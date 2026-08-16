/**
 * Essay brainstorming exercises.
 *
 * ⚠️ THIS TOOL NEVER WRITES AN ESSAY, AND MUST NOT BE MADE TO.
 * Two reasons, both hard: an AI-written personal statement is an integrity
 * problem the student carries, and school counselors are this app's primary
 * distribution channel (master-spec-doc.md §10) — a tool that drafts essays
 * gets the whole product blacklisted with exactly the people we need.
 *
 * The content below is not new. It's the method already written into the
 * 11th-grade roadmap item "Start drafting your Common App essay this summer",
 * turned into something you can actually sit down and do.
 */

export type Exercise = {
  id: string;
  name: string;
  /** Why this one works — students skip exercises they don't believe in. */
  why: string;
  prompts: string[];
};

export const EXERCISES: Exercise[] = [
  {
    id: "moments",
    name: "Five moments",
    why: "Brainstorming, not writing, is where almost everyone gets stuck. Starting from concrete moments beats starting from a theme, because a moment already has detail in it and a theme doesn't.",
    prompts: [
      "Write down a moment that changed how you see something. It can be small.",
      "A time you were wrong about something, and found out.",
      "A time you had to do something you weren't ready for.",
      "A moment you keep coming back to, even though nothing dramatic happened.",
      "A time someone said something to you that stuck.",
    ],
  },
  {
    id: "values",
    name: "Values, then memory",
    why: "Works in the other direction: start from who you are, then find the evidence. Useful if the moments exercise came out blank.",
    prompts: [
      "List three words you'd want a friend to use describing you.",
      "For the first word — what's a specific memory where you actually acted like that?",
      "For the second — same question. A real scene, not a summary.",
      "For the third — same again.",
      "Which of those three memories would you be happy for a stranger to read?",
    ],
  },
  {
    id: "outloud",
    name: "Tell it out loud",
    why: "Most people write worse than they talk, especially under pressure. Telling it to someone who wasn't there gets you your natural voice, which is the thing the essay is actually for.",
    prompts: [
      "Pick one story from above. Tell it out loud to a friend, or to your phone's voice recorder.",
      "Write down what you actually said — the words you used, not tidied-up versions.",
      "Which sentence sounded most like you?",
      "What detail did you include out loud that you'd have left out in writing?",
    ],
  },
];

export type Structure = {
  id: string;
  name: string;
  what: string;
  suits: string;
};

export const STRUCTURES: Structure[] = [
  {
    id: "narrative",
    name: "Narrative",
    what: "One scene or turning point, told in depth, with reflection on what it changed.",
    suits:
      "You have one story that clearly matters more than the others.",
  },
  {
    id: "montage",
    name: "Montage",
    what: "Several smaller moments connected by one throughline — an object, a place, a repeated action.",
    suits:
      "You have four or five moments that don't rank, but do rhyme.",
  },
];

/**
 * The specificity note, restated here because it's the single most useful
 * thing in the 11th-grade content and the place students most need it.
 */
export const SPECIFICITY_NOTE =
  "If you're writing about immigrating, translating for your parents, or family hardship — that's real and it matters, and it's completely valid material. But admissions readers see a very large number of essays that hit those beats in the same broad way, and a broad version of a true story can read as generic. The fix isn't a different topic. It's going more specific, not less: the particular smell of one waiting room, the exact sentence your grandmother said, the precise moment a translation went wrong in a way only you would know about.";
