/**
 * When each piece of time-sensitive content was last checked against reality.
 *
 * This exists because of a real incident, not as a nicety. On Aug 15, 2026 an
 * audit of content that had already been through several revision passes found
 * two dating errors: FAFSA cycle references reading one full cycle stale, and
 * the "no sibling discount" rule mis-dated to 2026-27 when it took effect in
 * 2024-25. Both were plausible-sounding and both were wrong.
 *
 * Admissions and aid policy moves every year. The honest response is not to
 * claim the content is always current — it's to say when it was last checked
 * and let the reader weigh that. No competitor shows their work this way, and
 * for an audience that has been burned by confident bad advice, showing it is
 * itself the feature.
 *
 * ⚠️ HOW TO USE THIS FILE: only update a date when you have ACTUALLY
 * re-verified the claims against a primary source. Bumping the date because
 * you edited nearby prose makes this worse than having no stamp at all.
 */

export type Freshness = {
  /** ISO date of the last real verification. */
  verified: string;
  /** What was actually checked. Specific, so the next person knows the scope. */
  checked: string;
  /** Claims known to move, flagged for the next pass. */
  watch?: string[];
};

/** Keyed by guide-article slug (see slugify in data/guide.ts). */
export const GUIDE_FRESHNESS: Record<string, Freshness> = {
  "financial-aid-what-you-need-to-know": {
    verified: "2026-08-17",
    checked:
      "Pell Grant maximum and minimum for 2026-27 ($7,395 / $740) checked against the Department of Education's own Dear Colleague Letter; federal Direct Loan annual and aggregate limits checked against the Federal Student Aid Handbook; the CSS Profile's free-under-$100,000 threshold checked on the College Board's site. FAFSA cycle dates, Parent PLUS caps and the removal of the multi-child allowance were re-confirmed from the previous pass.",
    watch: [
      "Pell maximum — set annually, and the minimum is derived from it",
      "FAFSA open date — it has moved in several recent cycles",
      "Parent PLUS caps and any future adjustment",
      "Federal loan limits — unchanged for years, but under active legislative discussion",
      "State-level aid eligibility, which changes and varies",
    ],
  },
  "how-the-u-s-college-system-works": {
    verified: "2026-08-17",
    checked:
      "Standardized-testing policy was rechecked, including which institutions have reinstated requirements and the schools still test-optional. Application-platform and deadline-type material (Common App college cap, Early Decision being binding, Early Action not) was added and checked this pass.",
    watch: [
      "Testing policy — reinstatements have been announced with little notice",
      "The share of colleges remaining test-optional",
      "The Common App college cap, which is a policy its members set",
      "State transfer/articulation guarantees, which are set per state",
    ],
  },

  // ── Stamped for the first time on 2026-08-17, during the depth pass ──
  // Each of these gained substantial new material that session, and the
  // specific claims below were checked against primary sources rather than
  // recalled. Anything NOT listed in `checked` was not re-verified.
  "how-to-support-your-child-s-applications": {
    verified: "2026-08-17",
    checked:
      "The FERPA claim — that rights over education records transfer from parent to student at 18 or on enrolling in a postsecondary institution, whichever comes first — was checked against the U.S. Department of Education's own student-privacy guidance, including the exceptions for tax-dependent students and health or safety emergencies.",
    watch: [
      "FERPA exceptions, and how individual colleges choose to apply the permitted ones",
      "Whether colleges keep offering a student-signed access form — that's institutional practice, not law",
    ],
  },
  "understanding-grades-and-gpa": {
    verified: "2026-08-17",
    checked:
      "Nothing numeric is claimed in this article by design. The added material describes mechanisms — GPA recalculation, the school profile, mid-year and final reports, rescinded offers — rather than figures, so it was written to stay true as policies shift.",
    watch: [
      "Whether recalculation practices are still commonly published by colleges",
    ],
  },
  "what-are-extracurricular-activities-and-what-s-a-spike": {
    verified: "2026-08-17",
    checked:
      "The Common App activities format — ten slots, the short role and organisation fields, roughly 150 characters of description, and the hours/weeks fields — reflects the current application. Treat the exact character counts as the thing most likely to move.",
    watch: [
      "Activity slot count and character limits, which the Common App has adjusted before",
      "Any rename of the activities section itself",
    ],
  },
  "resources-for-immigrant-families": {
    verified: "2026-08-17",
    checked:
      "The added residency material deliberately states no state-specific policy as fact — it explains how residency classification works, who decides it, and what to ask. That framing was chosen precisely because these provisions are changed by legislatures and challenged in courts, and because this app never tells a family that anything about their status is settled or safe.",
    watch: [
      "State in-state-tuition provisions for students who graduated from an in-state high school — these move, and they move fast",
      "State aid eligibility for undocumented and DACA students",
      "⚠️ Never add reassurance about enforcement risk to this article. Explain mechanisms; refer status questions to a licensed immigration attorney.",
    ],
  },

  "community-college-and-transfer-pathways": {
    verified: "2026-08-17",
    checked:
      "Community college vs. public four-year tuition averages ($4,150 / $11,950) checked against the College Board's own Trends in College Pricing and Student Aid 2025 report. The Pell Grant lifetime limit (12 semesters / 600% of a Scheduled Award) checked against the Federal Student Aid Handbook. Florida's Statewide Articulation Agreement terms and the UC Transfer Admission Guarantee's participating-campus list and unit requirements were checked against the Florida DOE and University of California's own admissions pages, respectively.",
    watch: [
      "Tuition averages — set annually by the College Board's autumn report",
      "Which UC campuses participate in TAG, and their specific unit/GPA thresholds",
      "Other states' articulation systems — this article names Florida and California as concrete examples, not as the only two that exist; a future pass could add more states by name",
      "The Pell Grant lifetime limit itself, under periodic legislative discussion",
    ],
  },
};

/**
 * Articles with no entry above have NOT been re-verified recently. That's
 * deliberately visible rather than hidden: an unstamped article is a to-do
 * list item, and pretending otherwise is how the two dating errors survived
 * multiple revision passes in the first place.
 */
export function getFreshness(slug: string): Freshness | null {
  return GUIDE_FRESHNESS[slug] ?? null;
}

/** e.g. "15 August 2026" — unambiguous across US/EU date conventions. */
export function formatVerified(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
