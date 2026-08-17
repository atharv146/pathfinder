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

/**
 * program      — coursework, a seminar, a summer institute. You attend and learn.
 * internship   — real placed work, usually paid, in an actual lab or role.
 * competition  — a judged submission or contest with an award at the end.
 */
export type OpportunityKind = "program" | "internship" | "competition";

export type Opportunity = {
  name: string;
  org: string;
  /** Added Aug 17, 2026 for the unified opportunities directory. */
  kind: OpportunityKind;
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
  /**
   * Set when the list is real but thin, so the UI can say "here's what we've
   * checked so far, and we're still looking" instead of implying this is the
   * complete set of what exists for the field. Honest either way — the failure
   * mode we're avoiding is a short list reading as a closed one.
   */
  stillResearching?: boolean;
};

export const MAJOR_OPPORTUNITIES: Record<string, FamilyOpportunities> = {
  "engineering-cs": {
    verifiedOn: "2026-08-16",
    items: [
      {
        name: "MITES Summer",
        kind: "program",
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
        kind: "internship",
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
        kind: "program",
        org: "NYU Tandon School of Engineering",
        what: "Three-week introduction to cybersecurity and computer science — ethical hacking, cryptography, digital forensics. No prior coding experience required, which is the point.",
        cost: "Tuition-free.",
        eligibility: "High school students; no prior CS background needed.",
        timing: "Summer program; applications open in the spring.",
        url: "https://engineering.nyu.edu/academics/programs/k12-stem-education/high-school-programs",
      },
      {
        name: "Beaver Works Summer Institute (BWSI)",
        kind: "program",
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
        kind: "internship",
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
        kind: "internship",
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
        kind: "program",
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
        kind: "program",
        org: "Princeton University",
        what: "Free journalism and college-readiness program for high-achieving juniors from lower-income backgrounds, including reporting, writing and a college application component.",
        cost: "Tuition-free, aimed specifically at students from limited-income families.",
        eligibility: "High school juniors from limited-income backgrounds.",
        timing: "Applications typically close in the spring of junior year.",
        url: "https://psjp.princeton.edu/",
      },
    ],
  },

  "arts-design": {
    verifiedOn: "2026-08-16",
    stillResearching: true,
    items: [
      {
        name: "YoungArts National Arts Competition",
        kind: "competition",
        org: "National YoungArts Foundation",
        what: "A national award across ten disciplines — visual arts, design, film, photography, writing, dance, theater, voice, classical music and jazz. Winners receive cash awards; those selected with distinction get an all-expenses-paid week in Miami working with professional artists.",
        cost:
          "$35 per application, and the fee is waived on request. The waiver is unusually easy: a short letter from a parent, teacher, counselor or principal saying you need the fee waived — it does not have to be on letterhead and does not have to give a reason. National YoungArts Week itself costs nothing; airfare, hotel and meals are covered.",
        eligibility:
          "Ages 15–18 and in grades 10–12 as of December 1, 2026. U.S. citizens, permanent residents, or anyone legally able to receive taxable income in the U.S.",
        timing:
          "The 2027 competition opened July 21, 2026 and closes October 6, 2026 at 8pm ET — so unlike most things on this page, this one is open right now. Confirm on the site.",
        url: "https://youngarts.org/apply/",
      },
      {
        name: "The Saturday Program",
        kind: "program",
        org: "The Cooper Union, New York City",
        what: "Free art and architecture classes on Saturdays in Cooper Union's own studios — drawing, painting, sculpture, graphic design, sound, architecture, and a dedicated portfolio preparation course. Taught by Cooper undergraduates with faculty and visiting artists.",
        cost: "Free, and has been for over 55 years.",
        eligibility:
          "New York City public high school students, grades 9–12. Admission includes an artwork review. This one is genuinely local — if you're not in New York it won't apply to you, but it's worth knowing that free university outreach programs like this exist, and asking whether any college near you runs one.",
        timing:
          "Saturdays, 9–5, for 6–8 weeks. Fall, winter and spring sessions. Confirm current dates on the site.",
        url: "https://cooper.edu/academics/outreach-and-pre-college/saturday-program",
      },
    ],
  },

  business: {
    verifiedOn: "2026-08-16",
    stillResearching: true,
    items: [
      {
        name: "Global High School Investment Competition",
        kind: "competition",
        org: "Wharton Global Youth Program, University of Pennsylvania",
        what: "A ten-week team competition. Your team manages a simulated $500,000 portfolio for a fictional client with real stated goals, then writes up the strategy behind your decisions. Fifty semifinalist teams present virtually and ten reach a finale at Wharton.",
        cost: "Free. There is no registration fee.",
        eligibility:
          "High school students worldwide, in teams of four to six from the same school. The team leader must be 16 by the competition's first day.",
        timing:
          "⚠️ A teacher has to register the team — you cannot register yourself — so the real first step is asking one, and that takes lead time. For 2026–27, registration opened August 10 and closes September 11, 2026, with the competition running September 28 to December 4. Confirm on the site.",
        url: "https://globalyouth.wharton.upenn.edu/competitions/investment-competition/",
      },
    ],
  },

  "social-sciences": {
    verifiedOn: "2026-08-16",
    stillResearching: true,
    items: [
      {
        name: "Boys State and Girls State",
        kind: "program",
        org: "The American Legion / American Legion Auxiliary",
        what: "A week-long, hands-on simulation of state government, running since 1935. You run for office, caucus, pass bills and staff a mock state. Two delegates from each state program go on to Boys Nation or Girls Nation in Washington, D.C.",
        cost:
          "Usually sponsored, but this genuinely varies by state and you should ask rather than assume. Maryland's is fully funded with no cost to families. New Jersey charges a $50 fee when a Legion post sponsors you. Arizona's true cost is roughly $650, with about $425 typically covered by a sponsorship. Asking your school or a local American Legion post about sponsorship is the normal route here, not a favour.",
        eligibility:
          "High school juniors, in the summer before senior year. Programs run in every state except Hawaii, which runs Girls State only.",
        timing:
          "One week in summer. Selection usually happens through your school in winter or early spring, so the year to ask is your sophomore or junior year.",
        url: "https://www.legion.org/get-involved/youth-programs/boys-state-boys-nation",
      },
    ],
  },

  education: {
    verifiedOn: "2026-08-16",
    stillResearching: true,
    items: [
      {
        name: "Breakthrough Teaching Fellowship",
        kind: "internship",
        org: "Breakthrough Collaborative (25 affiliate sites)",
        what: "Breakthrough runs summer academic programs for middle schoolers that are taught largely by student teaching fellows, mentored by professional educators. It is real teaching — planning lessons and running a classroom — not shadowing or filing.",
        cost: "Free to participate, and the national fellowship pays a living stipend.",
        eligibility:
          "⚠️ Check your local site before planning on this one. The NATIONAL fellowship is for undergraduates only. Some individual affiliates do take high schoolers — Breakthrough Summerbridge in San Francisco states plainly that its teaching fellows are high school and college students — but that is site by site, not a national rule. Find your nearest affiliate and ask them directly.",
        timing:
          "Summer, around nine weeks nationally. Applications generally run in winter and early spring.",
        url: "https://breakthroughcollaborative.org/apply-fellow/",
      },
    ],
  },

  "natural-sciences": {
    verifiedOn: "2026-08-16",
    items: [
      {
        name: "NIH Summer Internship Program (SIP)",
        kind: "internship",
        org: "National Institutes of Health",
        what: "Paid summer research placement in an NIH lab across the full range of biomedical science.",
        cost: "Paid stipend.",
        eligibility: "High school students 17+; U.S. citizens or permanent residents.",
        timing: "Has closed mid-February in recent cycles. Confirm on the site.",
        url: "https://www.training.nih.gov/programs/sip",
      },
      {
        name: "Research Science Institute (RSI)",
        kind: "internship",
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
      kind: "program",
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
 * Families with no researched entries yet.
 *
 * Empty as of Aug 16, 2026 — all eight families now have at least one verified
 * entry. Kept rather than deleted because the mechanism is the honest one: if
 * a future family is added (or entries are pulled after failing re-verification
 * under rule 5), the UI must be able to say "we haven't researched this yet"
 * instead of rendering an empty list, which reads as "there's nothing out there
 * for you" and is false and discouraging.
 *
 * Note the related-but-different `stillResearching` flag on each family, which
 * covers the more common case: a list that is real but short.
 */
export const UNRESEARCHED_FAMILIES: string[] = [];
