import {
  SCHOLARSHIPS,
  cycleStatus,
  type Scholarship,
  type ScholarshipTag,
} from "@/data/scholarships";
import {
  MAJOR_OPPORTUNITIES,
  CROSS_CUTTING,
  type Opportunity,
} from "@/data/major-opportunities";
import { MAJOR_FAMILIES } from "@/data/majors";

/**
 * The unified opportunities directory — scholarships, internships, programs
 * and competitions in ONE place. Added Aug 17, 2026.
 *
 * WHY THIS EXISTS: `/scholarships` only ever held scholarships. Internships
 * and summer programs lived on `/major`, gated behind picking a specific
 * field first — so a student browsing money and opportunities in general had
 * no single page for it, and the nav literally called the page "Money", which
 * undersold what it should have been. This module merges both existing,
 * already-verified data sources into one typed list rather than creating a
 * third source of truth — `data/scholarships.ts` and `data/major-opportunities.ts`
 * keep their own verification disciplines and headers; this only combines them
 * for display.
 *
 * `/major`'s per-family Opportunities section is UNCHANGED and still useful in
 * its own context (a student already on their field's page, in the middle of
 * reading about it) — this directory is the browse-everything alternative for
 * a student who lands looking for money or programs specifically, not majors.
 */

export type EntryKind = "scholarship" | "internship" | "program" | "competition";

export type UnifiedEntry = {
  id: string;
  kind: EntryKind;
  name: string;
  org: string;
  /** What it gives you / what it is. */
  headline: string;
  /** Second line — who it's for. */
  subline: string;
  cost: string | null;
  eligibility: string[];
  timing: string;
  url: string;
  /** Which major family this belongs to, if any. Null = open to any field. */
  familyLabel: string | null;
  /** Grades known to be able to apply. Empty = not specified. */
  grades: number[];
  status: ReturnType<typeof cycleStatus> | null;
  /** Published close date, when the organisation states one. Drives the timeline. */
  closesOn?: string | null;
  sensitive?: boolean;
  /** Scholarship-only facet tags. Empty for internships/programs/competitions. */
  tags: ScholarshipTag[];
};

const FAMILY_LABEL: Record<string, string> = Object.fromEntries(
  MAJOR_FAMILIES.map((f) => [f.id, f.label])
);

function fromScholarship(s: Scholarship, now: Date): UnifiedEntry {
  return {
    id: `scholarship:${s.id}`,
    kind: "scholarship",
    name: s.name,
    org: s.org,
    headline: s.award,
    subline: s.whoItsFor,
    cost: null,
    eligibility: s.eligibility,
    timing: s.cycle,
    url: s.url,
    familyLabel: null,
    grades: s.grades,
    status: cycleStatus(s, now),
    closesOn: s.closesOn ?? null,
    sensitive: s.sensitive,
    tags: s.tags,
  };
}

function fromOpportunity(
  o: Opportunity,
  familyLabel: string | null,
  now: Date
): UnifiedEntry {
  return {
    // familyLabel in the key, not just the name: RSI and NIH SIP are each
    // deliberately listed under two families (real crossover programs — a
    // biology-track and an engineering-track student both plausibly want to
    // see them), and `o.name` alone collided as a React key, silently
    // dropping one of the two rows. Caught via a console key-collision
    // warning during verification, not by inspection.
    id: `opportunity:${o.name}:${familyLabel ?? "any"}`,
    kind: o.kind,
    name: o.name,
    org: o.org,
    headline: o.what,
    subline: o.eligibility,
    cost: o.cost,
    eligibility: [o.eligibility],
    timing: o.timing,
    url: o.url,
    familyLabel,
    // Opportunities don't carry a structured grade list — eligibility is
    // prose ("rising seniors", "sophomores and juniors") because district and
    // programme phrasing varies too much to force into a clean array without
    // guessing. The grade filter simply doesn't apply to these rows.
    grades: [],
    // Only the handful of entries whose organisation publishes a hard date
    // carry these; everything else stays null and is simply absent from any
    // time-based view rather than being placed by a guess. `cycleStatus`
    // takes the same shape scholarships use.
    status:
      o.opensOn || o.closesOn
        ? cycleStatus(
            { opensOn: o.opensOn, closesOn: o.closesOn } as Scholarship,
            now
          )
        : null,
    closesOn: o.closesOn ?? null,
    tags: [],
  };
}

/** Every scholarship, internship, program and competition, unified. */
export function allOpportunities(now = new Date()): UnifiedEntry[] {
  const entries: UnifiedEntry[] = SCHOLARSHIPS.map((s) => fromScholarship(s, now));

  for (const [familyId, fam] of Object.entries(MAJOR_OPPORTUNITIES)) {
    for (const o of fam.items) {
      entries.push(fromOpportunity(o, FAMILY_LABEL[familyId] ?? null, now));
    }
  }
  for (const o of CROSS_CUTTING.items) {
    entries.push(fromOpportunity(o, null, now));
  }

  return entries;
}
