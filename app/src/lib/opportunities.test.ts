import { describe, expect, it } from "vitest";
import { allOpportunities } from "./opportunities";
import { SCHOLARSHIPS, SCHOLARSHIPS_VERIFIED_ON } from "@/data/scholarships";
import { MAJOR_OPPORTUNITIES, CROSS_CUTTING } from "@/data/major-opportunities";

/**
 * Data-integrity tests for everything a student might apply to.
 *
 * This is the file where being wrong costs the most: a broken link, a missing
 * deadline, or a silently-dropped programme is a student not applying to
 * something they were eligible for. None of that fails a build or throws an
 * error at runtime — it just quietly renders wrong, which is precisely why it
 * needs a test rather than a code review.
 */

const everything = [
  ...Object.values(MAJOR_OPPORTUNITIES).flatMap((f) => f.items),
  ...CROSS_CUTTING.items,
];

describe("unified directory", () => {
  /**
   * ⚠️ REGRESSION TEST FOR A BUG THAT SHIPPED (Aug 17, 2026).
   * RSI and the NIH Summer Internship Program are each deliberately listed
   * under two major families. The unified id was `opportunity:${name}`, which
   * collided as a React key — React then dropped one of the two rows from the
   * rendered list entirely, with no error visible to a user.
   */
  it("gives every entry a unique id even when a programme spans two families", () => {
    const ids = allOpportunities().map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes every scholarship and every opportunity", () => {
    expect(allOpportunities()).toHaveLength(
      SCHOLARSHIPS.length + everything.length
    );
  });

  it("keeps crossover programmes as separate rows rather than deduping them", () => {
    // RSI appears under both engineering-cs and natural-sciences. Both should
    // survive — a student browsing either field should find it.
    const rsi = allOpportunities().filter((e) => e.name.includes("Research Science"));
    expect(rsi.length).toBeGreaterThan(1);
  });

  it("carries a real kind for every entry", () => {
    for (const e of allOpportunities()) {
      expect(["scholarship", "internship", "program", "competition"]).toContain(e.kind);
    }
  });
});

describe("scholarship data", () => {
  it("has no duplicate ids", () => {
    const ids = SCHOLARSHIPS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every entry the fields the UI reads", () => {
    for (const s of SCHOLARSHIPS) {
      expect(s.name, s.id).toBeTruthy();
      expect(s.org, s.id).toBeTruthy();
      expect(s.award, s.id).toBeTruthy();
      expect(s.whoItsFor, s.id).toBeTruthy();
      expect(s.cycle, s.id).toBeTruthy();
      expect(s.eligibility.length, s.id).toBeGreaterThan(0);
      expect(s.grades.length, s.id).toBeGreaterThan(0);
    }
  });

  it("links only to https official sites", () => {
    for (const s of SCHOLARSHIPS) {
      expect(s.url, s.id).toMatch(/^https:\/\//);
    }
  });

  /**
   * Rule 2 of data/scholarships.ts: never state a deadline without the cycle
   * year attached. A month with no year is the failure — it reads as current
   * forever.
   *
   * Note what this deliberately allows: an entry that names NO date at all.
   * QuestBridge College Prep Scholars is exactly that case — the official page
   * showed no confirmed deadline, so the entry says so and tells the student
   * to go and look. "We don't know" is an honest state and must stay legal;
   * "closes March 3" with no year is not.
   */
  it("never names a month without a year", () => {
    const MONTHS =
      /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/;

    for (const s of SCHOLARSHIPS) {
      if (MONTHS.test(s.cycle)) {
        expect(
          s.cycle,
          `${s.id} names a month but no year — a bare month reads as current forever`
        ).toMatch(/20\d{2}/);
      }
    }
  });

  it("names a year whenever it stores a machine-readable date", () => {
    for (const s of SCHOLARSHIPS) {
      if (s.opensOn || s.closesOn) {
        expect(s.cycle, `${s.id} has stored dates, so its text must name a year`).toMatch(
          /20\d{2}/
        );
      }
    }
  });

  it("keeps opensOn before closesOn", () => {
    for (const s of SCHOLARSHIPS) {
      if (s.opensOn && s.closesOn) {
        expect(Date.parse(s.opensOn), s.id).toBeLessThan(Date.parse(s.closesOn));
      }
    }
  });

  it("uses ISO dates that actually parse", () => {
    for (const s of SCHOLARSHIPS) {
      for (const d of [s.opensOn, s.closesOn].filter(Boolean) as string[]) {
        expect(d, s.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(Number.isNaN(Date.parse(d)), `${s.id} ${d}`).toBe(false);
      }
    }
  });
});

describe("opportunity data", () => {
  it("gives every entry the fields the UI reads", () => {
    for (const o of everything) {
      expect(o.name).toBeTruthy();
      expect(o.org, o.name).toBeTruthy();
      expect(o.what, o.name).toBeTruthy();
      expect(o.cost, o.name).toBeTruthy();
      expect(o.eligibility, o.name).toBeTruthy();
      expect(o.timing, o.name).toBeTruthy();
    }
  });

  it("links only to https official sites", () => {
    for (const o of everything) {
      expect(o.url, o.name).toMatch(/^https:\/\//);
    }
  });
});

describe("freshness", () => {
  /**
   * Rule 5 in both data files: re-verify or remove after a year. This test is
   * the enforcement — it will start failing on its own once the data is stale,
   * which is the only mechanism that doesn't rely on someone remembering.
   */
  const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

  it("has scholarship data checked within the last year", () => {
    const age = Date.now() - Date.parse(`${SCHOLARSHIPS_VERIFIED_ON}T00:00:00Z`);
    expect(
      age,
      "Scholarships are over a year old — re-verify each on its official site, then bump SCHOLARSHIPS_VERIFIED_ON."
    ).toBeLessThan(YEAR_MS);
  });

  it("has opportunity data checked within the last year", () => {
    for (const [family, fam] of Object.entries(MAJOR_OPPORTUNITIES)) {
      const age = Date.now() - Date.parse(`${fam.verifiedOn}T00:00:00Z`);
      expect(
        age,
        `${family} opportunities are over a year old — re-verify or remove them.`
      ).toBeLessThan(YEAR_MS);
    }
  });
});
