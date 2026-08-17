/**
 * What to actually DO outside class, per major family — plus project ideas.
 *
 * ── WHY THIS FILE EXISTS ──────────────────────────────────────────────────
 * Until Aug 16, 2026 this app said almost nothing about extracurriculars and
 * projects, which is a large fraction of what an application actually is. The
 * roadmap covered courses, money and deadlines well and left "what do I do with
 * my time" nearly blank. This fills that gap.
 *
 * ── THE REGISTER (same boundary as major-pathways.ts) ─────────────────────
 * Everything here is "this is a reasonable thing to do and here is why it makes
 * sense for this field". NOT allowed, here or anywhere near it:
 *   · "this will get you in", "colleges want to see", "admissions officers love"
 *   · statistics, odds, rankings, or any claim about outcomes
 *   · anything that implies a required list — there isn't one, and pretending
 *     otherwise is how students end up doing things they don't care about
 *
 * Every `why` below is reasoning that stands on its own logic — why a thing is
 * useful to have done, or easier to write about — never a claim about what a
 * reader on the other end thinks.
 *
 * ── COST IS THE FIRST FILTER, NOT AN AFTERTHOUGHT ─────────────────────────
 * Same rule as major-opportunities.ts. This app serves families for whom a paid
 * program is not an option, and the single most useful thing this file can do
 * is show that the highest-value activities in almost every field cost nothing
 * but time. Every idea below is free or explicitly flagged otherwise, and the
 * ones that are already happening in a student's life (a job, caregiving,
 * translating, a family business) are named as real, because they are — the
 * activities interview already refuses to treat them as lesser and this must
 * match.
 *
 * ── NO INFLATION ──────────────────────────────────────────────────────────
 * `interview-prompt.ts` forbids the AI from inflating an activity. The same
 * rule binds the content here: nothing below tells a student to found, launch,
 * or start anything for the sake of the word. See GENERAL_PRINCIPLES, which
 * says so out loud.
 */

export type EcIdea = {
  title: string;
  /** What it actually is, plainly. */
  what: string;
  /** Why it fits THIS field. Reasoning, never an outcome claim. */
  why: string;
  /** Cost reality, first-class. */
  cost: string;
  /** The concrete thing to do first — small enough to do this week. */
  firstStep: string;
};

export type ProjectIdea = {
  title: string;
  what: string;
  /** Honest sense of how long before it's worth describing. */
  scale: string;
  /** The artifact — the thing someone else could actually look at. */
  evidence: string;
};

export type MajorActivities = {
  /**
   * How work is *shown* in this field — the portfolio equivalent. Different
   * per field and rarely explained to students, which is exactly why it's here.
   */
  showYourWork: string;
  ecs: EcIdea[];
  projects: ProjectIdea[];
};

