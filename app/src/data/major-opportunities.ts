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
    verifiedOn: "2026-08-17",
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
      {
        name: "HOSA – Future Health Professionals",
        kind: "program",
        org: "HOSA",
        what: "A career and technical student organisation for anyone interested in a health career — school-based chapters, a huge range of health-science competitive events (from medical terminology to sports medicine to nursing assessment), and a direct line into health-science coursework and clinical pathways at your school. Unlike the research placements above, this one doesn't require you to already be a top research candidate to get in the door.",
        cost:
          "Membership is exclusively through a school chapter — HOSA doesn't sell individual memberships. National dues combine with your state's own fee, and states set very different totals: recent examples range from about $10 to $25 a year. Ask your chapter advisor (usually a health-science or CTE teacher) what your school charges and whether it's covered.",
        eligibility:
          "Students at a school with a chapter, or working with a teacher to start one. Associate membership exists for students not formally enrolled in a health-science program.",
        timing:
          "Runs across the school year, with regional, state and international competition levels. Joining happens through your school, usually at the start of the year.",
        url: "https://hosa.org/membership/",
      },
    ],
  },

  humanities: {
    verifiedOn: "2026-08-17",
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
      {
        name: "National History Day (NHD)",
        kind: "competition",
        org: "National History Day",
        what: "A year-long historical research competition, not a one-day test — you pick a topic tied to an annual theme and build it into a paper, a performance, a documentary, an exhibit or a website, individually or in a small team. About 3,000 students reach the national contest each June, out of far more who start at the school level.",
        cost:
          "No national entry fee was found on NHD's own site. Some regional and state affiliates state their own policy explicitly — New York City History Day, for instance, says plainly it is free for all NYC students — but a regional coordinator could set a local materials or contest fee, so confirm with your specific state or regional affiliate rather than assuming the national default applies everywhere.",
        eligibility:
          "Open to all students, no audition or prior qualification needed to start. Two divisions: junior (grades 6–8) and senior (grades 9–12).",
        timing:
          "Starts at the school level, then regional/state, then the National Contest — for 2027, June 13–17 at the University of Maryland, College Park. Only the top two entries per category from each affiliate contest advance, so the real deadlines that matter are your own school's and region's, both earlier in the year.",
        url: "https://nhd.org/en/contest/",
      },
      {
        name: "Scholastic Art & Writing Awards",
        kind: "competition",
        org: "Alliance for Young Artists & Writers",
        what: "The country's longest-running recognition programme for creative teens, across 29 categories spanning both art and writing. Work is judged regionally first, and regional award winners move on to national judging. Listed here for its writing categories specifically — poetry, personal essay, short story, journalism and more — which are as much a humanities credential as an arts one.",
        cost:
          "$15 per individual entry, $40 per portfolio (portfolios are seniors only). ⚠️ Fee waivers are available for teens who can't afford the fee, and the Awards state plainly that they trust you to be honest about financial need — you are not required to provide proof of it in the portal. That is unusually low-friction; do not let the fee stop a submission.",
        eligibility:
          "Teens in grades 7–12, ages 13 and up. One of the very few things on this page open to middle schoolers.",
        timing:
          "Entries open in the autumn. Deadlines are set by region and begin in December, so yours depends on where you live — find your region on the site rather than assuming a national date.",
        url: "https://www.artandwriting.org/awards/how-to-enter/",
      },
    ],
  },

  "arts-design": {
    verifiedOn: "2026-08-17",
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
        name: "Scholastic Art & Writing Awards",
        kind: "competition",
        org: "Alliance for Young Artists & Writers",
        what: "The country's longest-running recognition programme for creative teens, across 29 categories of art and writing. Work is judged regionally first, and regional award winners move on to national judging.",
        cost:
          "$15 per individual entry, $40 per portfolio (portfolios are seniors only). ⚠️ Fee waivers are available for teens who can't afford the fee, and the Awards state plainly that they trust you to be honest about financial need — you are not required to provide proof of it in the portal. That is unusually low-friction; do not let the fee stop a submission.",
        eligibility:
          "Teens in grades 7–12, ages 13 and up. One of the very few things on this page open to middle schoolers.",
        timing:
          "Entries open in the autumn. Deadlines are set by region and begin in December, so yours depends on where you live — find your region on the site rather than assuming a national date.",
        url: "https://www.artandwriting.org/awards/how-to-enter/",
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
    verifiedOn: "2026-08-17",
    items: [
      {
        name: "DECA",
        kind: "program",
        org: "DECA Inc.",
        what: "A career and technical student organisation running school chapters in marketing, finance, hospitality and management, with nearly 60 competitive events across six career categories. Members run school-based enterprises, do community service and attend conferences.",
        cost:
          "DECA doesn't publish a national membership fee — chapters set it, and it varies by school and state. Ask your school's DECA advisor directly what it costs and whether the chapter or school covers it; that is a normal question, not a favour.",
        eligibility:
          "High school students at a school with a chapter. If your school has no chapter, that itself is worth asking a business or CTE teacher about — starting one is a real, documentable leadership project.",
        timing:
          "Runs across the school year, with district, state and international competition rounds. Joining happens at the start of the year through your school.",
        url: "https://www.deca.org/high-school-programs/",
      },
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
      {
        name: "FBLA (Future Business Leaders of America)",
        kind: "program",
        org: "FBLA",
        what: "A career and technical student organisation for anyone interested in business — school-based chapters, competitive events across accounting, marketing, entrepreneurship, coding, public speaking and more, plus state and national conferences. The same shape as DECA above; many schools run one or the other, some run both.",
        cost:
          "National dues are $10 a year. State and local chapter dues are added on top and vary — ask your chapter's advisor what your school's total is and whether it's covered. The real cost most members actually notice is travel and lodging if your chapter goes to a state or national conference, which is optional.",
        eligibility:
          "High school students at a school with a chapter. If your school has none, a business teacher can help start one — same real-leadership-project logic as an absent DECA chapter.",
        timing:
          "Runs across the school year, with competitive events at chapter, state and national levels. Joining happens through your school, usually in the fall.",
        url: "https://www.fbla.org/",
      },
      {
        name: "Diamond Challenge",
        kind: "competition",
        org: "Horn Entrepreneurship, University of Delaware",
        what: "A high school entrepreneurship competition — teams of 2–4 develop a real business or social-venture concept, submit a written plan and a short pitch video, and the strongest teams present live at a summit in Delaware. Genuinely large-scale: over 18,000 students from 120+ countries have entered since it started.",
        cost:
          "Free to enter — the university and its sponsors cover the costs. Total prize pool across both tracks (Business Innovation and Social Innovation) runs up to $100,000.",
        eligibility:
          "Ages 14–18 at the submission deadline, in teams of 2–4 with one adult advisor (21+). Open worldwide, not just to U.S. students.",
        timing:
          "For the 2027 cycle: submissions open September 16, 2026 and close January 14, 2027; advancing teams are notified in February, finalists in March, and the Limitless World Summit runs April 29–30, 2027. Confirm on the site, as with anything a year out.",
        url: "https://diamondchallenge.org/competition/",
      },
    ],
  },

  "social-sciences": {
    verifiedOn: "2026-08-17",
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
      {
        name: "Telluride Association Summer Seminar (TASS)",
        kind: "program",
        org: "Telluride Association",
        what: "A free six-week, college-level summer seminar exploring how power and social structures work, through one of two tracks: TASS-CBS (history, politics and culture of African-descended communities) or TASS-AOS (systems of power and oppression, examined through literature, history and art). Includes three hours of seminar daily plus democratic self-governance of the community you live in.",
        cost:
          "Genuinely free — Telluride Association covers tuition, books, room, board and field trips for every student, plus travel assistance and a subsidy to replace summer job earnings for students who need it. This is one of the very few selective summer programs with zero cost even for travel.",
        eligibility:
          "Rising juniors and rising seniors, age 15 at the start of the program and no older than 17 at the end. Open to both US and international students. Selective — worth applying to, not something to expect.",
        timing:
          "The 2026 cycle's window has closed (applications opened Oct 15, 2025, closed Dec 3, 2025; program ran June 21–July 25, 2026). Based on that pattern, expect the 2027 cycle to open mid-October 2026 — confirm exact dates on the site rather than assuming they repeat exactly.",
        url: "https://tellurideassociation.org/our-programs/high-school-students/",
      },
      {
        name: "National Economics Challenge",
        kind: "competition",
        org: "Council for Economic Education",
        what: "A team economics competition — a 30-question exam on micro/macroeconomics and the world economy, taken in 35 minutes. Teams of three or four, coached by a teacher or an economics professional, move from state competition through National Semi-Finals to the National Finals.",
        cost:
          "Free to enter through your school. National finalists' trip to the National Finals is fully funded except travel; cash awards go to the top four national teams.",
        eligibility:
          "High school students, entering as a school team (a coach/teacher is required to register a team — ask whoever teaches economics or AP Macro/Micro at your school). Two divisions: Adam Smith for AP/IB/Honors students and returning competitors, David Ricardo for students in their first year of the competition who've taken at most one economics course — the Ricardo division exists specifically so newcomers aren't up against veterans.",
        timing:
          "The 2027 season's registration runs roughly June through early December 2026, with the online Regional round in mid-December and National Finals in late May — confirm exact dates on the site.",
        url: "https://www.councilforeconed.org/programs/for-students/national-economic-challenge/",
      },
      {
        name: "Congressional Award",
        kind: "program",
        org: "U.S. Congress (administered by the Congressional Award Foundation)",
        what: "A self-paced, non-competitive recognition program, not a class or a cohort — you set your own goals across four areas (voluntary public service, personal development, physical fitness, and expedition/exploration), log the hours yourself, and earn Bronze, Silver and Gold certificates and medals as you go. Nobody is rejected; the only requirement is doing what you said you'd do.",
        cost:
          "A one-time registration fee — a state affiliate council cites $25; a third-party guide cites $35, so confirm the exact current figure when you register rather than trusting either number here. Financial assistance is available for students for whom even that is a barrier.",
        eligibility:
          "Ages 13½ to 23. No GPA requirement, no application or acceptance process — you register and start logging your own goals.",
        timing:
          "Rolling and self-paced. You can register starting at 13½ and submit your first completed record once you turn 14; there is no deadline to miss.",
        url: "https://www.congressionalaward.org/the-program/",
      },
      {
        name: "We the People: The Citizen and the Constitution",
        kind: "competition",
        org: "Center for Civic Education",
        what: "A constitutional-law curriculum run inside a government or civics class, culminating in a simulated congressional hearing: teams of three to six research one of six units, deliver a four-minute statement on a historical or current constitutional question, and field follow-up questions from a panel of judges acting as members of Congress.",
        cost:
          "Not published anywhere as a per-student fee — this runs as part of a class using curriculum materials from the Center for Civic Education, so any cost is whatever your school sets, if anything. Ask your government or civics teacher whether your school runs a team; if it doesn't, a teacher can start one.",
        eligibility:
          "High school students enrolled in a class running the program. There's no individual application — the entry point is your school having, or starting, a team.",
        timing:
          "State-level competitions run through fall and winter; the National Finals are held every spring in the Washington, D.C. area (the 2026 Finals ran April 17–19). Confirm your state's specific dates with your state's civic education coordinator.",
        url: "https://www.civiced.org/we-the-people",
      },
    ],
  },

  education: {
    verifiedOn: "2026-08-17",
    items: [
      {
        name: "Educators Rising",
        kind: "program",
        org: "Educators Rising",
        what: "A career and technical student organisation for students who want to teach — school-based chapters with a teaching curriculum, state and national competitions, and a direct line into teacher preparation programmes at universities.",
        cost:
          "Not published nationally; chapters and state affiliates set their own dues. Ask the teacher who would advise a chapter what it costs and whether the school covers it.",
        eligibility:
          "Middle and high school students at a school with a chapter, plus a separate college division. If your school has none, ask a teacher about starting one — this is the field where founding the chapter is itself the relevant experience.",
        timing:
          "Runs across the school year, with competitions at state level and a national conference.",
        url: "https://www.educatorsrising.org/",
      },
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
      {
        name: "Barbara Lotze Scholarship for Future Physics Teachers",
        kind: "program",
        org: "American Association of Physics Teachers (AAPT)",
        what: "A scholarship for students who intend to become high school physics teachers specifically — up to $3,000 plus a year of AAPT student membership. Narrow on purpose: it exists because physics teaching is a documented shortage field, which is exactly why the money is there and the applicant pool is small.",
        cost:
          "Free to apply, and it pays you — up to $3,000, renewable for each of four years, so the full value can reach $12,000 rather than being a one-off cheque.",
        eligibility:
          "High school seniors who have been accepted into a physics teacher preparation program at an accredited two- or four-year college, plus undergraduates already in one. Must be a U.S. citizen attending a U.S. institution, and must declare an intent to prepare for and enter a career teaching physics at the high school level.",
        timing:
          "Applications complete with recommendation letters by December 1 are considered at the AAPT Board's winter meeting. Since it requires college acceptance into a teacher-prep program, this is a senior-year application, not an earlier one.",
        url: "https://www.aapt.org/programs/grants/lotze.cfm",
      },
    ],
  },

  "natural-sciences": {
    verifiedOn: "2026-08-17",
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
      {
        name: "Youth Conservation Corps (YCC)",
        kind: "internship",
        org: "U.S. Forest Service, National Park Service, and U.S. Fish & Wildlife Service",
        what: "A genuinely paid summer job, not a stipend — a crew doing real conservation work (trail building, habitat restoration, invasive species removal) on national forests, parks and wildlife refuges. Unlike most entries on this list, this is a real job with a paycheck, not a competitive academic placement.",
        cost:
          "Paid — federal or state minimum wage, whichever is higher, plus a 15% pay bump for youth who return as a crew leader.",
        eligibility:
          "Age 15 at enrollment, no older than 18 on the last day of the program. U.S. citizen or permanent resident with a valid Social Security Number, and you'll need a state work permit.",
        timing:
          "Runs 1–3 months each summer. There's no single national application — most positions are filled through conservation-corps partner organizations (search corpsnetwork.org) or by contacting your nearest national forest, park or wildlife refuge office directly. This decentralization is real, not a gap in this listing — start local.",
        url: "https://www.fs.usda.gov/working-with-us/careers/youth-conservation-corps",
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
