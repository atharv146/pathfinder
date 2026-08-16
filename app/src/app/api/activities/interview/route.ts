import { NextResponse } from "next/server";
import {
  guardAiRequest,
  upstreamError,
  withRetry,
  MODEL,
} from "@/lib/ai/guard";
import { INTERVIEW_PROMPT } from "@/lib/ai/interview-prompt";

/**
 * The activities interview (V2 step 3).
 *
 * Streams one interviewer turn. Transcript is stored with kind='interview' so
 * it shares the spend cap with Ask AI without polluting that transcript.
 */

export const maxDuration = 60;

const MAX_INPUT_CHARS = 2000;
const HISTORY_TURNS = 30;

export async function POST(request: Request) {
  const guard = await guardAiRequest();
  if (!guard.ok) return guard.response;
  const { supabase, user, ai } = guard;

  let message: string;
  let starting = false;
  try {
    const body = await request.json();
    message = typeof body?.message === "string" ? body.message.trim() : "";
    starting = body?.start === true;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (!starting && !message) {
    return NextResponse.json({ error: "Say something first." }, { status: 400 });
  }

  if (message.length > MAX_INPUT_CHARS) {
    return NextResponse.json(
      { error: "That's a long one — try breaking it up." },
      { status: 400 }
    );
  }

  const { data: history } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("user_id", user.id)
    .eq("kind", "interview")
    .order("created_at", { ascending: false })
    .limit(HISTORY_TURNS);

  const priorTurns = (history ?? []).reverse();

  if (message) {
    await supabase.from("chat_messages").insert({
      user_id: user.id,
      role: "user",
      content: message,
      kind: "interview",
    });
  }

  // Gemini names the assistant role "model".
  const contents = [
    ...priorTurns.map((t) => ({
      role: t.role === "assistant" ? "model" : "user",
      parts: [{ text: t.content }],
    })),
  ];

  if (message) {
    contents.push({ role: "user", parts: [{ text: message }] });
  } else {
    // Opening turn. Phrased as an instruction rather than a fake user message
    // so the model doesn't treat it as something the student said.
    contents.push({
      role: "user",
      parts: [
        {
          text: "[Begin the interview. Greet them briefly and ask your first question about what a normal weekday after school looks like.]",
        },
      ],
    });
  }

  let stream: Awaited<ReturnType<typeof ai.models.generateContentStream>>;
  try {
    stream = await withRetry(() =>
      ai.models.generateContentStream({
        model: MODEL,
        contents,
        config: {
          systemInstruction: INTERVIEW_PROMPT,
          maxOutputTokens: 2048,
          thinkingConfig: { thinkingBudget: -1 },
        },
      })
    );
  } catch (err) {
    console.error("[interview] request rejected:", err);
    return upstreamError();
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
        if (!answer) {
          const note =
            "I lost my train of thought there — could you say that again?";
          answer = note;
          controller.enqueue(encoder.encode(note));
        }
      } catch (err) {
        console.error("[interview] generation failed:", err);
        const note =
          "\n\nSomething went wrong on our end. Try sending that again.";
        answer += note;
        controller.enqueue(encoder.encode(note));
      }

      await supabase.from("chat_messages").insert({
        user_id: user.id,
        role: "assistant",
        content: answer,
        kind: "interview",
      });

      controller.close();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