export const MAJOR_ACTIVITIES: Record<string, MajorActivities> = {
  "engineering-cs": {
    showYourWork:
      "Code is unusually easy to show: a public repository means someone can look at what you built instead of taking your word for it. That's the whole advantage. It doesn't need stars, users, or a landing page — it needs to exist, run, and have a README that explains what it does and what you'd fix next.",
    ecs: [
      {
        title: "A school robotics or CS team",
        what: "FIRST, VEX, Science Olympiad's engineering events, or a coding club — whichever your school actually has.",
        why: "Engineering is collaborative in practice, and a team gives you a multi-year thing to grow inside rather than a series of one-offs.",
        cost: "Often school-funded or sponsored. Ask what it costs before assuming you can't — teams frequently cover fees for students who need it.",
        firstStep:
          "Ask a math or science teacher which teams exist and who runs them. If none do, that's a real thing you could start.",
      },
      {
        title: "Hackathons",
        what: "Weekend build events, many of them high-school-specific and run online.",
        why: "A hackathon forces a project to a finished, demoable state in 36 hours, which is the hardest habit to build alone.",
        cost: "Most are free to enter, and online ones remove travel cost entirely.",
        firstStep:
          "Find one online event and sign up for it, even without a team or an idea. Both get sorted on the day.",
      },
      {
        title: "Teaching someone else to code",
        what: "A club at a library, a younger sibling, a summer session at a community centre.",
        why: "Explaining a concept is the fastest way to find out whether you understand it, and this is reachable anywhere — no lab, no equipment, no fee.",
        cost: "Free.",
        firstStep:
          "Offer one session to one person. Scale later if it turns out you like it.",
      },
      {
        title: "Paid technical work, however small",
        what: "Fixing computers, building a site for a local business, IT help for family or neighbours.",
        why: "Work someone paid for has a built-in constraint — a real person needed it to actually function — and that makes it easier to describe concretely.",
        cost: "Free to you; you're the one being paid.",
        firstStep:
          "Write down the tech things you already do for people for free. That list is usually longer than students expect.",
      },
    ],
    projects: [
      {
        title: "Something that solves a problem you personally have",
        what: "A tool for a class you're taking, a script that automates something tedious at home, an app for a family business.",
        scale: "A few weekends to start, better after a few months of use.",
        evidence:
          "A public repo with a README explaining the problem, and honestly, what still doesn't work.",
      },
      {
        title: "Rebuild something that already exists",
        what: "A small version of a thing you use — a chat app, a game, a search tool.",
        scale: "A month or two.",
        evidence:
          "The repo plus a short write-up of what surprised you. 'I thought X would be easy and it wasn't' is a genuinely good piece of writing.",
      },
      {
        title: "A long-running personal site or log",
        what: "Notes on what you're building and learning, updated as you go.",
        scale: "Only interesting after a year or more — which is the argument for starting early.",
        evidence:
          "The thing itself, with dated entries showing how your thinking changed.",
      },
    ],
  },

  "health-medicine": {
    showYourWork:
      "There is no portfolio in this field, and that catches people out. What you have instead is people who can describe you — a supervisor at a clinic, a teacher, a coordinator at the place you volunteered for two years. That's why consistency in one place matters more here than variety across many.",
    ecs: [
      {
        title: "Sustained volunteering in one place",
        what: "A hospital auxiliary, a clinic, a food bank, a nursing home, a crisis line if you're old enough.",
        why: "Health care is largely about showing up reliably for people having a hard day. Two years of the same weekly shift demonstrates that in a way a one-week experience cannot.",
        cost: "Free. Many hospitals have minimum-age rules — often 16 — so ask early.",
        firstStep:
          "Call the volunteer services office of the nearest hospital and ask what their minimum age is and when they take applications.",
      },
      {
        title: "Caregiving you already do",
        what: "Looking after a grandparent, managing a family member's medication or appointments, translating at medical visits.",
        why: "This is direct, relevant experience with the actual substance of care, and students routinely leave it off because it happens at home instead of at an organisation.",
        cost: "Free — it's already happening.",
        firstStep:
          "Write it down now, with roughly how many hours a week and for how long. Details fade by senior year.",
      },
      {
        title: "Get certified in something concrete",
        what: "CPR, First Aid, or an EMT course if your area offers one to teenagers.",
        why: "A certification is a specific, checkable fact rather than a claim about interest, and some volunteer roles require one anyway.",
        cost: "CPR/First Aid courses are often free or low-cost through the Red Cross, fire departments, or a school health class. EMT courses cost more — ask about fee assistance.",
        firstStep: "Search for a CPR class near you and note what it costs.",
      },
      {
        title: "Peer health or wellness work at school",
        what: "Peer counselling, a mental health awareness group, health outreach in your own community.",
        why: "Public health is a real branch of this field, and community-facing work is often more accessible than clinical work is at 16.",
        cost: "Free.",
        firstStep: "Ask your school counselor whether a peer programme exists.",
      },
    ],
    projects: [
      {
        title: "A health information project in your community's language",
        what: "Plain-language explanations of something real — how to read a prescription label, what a deductible is, how to book a clinic appointment.",
        scale: "A few months, ongoing.",
        evidence: "The materials themselves, and where they were actually used.",
      },
      {
        title: "Research with a local university or hospital",
        what: "Assisting on a study — often data entry and literature work at first.",
        scale: "A summer minimum; a year is more useful.",
        evidence:
          "A description of the study, what you specifically did, and what you learned about how research actually works.",
      },
    ],
  },

  "arts-design": {
    showYourWork:
      "This is the one field where showing your work is formally required, and the portfolio is the application. That changes the calculus completely: volume matters, because you cannot select ten strong pieces from a body of twelve. Document everything as you make it — badly photographed good work is a real and entirely avoidable problem.",
    ecs: [
      {
        title: "A sustained studio habit",
        what: "Regular making, in or out of school — a sketchbook you actually fill, a weekly session, a class.",
        why: "Portfolios are built from volume over years. There's no way to compress three years of practice into a senior-year push.",
        cost: "Free. Paper and pencil are enough; expensive materials are not the constraint people assume.",
        firstStep:
          "Start dating every piece you make. In two years that record is itself useful.",
      },
      {
        title: "Free university and museum outreach programmes",
        what: "Saturday programmes, teen councils, and free workshops run by art schools and museums.",
        why: "These give you critique from people outside your school, which is the input most students lack and the thing that improves work fastest.",
        cost: "Often completely free — they exist specifically as outreach. Always check before assuming a cost.",
        firstStep:
          "Search the name of the nearest art school or museum plus 'teen programme' or 'high school'.",
      },
      {
        title: "Making things people actually use",
        what: "Posters for a school event, a logo for a local business, sets for a play, a mural.",
        why: "Design for a real client has constraints and a deadline, which is different from personal work and worth having done at least once.",
        cost: "Free, and sometimes paid.",
        firstStep:
          "Offer to make one thing for one club or local business this term.",
      },
      {
        title: "Observational drawing, specifically",
        what: "Drawing from life rather than from photos or imagination.",
        why: "Many programmes ask for it explicitly, including from applicants whose main medium isn't drawing.",
        cost: "Free.",
        firstStep: "Draw something in the room you're in for twenty minutes.",
      },
    ],
    projects: [
      {
        title: "A body of work with one thread through it",
        what: "Ten to twenty pieces exploring one subject, question or material.",
        scale: "A year or more.",
        evidence:
          "The work, photographed properly, plus a short honest statement about what you were trying to do.",
      },
      {
        title: "Document a place or community you know",
        what: "A photo series, illustrated record, or design project about somewhere specific to you.",
        scale: "Several months.",
        evidence: "The finished series, and the reason it had to be you who made it.",
      },
    ],
  },

  business: {
    showYourWork:
      "The evidence here is numbers and outcomes, not artefacts: what you sold, what you organised, how many people showed up, what it cost and what came back. Write those down as they happen, because reconstructing them later is guesswork and guesswork is how résumés drift into fiction.",
    ecs: [
      {
        title: "A real job",
        what: "Retail, food service, tutoring, lifeguarding — paid work of any kind.",
        why: "This is the most directly relevant experience in the field and the most commonly left off. Handling money, customers and a schedule is the actual substance of business.",
        cost: "Free — you're paid.",
        firstStep:
          "List every job you've had, with dates and roughly what you were responsible for.",
      },
      {
        title: "Helping run a family business",
        what: "Serving customers, doing books, translating, managing inventory, running social media.",
        why: "It's the same set of skills a first job teaches, often with more responsibility, and students discount it constantly because it's family.",
        cost: "Free — already happening.",
        firstStep:
          "Write down what you actually handle, in specifics. 'Managed weekend inventory' beats 'helped out'.",
      },
      {
        title: "DECA, FBLA, or a school business club",
        what: "Competition-based business clubs that many schools already have.",
        why: "They give structure and a calendar, and the case-competition format is genuinely good practice at making an argument under time pressure.",
        cost: "Membership and competition fees vary. Ask what they are and whether the school covers them — often it does.",
        firstStep: "Ask whether your school has a chapter and what joining costs.",
      },
      {
        title: "Running the money side of something",
        what: "Treasurer of a club, fundraising for a team, organising an event with a real budget.",
        why: "A budget someone else depends on is a concrete, checkable responsibility.",
        cost: "Free.",
        firstStep:
          "Volunteer for the unglamorous role. Treasurer is usually uncontested and is worth more to talk about than a title.",
      },
    ],
    projects: [
      {
        title: "Sell something, honestly and at small scale",
        what: "Reselling, a service, a craft, a repair business — anything with real customers and real money.",
        scale: "A few months to be worth describing.",
        evidence:
          "Actual numbers: what you sold, what it cost you, what you learned when something didn't sell.",
      },
      {
        title: "A financial analysis of something you care about",
        what: "Work out the real economics of a local business, a product, or an industry you use.",
        scale: "A few weeks to a couple of months.",
        evidence:
          "A written analysis with your sources shown, and what you got wrong when you checked.",
      },
    ],
  },

  humanities: {
    showYourWork:
      "Writing is the evidence, and unlike most fields you can accumulate it privately and choose later. Keep everything you write, including drafts and things you abandoned — the revision history is often more interesting than the finished piece, and some programmes ask for a graded paper.",
    ecs: [
      {
        title: "The school paper, literary magazine, or debate",
        what: "Any activity where you produce writing or argument on a deadline and someone edits it.",
        why: "Writing improves through feedback and revision over years. There's no substitute for someone regularly telling you what didn't land.",
        cost: "Free.",
        firstStep: "Ask who runs the paper or magazine and when they next meet.",
      },
      {
        title: "Translating and interpreting for your family",
        what: "Handling appointments, letters, forms, or conversations in two languages.",
        why: "This is sophisticated linguistic and cultural work, and it's real evidence of the language ability that this field values.",
        cost: "Free — already happening.",
        firstStep:
          "Write down which languages, in what situations, and since when.",
      },
      {
        title: "Reading with intent, and keeping a record",
        what: "A reading log with your own notes and disagreements, not summaries.",
        why: "'Why this major' essays reward a specific question you care about, and those come from a record of what you actually thought, not from memory.",
        cost: "Free. A library card covers it.",
        firstStep:
          "Write three sentences about the last thing you read that annoyed you.",
      },
      {
        title: "Oral history in your own community",
        what: "Recording and writing up the stories of people around you — family, neighbours, elders.",
        why: "It's real humanities work, it's free, and it's the kind of thing only you have access to.",
        cost: "Free — a phone records audio fine.",
        firstStep: "Ask one relative if you can record one conversation.",
      },
    ],
    projects: [
      {
        title: "One substantial piece of writing",
        what: "A long essay, a research paper, a short story collection — something well past a class assignment.",
        scale: "Several months with real revision.",
        evidence:
          "The piece, plus an early draft. The distance between them is the point.",
      },
      {
        title: "A translation project",
        what: "Translate something that matters to your community and isn't available in the other language.",
        scale: "A few months.",
        evidence: "The translation and a note on the choices that were hard.",
      },
    ],
  },

  "social-sciences": {
    showYourWork:
      "The evidence here is a question you pursued and what you found — which means writing it down. A survey you ran, a pattern you noticed in public data, a community problem you documented. The subject matters far less than being able to describe your method honestly, including where it was weak.",
    ecs: [
      {
        title: "Sustained work with one community organisation",
        what: "Mutual aid, a food bank, a tenants' group, a youth board, a local campaign.",
        why: "These fields study how people and institutions actually behave, and there is no substitute for having been inside one.",
        cost: "Free.",
        firstStep:
          "Find one organisation near you and ask what they need on a regular weekly basis.",
      },
      {
        title: "Student government or a school board student seat",
        what: "Real institutional roles, including the ones nobody runs for.",
        why: "Learning how a decision actually gets made — including how slowly — is directly relevant and hard to get any other way.",
        cost: "Free.",
        firstStep:
          "Find out whether your district has a student representative seat. Many do and few students know.",
      },
      {
        title: "Tutoring or mentoring younger students",
        what: "Regular, ongoing academic help for someone specific.",
        why: "Education is one of the most-studied areas in the social sciences, and doing it gives you something concrete to think about.",
        cost: "Free.",
        firstStep: "Ask a teacher who could use help and commit to a weekly slot.",
      },
      {
        title: "Working with public data",
        what: "Census data, city budgets, school district reports — all free and public.",
        why: "Quantitative skill is where these majors surprise people, and public data is the free version of research access.",
        cost: "Free.",
        firstStep:
          "Look up your own school district's budget and find one number that surprises you.",
      },
    ],
    projects: [
      {
        title: "Investigate one specific local question",
        what: "Something answerable and near you — bus routes and school start times, food access, rent changes on one street.",
        scale: "A few months.",
        evidence:
          "A written report with your method, your data and an honest list of what your method can't tell you.",
      },
      {
        title: "Run a real survey",
        what: "Design it, run it, analyse it, and write up the limitations.",
        scale: "A couple of months.",
        evidence:
          "The instrument, the results, and a genuine discussion of sampling problems — that last part is what separates this from a poll.",
      },
    ],
  },

  "natural-sciences": {
    showYourWork:
      "A lab notebook is the field's native format, and almost no high schooler keeps one. Dated entries of what you tried, what happened, and what you'd change is both good practice and the thing that lets a teacher write specifically about your work later.",
    ecs: [
      {
        title: "Science Olympiad, or a subject team",
        what: "Competition teams your school already runs.",
        why: "They give depth in a specific area rather than general enthusiasm, and depth is what makes a recommendation letter concrete.",
        cost: "Usually school-funded. Ask.",
        firstStep: "Ask a science teacher which teams exist and what they need.",
      },
      {
        title: "Email local university labs",
        what: "Contacting professors at a nearby university or community college to ask about helping in a lab.",
        why: "This is the route most students never try, and it costs nothing but the awkwardness of asking. Local access is far more reachable than the famous national programmes.",
        cost: "Free.",
        firstStep:
          "Find three professors near you whose work you can describe in a sentence, and email one. Expect most not to reply — that's normal and not about you.",
      },
      {
        title: "Long-term observation of something real",
        what: "A local creek, bird populations, air quality, weather, night sky.",
        why: "Real science is mostly patient repetition, and a two-year dataset you collected yourself is genuinely uncommon.",
        cost: "Free.",
        firstStep: "Pick one thing you can measure weekly and start a log this week.",
      },
      {
        title: "Citizen science projects",
        what: "Public research programmes that accept data from volunteers.",
        why: "Your observations go into actual scientific datasets, and you learn real protocol discipline.",
        cost: "Free.",
        firstStep:
          "Search 'citizen science' plus a subject you like, and read one project's protocol.",
      },
    ],
    projects: [
      {
        title: "An experiment you designed and repeated",
        what: "Anything with a control, run enough times to say something.",
        scale: "A few months. Repetition is what makes it science.",
        evidence:
          "The lab notebook, the data, and an honest account of the confounds you couldn't remove.",
      },
      {
        title: "A local environmental survey",
        what: "Measure something about your own area over time.",
        scale: "A year is where it gets interesting.",
        evidence: "The dataset and what changed while you watched.",
      },
    ],
  },

  education: {
    showYourWork:
      "The evidence is specific students and specific change: what someone couldn't do, what you tried, what happened. Keep notes as you go — 'I tutored for two years' says far less than one concrete account of getting a concept across after three failed attempts.",
    ecs: [
      {
        title: "Regular tutoring, with the same students",
        what: "Peer tutoring, an after-school programme, or younger students at your own school.",
        why: "This is the field itself, not preparation for it, and the continuity is what lets you see whether your teaching actually worked.",
        cost: "Free, sometimes paid.",
        firstStep:
          "Ask your school whether a peer tutoring programme exists, and commit to one regular slot.",
      },
      {
        title: "Camp counselling or coaching",
        what: "Summer camps, youth sports, community centre programmes.",
        why: "Managing a group of children is a different and harder skill than one-to-one help, and both matter in this field.",
        cost: "Free to do, often paid.",
        firstStep:
          "Ask local camps and rec centres when they hire and what their minimum age is.",
      },
      {
        title: "Caring for younger siblings or relatives",
        what: "Regular responsibility for younger children in your family.",
        why: "This maps onto the major more directly than in any other field on this page, and it is chronically left off applications because it happens at home.",
        cost: "Free — already happening.",
        firstStep:
          "Write down the ages, the hours, and how long you've been doing it.",
      },
      {
        title: "Classroom assistant work",
        what: "Helping a teacher at your school or a nearby elementary school.",
        why: "Seeing planning and classroom management from the other side is the part outsiders never get to observe.",
        cost: "Free.",
        firstStep:
          "Ask a teacher you like whether they'd want help during a free period.",
      },
    ],
    projects: [
      {
        title: "Build something other students actually use",
        what: "A study guide, a video series, a workshop you run more than once.",
        scale: "A few months, and better if it's still used after you leave.",
        evidence:
          "The materials, plus honest feedback from the people who used them.",
      },
      {
        title: "Start a tutoring group that outlasts you",
        what: "A small, regular programme with other students helping too.",
        scale: "A year or more.",
        evidence:
          "Attendance over time and what happened when you handed it to someone else. Whether it survives is the interesting part.",
      },
    ],
  },
};

