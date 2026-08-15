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
  },
];

export function findMajorFamily(label: string | null | undefined) {
  if (!label) return null;
  return MAJOR_FAMILIES.find((m) => m.label === label) ?? null;
}
