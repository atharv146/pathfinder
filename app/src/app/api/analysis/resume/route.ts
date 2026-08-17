import { NextResponse } from "next/server";
import { guardAiRequest, upstreamError, callWithFallback } from "@/lib/ai/guard";
import { RESUME_PROMPT, buildResumeContext } from "@/lib/ai/resume-prompt";
import { completeWithOpenRouter, isConfigured } from "@/lib/ai/openrouter";
import type { Activity } from "@/lib/db/types";

/**
 * V2 §16K step 6 — writes up the student's OWN activities.
 *
 * ── PROVIDER (§16K step 5) ────────────────────────────────────────────────
 * OpenRouter first when `OPENROUTER_API_KEY` is set, falling back to the
 * Gemini chain in `lib/ai/guard.ts` otherwise — and also when OpenRouter
 * itself fails. Today the key is unset, so every request takes the Gemini
 * path; that is a working state, not a broken one.
 *
 * Why this route and not chat's provider: this is the one AI surface in the
 * app with no crisis or immigration-adjacent content, which is what made a
 * free unvetted model tier acceptable here and not there. See the header in
 * lib/ai/openrouter.ts.
 *
 * ── WHAT IT WILL NOT DO ───────────────────────────────────────────────────
 * Nothing here writes to the activities table, and nothing here invents an
 * activity. It rewrites descriptions of entries the student already made, and
 * the result is returned as a draft for them to accept, edit or ignore — the
 * same supervision rule as the interview's extraction step. The never-inflate
 * reasoning is in lib/ai/resume-prompt.ts and is the load-bearing part of this
 * feature.
 */

export const maxDuration = 60;

const SCHEMA = {
  type: "object",
  properties: {
    entries: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          description: { type: "string" },
          note: { type: ["string", "null"] },
        },
        required: ["id", "description"],
      },
    },
  },
  required: ["entries"],
};

export type ResumeEntry = {
  id: string;
  description: string;
  note: string | null;
};

/** Strips a markdown fence if a non-schema-constrained model added one. */
function unfence(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return (fenced ? fenced[1] : text).trim();
}

export async function POST() {
  const guard = await guardAiRequest();
  if (!guard.ok) return guard.response;
  const { supabase, user, ai } = guard;

  const [{ data: profile }, { data: activityRows }] = await Promise.all([
    supabase
      .from("profiles")
      .select("grade, major")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("activities")
      .select("*")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true })
      .limit(20),
  ]);

  const activities = (activityRows ?? []) as Activity[];

  if (activities.length === 0) {
    return NextResponse.json(
      {
        error:
          "There's nothing in your activities list yet. The AI interview is the fastest way to fill it — it's built to find things you'd never think to list.",
      },
      { status: 400 }
    );
  }

  const context = buildResumeContext({
    grade: profile?.grade ?? null,
    major: profile?.major ?? null,
    activities: activities.map((a) => ({
      id: a.id,
      title: a.title,
      organization: a.organization,
      role: a.role,
      description: a.description,
      hours_per_week: a.hours_per_week,
      weeks_per_year: a.weeks_per_year,
      grade_levels: a.grade_levels ?? [],
    })),
  });

  let raw: string | undefined;

  // Provider 1: OpenRouter, when configured. Wrapped so that ANY failure here
  // — including a misconfigured key — silently becomes the Gemini path rather
  // than an error the student can do nothing about.
  if (isConfigured()) {
    try {
      raw = unfence(
        await completeWithOpenRouter({ system: RESUME_PROMPT, user: context })
      );
    } catch (err) {
      console.error("[resume] OpenRouter failed, falling back to Gemini:", err);
      raw = undefined;
    }
  }

  if (!raw) {
    try {
      const result = await callWithFallback((model) =>
        ai.models.generateContent({
          model,
          contents: [{ role: "user", parts: [{ text: context }] }],
          config: {
            systemInstruction: RESUME_PROMPT,
            maxOutputTokens: 3072,
            responseMimeType: "application/json",
            responseJsonSchema: SCHEMA,
            // Rewriting sentences the student already supplied is an editing
            // job, not a reasoning one — same call as the extract route.
            thinkingConfig: { thinkingBudget: 0 },
          },
        })
      );
      raw = result.text;
    } catch (err) {
      console.error("[resume] request rejected:", err);
      return upstreamError(err);
    }
  }

  if (!raw) {
    return NextResponse.json(
      { error: "Couldn't write those up just now. Try again in a moment." },
      { status: 502 }
    );
  }

  let parsed: { entries?: ResumeEntry[] } | ResumeEntry[];
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error("[resume] unparseable JSON:", raw.slice(0, 300));
    return NextResponse.json(
      { error: "Couldn't write those up just now. Try again in a moment." },
      { status: 502 }
    );
  }

  // The prompt asks for a bare array (OpenRouter models aren't schema-bound);
  // Gemini's schema wraps it in `entries`. Accept both.
  const list = Array.isArray(parsed) ? parsed : (parsed.entries ?? []);

  // Only ids we actually sent. A model that hallucinates an id must not be
  // able to attach text to an activity that doesn't exist.
  const known = new Set(activities.map((a) => a.id));
  const entries = list
    .filter((e) => e?.id && known.has(e.id) && e.description?.trim())
    .map((e) => ({
      id: e.id,
      description: e.description.trim(),
      note: e.note?.trim() || null,
    }));

  return NextResponse.json({ entries });
}
