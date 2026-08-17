/**
 * V2 §16K step 5 — the OpenRouter provider path.
 *
 * ── SCOPE, WHICH IS DELIBERATELY NARROW ───────────────────────────────────
 * Resume-text generation only. The Aug 15, 2026 decision deferred OpenRouter
 * for the main chat specifically because a free, unvetted model tier sits
 * behind the crisis and immigration-enforcement guardrails, where being wrong
 * once is unforgivable. That reasoning was scoped to those paths, not to every
 * AI feature: rewriting a student's own activity description carries no such
 * risk. Do not widen this to chat without re-deciding that trade-off.
 *
 * ── WHY A SECOND PROVIDER AT ALL ──────────────────────────────────────────
 * The same cost posture as the Gemini decision — no billing until there are
 * real users — but spread across more free capacity than one provider's free
 * tier can offer. `MODEL_CHAIN` in guard.ts falls across models within Gemini;
 * this falls across *providers*, which is the failure mode that chain can't
 * cover (Gemini itself being down or quota-exhausted for the day).
 *
 * ── IT IS OPTIONAL, ON PURPOSE ────────────────────────────────────────────
 * `OPENROUTER_API_KEY` is not set today. `isConfigured()` returning false is a
 * normal state, not an error: the caller falls back to the Gemini chain, which
 * is exactly what happens right now in production. Adding the key later turns
 * this on with no other change.
 */

/**
 * Free-tier models, tried in order. All pinned with the `:free` suffix so a
 * silent switch to a paid variant cannot happen by accident — an unexpected
 * bill on a free student app is a real failure, not a rounding error.
 *
 * ⚠️ VERIFIED LIVE against `GET https://openrouter.ai/api/v1/models` on
 * 2026-08-17 — fetched the raw JSON directly rather than trusting a
 * WebFetch summary, since that response is 400+ models and got silently
 * truncated on the first two attempts. This is worth stating plainly: an
 * EARLIER version of this file shipped three model ids invented from
 * training-data memory (`llama-3.3-70b-instruct:free`,
 * `gemma-3-27b-it:free`, `mistral-small-3.2-24b-instruct:free`) — **none
 * of which exist on OpenRouter's live catalog.** Every one would have 404'd,
 * so the whole chain would have silently fallen through to Gemini on every
 * single call. Invisible today only because `OPENROUTER_API_KEY` was never
 * set — this is exactly the kind of bug that stays hidden until the day you
 * flip the key on.
 *
 * Free-tier availability churns fast (providers add and retire `:free`
 * variants regularly) — re-verify against the live endpoint above before
 * trusting this list again after any real gap, rather than assuming it
 * still matches.
 *
 * Order is best-first by general instruction-following for this task shape
 * (rewriting prose against a detailed system prompt). Reasoning-only,
 * code-only, vision-only and moderation-only free models were deliberately
 * excluded even though they were in the live list — wrong shape for this
 * job. If one is retired, the chain moves on rather than failing.
 */
export const OPENROUTER_CHAIN = [
  "google/gemma-4-31b-it:free",
  "z-ai/glm-5.2:free",
  "openai/gpt-oss-20b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "nvidia/nemotron-nano-9b-v2:free",
] as const;

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export function isConfigured(): boolean {
  return !!process.env.OPENROUTER_API_KEY;
}

/** Statuses worth trying the next model for. Anything else fails fast. */
const RETRYABLE = new Set([408, 429, 500, 502, 503, 504]);

/**
 * Run a single completion across the free-model chain.
 *
 * Returns the raw text. Throws only if every model in the chain failed —
 * callers are expected to catch and fall back to the Gemini chain rather than
 * surfacing an OpenRouter-specific error to a student, who cannot act on it.
 */
export async function completeWithOpenRouter(input: {
  system: string;
  user: string;
  signal?: AbortSignal;
}): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY is not set");

  let lastError: unknown;

  for (const model of OPENROUTER_CHAIN) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          // OpenRouter uses these for its own attribution pages. Harmless, and
          // it keeps the account's traffic identifiable if a model starts
          // misbehaving.
          "HTTP-Referer": "https://pathfinder-atharv.vercel.app",
          "X-Title": "PathFinder",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: input.system },
            { role: "user", content: input.user },
          ],
          temperature: 0.4,
          max_tokens: 1200,
        }),
        signal: input.signal,
      });

      if (!res.ok) {
        const err = Object.assign(new Error(`OpenRouter ${res.status}`), {
          status: res.status,
        });
        if (!RETRYABLE.has(res.status)) throw err;
        lastError = err;
        continue;
      }

      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = body.choices?.[0]?.message?.content?.trim();
      if (!text) {
        lastError = new Error("OpenRouter returned an empty completion");
        continue;
      }
      return text;
    } catch (err) {
      lastError = err;
      const status = (err as { status?: number }).status;
      // A non-transient failure on one model (bad request, auth) will fail the
      // same way on the next one — stop rather than burn the chain.
      if (status && !RETRYABLE.has(status)) throw err;
    }
  }

  throw lastError ?? new Error("Every OpenRouter model failed");
}
