import { describe, expect, it } from "vitest";
import { OPENROUTER_CHAIN, isConfigured } from "./openrouter";

/**
 * ⚠️ REGRESSION TEST FOR A BUG THAT SHIPPED (Aug 17, 2026).
 *
 * An earlier version of `OPENROUTER_CHAIN` listed three model ids invented
 * from training-data memory rather than checked against OpenRouter's live
 * catalog. None of the three existed. Every one would have 404'd, so the
 * resume-rewrite route would have silently fallen through to Gemini on
 * every single call — invisible only because `OPENROUTER_API_KEY` had never
 * been set. The day someone added the key, the feature would have looked
 * "on" while doing nothing.
 *
 * This file cannot call OpenRouter's live API from a unit test (no network,
 * no key in CI). What it CAN enforce is the shape of the list — every entry
 * pinned to `:free`, no duplicates, a real chain rather than a single point
 * of failure — which is the layer of defence available without a network
 * call. The live-catalog check is manual: `curl
 * https://openrouter.ai/api/v1/models | jq` and grep for `:free`, the same
 * way the current list was verified. Re-run that after any gap before
 * trusting this list again.
 */

describe("OPENROUTER_CHAIN", () => {
  it("has more than one model — a chain, not a single point of failure", () => {
    expect(OPENROUTER_CHAIN.length).toBeGreaterThan(1);
  });

  it("pins every model to the free tier explicitly", () => {
    for (const model of OPENROUTER_CHAIN) {
      expect(model, `${model} must end in :free`).toMatch(/:free$/);
    }
  });

  it("has no duplicate entries", () => {
    expect(new Set(OPENROUTER_CHAIN).size).toBe(OPENROUTER_CHAIN.length);
  });

  it("uses org/model slugs, not bare names", () => {
    // OpenRouter ids are always "<provider>/<model>:free" — a bare model
    // name with no provider prefix is the exact shape of a guessed id.
    for (const model of OPENROUTER_CHAIN) {
      expect(model, `${model} must include a provider prefix`).toMatch(
        /^[a-z0-9-]+\/[a-z0-9.-]+:free$/
      );
    }
  });
});

describe("isConfigured", () => {
  it("is false with no key in the environment", () => {
    const original = process.env.OPENROUTER_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    expect(isConfigured()).toBe(false);
    if (original !== undefined) process.env.OPENROUTER_API_KEY = original;
  });
});
