import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * The spend guards, tested because they are the only thing between normal use
 * and an exhausted free tier once this has real traffic — and because both are
 * read from the environment, which is exactly the kind of thing that silently
 * stops working after a refactor.
 *
 * `vi.resetModules()` between cases because `DAILY_MESSAGE_CAP` is resolved at
 * module load; without it the first import would pin the value for the file.
 */

const load = async () => {
  vi.resetModules();
  return import("./guard");
};

afterEach(() => {
  delete process.env.AI_DAILY_CAP;
  delete process.env.AI_DISABLED;
});

describe("DAILY_MESSAGE_CAP", () => {
  it("defaults to 30 when unset", async () => {
    const { DAILY_MESSAGE_CAP } = await load();
    expect(DAILY_MESSAGE_CAP).toBe(30);
  });

  it("takes the value from AI_DAILY_CAP", async () => {
    process.env.AI_DAILY_CAP = "5";
    const { DAILY_MESSAGE_CAP } = await load();
    expect(DAILY_MESSAGE_CAP).toBe(5);
  });

  /**
   * A typo'd or empty env var must not silently become 0 or NaN. Either would
   * be worse than the default: 0 locks every student out of the AI, and NaN
   * makes the `>=` comparison always false, removing the cap entirely — the
   * exact failure this whole mechanism exists to prevent.
   */
  it.each(["", "abc", "0", "-5", "NaN"])(
    "falls back to 30 for the junk value %o",
    async (value) => {
      process.env.AI_DAILY_CAP = value;
      const { DAILY_MESSAGE_CAP } = await load();
      expect(DAILY_MESSAGE_CAP).toBe(30);
    }
  );

  it("floors a fractional value rather than leaving it fractional", async () => {
    process.env.AI_DAILY_CAP = "12.7";
    const { DAILY_MESSAGE_CAP } = await load();
    expect(DAILY_MESSAGE_CAP).toBe(12);
  });
});

describe("aiDisabled", () => {
  it("is off by default", async () => {
    const { aiDisabled } = await load();
    expect(aiDisabled()).toBe(false);
  });

  it("switches on for exactly AI_DISABLED=1", async () => {
    process.env.AI_DISABLED = "1";
    const { aiDisabled } = await load();
    expect(aiDisabled()).toBe(true);
  });

  /**
   * Deliberately strict. "true"/"yes" not counting is a real trade-off, but a
   * kill switch that engages on any truthy-looking string is one stray env var
   * away from taking the AI down for everyone with no obvious cause.
   */
  it.each(["0", "true", "yes", "", "false"])(
    "stays off for %o",
    async (value) => {
      process.env.AI_DISABLED = value;
      const { aiDisabled } = await load();
      expect(aiDisabled()).toBe(false);
    }
  );
});

describe("MODEL_CHAIN", () => {
  it("has a real fallback chain, best model first", async () => {
    const { MODEL_CHAIN, MODEL } = await load();
    expect(MODEL_CHAIN.length).toBeGreaterThan(1);
    expect(MODEL).toBe(MODEL_CHAIN[0]);
  });

  it("pins every model rather than using a -latest alias", async () => {
    const { MODEL_CHAIN } = await load();
    // A silent model swap under an app advising minors should be a commit,
    // not a surprise — see the note in guard.ts.
    for (const model of MODEL_CHAIN) {
      expect(model, `${model} must not be a floating alias`).not.toMatch(/latest/);
    }
  });
});
