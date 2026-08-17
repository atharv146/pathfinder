import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * The checks every AI route runs before spending anything.
 *
 * Extracted because there are now three of them (chat, interview, extract) and
 * a guard that's copy-pasted is a guard that drifts — the third copy is where
 * someone forgets the rate limit and quietly opens a hole.
 *
 * Order matters and is not arbitrary:
 *   1. Signed in     — anonymous access to a model endpoint is an open tab.
 *   2. Key present   — a config gap should read as a config gap, not a crash.
 *   3. Under the cap — free tiers have quotas, and one runaway client takes
 *                      the feature down for every user at once.
 */

/**
 * Messages per user per rolling 24h, across chat, interview AND profile
 * analysis combined.
 *
 * Configurable via `AI_DAILY_CAP` (Aug 17, 2026) so it can be changed from the
 * Vercel dashboard without a deploy. That matters because the moment this has
 * real traffic, the cap is the only lever between normal use and an exhausted
 * free tier — and needing a code push to pull it is needing it too late.
 *
 * 30 stays the default: it was picked as "more than any honest session needs,
 * less than a runaway client costs", and nothing has changed that.
 */
export const DAILY_MESSAGE_CAP = (() => {
  const raw = Number(process.env.AI_DAILY_CAP);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 30;
})();

/**
 * Hard off switch, via `AI_DISABLED=1`.
 *
 * The per-user cap bounds one student; it does nothing about a thousand
 * students at once, and the free tier has no billing alarm to hide behind.
 * This is the lever for that case — flip it in the Vercel dashboard and every
 * AI route returns a clear, honest message while the rest of the app (roadmap,
 * guides, opportunities, activities list) keeps working untouched.
 *
 * Deliberately not a silent failure: a student who can't use the AI should be
 * told it's switched off, not left staring at a spinner.
 */
export function aiDisabled(): boolean {
  return process.env.AI_DISABLED === "1";
}

/**
 * Model fallback chain, tried in order.
 *
 * NOT belt-and-braces — measured. The Gemini free tier returns 503 ("high
 * demand") and 429 (quota) frequently enough that a single pinned model fails
 * visibly for real users. When 3.7 is saturated, 3.5 has repeatedly answered
 * on the same key seconds later, so falling across models rescues far more
 * requests than retrying one model harder does.
 *
 * All pinned, never `-latest` aliases: a silent model swap under an app
 * advising minors should be a deliberate commit. Order is best-first, so a
 * healthy free tier always serves 3.7.
 */
export const MODEL_CHAIN = [
  "gemini-3.7-flash",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
] as const;

/** Primary model. Kept for callers that only need a label. */
export const MODEL = MODEL_CHAIN[0];

type GuardOk = {
  ok: true;
  supabase: SupabaseClient;
  user: User;
  ai: GoogleGenAI;
};

type GuardFail = { ok: false; response: NextResponse };

export async function guardAiRequest(): Promise<GuardOk | GuardFail> {
  // Checked first: if the AI is switched off there is no reason to touch the
  // database or the auth service to say so.
  if (aiDisabled()) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            "PathFinder's AI is temporarily switched off while we sort out capacity. Everything else — your roadmap, the guides, opportunities and your activities list — still works.",
        },
        { status: 503 }
      ),
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 }
      ),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            "AI isn't configured on the server yet. Nothing is wrong on your end.",
        },
        { status: 501 }
      ),
    };
  }

  // Fails open on an RPC error: a monitoring blip shouldn't lock a student out
  // of the product. The cap is a spend guard, not a security boundary.
  const { data: usedToday } = await supabase.rpc("chat_messages_today", {
    p_user_id: user.id,
  });

  if (typeof usedToday === "number" && usedToday >= DAILY_MESSAGE_CAP) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: `You've used today's ${DAILY_MESSAGE_CAP} AI messages. It resets 24 hours after your first one — the roadmap, guides and your activities list all still work in the meantime.`,
        },
        { status: 429 }
      ),
    };
  }

  return { ok: true, supabase, user, ai: new GoogleGenAI({ apiKey }) };
}

/**
 * Shared failure text for a rejected upstream request. Free-tier 503s ("high
 * demand") are common enough to be worth naming honestly rather than showing a
 * generic error.
 */
export function upstreamError(err?: unknown) {
  // 429 and 503 need different advice: one means "come back tomorrow", the
  // other means "try again right now". Telling a student to retry against an
  // exhausted daily quota just wastes their evening.
  const status = (err as { status?: number })?.status;

  if (status === 429) {
    return NextResponse.json(
      {
        error:
          "PathFinder's AI has hit today's free usage limit. It resets within 24 hours — the roadmap, guides and your activities list all still work in the meantime.",
      },
      { status: 429 }
    );
  }

  return NextResponse.json(
    {
      error:
        "The AI service is busy right now — this is usually a short spike. Wait a few seconds and send it again.",
    },
    { status: 502 }
  );
}

/**
 * Run `call` against each model in the chain until one answers.
 *
 * Retries transient statuses within a model (short backoff), then falls to the
 * next model. A non-transient error — a bad request, a retired model — throws
 * immediately rather than burning the whole chain on a request that can never
 * succeed.
 */
export async function callWithFallback<T>(
  call: (model: string) => Promise<T>
): Promise<T> {
  let lastError: unknown;

  for (const model of MODEL_CHAIN) {
    try {
      return await withRetry(() => call(model), 2);
    } catch (err) {
      lastError = err;
      const status = (err as { status?: number })?.status;
      // Only fall to the next model for capacity/quota problems.
      if (!status || !RETRYABLE.has(status)) throw err;
    }
  }

  throw lastError;
}

/**
 * Retry with exponential backoff.
 *
 * NOT premature optimisation — measured. During development the Gemini free
 * tier returned 429 (per-minute quota) and 503 ("high demand") often enough
 * that a single-shot call failed roughly half the time, including three
 * consecutive failures before a success. Without this, a student asking a
 * question gets an error on a working system, which reads as "this app is
 * broken" rather than "the free tier is busy".
 *
 * Only retries transient statuses. A 400 (bad request) or 404 (retired model)
 * will never succeed on retry and should surface immediately — retrying those
 * just delays a real error.
 */
const RETRYABLE = new Set([429, 500, 502, 503, 504]);

export async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3
): Promise<T> {
  let lastError: unknown;

  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const status = (err as { status?: number })?.status;

      if (!status || !RETRYABLE.has(status) || i === attempts) throw err;

      // 700ms, 1.4s, 2.8s — bounded so a Vercel function can't hang on it.
      await new Promise((r) => setTimeout(r, 700 * 2 ** (i - 1)));
    }
  }

  throw lastError;
}
