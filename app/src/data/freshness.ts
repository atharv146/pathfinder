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
    verified: "2026-08-15",
    checked:
      "FAFSA cycle dates, Parent PLUS loan caps, and the removal of the multi-child allowance were each checked against current reporting.",
    watch: [
      "FAFSA open date — it has moved in several recent cycles",
      "Parent PLUS caps and any future adjustment",
      "State-level aid eligibility, which changes and varies",
    ],
  },
  "how-the-u-s-college-system-works": {
    verified: "2026-08-15",
    checked:
      "Standardized-testing policy was rechecked, including which institutions have reinstated requirements and the schools still test-optional.",
    watch: [
      "Testing policy — reinstatements have been announced with little notice",
      "The share of colleges remaining test-optional",
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
