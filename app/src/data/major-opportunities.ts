/**
 * V2 step 5 Part B — real, named opportunities per major family.
 *
 * ⚠️ READ BEFORE ADDING ANYTHING HERE.
 * This is the one file in the project where fabrication does the most damage.
 * A student who builds a summer around a program that doesn't exist, or whose
 * deadline passed two months ago, has lost something they can't get back. Every
 * entry below was verified by real web research on 2026-08-16 — nothing here
 * was written from memory, and nothing should be.
 *
 * RULES FOR THIS FILE:
 *  1. Never add a program you have not just checked on its own official site.
 *  2. Never state a deadline as fact without the year attached, and always
 *     pair it with "confirm on the site" — these move every cycle.
 *  3. Prefer FREE and funded programs. This app serves families for whom a
 *     $6,000 summer program is not a real option, and filling this list with
 *     pay-to-attend programs would quietly tell them they're not the audience.
 *  4. Selective programs are listed as worth *applying* to, never as things a
 *     student should expect to get into. Most applicants don't.
 *  5. When `verifiedOn` is more than a year old, re-verify or remove.
 *
 * Deliberately NOT here: competition rankings, "students like you got in",
 * admissions odds, or any claim about what a program does for your chances.
 */

export type Opportunity = {
  name: string;
  org: string;
  /** What it actually is, plainly. */
  what: string;
  /** Cost reality — the first thing this audience needs to know. */
  cost: string;
  /** Who it's open to. */
  eligibility: string;
  /** Rough timing. Always paired with a "confirm" instruction in the UI. */
  timing: string;
  /** Official site, so nobody has to trust our summary. */
  url: string;
};

export type FamilyOpportunities = {
  /** ISO date these entries were last checked against official sources. */
  verifiedOn: string;
  items: Opportunity[];
};

