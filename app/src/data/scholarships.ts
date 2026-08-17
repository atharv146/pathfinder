/**
 * V2 §16K step 3 — the scholarships hub.
 *
 * ⚠️ SAME VERIFICATION RULES AS major-opportunities.ts, AND THEY BIND HARDER HERE.
 * Every entry below was checked on its own official site on the date in
 * `verifiedOn`. Nothing was written from memory. A wrong scholarship deadline
 * is not a typo — it is a student missing money they were entitled to, and for
 * this audience that can decide whether they enrol at all.
 *
 * RULES:
 *  1. Never add an award you have not just opened the official page for.
 *  2. Never state a deadline without the cycle year attached. These move every
 *     year, and a stale date presented confidently is worse than no date.
 *  3. Award amounts and eligibility get quoted as the organisation states them,
 *     not rounded, softened, or "simplified" into something inaccurate.
 *  4. When `verifiedOn` is more than a year old, re-verify or remove.
 *  5. No "you should apply to this" language and no odds. These are competitive;
 *     the honest framing is that applying costs nothing but time.
 *
 * ── ON THE IMMIGRATION-RELATED ENTRIES ────────────────────────────────────
 * Some awards here are specifically for undocumented students. Listing them is
 * correct — they are real, they are the single highest-value thing this app can
 * surface for part of its audience, and hiding them would fail exactly the
 * families it exists for. But the standing rule in `system-prompt.ts` applies
 * word for word: **never reassure anyone about immigration enforcement risk.**
 * So these entries state eligibility as the organisation states it and stop
 * there. We do not tell anyone that applying is safe, that information is
 * protected, or what any agency will or won't do with it. That is not our call
 * to make, and being wrong once would be unforgivable. `sensitive: true` makes
 * the UI render the "decide with your family" note instead of any assurance.
 */

export type Scholarship = {
  id: string;
  name: string;
  org: string;
  /** What it actually gives you. Quote the organisation's own figures. */
  award: string;
  /** The honest "is this me?" answer. */
  whoItsFor: string;
  /** Eligibility as stated by the organisation. */
  eligibility: string[];
  /**
   * The cycle window in words, always with the year attached (rule 2).
   */
  cycle: string;
  /**
   * ISO date this cycle's application closes, when the org publishes one.
   * Used only to compute a "closing soon / already closed" hint, which is
   * always shown alongside `cycle` and a "confirm on the site" instruction —
   * never on its own.
   */
  closesOn?: string;
  /** ISO date it opens, when published. */
  opensOn?: string;
  url: string;
  /** Triggers the immigration-status framing. See the header note. */
  sensitive?: boolean;
};

