/**
 * Major-family guidance.
 *
 * ⚠️ SCOPE, DELIBERATELY NARROW. `master-spec-doc.md` §3B defers full
 * major-specific pathways precisely because they need real sourced research,
 * and warns that improvising them reproduces the "generic, low-trust content"
 * problem this app exists to solve.
 *
 * So everything below is restricted to things that are *structurally* true of
 * a major family and checkable in five minutes on any university's admissions
 * page — portfolio and audition requirements exist, engineering programs look
 * for calculus and physics, "pre-med" is a track rather than a major. Nothing
 * here claims admissions odds, ranks schools, or invents statistics.
 *
 * WHAT IS STILL MISSING and needs real research before it ships: per-major
 * course sequences by state, named programs, competition/EC recommendations,
 * and anything resembling "students like you". Do not fill those in from
 * memory — that's the exact failure mode this file is written around.
 */

export type MajorFamily = {
  id: string;
  /** Must match the labels used in OnboardingFlow. */
  label: string;
  /** One line on what actually differs for this family. */
  summary: string;
  /** Concrete, verifiable things to act on. */
  notes: string[];
  /** Grade at which this family's requirements start to bite. */
  actFrom: number;
  /**
   * Grade-phased structural guidance — the "pathway" part.
   *
   * Restricted to sequencing and timing, which are structurally true and
   * checkable: course ladders have prerequisites, portfolio deadlines land
   * before application deadlines, direct-admit majors close later transfers.
   * NOT here: named programs, competitions, admissions odds, or "students
   * like you" — those need real research (see the file header).
   */
  phases: MajorPhase[];
  /**
   * Questions to take to a counselor. Deliberately questions and not answers:
   * the honest thing to give a student is the question their better-resourced
   * classmate already knows to ask, since the answer is school-specific and we
   * would be guessing at it.
   */
  askCounselor: string[];
  /** Things that genuinely differ school to school. Verify, never assume. */
  verify: string[];
};

export type MajorPhase = {
  /** Inclusive grade range this phase covers. */
  from: number;
  to: number;
  label: string;
  points: string[];
};