export const MAJOR_OPPORTUNITIES: Record<string, FamilyOpportunities> = {
  "engineering-cs": {
    verifiedOn: "2026-08-16",
    items: [
      {
        name: "MITES Summer",
        org: "MIT",
        what: "Six-week residential STEM program built specifically for students from underrepresented and underserved backgrounds — coursework, projects, and a real sense of whether engineering is for you.",
        cost: "Free. MIT and its donors cover program, food and housing. You pay only travel to MIT.",
        eligibility: "Rising high school seniors.",
        timing:
          "Applications have closed around Feb 1 in recent cycles, with recommendations shortly after. Check the site in the autumn before you'd attend.",
        url: "https://mites.mit.edu/",
      },
      {
        name: "Research Science Institute (RSI)",
        org: "Center for Excellence in Education, hosted at MIT",
        what: "About 100 students worldwide spend a week in intensive STEM classes, then five weeks on an individual research project with a working scientist.",
        cost: "Free — classes, housing and dining all covered.",
        eligibility:
          "Rising seniors. Extremely selective; worth applying to, not worth planning around.",
        timing:
          "Applications typically close in winter for the following summer. Confirm dates on the site.",
        url: "https://www.cee.org/programs/research-science-institute",
      },
      {
        name: "CS4CS",
        org: "NYU Tandon School of Engineering",
        what: "Three-week introduction to cybersecurity and computer science — ethical hacking, cryptography, digital forensics. No prior coding experience required, which is the point.",
        cost: "Tuition-free.",
        eligibility: "High school students; no prior CS background needed.",
        timing: "Summer program; applications open in the spring.",
        url: "https://engineering.nyu.edu/academics/programs/k12-stem-education/high-school-programs",
      },
      {
        name: "Beaver Works Summer Institute (BWSI)",
        org: "MIT Lincoln Laboratory",
        what: "Project-based summer courses in areas like autonomous vehicles, robotics and machine learning, with an online prerequisite course you complete first.",
        cost: "Free for accepted students.",
        eligibility: "Rising seniors, via the online prerequisite course.",
        timing:
          "The prerequisite course runs the spring before, so this one needs planning a year ahead.",
        url: "https://beaverworks.ll.mit.edu/CMS/bw/bwsi",
      },
    ],
  },

  "health-medicine": {
    verifiedOn: "2026-08-16",
    items: [
      {
        name: "Stanford Institutes of Medicine Summer Research Program (SIMR)",
        org: "Stanford Medicine",
        what: "Eight-week paid research internship in one of several areas — immunology, neurobiology, cancer biology, bioengineering, genetics and others — working in an actual lab.",
        cost: "Free to attend, and participants receive a stipend.",
        eligibility:
          "Rising juniors and seniors, 16+, U.S. citizens or permanent residents. Around 50 places, so highly selective.",
        timing:
          "The application has opened in December and closed in February in recent cycles. Confirm the current dates on the site.",
        url: "https://simr.stanford.edu/",
      },
      {
        name: "NIH Summer Internship Program (SIP)",
        org: "National Institutes of Health",
        what: "Paid summer research at NIH labs. One of the largest and most established high-school research pipelines in the country.",
        cost: "Paid — a stipend scaled to education level.",
        eligibility:
          "High school students 17+ at the time of starting; U.S. citizens or permanent residents.",
        timing:
          "Applications have closed in mid-February in recent cycles. Confirm on the site.",
        url: "https://www.training.nih.gov/programs/sip",
      },
    ],
  },

  humanities: {
    verifiedOn: "2026-08-16",
    items: [
      {
        name: "Telluride Association Summer Seminar (TASS)",
        org: "Telluride Association",
        what: "A free, discussion-based seminar in humanities and social sciences — closer to a college seminar than a summer camp. Two tracks: one centred on Black studies, one on critical inquiry into power and social structures.",
        cost: "Completely free. Tuition, books, room, board and field trips all covered.",
        eligibility:
          "High school sophomores and juniors, ages 15–18. Preference for Black, Indigenous and underrepresented communities.",
        timing:
          "Applications have opened in October and closed in early December for the following summer — meaning you apply almost a year ahead. Set a reminder.",
        url: "https://tellurideassociation.org/tass/",
      },
      {
        name: "Princeton Summer Journalism Program",
        org: "Princeton University",
        what: "Free journalism and college-readiness program for high-achieving juniors from lower-income backgrounds, including reporting, writing and a college application component.",
        cost: "Tuition-free, aimed specifically at students from limited-income families.",
        eligibility: "High school juniors from limited-income backgrounds.",
        timing: "Applications typically close in the spring of junior year.",
        url: "https://psjp.princeton.edu/",
      },
    ],
  },

  "natural-sciences": {
    verifiedOn: "2026-08-16",
    items: [
      {
        name: "NIH Summer Internship Program (SIP)",
        org: "National Institutes of Health",
        what: "Paid summer research placement in an NIH lab across the full range of biomedical science.",
        cost: "Paid stipend.",
        eligibility: "High school students 17+; U.S. citizens or permanent residents.",
        timing: "Has closed mid-February in recent cycles. Confirm on the site.",
        url: "https://www.training.nih.gov/programs/sip",
      },
      {
        name: "Research Science Institute (RSI)",
        org: "Center for Excellence in Education, hosted at MIT",
        what: "Five weeks of individual scientific research with a mentor, after a week of intensive classes.",
        cost: "Free, including housing and dining.",
        eligibility: "Rising seniors. Very selective.",
        timing: "Winter application deadline for the following summer.",
        url: "https://www.cee.org/programs/research-science-institute",
      },
    ],
  },
};

/**
 * Programs that matter regardless of major — and that matter *most* for this
 * app's audience specifically. Kept separate because filing LEDA under a
 * single major family would hide it from the students it was built for.
 *
 * Same verification rules as above.
 */
export const CROSS_CUTTING: FamilyOpportunities = {
  verifiedOn: "2026-08-16",
  items: [
    {
      name: "LEDA Scholars",
      org: "Leadership Enterprise for a Diverse America",
      what: "A five-week summer institute plus year-round support with college admissions, essays and applications — built specifically for high-achieving students from under-resourced backgrounds. The ongoing support after the summer is the part that makes it unusual; most programs end when the summer does.",
      cost: "Free for selected Scholars.",
      eligibility:
        "High school juniors from under-resourced backgrounds. This is the closest thing on this page to a program designed for exactly the students PathFinder is for.",
      timing:
        "Applications have historically run in the autumn/winter of junior year. Confirm current dates on the site.",
      url: "https://www.ledascholars.org/",
    },
  ],
};

export function opportunitiesFor(familyId: string): FamilyOpportunities | null {
  return MAJOR_OPPORTUNITIES[familyId] ?? null;
}

/**
 * Families with no researched entries yet. Named explicitly so the UI can say
 * "we haven't researched this one yet" instead of showing an empty section
 * that reads as "there's nothing out there" — which would be false and
 * discouraging.
 */
export const UNRESEARCHED_FAMILIES = [
  "arts-design",
  "business",
  "social-sciences",
  "education",
];
