import { roadmapData, type RoadmapItem } from "@/data/roadmap";
import { isEvergreen } from "@/data/roadmap-timing";

/**
 * "Start where you are" — the gap view.
 *
 * The design constraint that shapes everything here, from master-spec-doc.md
 * Section 16B: **never score the student.** No percentage, no completion bar,
 * no "you're behind". For this audience a behind-ness number is actively
 * harmful — a first-gen 11th grader who joins and sees "you've completed 12%
 * of your roadmap" learns that they are failing at something they only just
 * found out existed.
 *
 * What it produces instead is a list of what is still *available* to them:
 * this year's work, the earlier things that genuinely still transfer, and a
 * look at what's next. Everything is framed as open, never as missed.
 *
 * Note there is deliberately no "missed" bucket. It was considered and cut —
 * there is no version of showing someone a list of closed doors that helps
 * them, and the windowed items remain readable on their own grade pages.
 */

export type GapItem = { item: RoadmapItem; grade: number };

export type Gaps = {
  /** This year's items, in order, with what's already ticked off. */
  thisYear: { item: RoadmapItem; done: boolean }[];
  /** Earlier-grade items that still genuinely transfer, and aren't done. */
  catchUp: GapItem[];
  /** A look at next year, so nothing arrives as a surprise. */
  comingUp: GapItem[];
  /** Count of this year's items already done — a fact, not a grade. */
  doneThisYear: number;
};

export const MIN_GRADE = 6;
export const MAX_GRADE = 12;

export function buildGaps(grade: number, done: Set<string>): Gaps {
  const thisYearItems = roadmapData[String(grade)] ?? [];

  const thisYear = thisYearItems.map((item) => ({
    item,
    done: done.has(item.id),
  }));

  // Walked newest-first, and that ordering is the whole usefulness of this
  // list. Sorted the other way, the first things an 11th grader sees are
  // grade-6 habits ("read something you chose most days") while the genuinely
  // urgent grade-10 items (net price calculators, scholarship search, what
  // your target schools actually require) sit 20 rows down where nobody looks.
  // Closest year first is also the truest: guidance from last year transfers
  // far better than guidance from five years ago.
  const catchUp: GapItem[] = [];
  for (let g = grade - 1; g >= MIN_GRADE; g--) {
    for (const item of roadmapData[String(g)] ?? []) {
      if (done.has(item.id)) continue;
      if (!isEvergreen(item.id)) continue;
      catchUp.push({ item, grade: g });
    }
  }

  const comingUp: GapItem[] = [];
  if (grade < MAX_GRADE) {
    for (const item of roadmapData[String(grade + 1)] ?? []) {
      comingUp.push({ item, grade: grade + 1 });
    }
  }

  return {
    thisYear,
    catchUp,
    comingUp,
    doneThisYear: thisYear.filter((t) => t.done).length,
  };
}
