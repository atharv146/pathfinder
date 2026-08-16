/**
 * Fee waivers — the money most families leave on the table.
 *
 * ⚠️ THIS DOES NOT DECIDE ELIGIBILITY, ON PURPOSE.
 * Exact income thresholds are set per program and revised annually, and a
 * confident "you don't qualify" from this app could cost a family hundreds of
 * dollars they were actually entitled to. So this lists the common indicators
 * and, when any apply, tells them precisely who to ask. The organisation
 * running the waiver decides — we just make sure the student knows to ask.
 *
 * Everything below is structural and checkable: these programs exist, these
 * are the commonly-used indicators, this is who you ask. No dollar figures, no
 * thresholds, no "you qualify".
 */

export type Indicator = { id: string; label: string; detail?: string };

/**
 * Commonly-used eligibility indicators across waiver programs. Deliberately
 * phrased as "any of these" rather than a formula — different programs weigh
 * them differently and several accept a counselor's judgement alone.
 */
export const INDICATORS: Indicator[] = [
  {
    id: "nslp",
    label: "You get free or reduced-price school lunch",
    detail:
      "This is the single most commonly accepted indicator, and the one most families don't realise carries over to testing and application fees.",
  },
  {
    id: "income",
    label: "Your family's income is low relative to its size",
    detail:
      "Programs use federal income guidelines that change each year, so don't rule yourself out on a guess — a counselor can check the current figure.",
  },
  {
    id: "program",
    label:
      "You're in a federal or state program for low-income students (TRIO, Upward Bound, GEAR UP, a similar one)",
  },
  {
    id: "assistance",
    label: "Your family receives public assistance",
  },
  {
    id: "housing",
    label:
      "You live in federally subsidised housing, in foster care, or are experiencing homelessness",
    detail:
      "Students who are homeless or unaccompanied qualify for a range of waivers and support, and a school counselor or homeless liaison can confirm this without involving your family.",
  },
  {
    id: "ward",
    label: "You're a ward of the state, or an orphan",
  },
];

export type Waiver = {
  id: string;
  name: string;
  what: string;
  /** Exactly who to ask. The specific ask is the whole value here. */
  howToAsk: string;
  /** When it becomes relevant. */
  fromGrade: number;
};

export const WAIVERS: Waiver[] = [
  {
    id: "sat-act",
    name: "SAT and ACT fee waivers",
    what: "Covers the cost of taking the test, usually more than once. These are run separately by the College Board (SAT) and ACT, so a waiver for one does not cover the other.",
    howToAsk:
      "Ask your school counselor directly — they issue these, and you don't apply to the testing company yourself.",
    fromGrade: 10,
  },
  {
    id: "app-fees",
    name: "College application fee waivers",
    what: "Colleges charge per application, and applying to eight schools adds up fast. Fee waivers remove that cost. Students who received an SAT fee waiver are often automatically eligible for application waivers too.",
    howToAsk:
      "The Common App asks a fee-waiver question directly inside the application — answer it honestly, and your counselor confirms it. Colleges you apply to outside the Common App will have their own process; email their admissions office and ask.",
    fromGrade: 11,
  },
  {
    id: "css",
    name: "CSS Profile fee waiver",
    what: "The CSS Profile is a second financial aid form required by a few hundred mostly-private colleges, and unlike the FAFSA it normally costs money to submit. Waivers exist for lower-income families.",
    howToAsk:
      "The waiver is applied automatically based on what you enter in the form itself — fill it in accurately rather than trying to qualify.",
    fromGrade: 12,
  },
  {
    id: "ap",
    name: "AP exam fee reductions",
    what: "AP exams cost money per exam, which quietly discourages students from taking the rigorous courses colleges want to see. Reductions exist.",
    howToAsk:
      "Ask the AP coordinator or your counselor at your school — this is handled at school level, usually early in the school year.",
    fromGrade: 10,
  },
];

/** The FAFSA is free. Stated explicitly because scam sites charge for it. */
export const FAFSA_NOTE =
  "The FAFSA itself is always free — the first F stands for Free. If any site asks you to pay to file it, you're on the wrong site. Go to studentaid.gov.";
