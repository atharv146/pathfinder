/**
 * Which roadmap items still matter if you arrive late.
 *
 * A student who signs up in 11th grade should not be shown five years of
 * unfinished checkboxes. Most of what's behind them is either still genuinely
 * useful or genuinely past, and the difference matters:
 *
 *   evergreen — still worth doing whenever you find it. "Start a running list
 *               of your activities" is as useful in 12th grade as in 9th.
 *   windowed  — tied to a moment that has actually passed. Telling an 11th
 *               grader to "choose your 9th grade classes carefully" isn't
 *               guidance, it's just making them feel bad about something they
 *               cannot change.
 *
 * ⚠️ This is NOT a judgement of the student and must never be rendered as one.
 * Nothing here produces a score, a percentage, or a "you're behind". Windowed
 * items are simply not shown as catch-up; they still live on their own grade
 * page for anyone who wants to read them.
 *
 * Lives outside roadmap.json deliberately: that file is generated from
 * content/roadmap-content-v4.md, so anything added to it is lost on the next
 * regeneration. Keyed by item id instead.
 */

export type Timing = "evergreen" | "windowed";

/**
 * Only the windowed ones are listed. Everything else is evergreen by default —
 * see `getTiming`. That default is deliberate: a newly-added item that nobody
 * has classified yet should show up as "worth a look" rather than silently
 * vanish from catch-up.
 */
const WINDOWED: Record<string, string> = {
  // Advice that actively conflicts with what a later student should do —
  // by 10th/11th the guidance is depth, not breadth.
  "6-1": "Breadth-first advice; later grades want depth instead.",

  // A specific summer that has been and gone.
  "6-5": "About one particular summer.",
  "7-5": "About one particular summer.",
  "9-7": "About one particular summer.",
  "8-4": "About the summer before 9th grade specifically.",

  // Decisions made on a fixed calendar, before high school.
  "g6-math-placement":
    "The placement decision is made in middle school; by high school the sequence is already running.",
  "g7-hs-credit-courses":
    "About choosing middle school courses before taking them.",
  "8-1": "About selecting 9th grade courses, at the time you select them.",
};

export function getTiming(itemId: string): Timing {
  return itemId in WINDOWED ? "windowed" : "evergreen";
}

export function isEvergreen(itemId: string): boolean {
  return getTiming(itemId) === "evergreen";
}

/** Why an item is windowed — for a tooltip or a future explanation, not shown by default. */
export function windowedReason(itemId: string): string | undefined {
  return WINDOWED[itemId];
}
