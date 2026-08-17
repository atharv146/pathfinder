import { describe, expect, it } from "vitest";
import { normalizeCourse, readStructure } from "./structure";
import type { Course, Profile } from "@/lib/db/types";

/**
 * Course matching is the highest-stakes pure function in the app.
 *
 * Getting it wrong in one direction is harmless — a missed match renders as
 * "not listed yet", which is recoverable and honest. Getting it wrong in the
 * OTHER direction tells a student they have completed a class they have not,
 * which is exactly the confidently-wrong behaviour PathFinder exists to be an
 * alternative to. The false-positive tests below are the point of this file;
 * one of them (Algebra I / Algebra 2) is a bug that actually shipped.
 */

const course = (title: string, grade: number): Course => ({
  id: title,
  user_id: "u",
  grade,
  title,
  level: null,
  subject: null,
  status: "taken",
  sort_order: 0,
  created_at: "",
  updated_at: "",
});

const profile = (over: Partial<Profile> = {}): Profile =>
  ({
    grade: 10,
    major: "Engineering / CS",
    major_undecided: false,
    school_ap_offered: null,
    school_offers_ib: null,
    school_offers_dual_enrollment: null,
    school_course_limits: null,
    ...over,
  }) as Profile;

/** Find a ladder step's match by the step's name. */
function matchFor(courses: Course[], step: string, p: Profile = profile()) {
  const reading = readStructure(p, courses);
  for (const ladder of reading.ladders) {
    const hit = ladder.steps.find((s) => s.step === step);
    if (hit) return hit.matched;
  }
  throw new Error(`No ladder step named "${step}" — did the pathway data change?`);
}

describe("normalizeCourse", () => {
  it("folds Roman numerals to digits so Algebra II === Algebra 2", () => {
    expect(normalizeCourse("Algebra II")).toBe(normalizeCourse("Algebra 2"));
  });

  it("strips track prefixes that don't change what the class is", () => {
    expect(normalizeCourse("AP Chemistry")).toBe(normalizeCourse("Chemistry"));
    expect(normalizeCourse("Honors Geometry")).toBe(normalizeCourse("Geometry"));
    expect(normalizeCourse("Biology CP")).toBe(normalizeCourse("Biology"));
  });

  it("ignores punctuation and casing", () => {
    expect(normalizeCourse("PRE-CALCULUS")).toBe(normalizeCourse("Pre Calculus"));
  });
});

describe("readStructure — true matches", () => {
  it("matches a course written with a Roman numeral", () => {
    expect(matchFor([course("Algebra I", 8)], "Algebra 1")).toBe("Algebra I");
  });

  it("matches through an honors/AP prefix", () => {
    expect(matchFor([course("Geometry Honors", 9)], "Geometry")).toBe(
      "Geometry Honors"
    );
    expect(matchFor([course("AP Chemistry", 10)], "Chemistry")).toBe(
      "AP Chemistry"
    );
  });
});

describe("readStructure — false matches (the ones that actually matter)", () => {
  /**
   * ⚠️ REGRESSION TEST FOR A BUG THAT SHIPPED (Aug 17, 2026).
   * The word-overlap fallback drops tokens shorter than four characters, so
   * "algebra 1" and "algebra 2" both reduced to ["algebra"] and matched each
   * other. A student who had taken Algebra I was told they had finished
   * Algebra 2.
   */
  it("does NOT match Algebra I to the Algebra 2 step", () => {
    expect(matchFor([course("Algebra I", 8)], "Algebra 2")).toBeNull();
  });

  it("does NOT match Algebra 2 to the Algebra 1 step", () => {
    expect(matchFor([course("Algebra 2", 10)], "Algebra 1")).toBeNull();
  });

  it("leaves a step unmatched when nothing resembles it", () => {
    expect(matchFor([course("Ceramics", 9)], "Calculus")).toBeNull();
  });
});

describe("readStructure — school context", () => {
  it("caveats a school that offers no AP at all", () => {
    const r = readStructure(profile({ school_ap_offered: "none" }), []);
    expect(r.caveats.join(" ")).toContain("doesn't offer AP");
  });

  it("quotes the student's own words about course limits", () => {
    const r = readStructure(
      profile({ school_course_limits: "No APs before 11th grade." }),
      []
    );
    expect(r.caveats.join(" ")).toContain("No APs before 11th grade.");
  });

  it("never invents a caveat when nothing was entered", () => {
    expect(readStructure(profile(), []).caveats).toHaveLength(0);
  });
});

describe("readStructure — unplanned grades look forward only", () => {
  /**
   * Looking backwards would flag every year the student didn't type in as a
   * gap, which is the "five years of unchecked boxes" mistake that
   * roadmap-timing.ts exists to avoid.
   */
  it("does not flag grades already behind the student", () => {
    const r = readStructure(profile({ grade: 11 }), [course("Algebra 2", 11)]);
    expect(r.unplannedGrades).not.toContain(9);
    expect(r.unplannedGrades).not.toContain(10);
  });

  it("flags future years with nothing listed", () => {
    const r = readStructure(profile({ grade: 11 }), [course("Algebra 2", 11)]);
    expect(r.unplannedGrades).toContain(12);
  });

  it("returns nothing when the grade is unknown", () => {
    expect(readStructure(profile({ grade: null }), []).unplannedGrades).toEqual([]);
  });
});

describe("readStructure — safe empty states", () => {
  it("is empty rather than throwing when no major is set", () => {
    const r = readStructure(profile({ major: null, major_undecided: true }), []);
    expect(r.empty).toBe(true);
    expect(r.ladders).toEqual([]);
  });
});
