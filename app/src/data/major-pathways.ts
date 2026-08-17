/**
 * V2 §16K step 1 — the detailed layer behind the `/major` page.
 *
 * `majors.ts` answers "what changes for my major" in a paragraph. This answers
 * "what does this field actually look like across seven years" — course
 * ladders, the kinds of activities that are genuinely reachable, and the
 * narrative angle an application in this field tends to take.
 *
 * ── THE REGISTER, WHICH IS THE WHOLE POINT ────────────────────────────────
 *
 * Everything here is "commonly true of this field", never "this is what got
 * someone in". That boundary is set in `majors.ts`'s header and in
 * master-spec-doc.md §3B, and it is the difference between guidance and the
 * confidently-wrong college content this app exists as an alternative to.
 *
 * So, concretely — NOT allowed in this file, ever:
 *   · admissions odds, chances, or anything that implies a probability
 *   · school rankings, or "students like you"
 *   · statistics of any kind (no percentages, no counts, no averages)
 *   · claims about what admissions readers think, prefer, or are tired of
 *   · named programs with deadlines — those live in `major-opportunities.ts`,
 *     which has its own verification rules and dated `verifiedOn` stamps
 *
 * What IS allowed, and what everything below is restricted to: structural
 * facts you could confirm in five minutes on a university admissions page or a
 * district course catalogue, plus reasoning about writing that stands on its
 * own logic rather than on a claim about the reader.
 *
 * ── COURSE LADDERS ARE THE COMMON U.S. SEQUENCE, NOT A UNIVERSAL ONE ──────
 *
 * District course names and orders genuinely differ — some schools run physics
 * first, some integrate maths into I/II/III, some don't offer the top of the
 * ladder at all. Every ladder below therefore ships with a caveat rendered in
 * the UI, and no ladder step is stated as a requirement. A student whose school
 * doesn't offer the last step has not failed; that's what the "if your school
 * doesn't offer it" notes are for.
 *
 * ── ACTIVITIES LEAD WITH WHAT IS FREE ─────────────────────────────────────
 *
 * Same rule as `major-opportunities.ts` rule 3: this app serves families for
 * whom a paid summer programme is not a real option. Every activity list below
 * leads with free, school-based, or already-happening-in-your-life options, and
 * paid work and family responsibilities are named as the real experience they
 * are — consistent with the activities interview's refusal to treat caregiving
 * or family-business work as lesser.
 */

export type LadderStep = {
  name: string;
  /** Optional caveat or "what if my school doesn't have this". */
  note?: string;
};

export type LadderTrack = {
  /** e.g. "Math", "Science", "Studio". */
  label: string;
  /** One honest line on why the ORDER matters, not just the total. */
  why: string;
  steps: LadderStep[];
};

export type StageDetail = {
  /** Inclusive grade range. */
  from: number;
  to: number;
  /** Short band name shown on the timeline. */
  label: string;
  /** One line summarising what this stage is actually for. */
  gist: string;
  courses: string[];
  activities: string[];
  /**
   * The narrative angle — what an application in this field tends to be about.
   * Prose, and deliberately reasoned rather than asserted: "this is easier to
   * write well because X", never "this is what admissions officers want".
   */
  narrative: string;
};

export type StructureFacts = {
  /** How you actually get into the major. */
  entry: string;
  /** Portfolio, audition, or nothing extra. */
  extra: string;
  /**
   * How much earlier course placement constrains this path. Three values only,
   * so the comparison table stays scannable.
   */
  locked: "High" | "Some" | "Low";
  /** One line explaining the `locked` value — never a bare label. */
  lockedWhy: string;
};

export type MajorPathway = {
  ladders: LadderTrack[];
  stages: StageDetail[];
  structure: StructureFacts;
};