export const SCHOLARSHIPS_VERIFIED_ON = "2026-08-16";

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: "gates",
    name: "The Gates Scholarship",
    org: "Bill & Melinda Gates Foundation",
    award:
      "The full cost of attendance — tuition, fees, books, housing and food — minus other financial aid and your Student Aid Index.",
    whoItsFor:
      "Seniors with strong grades whose families qualify for a Pell Grant. This is one of the largest awards a U.S. high schooler can win, and the application is free.",
    eligibility: [
      "High school senior",
      "Pell-eligible",
      "U.S. citizen or permanent resident",
      "Minimum 3.3 GPA on a 4.0 scale",
      "Planning to enrol full-time in a four-year degree programme",
    ],
    cycle:
      "The 2026–27 application opened July 15, 2026 and closes September 15, 2026. Selection runs through April 2027.",
    opensOn: "2026-07-15",
    closesOn: "2026-09-15",
    url: "https://www.thegatesscholarship.org/scholarship",
  },
  {
    id: "jkc-college",
    name: "Cooke College Scholarship Program",
    org: "Jack Kent Cooke Foundation",
    award:
      "Last-dollar funding after institutional aid, up to $55,000 per year toward a bachelor's degree — tuition, living expenses, books and required fees. Includes personal advising on choosing a college and navigating aid.",
    whoItsFor:
      "High-achieving seniors with financial need aiming at four-year colleges. The advising that comes with it is worth nearly as much as the money for a student without a counselor who knows this system.",
    eligibility: [
      "High school senior with financial need",
      "Planning to attend a four-year college or university",
      "The foundation publishes full GPA and income thresholds on its own page — check them there rather than relying on any summary",
    ],
    cycle:
      "The Cooke College Scholarship application opens August 19, 2026. The foundation had not published a closing date at the time we checked — confirm on the site.",
    opensOn: "2026-08-19",
    url: "https://www.jkcf.org/our-scholarships/college-scholarship-program/",
  },
  {
    id: "questbridge-cps",
    name: "College Prep Scholars",
    org: "QuestBridge",
    award:
      "Not cash — access. Summer programme scholarships, college admissions conferences, free college visits to partner institutions, and personalised guidance. It's the on-ramp to QuestBridge's National College Match, which is a full four-year scholarship for seniors.",
    whoItsFor:
      "Juniors specifically. This is the rare thing on this page you apply to a full year before everyone else starts, and doing it puts you in position for the much larger senior-year award.",
    eligibility: [
      "Currently a high school junior",
      "Mostly A's in challenging courses, with strong writing",
      "Household income under $65,000 a year for a family of four, with minimal assets",
    ],
    cycle:
      "QuestBridge did not show a confirmed deadline on the page we checked. Do not guess at it — open the site and check, because this one closes in junior year and there is no second chance at it.",
    url: "https://www.questbridge.org/high-school-students/college-prep-scholars",
  },
  {
    id: "dell",
    name: "Dell Scholars",
    org: "Michael & Susan Dell Foundation",
    award:
      "$20,000 flexible funding, a laptop, book credits, emergency funds, academic and career coaching, and free teletherapy. The emergency fund and the coaching are the unusual parts — most awards stop at a cheque.",
    whoItsFor:
      "Seniors who have pushed through real obstacles. Note the GPA floor is 2.4, not 3.5 — this one explicitly weights determination over a perfect transcript, which makes it winnable for students other awards screen out.",
    eligibility: [
      "High school senior with a minimum 2.4 GPA",
      "Pell Grant eligible",
      "Participating in an approved college readiness programme",
      "Enrolling full-time at a four-year college immediately after high school",
    ],
    cycle:
      "The 2026 cycle ran December 15, 2025 to February 15, 2026, with scholars announced June 1, 2026. That round has closed; the next is expected on a similar winter schedule, but confirm on the site.",
    closesOn: "2026-02-15",
    url: "https://www.dellscholars.org/scholarship/",
  },
  {
    id: "thedream-us",
    name: "National Scholarship",
    org: "TheDream.US",
    award:
      "Up to $33,000 toward a bachelor's degree, plus up to $6,000 for books, supplies and transportation.",
    whoItsFor:
      "Undocumented students, with or without DACA or TPS. This is the largest scholarship fund in the country for undocumented students, and most families it applies to have never heard of it.",
    eligibility: [
      "First-generation immigrant student, currently undocumented, with or without DACA or TPS",
      "Arrived in the U.S. before November 1, 2020, and entered before age 16",
      "Graduating from a U.S. high school (or equivalency) with a minimum 2.5 GPA",
      "Must be eligible for in-state tuition at one of roughly 80 partner colleges",
      "Not applicable at private, online, or Texas institutions",
    ],
    cycle:
      "The 2026–27 round opened November 1, 2025 and closed February 28, 2026, with notifications in late April 2026. That round has closed. The next round has historically opened around November — confirm the exact dates on the site rather than assuming.",
    closesOn: "2026-02-28",
    url: "https://www.thedream.us/scholarships/national-scholarship/",
    sensitive: true,
  },
];

/**
 * Where a scholarship's currently-known cycle sits relative to today.
 *
 * Deliberately conservative. This never invents a date and never contradicts
 * the written `cycle` text — it only labels what the stored ISO dates already
 * say, and the UI always renders `cycle` plus a "confirm on the site"
 * instruction alongside whatever this returns. A student should never be
 * relying on a computed badge alone.
 */
export type CycleStatus =
  | { kind: "open"; daysLeft: number }
  | { kind: "opens-soon"; daysUntil: number }
  | { kind: "closed" }
  | { kind: "unknown" };

export function cycleStatus(s: Scholarship, now = new Date()): CycleStatus {
  const day = 86_400_000;
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const opens = s.opensOn ? Date.parse(`${s.opensOn}T00:00:00Z`) : null;
  const closes = s.closesOn ? Date.parse(`${s.closesOn}T00:00:00Z`) : null;

  if (closes !== null && today > closes) return { kind: "closed" };
  if (opens !== null && today < opens)
    return { kind: "opens-soon", daysUntil: Math.round((opens - today) / day) };
  if (closes !== null && today <= closes)
    return { kind: "open", daysLeft: Math.round((closes - today) / day) };
  // Opened, with no published closing date — real for JKC at time of writing.
  if (opens !== null && today >= opens) return { kind: "open", daysLeft: -1 };
  return { kind: "unknown" };
}
