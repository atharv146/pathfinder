import { NextResponse } from "next/server";
import {
  guardAiRequest,
  upstreamError,
  callWithFallback,
} from "@/lib/ai/guard";
import { SYSTEM_PROMPT, buildContextBlock } from "@/lib/ai/system-prompt";
import { flagTopics } from "@/lib/ai/flags";
import { tolerateMissingColumn } from "@/lib/db/resilient";

/**
 * Ask AI — the server-side model call.
 *
 * WHY THIS ROUTE EXISTS AT ALL: the original prototype (pathfinder-app.jsx)
 * called the model API directly from the browser. That can never work — an API
 * key shipped to the client is a public API key, and anyone can spend it. The
 * key lives here, server-side only (no NEXT_PUBLIC_ prefix), and the browser
 * only ever talks to this route.
 *
 * Three guards, in order:
 *   1. Signed in. Anonymous access to a model endpoint is an open tab for abuse.
 *   2. Under the daily cap. Free tiers have quotas; blowing through one takes
 *      the feature down for every user at once.
 *   3. Non-empty, bounded input.
 *
 * ── PROVIDER ─────────────────────────────────────────────────────────────
 * Currently Gemini 3.7 Flash (see MODEL in lib/ai/guard.ts), on the free tier,
 * chosen deliberately to avoid setting up billing while the app has no users.
 * This is a temporary cost decision, not an architectural one.
 *
 * To move to Claude (planned, once usage justifies billing): swap GoogleGenAI
 * for the already-installed `@anthropic-ai/sdk`, change the role mapping back
 * ("model" → "assistant"), move systemInstruction back to a cached `system`
 * block, and set ANTHROPIC_API_KEY. Everything else here — the guards, the
 * escalation flags, the storage — is provider-agnostic on purpose.
 */

// Thinking + a full answer can take a while. Vercel's default serverless
// timeout would cut a long response off mid-sentence.
export const maxDuration = 60;

/** Longest question we'll accept. Generous for a real question, bounded. */
const MAX_INPUT_CHARS = 4000;

/** How much prior conversation to replay. The API is stateless. */
const HISTORY_TURNS = 10;