export function activitiesFor(familyId: string): MajorActivities | null {
  return MAJOR_ACTIVITIES[familyId] ?? null;
}

/**
 * The part that's true whatever you study.
 *
 * These are deliberately blunt, because the surrounding advice ecosystem is
 * not. Several of these exist specifically to counter common bad advice — the
 * activity-collecting, the founded-a-nonprofit inflation, the belief that only
 * paid programmes count.
 */
export const GENERAL_PRINCIPLES: { title: string; body: string }[] = [
  {
    title: "Depth beats a collection",
    body: "One thing you stayed with for four years, with something to show for it, is easier to write about than eleven clubs you attended. This is also the version that's available to you regardless of money, because time is the only input.",
  },
  {
    title: "What you already do counts",
    body: "A job, caring for siblings, translating for your parents, working in a family business, running a household while adults work — these are real responsibilities and they belong on your list. Students leave them off constantly because they don't look like a club. That instinct is wrong, and it disproportionately costs the students who have the most of this kind of experience.",
  },
  {
    title: "Make it visible",
    body: "A public repository, a portfolio, a written log, a channel — the point isn't an audience. It's that the work exists somewhere someone can look, instead of only in a sentence claiming it happened. This costs nothing and almost nobody does it.",
  },
  {
    title: "Start things. Don't inflate them.",
    body: "Starting a club, a tutoring group, or a small business is genuinely good. Calling a website and a logo a nonprofit is not, and you will be asked about it — in an interview, in an essay, or by yourself later. A tutoring group that met twenty times and helped nine people is real, describable, and stronger than a grand title with nothing under it. Use the plain name for what you actually did.",
  },
  {
    title: "For volunteering, consistency beats hours",
    body: "A weekly shift held for two years says something a hundred-hour summer doesn't: that you kept showing up when it stopped being novel. It's also easier to arrange, because organisations prefer reliable regulars to one-off help.",
  },
  {
    title: "Research is reachable without a famous programme",
    body: "The selective national summer programmes are worth applying to and are not the only route. Professors at nearby universities and community colleges take on local students more often than students imagine, and almost nobody asks. Email three whose work you can describe in one sentence, say specifically what you'd want to help with, and accept that most won't reply — that's the normal hit rate, not a verdict on you.",
  },
  {
    title: "Write it down as it happens",
    body: "Dates, hours, what you were actually responsible for. By senior year you will have forgotten the specifics, and specifics are the whole difference between a describable activity and a vague one. This is the single cheapest thing on this page and the one most likely to matter.",
  },
];