export const MAJOR_PATHWAYS: Record<string, MajorPathway> = {
  "engineering-cs": {
    ladders: [
      {
        label: "Math",
        why: "Each course is the prerequisite for the next, so where you finish is mostly decided by where you start — not by how hard you work in 11th grade.",
        steps: [
          {
            name: "Algebra 1",
            note: "The placement that shapes everything after it. Ask how your district decides who takes it in 8th grade.",
          },
          { name: "Geometry" },
          { name: "Algebra 2" },
          { name: "Precalculus" },
          {
            name: "Calculus",
            note: "Not offered everywhere. Community college dual enrolment is the usual route if your school doesn't have it, and is often free for high schoolers.",
          },
        ],
      },
      {
        label: "Science",
        why: "Physics is the one engineering programs specifically look for, and it usually sits at the end of the sequence — so the order matters, not just the number of years.",
        steps: [
          { name: "Biology" },
          { name: "Chemistry" },
          {
            name: "Physics",
            note: "Some schools run physics first instead. If yours does, that's fine — what matters is that it's on the transcript.",
          },
        ],
      },
    ],
    stages: [
      {
        from: 6,
        to: 8,
        label: "Middle school",
        gist: "One decision matters. The rest is noise.",
        courses: [
          "Algebra 1 in 8th grade if your school offers it and you can be placed into it.",
          "If not, the most advanced math you can actually be placed into — the ladder starts wherever you start.",
        ],
        activities: [
          "Genuinely optional at this age. Free options are enough: Scratch, Code.org, Khan Academy.",
          "A school robotics or math club, if one already exists and it's free to join.",
        ],
        narrative:
          "There is no story to build yet, and nothing you do at 12 needs to become one. This stage has exactly one job: don't let a math placement quietly close a door you'd want open at 17.",
      },
      {
        from: 9,
        to: 10,
        label: "Early high school",
        gist: "Keep the ladder moving and take the sciences in order.",
        courses: [
          "Keep the math sequence moving — a repeated or skipped year is hard to make up later.",
          "Take physics and chemistry when your school offers them rather than deferring them.",
          "Honors or AP versions if the workload is manageable alongside everything else you carry.",
        ],
        activities: [
          "Free and school-based first: robotics teams are often school-funded (ask before assuming a cost), and most hackathons are free to enter.",
          "One thing you build and actually finish is worth more than five clubs you attended.",
          "Paid work, helping with a family business, and fixing things for relatives all count as real experience. Write them down as you go — people forget by senior year.",
        ],
        narrative:
          "If a project is going to be part of your application, this is when it starts — not because a project is required, but because the interesting part is what something turns into after two years, and that needs the two years.",
      },
      {
        from: 11,
        to: 11,
        label: "Junior year",
        gist: "Find out how CS admission works at each school before you build a list.",
        courses: [
          "Calculus or precalculus, depending on where the ladder put you.",
          "If calculus isn't offered at your school, look into dual enrolment now — it takes planning, not just willingness.",
        ],
        activities: [
          "The free and funded summer programs worth applying to are listed further down this page. Treat them as worth applying to, not as a plan.",
          "A teacher who has seen your work closely matters more later than a program's name does.",
        ],
        narrative:
          "The essay that's easiest to write well here is small and specific: one thing you built, what broke, what you did about it. 'I've always loved technology' is hard to make convincing, because every single person applying can write that sentence honestly.",
      },
      {
        from: 12,
        to: 12,
        label: "Senior year",
        gist: "Apply to the right unit — the university and its engineering school can be different applications.",
        courses: [
          "Whatever sits at the top of your ladder. Dropping math entirely in senior year is a visible gap on an engineering application.",
          "If your school never offered calculus or physics, say so in the application's context section rather than leaving it unexplained.",
        ],
        activities: [
          "Nothing new needs to start now. Senior year is for finishing and describing what already exists.",
        ],
        narrative:
          "Engineering and CS supplements usually ask 'why this field' rather than 'why us'. A specific problem you want to work on is easier to defend in 250 words than a passion is.",
      },
    ],
    structure: {
      entry:
        "Often direct-admit, and at some schools CS specifically is closed to later transfers.",
      extra: "Nothing extra to submit",
      locked: "High",
      lockedWhy:
        "The math ladder is set years before you apply, and reaching its top depends on middle-school placement.",
    },
  },

  "health-medicine": {
    ladders: [
      {
        label: "Science",
        why: "Biology and chemistry are the expected pair, and most higher-level science courses list them as prerequisites — so taking the lightest version available early narrows what you can take later.",
        steps: [
          { name: "Biology" },
          { name: "Chemistry" },
          {
            name: "Anatomy / Physiology or AP Biology",
            note: "Whichever your school actually offers. Neither is required anywhere; both are useful.",
          },
        ],
      },
      {
        label: "Math",
        why: "Statistics turns up in almost every health field, and many science degrees expect calculus in the first year regardless of major.",
        steps: [
          { name: "Algebra 2" },
          { name: "Precalculus" },
          {
            name: "Statistics or Calculus",
            note: "Statistics is the more directly useful of the two for most health fields, and is often the easier one to reach.",
          },
        ],
      },
    ],
    stages: [
      {
        from: 6,
        to: 8,
        label: "Middle school",
        gist: "Nothing here is field-specific yet.",
        courses: [
          "Nothing specific to health or medicine. Take the strongest math and science placement available to you and leave it there.",
        ],
        activities: [
          "Nothing is expected at this age, and anyone telling a 12-year-old to start building a medical résumé is wrong.",
        ],
        narrative:
          "This field's requirements genuinely start in 9th grade. We'd rather say that than invent middle-school steps to fill the space.",
      },
      {
        from: 9,
        to: 10,
        label: "Early high school",
        gist: "Build the science base properly, and learn what 'pre-med' actually means.",
        courses: [
          "Biology and chemistry, taken properly rather than in the lightest version offered.",
          "Keep math moving — statistics shows up everywhere in health fields.",
        ],
        activities: [
          "Free and near-at-hand first: volunteering that already exists in your community, tutoring younger students, helping at a clinic or food bank if one will take a 15-year-old.",
          "Caring for a family member is real, relevant experience in this field. It belongs in your activities list.",
          "You do not need clinical shadowing at 15. That matters for medical school applications years from now, not for undergraduate admission.",
        ],
        narrative:
          "The most common misunderstanding in this whole category is that 'pre-med' is a major. It isn't — it's a set of courses you take alongside any major, so you can be a pre-med history student. Nobody applies to college as a pre-med.",
      },
      {
        from: 11,
        to: 11,
        label: "Junior year",
        gist: "Separate the two paths — nursing and pre-med work completely differently.",
        courses: [
          "The most advanced science your school offers that you can carry alongside everything else.",
          "Statistics if it's available.",
        ],
        activities: [
          "If nursing is on your list, check its specific requirements now — they're usually stricter and more specific than the general university's.",
          "Sustained volunteering in one place is easier to write about than a collection of one-off hours.",
        ],
        narrative:
          "There are really two applications hiding in this category. Nursing and allied-health programs often admit directly and competitively, with their own requirements. Pre-med isn't an admission category at all — you apply as a biology or chemistry or anything-else student. Knowing which one you're doing changes what you need to have ready.",
      },
      {
        from: 12,
        to: 12,
        label: "Senior year",
        gist: "Apply to the actual program, not the general idea of it.",
        courses: [
          "Keep science on the schedule. A senior year with no science on a health application is a visible gap.",
        ],
        activities: [
          "Nothing new. Describe what you already did, in specifics — 'two years, every Saturday' says more than a title does.",
        ],
        narrative:
          "'Why medicine' essays are hard because the honest answer is often a family experience, and that story is common. What makes it yours is the specific detail — what you saw, what you did, what you didn't understand at the time — not the conclusion you draw from it.",
      },
    ],
    structure: {
      entry:
        "Pre-med isn't an admission category at all. Nursing and allied health often are, and admit directly.",
      extra: "Nothing extra to submit",
      locked: "Some",
      lockedWhy:
        "Biology and chemistry are prerequisites for the courses above them, but the sequence is shorter and more forgiving than engineering's.",
    },
  },

  "arts-design": {
    ladders: [
      {
        label: "Studio",
        why: "A portfolio is built from a large body of work over years, not assembled in senior year — which is why the studio sequence is the ladder that matters here.",
        steps: [
          {
            name: "Any studio art course",
            note: "Whatever your school offers. The medium matters much less than making work consistently.",
          },
          {
            name: "Observational drawing",
            note: "Drawing from life rather than from photos or imagination. Many programs specifically ask for it even from non-drawing applicants.",
          },
          { name: "Advanced studio / AP Art" },
          {
            name: "Portfolio assembly",
            note: "A separate job from making the work, and one that takes longer than students expect.",
          },
        ],
      },
    ],
    stages: [
      {
        from: 6,
        to: 8,
        label: "Middle school",
        gist: "Just keep the work.",
        courses: [
          "Any art class your school offers. There's no sequence to protect here yet.",
        ],
        activities: [
          "Keep everything you make, including the work you don't like. That's the only middle-school step that matters in this field.",
        ],
        narrative:
          "Nothing to build yet. The habit of keeping your work is the whole assignment.",
      },
      {
        from: 9,
        to: 10,
        label: "Early high school",
        gist: "Make a lot, keep all of it, and practise drawing from life.",
        courses: [
          "Studio courses in whatever your school offers.",
          "Keep a normal academic transcript alongside — art programs inside universities still read it.",
        ],
        activities: [
          "Free first: sketchbooks, community centre workshops, and library programs. You do not need expensive materials to build a portfolio.",
          "Practise observational drawing even if it isn't your medium — many programs ask for it specifically.",
          "Document your work properly as you go. Badly photographed good work is a real and avoidable problem.",
        ],
        narrative:
          "Portfolios are built from volume. The pieces you'll submit in three years are probably not the ones you'd pick today, which is the argument for keeping everything rather than curating early.",
      },
      {
        from: 11,
        to: 11,
        label: "Junior year",
        gist: "Find the real deadlines — they're usually earlier than you think.",
        courses: ["The most advanced studio course you can take."],
        activities: [
          "National Portfolio Days give you free feedback from several schools at once, and attending in 11th grade leaves time to act on what you hear.",
          "Find the exact portfolio requirements for every school on your list — piece counts and required media differ, so build toward the strictest one.",
        ],
        narrative:
          "This field runs on an earlier calendar than every other one on this page. Portfolio deadlines are frequently before application deadlines, and working backwards from the wrong date is the single most common way this goes wrong.",
      },
      {
        from: 12,
        to: 12,
        label: "Senior year",
        gist: "Work backwards from the portfolio deadline, not the application deadline.",
        courses: ["Advanced studio, and a normal academic load alongside it."],
        activities: [
          "Some programs require an interview or a portfolio review, in person or virtual. Check whether yours do and book early.",
        ],
        narrative:
          "Artist statements are usually short and usually harder than the essay. Describing what you were actually trying to do — including where it didn't work — reads as a practising artist. Describing what your work symbolises rarely does.",
      },
    ],
    structure: {
      entry:
        "Often a separate admission from the general university, with its own review.",
      extra: "Portfolio, and sometimes an interview or review",
      locked: "Low",
      lockedWhy:
        "There's no prerequisite chain to protect. What binds here is the calendar, not course placement.",
    },
  },

  business: {
    ladders: [
      {
        label: "Math",
        why: "Business curricula are more quantitative than most applicants expect — statistics and calculus both show up, so the math ladder matters more here than the subject's reputation suggests.",
        steps: [
          { name: "Algebra 1" },
          { name: "Geometry" },
          { name: "Algebra 2" },
          {
            name: "Statistics or Precalculus",
            note: "Statistics is directly useful and often more reachable than calculus.",
          },
          {
            name: "Calculus",
            note: "Required by some business programs, preferred by others, irrelevant at the rest. Worth checking per school.",
          },
        ],
      },
    ],
    stages: [
      {
        from: 6,
        to: 8,
        label: "Middle school",
        gist: "Only the math placement matters here.",
        courses: [
          "The strongest math placement you can get. Nothing else in middle school affects this path.",
        ],
        activities: [
          "Nothing is expected. If you already help with a family business, that's real and it will matter later — just remember it.",
        ],
        narrative:
          "Nothing to build yet. Business programs read a high school transcript, not a middle school one.",
      },
      {
        from: 9,
        to: 10,
        label: "Early high school",
        gist: "Take math seriously, and start writing down the work you already do.",
        courses: [
          "Keep the math ladder moving — this is the part students underestimate in this field.",
          "Economics if your school offers it, though it's rarely required.",
        ],
        activities: [
          "A part-time job is directly relevant experience here. So is helping run a family business, translating for customers, or handling a household's money.",
          "Free and school-based: DECA and FBLA chapters exist at many schools — ask whether yours has one and what it costs before assuming.",
          "Students routinely leave paid work off their applications because it doesn't feel like a 'real' extracurricular. In this field especially, that's a mistake.",
        ],
        narrative:
          "This is one of the few fields where the work you're already doing out of necessity maps directly onto the major. A student who has actually handled money, customers, or a schedule has something specific to write about.",
      },
      {
        from: 11,
        to: 11,
        label: "Junior year",
        gist: "Find out which schools admit to the business school directly.",
        courses: ["Statistics, calculus, or both, depending on your ladder."],
        activities: [
          "Check which of your schools do direct admission into business — it changes whose requirements bind, the university's or the business school's.",
          "Leadership in something small and real beats a title in something you joined for the title.",
        ],
        narrative:
          "'Why business' is one of the easier essays to write badly, because ambition is easy to state and hard to evidence. A specific thing you ran, sold, fixed, or organised does the work that an ambitious sentence can't.",
      },
      {
        from: 12,
        to: 12,
        label: "Senior year",
        gist: "Apply to the school, not just the university.",
        courses: ["Keep math on the schedule."],
        activities: [
          "Confirm whether the business school needs its own application, its own essays, or has higher stated requirements.",
        ],
        narrative:
          "If you've worked, lead with the work. The concrete detail of a real job is more convincing than any framing you could put around it.",
      },
    ],
    structure: {
      entry:
        "Often a direct-admit school within the university, and internal transfer in can be competitive or closed.",
      extra: "Nothing extra to submit",
      locked: "Some",
      lockedWhy:
        "Reaching calculus depends on the earlier ladder, but many business programs don't require it.",
    },
  },

  humanities: {
    ladders: [
      {
        label: "World language",
        why: "Four years of the SAME language is commonly expected here, and each year is a prerequisite for the next — so where you finish depends on which year you started.",
        steps: [
          { name: "Language I" },
          { name: "Language II" },
          { name: "Language III" },
          {
            name: "Language IV / AP",
            note: "If you speak a language at home, ask about a placement test or credit by exam — some districts and colleges grant credit for demonstrated proficiency.",
          },
        ],
      },
      {
        label: "English",
        why: "Writing carries more weight in this field than anywhere else on this page, and the advanced courses are where you get feedback on long-form work.",
        steps: [
          { name: "English 9 / 10" },
          { name: "AP Language or an advanced composition course" },
          { name: "AP Literature or a seminar-style course" },
        ],
      },
    ],
    stages: [
      {
        from: 6,
        to: 8,
        label: "Middle school",
        gist: "Starting a language early is the one thing with long-term effect.",
        courses: [
          "If your school offers a world language in middle school, starting it early is what makes reaching level IV or AP possible later.",
        ],
        activities: [
          "Reading widely. That's genuinely it — no programme, no cost.",
        ],
        narrative:
          "Nothing to build. If you speak a language at home, you already have an academic asset most applicants don't; the work later is getting it recognised, not acquiring it.",
      },
      {
        from: 9,
        to: 10,
        label: "Early high school",
        gist: "Start the language sequence and treat writing as coursework that compounds.",
        courses: [
          "Begin the four-year language sequence, and stay in the same language rather than switching.",
          "Ask about a placement test or credit by exam for a language you already speak.",
        ],
        activities: [
          "Free: the school paper, debate, a library writing group, or simply keeping the essays you're proud of.",
          "Translating for your family is real intellectual work and belongs on your list.",
        ],
        narrative:
          "The work here compounds quietly — writing gets better through feedback and revision over years, and there's no way to compress that into senior year.",
      },
      {
        from: 11,
        to: 11,
        label: "Junior year",
        gist: "Writing is the main event, so budget more revision time than a STEM applicant would.",
        courses: [
          "Advanced English, and the highest level of your language you can reach.",
        ],
        activities: [
          "Keep any substantial piece of writing you're proud of — some programs accept or request a graded paper.",
          "A teacher who has read several drafts of your work writes a better recommendation than one who's only seen your grades.",
        ],
        narrative:
          "Your essays are doing double duty in this field: personal statement and writing sample. That's a real argument for starting earlier and revising more than the general advice suggests.",
      },
      {
        from: 12,
        to: 12,
        label: "Senior year",
        gist: "Write specifically. Specificity is the whole game here.",
        courses: ["Finish the language sequence rather than dropping it senior year."],
        activities: [
          "Check whether any program asks for a writing supplement separate from the main essay.",
        ],
        narrative:
          "'Why this major' rewards a particular question, text, or period you actually care about. A general love of reading is true of everyone applying and therefore tells the reader nothing about you.",
      },
    ],
    structure: {
      entry: "Usually declared after you arrive, not on the application.",
      extra: "Sometimes a graded writing sample",
      locked: "Some",
      lockedWhy:
        "The language sequence is cumulative — where you finish depends on when you started.",
    },
  },

  "social-sciences": {
    ladders: [
      {
        label: "Math",
        why: "Economics, psychology and sociology are all quantitative at university level, which surprises people — statistics is the course that pays off most here.",
        steps: [
          { name: "Algebra 2" },
          { name: "Precalculus" },
          {
            name: "Statistics",
            note: "The single most useful math course for this family. Take it if your school offers it.",
          },
        ],
      },
    ],
    stages: [
      {
        from: 6,
        to: 8,
        label: "Middle school",
        gist: "Nothing field-specific. That's genuinely the answer.",
        courses: [
          "Nothing specific. A solid general placement is all this path needs from middle school.",
        ],
        activities: ["Nothing expected."],
        narrative:
          "This is the most flexible family on the page, and that flexibility starts now: there's no ladder to protect and no door closing.",
      },
      {
        from: 9,
        to: 10,
        label: "Early high school",
        gist: "Keep it broad — there's rarely a specific requirement to hit.",
        courses: [
          "A strong general transcript is genuinely what this family asks for.",
          "Take statistics if it's offered — it's the most transferable course here.",
        ],
        activities: [
          "Free and local: community organisations, tutoring, mutual aid, anything where you can describe what you actually did.",
          "Paid work counts, as does family responsibility. Concrete beats impressive.",
        ],
        narrative:
          "Because there's no prerequisite chain, this is a genuinely safe choice while undecided — you're not spending an option to pick it.",
      },
      {
        from: 11,
        to: 11,
        label: "Junior year",
        gist: "Get one concrete thing you can describe in detail.",
        courses: ["Statistics, and whatever social science your school offers."],
        activities: [
          "Research, community work, or a sustained role somewhere — the subject matters less than being able to describe specifics.",
          "Start noticing which questions actually interest you. That's the raw material a 'why this major' essay needs.",
        ],
        narrative:
          "The strongest version of this application is usually one sustained thing described precisely, not many things listed. Precision is the substitute for prestige here, and it's available to everyone.",
      },
      {
        from: 12,
        to: 12,
        label: "Senior year",
        gist: "Apply broadly — most of these are declared after you arrive.",
        courses: ["Keep the transcript strong; there's no specific course to add."],
        activities: [
          "Check the few schools that do require declaring a major on entry.",
        ],
        narrative:
          "Applying undecided costs little in this family, which makes it worth being honest rather than picking a major to sound decided.",
      },
    ],
    structure: {
      entry:
        "Usually declared after a year or two rather than on the application.",
      extra: "Nothing extra to submit",
      locked: "Low",
      lockedWhy:
        "There is rarely a prerequisite chain, which is what makes this a safe choice while undecided.",
    },
  },

  "natural-sciences": {
    ladders: [
      {
        label: "Math",
        why: "Many science degrees require calculus in the first year regardless of the specific field, so the math ladder constrains this path much as it does engineering's.",
        steps: [
          {
            name: "Algebra 1",
            note: "Taking this in 8th grade is what makes calculus reachable by senior year at most schools.",
          },
          { name: "Geometry" },
          { name: "Algebra 2" },
          { name: "Precalculus" },
          {
            name: "Calculus",
            note: "Dual enrolment at a community college is the usual route if your school doesn't offer it.",
          },
        ],
      },
      {
        label: "Lab science",
        why: "Lab courses build on each other, and the advanced ones are where you get the hands-on work that a science recommendation letter can describe.",
        steps: [
          { name: "Biology" },
          { name: "Chemistry" },
          { name: "Physics" },
          {
            name: "An AP or advanced lab science",
            note: "Whichever your school actually offers. None of these are universally required.",
          },
        ],
      },
    ],
    stages: [
      {
        from: 6,
        to: 8,
        label: "Middle school",
        gist: "Same math-placement decision as engineering.",
        courses: [
          "Algebra 1 in 8th grade if you can be placed into it — the calculus requirement at the other end traces back to here.",
        ],
        activities: [
          "Nothing required. Free science content and a library card do the job at this age.",
        ],
        narrative:
          "The only thing worth protecting now is the math ladder. Everything else in this field starts in high school.",
      },
      {
        from: 9,
        to: 10,
        label: "Early high school",
        gist: "Take the lab sciences and keep math moving.",
        courses: [
          "Take the lab sciences your school offers rather than the lightest science available.",
          "Keep the math sequence moving — it's the constraint that closes doors quietly.",
        ],
        activities: [
          "Free first: science olympiad and similar school teams, which are usually school-funded.",
          "Getting genuinely good at one lab technique or one topic gives a teacher something specific to write about later.",
        ],
        narrative:
          "This field rewards depth over breadth, and depth is free — it takes time rather than money, which makes it one of the more accessible paths on this page.",
      },
      {
        from: 11,
        to: 11,
        label: "Junior year",
        gist: "Look for research access, and ask locally before looking nationally.",
        courses: [
          "The most advanced science and math you can carry.",
        ],
        activities: [
          "Free and funded research programs are listed further down this page. Also ask your counselor what students at your school have actually done — local university programs are easier to reach than famous national ones.",
          "A teacher who knows your lab work is a strong recommendation letter later.",
        ],
        narrative:
          "Research experience is helpful, not expected, and pretending otherwise mostly serves programs that charge for it. What you can describe understanding matters more than where you were.",
      },
      {
        from: 12,
        to: 12,
        label: "Senior year",
        gist: "Apply with the transcript you actually have, and explain the gaps.",
        courses: [
          "Keep both math and science on the schedule.",
          "If your school didn't offer a course a program expects, say so in the context section rather than leaving it unexplained.",
        ],
        activities: ["Nothing new needs to start."],
        narrative:
          "'Why this field' supplements are common here. A specific question you want to answer is easier to defend than enthusiasm for science in general.",
      },
    ],
    structure: {
      entry:
        "Usually the general university first, with the major declared on entry or shortly after.",
      extra: "Nothing extra to submit",
      locked: "High",
      lockedWhy:
        "Calculus in the first year of the degree traces back to middle-school math placement.",
    },
  },

  education: {
    ladders: [
      {
        label: "General academic",
        why: "There's rarely a field-specific course ladder here. What shapes this path is state licensure, which sits outside your high school transcript entirely.",
        steps: [
          { name: "A solid general transcript" },
          {
            name: "The subject you want to teach",
            note: "If you already know — secondary teaching licences are subject-specific, so depth in that subject starts to matter.",
          },
          {
            name: "Any child development or education course",
            note: "Offered at some high schools, not most. Useful if available, not a gap if not.",
          },
        ],
      },
    ],
    stages: [
      {
        from: 6,
        to: 8,
        label: "Middle school",
        gist: "Nothing field-specific yet.",
        courses: ["Nothing specific to education."],
        activities: [
          "If you already look after younger siblings or cousins, that's the experience this field values most — and you're already doing it.",
        ],
        narrative:
          "Nothing to build. This is one of the few fields where the relevant experience often starts at home rather than in a programme.",
      },
      {
        from: 9,
        to: 10,
        label: "Early high school",
        gist: "The relevant experience is available to you right now, and mostly free.",
        courses: [
          "Keep a broad, solid transcript — there are rarely field-specific requirements at this stage.",
        ],
        activities: [
          "Tutoring, camp counselling, coaching, and caring for younger siblings are all directly relevant. This field maps onto that experience more directly than any other on this page.",
          "Free and school-based: peer tutoring programmes, teaching assistant roles, and after-school help sessions.",
        ],
        narrative:
          "Most fields ask you to translate your experience into something that sounds relevant. This one doesn't — looking after and teaching younger people is the thing itself.",
      },
      {
        from: 11,
        to: 11,
        label: "Junior year",
        gist: "Check the licensure angle, because it shapes the degree more than admissions does.",
        courses: [
          "Depth in the subject you'd want to teach, if you know it.",
        ],
        activities: [
          "Ask whether programs on your list admit directly into education, or require applying to the school of education after a year or two.",
          "Sustained tutoring in one place gives you something concrete to write about.",
        ],
        narrative:
          "Teaching licences are issued by states and the requirements differ. If you know which state you want to teach in, its rules affect which programs are worth applying to at all — that's a structural constraint most applicants don't discover until later.",
      },
      {
        from: 12,
        to: 12,
        label: "Senior year",
        gist: "Apply to the right structure — direct-admit or later application.",
        courses: ["Keep the transcript steady."],
        activities: [
          "Confirm whether education is direct-admit at each school or a later internal application.",
        ],
        narrative:
          "If you already tutor or coach, that belongs in your essays as evidence rather than only in the activities list. A specific student you helped, and what changed, is a stronger piece of writing than a statement about wanting to help people.",
      },
    ],
    structure: {
      entry:
        "Mixed — some admit directly into education, others require applying after a year or two.",
      extra: "Nothing extra to submit",
      locked: "Low",
      lockedWhy:
        "No prerequisite chain to protect. State licensure rules, not course placement, are the real constraint.",
    },
  },
};

export function pathwayFor(familyId: string): MajorPathway | null {
  return MAJOR_PATHWAYS[familyId] ?? null;
}

/**
 * The stage covering a given grade, if any.
 *
 * Same contract as `phaseForGrade` in majors.ts — returns null rather than a
 * nearest match, so a student never sees another grade's advice relabelled as
 * theirs.
 */
export function stageForGrade(
  pathway: MajorPathway,
  grade: number
): StageDetail | null {
  return pathway.stages.find((s) => grade >= s.from && grade <= s.to) ?? null;
}