export const MAJOR_FAMILIES: MajorFamily[] = [
  {
    id: "engineering-cs",
    label: "Engineering / CS",
    summary:
      "The most course-sequence-dependent path there is — what you can take senior year is decided years earlier.",
    notes: [
      "Most engineering programs expect calculus and physics on your transcript. Reaching calculus by senior year usually means being on an accelerated math track from middle school, so if you're in 8th or 9th grade this is the decision that matters most.",
      "If your school doesn't offer calculus or physics, that is not disqualifying — but say so in your application context section, and look at community college dual enrolment, which is often free for high schoolers.",
      "Computer science admission is frequently separate and more competitive than the rest of the university, and at some schools you cannot switch into it later. Check whether it's a direct-admit major before applying.",
    ],
    actFrom: 8,
    phases: [
      {
        from: 6,
        to: 8,
        label: "Get on the math ladder",
        points: [
          "Ask how your district decides who takes Algebra 1 in 8th grade. Reaching calculus by senior year usually depends on starting Algebra 1 by 8th or 9th.",
          "Nothing else in middle school affects this path. If the math placement is handled, you're on track.",
        ],
      },
      {
        from: 9,
        to: 10,
        label: "Take the sciences in order",
        points: [
          "Physics and chemistry are the two that matter most here. Take them when your school offers them rather than deferring.",
          "If your school offers honors or AP versions and you can handle the load, they signal readiness for university-level work.",
          "If calculus or physics isn't offered at your school, look into dual enrolment at a community college — often free for high schoolers.",
        ],
      },
      {
        from: 11,
        to: 11,
        label: "Check how CS admission works",
        points: [
          "Find out for each school on your list whether computer science is a direct-admit major. At many universities it is separate, more competitive, and closed to later transfers.",
          "If you're not reaching calculus, that isn't disqualifying — but plan to explain your school's offerings in the application's context section.",
        ],
      },
      {
        from: 12,
        to: 12,
        label: "Apply to the right unit",
        points: [
          "Applying to 'the university' and applying to its engineering or CS school can be different applications with different deadlines. Confirm which one you're filing.",
          "Some engineering programs ask for a supplemental essay about why that specific field. Draft it early — it's harder than it looks.",
        ],
      },
    ],
    askCounselor: [
      "Is computer science direct-admit here, or can I transfer in later?",
      "What's the most advanced math I can reach if I start from where I am now?",
      "Does our school offer dual enrolment for calculus or physics?",
    ],
    verify: [
      "Whether CS is a separate, more competitive admission at each school.",
      "Whether engineering requires its own application and deadline.",
      "Which specific math and science courses each program expects.",
    ],
  },
  {
    id: "health-medicine",
    label: "Health & Medicine",
    summary: "The most common misunderstanding in this whole category is what 'pre-med' means.",
    notes: [
      "'Pre-med' is not a major. It's a set of courses you take alongside any major, so you can be a pre-med history student. Nobody applies to college as a pre-med.",
      "Biology and chemistry are the expected sciences. Nursing and some allied-health programs, unlike pre-med, often ARE direct-admit and highly competitive.",
      "Clinical volunteering or shadowing matters far more for medical school applications later than for undergraduate admission. Don't let anyone convince you it's required at 15.",
    ],
    actFrom: 9,
    phases: [
      {
        from: 9,
        to: 10,
        label: "Build the science base",
        points: [
          "Biology and chemistry are the expected sciences. Take them properly rather than the lightest version available.",
          "'Pre-med' is not a major and not something you apply as. It's a set of courses taken alongside any major — you can be a pre-med history student.",
        ],
      },
      {
        from: 11,
        to: 11,
        label: "Separate the two paths",
        points: [
          "Nursing and allied-health programs often ARE direct-admit and competitive — very different from pre-med, which isn't an admission category at all.",
          "If nursing is on your list, check its requirements now; they're usually stricter and more specific than the general university's.",
        ],
      },
      {
        from: 12,
        to: 12,
        label: "Apply to the actual program",
        points: [
          "For nursing or allied health, confirm whether you're applying to the program directly or to the university first.",
          "Clinical volunteering matters far more for medical school applications years from now than for undergraduate admission. Don't let anyone tell you it's required at 17.",
        ],
      },
    ],
    askCounselor: [
      "Is nursing here a direct-admit program, and what does it require?",
      "What science courses do the programs on my list actually expect?",
      "Does applying 'pre-med' mean anything at these schools, or is it just advising?",
    ],
    verify: [
      "Whether nursing/allied health admits separately and on what criteria.",
      "Whether a school has a formal pre-med advising track.",
      "Course requirements, which differ noticeably between programs.",
    ],
  },
  {
    id: "arts-design",
    label: "Arts & Design",
    summary: "Portfolio requirements run on a different, earlier calendar than everything else.",
    notes: [
      "Most art and design programs require a portfolio, and portfolio deadlines are often earlier than the application deadline itself. Find the exact date the summer before senior year.",
      "Many programs specify what the portfolio must contain — a set number of pieces, sometimes observational drawing. Requirements differ per school, so build to the strictest one on your list.",
      "National Portfolio Days let you get free feedback from multiple schools at once. They're worth attending in 11th grade, while there's still time to act on what you hear.",
    ],
    actFrom: 10,
    phases: [
      {
        from: 9,
        to: 10,
        label: "Start keeping the work",
        points: [
          "Keep everything you make, including work you don't love. Portfolios are built from a large body of work, not from a few finished pieces.",
          "Many programs specifically want observational drawing — drawing from life rather than from photos or imagination. Practise it even if it isn't your main medium.",
        ],
      },
      {
        from: 11,
        to: 11,
        label: "Find the real deadlines",
        points: [
          "Portfolio deadlines are often EARLIER than the application deadline. Find the exact date for every school on your list by the summer before senior year.",
          "Requirements differ per school — a set number of pieces, specific media, sometimes a written statement. Build toward the strictest list you're applying to.",
          "National Portfolio Days give you free feedback from multiple schools at once. Attending in 11th grade leaves time to act on what you hear.",
        ],
      },
      {
        from: 12,
        to: 12,
        label: "Submit on the earlier calendar",
        points: [
          "Work backwards from the portfolio deadline, not the application deadline. They are frequently not the same date.",
          "Some programs require an interview or an in-person/virtual review. Check whether yours do and book early.",
        ],
      },
    ],
    askCounselor: [
      "Which schools on my list require a portfolio, and when is it actually due?",
      "Is there anyone here who can review my portfolio before I submit it?",
      "Are there portfolio-prep or art classes I should be taking now?",
    ],
    verify: [
      "Exact portfolio contents and deadlines, which vary a lot per school.",
      "Whether an audition or interview is part of admission.",
      "Whether the program admits directly or through the general university.",
    ],
  },
  {
    id: "business",
    label: "Business",
    summary: "Often a direct-admit school within the university, with its own separate bar.",
    notes: [
      "At many universities the business school admits separately from the main university, and transferring in later is competitive or closed. Check whether your schools do direct admission.",
      "Math matters more than most students expect — statistics and calculus both appear in business curricula.",
      "A part-time job or helping run a family business is genuinely relevant experience here. Write it down in your activities list; students routinely leave this off because it doesn't feel like a 'real' extracurricular.",
    ],
    actFrom: 10,
    phases: [
      {
        from: 9,
        to: 10,
        label: "Take math seriously",
        points: [
          "Statistics and calculus both appear in business curricula, and math matters more here than most students expect.",
          "A part-time job or helping run a family business is genuinely relevant experience. Write it in your activities list — students routinely leave this off because it doesn't feel like a 'real' extracurricular.",
        ],
      },
      {
        from: 11,
        to: 11,
        label: "Check for direct admission",
        points: [
          "At many universities the business school admits separately, and transferring in later is competitive or closed entirely.",
          "Find out which of your schools do direct admission, because it changes whether the business school's requirements or the university's are the ones that bind.",
        ],
      },
      {
        from: 12,
        to: 12,
        label: "Apply to the school, not just the university",
        points: [
          "Confirm whether the business school needs its own application, essays, or higher stated requirements.",
          "'Why business' supplemental essays are common. A specific answer beats an ambitious-sounding one.",
        ],
      },
    ],
    askCounselor: [
      "Does the business school here admit separately, or can I transfer in?",
      "What math should I take if I'm aiming at a business program?",
      "Do any schools on my list require a separate business application?",
    ],
    verify: [
      "Whether business is direct-admit at each school.",
      "Whether internal transfer into business is realistically possible.",
      "Additional GPA or course requirements the business school sets.",
    ],
  },
  {
    id: "humanities",
    label: "Humanities",
    summary: "Writing carries more weight here than anywhere else in the application.",
    notes: [
      "Your essays are doing double duty: they're a personal statement and a writing sample. Give them more revision time than a STEM applicant would.",
      "Four years of the same world language is commonly expected, and for some programs it's a stated requirement rather than a preference.",
      "If you speak a language at home, that is an academic asset. Some schools grant placement credit for it — ask.",
    ],
    actFrom: 9,
    phases: [
      {
        from: 9,
        to: 10,
        label: "Start the language sequence",
        points: [
          "Four years of the SAME world language is commonly expected here, and for some programs it's a stated requirement rather than a preference. Where you finish depends on where you start.",
          "If you speak a language at home, ask about a placement test or credit by exam — some districts and colleges grant credit for demonstrated proficiency.",
        ],
      },
      {
        from: 11,
        to: 11,
        label: "Treat writing as the main event",
        points: [
          "Your essays do double duty here: personal statement and writing sample. Budget more revision time than a STEM applicant would.",
          "Keep any substantial piece of writing you're proud of — some programs accept or request a graded paper.",
        ],
      },
      {
        from: 12,
        to: 12,
        label: "Write specifically",
        points: [
          "'Why this major' essays reward specificity — a particular question, text, or period you care about beats a general love of reading.",
          "Check whether any program asks for a writing supplement separate from the main essay.",
        ],
      },
    ],
    askCounselor: [
      "How far can I get in one language if I start from where I am now?",
      "Can I test out of a language I already speak at home?",
      "Is there a teacher who'd review a writing sample with me?",
    ],
    verify: [
      "Whether a specific number of language years is required or merely preferred.",
      "Whether a graded writing sample is accepted or required.",
      "Whether the major is declared on entry or later.",
    ],
  },
  {
    id: "social-sciences",
    label: "Social Sciences",
    summary: "Broad and flexible, with fewer hard prerequisites than most families.",
    notes: [
      "There are rarely specific course requirements beyond a strong general transcript, which makes this a genuinely safe choice if you're undecided.",
      "Statistics is increasingly useful — economics, psychology and sociology are all quantitative at university level, which surprises people.",
      "Research or community work you can describe concretely tends to matter more than the specific subject you did it in.",
    ],
    actFrom: 10,
    phases: [
      {
        from: 9,
        to: 10,
        label: "Keep it broad",
        points: [
          "There are rarely specific course requirements beyond a strong general transcript, which genuinely makes this a safe choice while undecided.",
          "Take statistics if it's offered. Economics, psychology and sociology are all quantitative at university level, which surprises people.",
        ],
      },
      {
        from: 11,
        to: 11,
        label: "Get something concrete to describe",
        points: [
          "Research, community work, or anything you can describe in specifics tends to matter more than the subject it was in.",
          "Start noticing which questions actually interest you — that's what a 'why this major' essay needs later.",
        ],
      },
      {
        from: 12,
        to: 12,
        label: "Apply broadly, decide later",
        points: [
          "Most of these majors are declared after you arrive, not on the application, so applying undecided costs little here.",
          "Check the few schools that do require declaring on entry.",
        ],
      },
    ],
    askCounselor: [
      "Is statistics offered here, and should I take it?",
      "Do I need to declare this major when I apply, or later?",
      "Are there research or community programs the school knows about?",
    ],
    verify: [
      "Whether the major is declared on entry or after a year or two.",
      "Whether any quantitative prerequisite exists.",
      "Whether specific programs within the school are competitive.",
    ],
  },
  {
    id: "natural-sciences",
    label: "Natural Sciences",
    summary: "Lab coursework and math sequencing both matter, similarly to engineering.",
    notes: [
      "Take the lab sciences your school offers. If AP or IB options exist and you can handle the workload, they signal readiness for university-level lab work.",
      "Math sequencing matters here too — many science degrees require calculus in the first year regardless of the specific field.",
      "Summer research programs exist at many universities and a number are free or paid for students from lower-income families. Search for them by name in 10th and 11th grade.",
    ],
    actFrom: 9,
    phases: [
      {
        from: 6,
        to: 8,
        label: "Math placement matters here too",
        points: [
          "Many science degrees require calculus in the first year regardless of field, so the middle-school math ladder matters here much like it does for engineering.",
        ],
      },
      {
        from: 9,
        to: 10,
        label: "Take the lab sciences",
        points: [
          "Take the lab sciences your school offers. If AP or IB options exist and the workload is manageable, they signal readiness for university-level lab work.",
          "Keep the math sequence moving — it's the constraint that closes doors quietly.",
        ],
      },
      {
        from: 11,
        to: 11,
        label: "Look for research access",
        points: [
          "Summer research programs exist at many universities, and a number are free or paid for students from lower-income families. Search for them by name and ask your counselor which ones students here have done.",
          "A teacher who knows your lab work is a strong recommendation letter later.",
        ],
      },
      {
        from: 12,
        to: 12,
        label: "Apply with the transcript you have",
        points: [
          "If your school didn't offer a course a program expects, say so in the context section rather than leaving it unexplained.",
          "Some science programs ask a 'why this field' supplemental. Specific beats enthusiastic.",
        ],
      },
    ],
    askCounselor: [
      "What's the most advanced math and science I can reach from where I am?",
      "Do you know of summer research programs students here have done?",
      "Are there free or funded options for those programs?",
    ],
    verify: [
      "Which specific courses each program expects.",
      "Whether the major is direct-admit or declared later.",
      "Whether research experience is expected or merely helpful.",
    ],
  },
  {
    id: "education",
    label: "Education",
    summary: "State licensure requirements shape the degree more than admissions do.",
    notes: [
      "Teaching licences are issued by states, and the requirements differ. If you know which state you want to teach in, check its rules — they affect which programs are worth applying to.",
      "Some programs admit you directly into education; others require applying to the school of education after your first or second year.",
      "Tutoring, camp counselling, coaching or caring for younger siblings are all directly relevant experience. List them.",
    ],
    actFrom: 10,
    phases: [
      {
        from: 9,
        to: 10,
        label: "Get real experience early",
        points: [
          "Tutoring, camp counselling, coaching, or caring for younger siblings are all directly relevant here. List them — this is one of the few fields where that experience maps straight onto the major.",
          "Keep a broad, solid transcript; there are rarely field-specific course requirements at this stage.",
        ],
      },
      {
        from: 11,
        to: 11,
        label: "Check the licensure angle",
        points: [
          "Teaching licences are issued by states and requirements differ. If you know which state you want to teach in, check its rules — they affect which programs are worth applying to.",
          "Some programs admit you directly into education; others require applying to the school of education after your first or second year.",
        ],
      },
      {
        from: 12,
        to: 12,
        label: "Apply to the right structure",
        points: [
          "Confirm whether education is direct-admit at each school or a later internal application.",
          "If you already tutor or coach, that belongs in your essays as evidence, not just in the activities list.",
        ],
      },
    ],
    askCounselor: [
      "Is education direct-admit here, or do I apply after a year or two?",
      "Does this program lead to licensure in the state I want to teach in?",
      "Are there tutoring or classroom-assistant opportunities I can do now?",
    ],
    verify: [
      "State licensure requirements, which differ and change.",
      "Whether the program admits directly or later.",
      "Whether student teaching placement is guaranteed.",
    ],
  },
];

export function findMajorFamily(label: string | null | undefined) {
  if (!label) return null;
  return MAJOR_FAMILIES.find((m) => m.label === label) ?? null;
}

/**
 * The phase covering a given grade, if any.
 *
 * Returns null rather than a nearest match — a 7th grader looking at a family
 * whose guidance starts in 9th should see nothing here, not 9th-grade advice
 * relabelled as theirs.
 */
export function phaseForGrade(family: MajorFamily, grade: number): MajorPhase | null {
  return family.phases.find((p) => grade >= p.from && grade <= p.to) ?? null;
}
