import { NextResponse } from "next/server";
import {
  guardAiRequest,
  upstreamError,
  callWithFallback,
} from "@/lib/ai/guard";
import { EXTRACT_PROMPT } from "@/lib/ai/interview-prompt";
import { tolerateMissingColumn } from "@/lib/db/resilient";

/**
 * Turns the interview transcript into draft activity entries.
 *
 * A separate call from the interview itself, deliberately: asking a
 * mid-conversation model to also emit JSON tends to corrupt one or the other,
 * and this way the student can keep talking after generating a draft.
 *
 * Nothing here writes to the activities table. Drafts are returned for the
 * student to review, edit and accept — the model does not get to put words on
 * a college application unsupervised.
 */

export const maxDuration = 60;

const DRAFT_SCHEMA = {
  type: "object",
  properties: {
    activities: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          organization: { type: ["string", "null"] },
          role: { type: ["string", "null"] },
          description: { type: "string" },
          hours_per_week: { type: ["number", "null"] },
          weeks_per_year: { type: ["number", "null"] },
        },
        required: ["title", "description"],
      },
    },
  },
  required: ["activities"],
};

export type DraftActivity = {
  title: string;
  organization: string | null;
  role: string | null;
  description: string;
  hours_per_week: number | null;
  weeks_per_year: number | null;
};

export async function POST() {
  const guard = await guardAiRequest();
  if (!guard.ok) return guard.response;
  const { supabase, user, ai } = guard;

  const { data: history } = await tolerateMissingColumn(
    () =>
      supabase
        .from("chat_messages")
        .select("role, content")
        .eq("user_id", user.id)
        .eq("kind", "interview")
        .order("created_at", { ascending: true })
        .limit(60),
    async () => ({ data: [] as { role: string; content: string }[], error: null })
  );

  if (!history || history.length < 2) {
    return NextResponse.json(
      { error: "Have a bit more of the conversation first, then try again." },
      { status: 400 }
    );
  }

  const transcript = history
    .map(
      (t) => `${t.role === "assistant" ? "Interviewer" : "Student"}: ${t.content}`
    )
    .join("\n\n");

  let raw: string | undefined;
  try {
    const result = await callWithFallback((model) =>
      ai.models.generateContent({
        model,
        contents: [
          { role: "user", parts: [{ text: `TRANSCRIPT:\n\n${transcript}` }] },
        ],
        config: {
          systemInstruction: EXTRACT_PROMPT,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
          responseJsonSchema: DRAFT_SCHEMA,
          // Extraction is a transcription job, not a reasoning one — the
          // answers are already in the transcript. Thinking here buys nothing
          // and costs free-tier quota.
          thinkingConfig: { thinkingBudget: 0 },
        },
      })
    );
    raw = result.text;
  } catch (err) {
    console.error("[extract] request rejected:", err);
    return upstreamError(err);
  }

  if (!raw) {
    return NextResponse.json(
      { error: "Couldn't read that conversation. Try again in a moment." },
      { status: 502 }
    );
  }

  // Schema-constrained output should always parse, but "should" isn't a
  // guarantee worth crashing a student's session over.
  let parsed: { activities?: DraftActivity[] };
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error("[extract] unparseable JSON:", raw.slice(0, 300));
    return NextResponse.json(
      { error: "Couldn't read that conversation. Try again in a moment." },
      { status: 502 }
    );
  }

  const activities = (parsed.activities ?? []).filter(
    (a) => a?.title?.trim() && a?.description?.trim()
  );

  return NextResponse.json({ activities });
}