export async function POST(request: Request) {
  // Signed in → key present → under the daily cap. Shared with the interview
  // routes so the three can't drift apart.
  const guard = await guardAiRequest();
  if (!guard.ok) return guard.response;
  const { supabase, user, ai } = guard;

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

  // --- Context ------------------------------------------------------------
  const PROFILE_COLUMNS =
    "grade, major, major_undecided, account_type, preferred_language, gpa, gpa_scale, sat_score, act_score, course_rigor, target_colleges, first_gen, home_language, status_category";

  // The school-context columns arrived in migration 0008. Naming a column that
  // doesn't exist fails the whole select — not just that field — so this falls
  // back to the pre-0008 column list rather than losing every piece of context
  // the chat has. Same reasoning as lib/db/resilient.ts, which this uses.
  const { data: profile } = await tolerateMissingColumn(
    () =>
      supabase
        .from("profiles")
        .select(
          `${PROFILE_COLUMNS}, school_ap_offered, school_offers_ib, school_offers_dual_enrollment, school_course_limits`
        )
        .eq("id", user.id)
        .maybeSingle(),
    () =>
      supabase
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .eq("id", user.id)
        .maybeSingle()
  );

  // The course list (migration 0008). Capped: a full 7-year transcript is
  // maybe 40 rows, and this rides along on every single message, so it is
  // bounded rather than trusted to stay small. An error here (table missing)
  // simply means no course context — the chat is not worth breaking over it.
  const { data: courseRows } = await supabase
    .from("courses")
    .select("grade, title, level, status")
    .eq("user_id", user.id)
    .order("grade", { ascending: true })
    .order("sort_order", { ascending: true })
    .limit(60);

  // Degrades rather than dies if migration 0005 hasn't been applied — see
  // lib/db/resilient.ts. Without `kind` the history is unseparated, which is
  // worse than correct but far better than the chat appearing broken.
  const { data: history } = await tolerateMissingColumn(
    () =>
      supabase
        .from("chat_messages")
        .select("role, content")
        .eq("user_id", user.id)
        .eq("kind", "chat")
        .order("created_at", { ascending: false })
        .limit(HISTORY_TURNS),
    () =>
      supabase
        .from("chat_messages")
        .select("role, content")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(HISTORY_TURNS)
  );

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
  const userRow = {
    user_id: user.id,
    role: "user",
    content: message,
    flagged_topics: flags,
  };
  await tolerateMissingColumn(
    () => supabase.from("chat_messages").insert({ ...userRow, kind: "chat" }),
    () => supabase.from("chat_messages").insert(userRow)
  );

  const contextBlock = buildContextBlock({
    grade: profile?.grade ?? null,
    major: profile?.major ?? null,
    majorUndecided: profile?.major_undecided ?? false,
    accountType: profile?.account_type ?? "student",
    language: profile?.preferred_language ?? "en",
    gpa: profile?.gpa ?? null,
    gpaScale: profile?.gpa_scale ?? null,
    satScore: profile?.sat_score ?? null,
    actScore: profile?.act_score ?? null,
    courseRigor: profile?.course_rigor ?? null,
    targetColleges: profile?.target_colleges ?? [],
    firstGen: profile?.first_gen ?? null,
    homeLanguage: profile?.home_language ?? null,
    statusCategory: profile?.status_category ?? null,
    courses: courseRows ?? [],
    schoolApOffered: profile?.school_ap_offered ?? null,
    schoolOffersIb: profile?.school_offers_ib ?? null,
    schoolOffersDualEnrollment: profile?.school_offers_dual_enrollment ?? null,
    schoolCourseLimits: profile?.school_course_limits ?? null,
  });

  // Gemini names the assistant role "model", not "assistant".
  const contents = [
    ...priorTurns.map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.content }],
    })),
    { role: "user", parts: [{ text: `${contextBlock}\n\n${message}` }] },
  ];

  let stream: Awaited<ReturnType<typeof ai.models.generateContentStream>>;

  try {
    stream = await callWithFallback((model) =>
      ai.models.generateContentStream({
        // Falls across MODEL_CHAIN when the free tier 503s or 429s — see
        // lib/ai/guard.ts. All pinned, never a `-latest` alias.
        model,
        contents,
        config: {
          // The system prompt is byte-identical across every request, which
          // is what lets Gemini's implicit context caching kick in. Keep it
          // stable; per-user context goes in the message turn, not here.
          systemInstruction: SYSTEM_PROMPT,
          maxOutputTokens: 4096,

          // Thinking OFF. Free-tier quota is the binding constraint in
          // practice (measured 429s), and thinking tokens count against the
          // output budget on every single message. These questions are
          // explanatory rather than genuinely hard, and answer quality was
          // indistinguishable in testing. Raise this only if answers thin out.
          thinkingConfig: { thinkingBudget: 0 },
        },
      })
    );
  } catch (err) {
    // A bad key or an exhausted quota fails here, before any bytes are sent —
    // so it can still be a clean JSON error instead of a truncated stream.
    console.error("[ask-ai] request rejected:", err);
    return upstreamError(err);
  }

  const encoder = new TextEncoder();

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let answer = "";

      try {
        for await (const chunk of stream) {
          const text = chunk.text;
          if (text) {
            answer += text;
            controller.enqueue(encoder.encode(text));
          }
        }

        // Gemini's safety filters can suppress a response entirely and still
        // return successfully — no error, just nothing. The topics most likely
        // to trip them (self-harm, abuse) are precisely the ones this app must
        // not go silent on.
        //
        // The escalation resources are safe here by design: they're computed
        // from the user's own message and sent in a header, so 988 and the
        // counselor pointer still render even when the model produces zero
        // tokens. This only replaces the empty bubble sitting above them.
        if (!answer) {
          const note = flags.length
            ? "I can't answer that one directly — but please look at the resources just below. Those are real people who can help, and reaching out to them is the right move here."
            : "I wasn't able to generate an answer to that one. Try rephrasing it, or ask me something more specific?";
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
        const assistantRow = {
          user_id: user.id,
          role: "assistant",
          content: answer,
          flagged_topics: flags,
        };
        await tolerateMissingColumn(
          () =>
            supabase
              .from("chat_messages")
              .insert({ ...assistantRow, kind: "chat" }),
          () => supabase.from("chat_messages").insert(assistantRow)
        );
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
