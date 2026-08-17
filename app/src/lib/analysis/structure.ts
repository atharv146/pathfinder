import { pathwayFor, type LadderTrack } from "@/data/major-pathways";
import { findMajorFamily } from "@/data/majors";
import type { Course, Profile } from "@/lib/db/types";

/**
 * V2 §16K step 4 — the structural half of Profile Analysis.
 *
 * Deterministic. No model is involved in anything on this page that could be
 * mistaken for a judgement about a student, and that is the entire design:
 * matching a course list against a published course sequence is arithmetic,
 * and arithmetic can be checked. The AI is used for exactly one thing on this
 * page — rewriting the student's own activity descriptions — and never for
 * evaluation.
 *
 * ── THE RULES THIS FILE ENFORCES ──────────────────────────────────────────
 *
 * 1. **No score, no percentage, no "X of Y complete".** Same rule as
 *    `WhereYouAre`, `JourneyArc` and the `/major` timeline, and it matters
 *    most here because this is the page that looks most like a report card.
 *    A ladder step is either "you've listed this" or "not listed yet" — and
 *    "not listed yet" is a fact about the list, never about the student.
 *
 * 2. **The school's ceiling caveats everything.** A step the school doesn't
 *    offer is not a gap. When `school_ap_offered` says "none", or the student
 *    wrote real limits into `school_course_limits`, that context is attached
 *    to the output rather than left for the reader to remember.
 *
 * 3. **Nothing is a requirement.** `major-pathways.ts` ships every ladder with
 *    the caveat that district sequences differ; this file must not quietly
 *    upgrade "commonly the next step" into "you need this".
 *
 * 4. **Silence over guessing.** No major chosen, no courses listed, a family
 *    with no pathway data — each returns an empty result that the UI renders
 *    as an invitation, not an error.
 */

export type LadderMatch = {
  step: string;
  note?: string;
  /** A course the student listed that appears to be this step. */
  matched: string | null;
};

export type LadderReading = {
  label: string;
  why: string;
  steps: LadderMatch[];
  /** Index of the furthest step they've listed something for, or -1. */
  furthest: number;
};

export type StructuralReading = {
  familyId: string | null;
  familyLabel: string | null;
  ladders: LadderReading[];
  /** Grades that have no courses listed at all, from this grade forward. */
  unplannedGrades: number[];
  /** School-context caveats to render alongside everything above. */
  caveats: string[];
  /** True when there is simply not enough entered to say anything. */
  empty: boolean;
};

/**
 * Course titles are free text and districts disagree with each other, so
 * matching is normalised rather than exact: case and punctuation dropped,
 * Roman numerals folded to digits ("Algebra II" → "algebra 2"), and the
 * common prefixes that don't change what a class *is* removed ("AP", "Honors",
 * "CP", "Advanced"). Deliberately conservative — a missed match shows as "not
 * listed yet", which is recoverable, while a false match would tell a student
 * they've taken something they haven't.
 */
const ROMAN: Record<string, string> = { i: "1", ii: "2", iii: "3", iv: "4", v: "5" };

export function normalizeCourse(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => ROMAN[w] ?? w)
    .filter((w) => !["ap", "honors", "honor", "cp", "advanced", "the", "of"].includes(w))
    .join(" ");
}

/** Digits carry the level: "algebra 1" and "algebra 2" are different classes. */
function levelNumber(s: string): string | null {
  const m = s.match(/\b(\d)\b/);
  return m ? m[1] : null;
}

/** Does a listed course plausibly satisfy this ladder step? */
function matches(courseTitle: string, step: string): boolean {
  const c = normalizeCourse(courseTitle);
  const s = normalizeCourse(step);
  if (!c || !s) return false;

  // ⚠️ CHECKED FIRST, and it caught a real bug in verification: without it,
  // "Algebra I" matched the ladder's "Algebra 2" step, because the word-overlap
  // fallback below drops short tokens and both reduce to ["algebra"]. Telling a
  // student they've completed a class they haven't is the single worst thing
  // this file could do, so a level mismatch is disqualifying before anything
  // else runs.
  const cn = levelNumber(c);
  const sn = levelNumber(s);
  if (cn && sn && cn !== sn) return false;

  if (c === s) return true;
  if (c.includes(s) || s.includes(c)) return true;

  // Fall back to significant-word overlap: "Chemistry" should match
  // "Chemistry (or Physics, depending on your school)". Requires every
  // significant word of the shorter string to appear in the longer one, so
  // "biology" does not match "marine biology research".
  const cw = c.split(" ").filter((w) => w.length > 3);
  const sw = s.split(" ").filter((w) => w.length > 3);
  if (!cw.length || !sw.length) return false;
  const [short, long] = cw.length <= sw.length ? [cw, sw] : [sw, cw];
  return short.every((w) => long.includes(w));
}

function readLadder(track: LadderTrack, courses: Course[]): LadderReading {
  let furthest = -1;

  const steps = track.steps.map((step, i) => {
    const hit = courses.find((c) => matches(c.title, step.name));
    if (hit) furthest = i;
    return { step: step.name, note: step.note, matched: hit?.title ?? null };
  });

  return { label: track.label, why: track.why, steps, furthest };
}

export function readStructure(
  profile: Pick<
    Profile,
    | "grade"
    | "major"
    | "major_undecided"
    | "school_ap_offered"
    | "school_offers_ib"
    | "school_offers_dual_enrollment"
    | "school_course_limits"
  >,
  courses: Course[]
): StructuralReading {
  const family = findMajorFamily(profile.major);
  const pathway = family ? pathwayFor(family.id) : null;

  const ladders = pathway ? pathway.ladders.map((t) => readLadder(t, courses)) : [];

  // Only ever looks FORWARD. Listing nothing for a grade already behind you is
  // a gap in the data entry, not in the student's life, and flagging it would
  // be the "five years of unchecked boxes" mistake `roadmap-timing.ts` exists
  // to avoid.
  const grade = profile.grade;
  const unplannedGrades =
    grade === null
      ? []
      : [9, 10, 11, 12]
          .filter((g) => g >= grade)
          .filter((g) => !courses.some((c) => c.grade === g));

  const caveats: string[] = [];
  if (profile.school_ap_offered === "none") {
    caveats.push(
      "You've told us your school doesn't offer AP classes. Nothing below should be read against a school that does — taking the most advanced version of a subject your school actually has is the top of your ladder."
    );
  } else if (profile.school_ap_offered === "1_5") {
    caveats.push(
      "Your school offers roughly 1–5 AP classes. A schedule is read against what was available to you, not against a school with twenty-five."
    );
  }
  if (profile.school_offers_ib === false && profile.school_offers_dual_enrollment === false) {
    caveats.push(
      "No IB and no dual enrollment at your school, so those routes to advanced coursework aren't on the table — that's a fact about the school, not about you."
    );
  }
  if (profile.school_course_limits) {
    caveats.push(
      `You've noted rules your school places on what you can take: “${profile.school_course_limits}” Anything those rules block is not a gap.`
    );
  }

  return {
    familyId: family?.id ?? null,
    familyLabel: family?.label ?? null,
    ladders,
    unplannedGrades,
    caveats,
    empty: courses.length === 0 || ladders.length === 0,
  };
}
