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

/**
 * Filter facets for the directory. Deliberately few and concrete — a filter
 * bar with fifteen tags is a worse experience than a list of twelve awards.
 *
 *  need      — financial need is central to who wins it
 *  status    — eligibility turns on citizenship or immigration status, in
 *              either direction (some *require* citizenship, some exist
 *              specifically for undocumented students). Surfaced as a filter
 *              because it is the first question this audience actually has.
 *  early     — you apply before senior year. The most valuable and least
 *              known category on the page.
 *  full-ride — covers most or all of a degree, not a one-off cheque
 *  support   — comes with advising, coaching or a community, not just money
 */
export type ScholarshipTag = "need" | "status" | "early" | "full-ride" | "support";

export type Scholarship = {
  id: string;
  name: string;
  org: string;
  /** Grades that can actually apply this year. Drives the grade filter. */
  grades: number[];
  tags: ScholarshipTag[];
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

/** The most recent date on which this whole list was re-checked. */
export const SCHOLARSHIPS_VERIFIED_ON = "2026-08-17";

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: "gates",
    grades: [12],
    tags: ["need", "full-ride", "status"],
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
    grades: [12],
    tags: ["need", "full-ride", "support"],
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
    grades: [11],
    tags: ["need", "early", "support"],
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
    grades: [12],
    tags: ["need", "support"],
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
    grades: [12],
    tags: ["need", "status", "full-ride"],
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

  // ── Added Aug 17, 2026. Each of the seven below was verified by opening the
  // organisation's own page on that date; figures and dates are quoted from
  // what those pages actually said, including where a page had not yet posted
  // its next cycle. Where a site was ambiguous or unreachable, the award was
  // LEFT OUT rather than filled in from a third-party summary — see the note
  // at the bottom of this file for the two that were dropped for that reason.

  {
    id: "coca-cola",
    grades: [12],
    tags: ["status"],
    name: "Coca-Cola Scholars Program",
    org: "Coca-Cola Scholars Foundation",
    award: "$20,000. 150 scholars are selected each year.",
    whoItsFor:
      "Seniors, and the bar is a B average rather than a perfect transcript. It is achievement-based rather than need-based, so it does not ask your family to qualify for anything first.",
    eligibility: [
      "Currently enrolled high school student graduating during the 2026–2027 academic year",
      "Minimum overall B / 3.0 GPA in high school coursework",
      "U.S. citizens, U.S. nationals, U.S. permanent residents, refugees, asylees, Cuban-Haitian entrants, or humanitarian parolees",
      "Attending school in one of the 50 U.S. states, D.C., Puerto Rico, or select DoD schools",
    ],
    cycle:
      "The application for students graduating in 2026–2027 opened Monday, August 3, 2026 and closes Wednesday, September 30, 2026 at 5pm Eastern.",
    opensOn: "2026-08-03",
    closesOn: "2026-09-30",
    url: "https://www.coca-colascholarsfoundation.org/apply/",
  },
  {
    id: "questbridge-match",
    grades: [12],
    tags: ["need", "full-ride"],
    name: "National College Match",
    org: "QuestBridge",
    award:
      "A full four-year scholarship at one of 55 college partners, awarded through a matching process rather than as cash.",
    whoItsFor:
      "Seniors — this is the senior-year half of QuestBridge, and the one College Prep Scholars leads into. You do not have to have done College Prep Scholars to apply.",
    eligibility: [
      "High school senior",
      "Household earning less than $65,000 a year for a household of four, with minimal assets",
      "Earning primarily A's in the most challenging courses offered, with strong writing",
      "QuestBridge states its citizenship and status requirements on its own eligibility page — check them there, we are not summarising them second-hand",
    ],
    cycle:
      "The 2026 application deadline is October 1, 2026. Match results come back in December, before regular decision deadlines.",
    closesOn: "2026-10-01",
    url: "https://www.questbridge.org/high-school-students/national-college-match",
  },
  {
    id: "elks-mvs",
    grades: [12],
    tags: ["need"],
    name: "Most Valuable Student",
    org: "Elks National Foundation",
    award:
      "500 four-year scholarships ranging from $1,000 per year to $7,500 per year. The top 20 scholars receive $30,000.",
    whoItsFor:
      "Seniors. You do not need any connection to the Elks to apply, which surprises most people who see the name and assume it's members-only.",
    eligibility: [
      "Current high school senior, or the equivalent",
      "Must be a U.S. citizen on the date the application is submitted — the foundation states plainly that permanent legal resident status does not qualify",
    ],
    cycle:
      "The 2027 application deadline is November 12, 2026 at 11:59pm Pacific.",
    closesOn: "2026-11-12",
    url: "https://www.elks.org/scholars/scholarships/mvs.cfm",
    sensitive: true,
  },
  {
    id: "hsf",
    grades: [12],
    tags: ["need", "status", "support"],
    name: "HSF Scholar Program",
    org: "Hispanic Scholarship Fund",
    award:
      "Award amounts range from $500 to $5,000, based on relative need. Scholars also get career services, mentorship and leadership programming.",
    whoItsFor:
      "Students of Hispanic heritage, and it is one of the few large national programmes that explicitly lists DACA recipients as eligible alongside citizens and permanent residents.",
    eligibility: [
      "U.S. citizen, permanent legal resident, or DACA",
      "High school seniors: minimum 3.0 GPA on a 4.0 scale (or equivalent)",
      "College and graduate students: minimum 2.5 GPA on a 4.0 scale (or equivalent)",
      "Must plan to enrol full-time in a degree programme",
    ],
    cycle:
      "The 2026 application ran January 5 to February 15, 2026 and has closed. HSF opens a new cycle each January — check the site in December for the 2027 dates rather than assuming the same days.",
    closesOn: "2026-02-15",
    url: "https://www.hsf.net/scholarship",
    sensitive: true,
  },
  {
    id: "apia",
    grades: [12],
    tags: ["need"],
    name: "APIA Scholarship",
    org: "APIA Scholars",
    award:
      "Scholarship amounts range from $2,500 one-year awards to $20,000 multi-year awards.",
    whoItsFor:
      "Students of Asian and Pacific Islander heritage heading into an undergraduate degree. Note the multi-year awards — most national scholarships are one-and-done.",
    eligibility: [
      "Citizen, national, or legal permanent resident of the United States",
      "Citizens of the Republic of the Marshall Islands, the Federated States of Micronesia, and the Republic of Palau are also eligible",
      "Degree-seeking undergraduate student",
    ],
    cycle:
      "The 2027–2028 cycle opens November 15, 2026 and closes January 15, 2027 at 5pm Eastern.",
    opensOn: "2026-11-15",
    closesOn: "2027-01-15",
    url: "https://apiascholars.org/scholarship/apia-scholarship/",
  },
  {
    id: "jkc-young",
    grades: [7, 8],
    tags: ["need", "early", "support"],
    name: "Cooke Young Scholars Program",
    org: "Jack Kent Cooke Foundation",
    award:
      "Not a cheque — five years of comprehensive academic and college advising, plus financial support for school, Cooke-sponsored summer programmes, internships and other learning enrichment, from 8th grade through high school.",
    whoItsFor:
      "Current 7th graders with financial need. This is the single earliest thing on this page and almost nobody in this audience knows it exists — by the time most families start looking at scholarships, this one closed five years ago.",
    eligibility: [
      "Applies during 7th grade, for support beginning in 8th grade",
      "Strong academic record with demonstrated financial need",
      "The foundation publishes its exact income and grade thresholds on its own page — check them there",
    ],
    cycle:
      "The application was closed when we checked on August 17, 2026. It runs on an annual cycle for current 7th graders — if you are in 6th or 7th grade, put a reminder in your phone to check the site in the autumn.",
    url: "https://www.jkcf.org/our-scholarships/young-scholars-program/",
  },
  {
    id: "hhf-youth",
    grades: [12],
    tags: [],
    name: "Youth Awards",
    org: "Hispanic Heritage Foundation",
    award:
      "A one-time innovation grant to fund college or support a community service effort, awarded by category — STEM, entrepreneurship, media, public service and others.",
    whoItsFor:
      "Seniors who have done something specific and can point at it. Because it is judged by category rather than as one general pool, a student with one strong area does not have to look well-rounded to win.",
    eligibility: [
      "Currently enrolled in high school and graduating in the spring",
      "Minimum unweighted 3.0 GPA on a 4.0 scale, or 7.5 on a 10.0 scale",
      "Must enrol at an accredited higher education institution the following year",
    ],
    cycle:
      "⚠️ When we checked on August 17, 2026 the site still showed the previous cycle (deadline November 2, 2025) and had not posted the next one. Their deadlines have historically fallen in early November — check the site in the autumn, and do not treat that pattern as a date.",
    url: "https://hispanicheritage.org/programs/leadership/youth-awards/",
  },
];

/**
 * ── DELIBERATELY NOT LISTED, and why (Aug 17, 2026) ────────────────────────
 * Both of these are real and would be valuable here. Neither is listed because
 * rule 1 wasn't satisfiable on the day, and a half-verified scholarship entry
 * is exactly the kind of confident wrongness this file exists to prevent.
 *
 *  • Golden Door Scholars — for students with DACA, TPS or no lawful status.
 *    Their site had moved to roadtohire.org and the live page showed only
 *    "Applications are Closed" with no eligibility criteria and no next cycle.
 *    Third-party summaries carry details; those are not a source we use for an
 *    award whose whole audience is status-dependent. Re-check for the next
 *    cycle and add it then — this is the highest-value missing entry.
 *  • Ron Brown Scholar Program — $40,000 over four years for Black students.
 *    The official page showed contradictory cycle status on the same screen
 *    (both "now open" and "the 2026 competition is now closed"), so the
 *    deadline could not be stated honestly. Re-check.
 */

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
