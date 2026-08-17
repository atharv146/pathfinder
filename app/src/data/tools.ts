/**
 * The tools registry — V2 §16K step 2.
 *
 * ── WHY THIS FILE EXISTS ──────────────────────────────────────────────────
 * `/tools` used to be one page with both tools stacked on it as sections, and
 * roadmap items deep-linked into it with hash fragments (`/tools#fee-waivers`).
 * That worked with two tools and stops working as soon as there are three: the
 * page gets long, a hash link drops you mid-scroll with no context about where
 * you landed, and neither tool can grow without burying the other.
 *
 * So each tool is now its own route, and this is the single place that knows
 * the set. The index page maps over it, and `item-tools.ts` builds its
 * roadmap deep links from `href()` rather than hardcoding paths — which is
 * what stops the two from drifting apart the next time one moves.
 *
 * ── THE `promise` FIELD IS NOT MARKETING ──────────────────────────────────
 * Each tool here is defined as much by what it refuses to do as by what it
 * does, and those refusals are real product decisions recorded in
 * master-spec-doc.md: the fee-waiver checker never says "you don't qualify"
 * (thresholds move annually and a false negative costs a family real money),
 * and the essay tool writes nothing (an AI-drafted essay is an integrity
 * problem for the student and would cost us counselors, who are the #1
 * distribution channel). Stating those on the card is the honest version of a
 * feature list, and for this audience the refusal is often the reason to trust
 * the tool at all.
 */

export type Tool = {
  slug: string;
  name: string;
  /** One line on what it does. */
  tagline: string;
  /** Who it's for and when it's useful — the "should I open this" answer. */
  what: string;
  /** What it deliberately will NOT do. See the header note. */
  promise: string;
  /** Roughly how long it takes, so nobody opens it at the wrong moment. */
  effort: string;
};

export const TOOLS: Tool[] = [
  // First on purpose — this is the one the homepage promotes, and the one that
  // reads everything else the student has entered.
  {
    slug: "profile-analysis",
    name: "Profile analysis",
    tagline: "Everything you've entered, read back to you properly.",
    what: "Matches your classes against the usual sequence for your field, writes your activities up in application language, and shows you exactly which published documents to look up for the colleges on your list.",
    promise:
      "It will never give you a percentage, a score, or your chances of getting in. Nobody can honestly calculate that, and a confident number from a site that sounds like it's on your side is worse than no number at all. It also never invents a college statistic — it tells you where the school publishes its own.",
    effort: "Instant, then about 10 minutes of reading",
  },
  {
    slug: "fee-waivers",
    name: "Fee waiver checker",
    tagline: "Find out which fees you probably don't have to pay.",
    what: "Test fees, application fees, and score reports are all waivable, and most families never find out. This walks through the indicators and tells you exactly who to ask.",
    promise:
      "It will never tell you that you don't qualify. Thresholds change every year and vary by school, so a confident 'no' from us could cost you money you were entitled to. It shows what to check and who decides.",
    effort: "About 5 minutes",
  },
  {
    slug: "essay-brainstorm",
    name: "Essay brainstorming",
    tagline: "Find the story before you try to write it.",
    what: "Three exercises for the part everyone gets stuck on — not the writing, the finding. Useful in 11th and 12th grade, and pointless before that.",
    promise:
      "It writes nothing for you, ever. Not a draft, not a sentence, not a 'here's an example you could adapt'. Your notes stay on your own device and are never uploaded, because this is unedited thinking about your own life.",
    effort: "20–30 minutes, and worth doing more than once",
  },
];

export function toolBySlug(slug: string): Tool | null {
  return TOOLS.find((t) => t.slug === slug) ?? null;
}

/** Single source of truth for tool URLs — see the header note on drift. */
export function toolHref(slug: string): string {
  return `/tools/${slug}`;
}
