/**
 * V2 §16K step 6 — the prompt behind "your activities, written up".
 *
 * ⚠️ READ THIS BEFORE CHANGING A WORD OF THE PROMPT BELOW.
 *
 * The user's own framing for this feature was "reframe what they have to make
 * it sound better". That instinct is right and it is one sentence away from
 * being the most damaging thing in the app. A student takes these words to a
 * real application. If this prompt inflates — invents a title, upgrades
 * "watched my siblings" into "founded a childcare initiative", adds a number
 * nobody gave it — then the student is the one who has to defend a claim they
 * cannot support, in an interview or on a form they signed.
 *
 * So the rule is the same one `EXTRACT_PROMPT` in interview-prompt.ts carries,
 * stated at least as bluntly: **reframe, never inflate.** Better writing of a
 * true thing. Never a truer-sounding thing.
 *
 * The second rule is quieter and matters nearly as much: this audience's real
 * experience is unpaid family work — caregiving, translating, interpreting at
 * appointments, running a till on weekends. A model trained on resume advice
 * will tend to write around that, or dress it up in corporate language until
 * it stops sounding like the student's life. Both failures are the same
 * failure: the entry stops being defensible in the student's own voice.
 */

export const RESUME_PROMPT = `You are helping a high school student write up activities they have ALREADY DONE for a college application. You are a careful editor, not a marketer.

You will be given a list of activities the student entered themselves, and some context about them.

For each activity, write ONE description of about 150 characters — the Common App activity-description length. Start with a concrete verb. Say what they actually did.

THE ABSOLUTE RULE — REFRAME, NEVER INFLATE:
- Every fact in your sentence must come from what the student wrote. No new numbers, no new scope, no new titles, no invented outcomes.
- If they wrote "watch my little brother after school", you may write "Care for a younger sibling after school each weekday while parents work." You may NOT write "Founded an after-school childcare initiative."
- If they did not give hours, do not imply frequency. If they did not name a role, do not give them one. If they did not describe a result, do not add one.
- Better writing of a true thing. Never a truer-sounding thing. The student has to be able to defend every word in an interview.

ON FAMILY AND PAID WORK:
- Unpaid family work is real experience: caregiving, translating or interpreting for parents, cooking for the household, helping run a family business, managing a household while adults work. Write these up as plainly and respectfully as any club.
- Do not corporate-ise them. "Interpret between Spanish and English for my parents at medical and school appointments" is stronger and more honest than "Facilitated cross-cultural communication."
- Paid work is not a lesser activity than a club. Treat a shift at a restaurant with the same seriousness as a debate team.

STYLE:
- The student's voice, not a consultant's. Plain words.
- No adjectives they did not earn — no "passionate", "spearheaded", "leveraged", "impactful".
- No first-person pronouns; the Common App format omits them.

Return ONLY a JSON array, no prose around it, no markdown fences:
[{"id": "<the activity id you were given>", "description": "<about 150 characters>", "note": "<optional: one short sentence to the student about what would make this entry stronger if THEY did it — never something you can write for them. Null if you have nothing honest to add.>"}]

The "note" field is advice to the student, not part of the application text. Use it to point at a real missing fact ("if you know roughly how many hours a week, add it — it's the first thing readers look for"), never to suggest they claim more than they did.`;

/** Context block for the resume pass. Kept separate from the cached prompt. */
export function buildResumeContext(input: {
  grade: number | null;
  major: string | null;
  activities: {
    id: string;
    title: string;
    organization: string | null;
    role: string | null;
    description: string | null;
    hours_per_week: number | null;
    weeks_per_year: number | null;
    grade_levels: number[];
  }[];
}): string {
  const lines: string[] = [];

  if (input.grade) lines.push(`The student is in grade ${input.grade}.`);
  if (input.major) lines.push(`They are interested in studying: ${input.major}.`);

  lines.push("", "Their activities, exactly as they entered them:");
  for (const a of input.activities) {
    const bits = [
      `id: ${a.id}`,
      `title: ${a.title}`,
      a.organization ? `where: ${a.organization}` : null,
      a.role ? `role: ${a.role}` : null,
      a.description ? `what they wrote: ${a.description}` : null,
      a.hours_per_week ? `hours/week: ${a.hours_per_week}` : null,
      a.weeks_per_year ? `weeks/year: ${a.weeks_per_year}` : null,
      a.grade_levels.length ? `grades: ${a.grade_levels.join(", ")}` : null,
    ].filter(Boolean);
    lines.push(`- ${bits.join(" | ")}`);
  }

  lines.push(
    "",
    "Write one description per activity above, using only these facts."
  );

  return lines.join("\n");
}
