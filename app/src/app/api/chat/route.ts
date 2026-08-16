import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { SYSTEM_PROMPT, buildContextBlock } from "@/lib/ai/system-prompt";
import { flagTopics } from "@/lib/ai/flags";

/**
 * Ask AI — the server-side model call.
 *
 * WHY THIS ROUTE EXISTS AT ALL: the original prototype (pathfinder-app.jsx)
 * called api.anthropic.com directly from the browser. That can never work —
 * an API key shipped to the client is a public API key, and anyone can spend
 * it. The key lives here, in ANTHROPIC_API_KEY (no NEXT_PUBLIC_ prefix), and
 * the browser only ever talks to this route.
 *
 * Three guards, in order:
 *   1. Signed in. Anonymous access to a paid model is an open tab for abuse.
 *   2. Under the daily cap. This app is free; the model is not.
 *   3. Non-empty, bounded input.
 */

// Thinking + a full answer can take a while. Vercel's default serverless
// timeout would cut a long response off mid-sentence.
export const maxDuration = 60;

/** Messages per user per rolling 24h. Tune with real usage, not guesses. */
const DAILY_MESSAGE_CAP = 30;

/** Longest question we'll accept. Generous for a real question, bounded. */
const MAX_INPUT_CHARS = 4000;

/** How much prior conversation to replay. The API is stateless. */
const HISTORY_TURNS = 20;

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Please sign in to ask a question." },
      { status: 401 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Same shape as the account-deletion route: a config gap is not the
    // user's fault and shouldn't read as a crash.
    return NextResponse.json(
      {
        error:
          "Ask AI isn't configured on the server yet. Nothing is wrong on your end.",
      },
      { status: 501 }
    );
  }

  let message: string;
  try {
    const body = await request.json();
    message = typeof body?.message === "string" ? body.message.trim() : "";
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json(
      { error: "Type a question first." },
      { status: 400 }
    );
  }

  if (message.length > MAX_INPUT_CHARS) {
    return NextResponse.json(
      {
        error: `That's a bit long for one question — try trimming it to under ${MAX_INPUT_CHARS} characters.`,
      },
      { status: 400 }
    );
  }

  // --- Guard 2: daily cap -------------------------------------------------
  // Counted server-side via a SECURITY DEFINER function so the number can't be
  // spoofed from the client. Fail *open* on an error here: a monitoring blip
  // shouldn't lock a student out of the product.
  const { data: usedToday } = await supabase.rpc("chat_messages_today", {
    p_user_id: user.id,
  });

  if (typeof usedToday === "number" && usedToday >= DAILY_MESSAGE_CAP) {
    return NextResponse.json(
      {
        error: `You've hit today's limit of ${DAILY_MESSAGE_CAP} questions. It resets 24 hours after your first question today — the roadmap and guides are always open in the meantime.`,
      },
      { status: 429 }
    );
  }

  // --- Context ------------------------------------------------------------
  const { data: profile } = await supabase
    .from("profiles")
    .select("grade, major, major_undecided, account_type")
    .eq("id", user.id)
    .maybeSingle();

  const { data: history } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(HISTORY_TURNS);

  const priorTurns = (history ?? [])
    .reverse()
    .map((row) => ({
      role: row.role as "user" | "assistant",
      content: row.content,
    }));

  const flags = flagTopics(message);

  // Persist the question before calling the model, so a failed or abandoned
  // generation still counts against the cap and still leaves the escalation
  // flag on record. RLS scopes this insert to the signed-in user.
  await supabase.from("chat_messages").insert({
    user_id: user.id,
    role: "user",
    content: message,
    flagged_topics: flags,
  });

  const contextBlock = buildContextBlock({
    grade: profile?.grade ?? null,
    major: profile?.major ?? null,
    majorUndecided: profile?.major_undecided ?? false,
    accountType: profile?.account_type ?? "student",
  });

  const anthropic = new Anthropic({ apiKey });

  const stream = anthropic.beta.messages.stream({
    model: "claude-opus-5",
    max_tokens: 8000,

    // Safety classifiers can decline a request outright. Without a fallback
    // the turn just stops; with one, the request is re-served by another model
    // inside the same call. Refusals are unlikely in this domain, but a silent
    // dead end in a student's face is a bad failure mode. Remove these two
    // lines to opt out.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",

    // Cached: the system prompt is identical for every user and every request,
    // so it's a stable prefix. Per-user context goes in the message turn below
    // — putting it here would invalidate the cache on every call.
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],

    // Thinking is on by default on this model. Left on deliberately: financial
    // aid and status-aware questions have real nuance, and disabling thinking
    // on Opus 5 can leak internal tags into the visible answer. `effort` is the
    // tuning knob if responses feel slow — "low" is still strong here.
    thinking: { type: "adaptive" },
    output_config: { effort: "medium" },

    messages: [
      ...priorTurns,
      { role: "user", content: `${contextBlock}\n\n${message}` },
    ],
  });

  const encoder = new TextEncoder();

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let answer = "";

      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            answer += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        const final = await stream.finalMessage();

        // A refusal arrives as a successful response with empty or partial
        // content — not as a thrown error. Checked explicitly so it surfaces
        // as a real message instead of a blank bubble.
        if (final.stop_reason === "refusal" && !answer) {
          const note =
            "I can't help with that one. If it's about your immigration status or something urgent, a school counselor or a licensed professional is the right person — see the resources below.";
          answer = note;
          controller.enqueue(encoder.encode(note));
        }
      } catch (err) {
        // Headers are already sent, so this can't become a 500. Say something
        // true and readable rather than dying silently mid-sentence.
        console.error("[ask-ai] generation failed:", err);
        const note =
          "\n\nSomething went wrong on our end before I could finish. Please try again.";
        answer += note;
        controller.enqueue(encoder.encode(note));
      }

      if (answer) {
        await supabase.from("chat_messages").insert({
          user_id: user.id,
          role: "assistant",
          content: answer,
          flagged_topics: flags,
        });
      }

      controller.close();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      // Escalation topics travel in a header because they're derived from the
      // question, which we already have — no need to muddle the text stream
      // with a control channel.
      "X-Pathfinder-Flags": flags.join(","),
    },
  });
}
