/**
 * Escalation flagging for chat messages.
 *
 * master-spec-doc.md Section 6: "any message touching legal immigration
 * status, mental health crisis, or abuse/safety concerns should be flagged and
 * given a clear resource pointer, not just an AI answer."
 *
 * ⚠️ WHAT THIS IS AND ISN'T. This is a keyword heuristic, not a classifier. It
 * will miss things and it will over-fire. It exists so that:
 *   - the UI can surface a real human resource alongside the AI answer, and
 *   - these conversations are identifiable later if we ever need to review
 *     how the app handled them.
 *
 * The actual quality of the response comes from the system prompt, not from
 * here. Never gate a response on this — a missed flag must still get a good
 * answer, and a false positive must not refuse to help.
 */

export type FlagTopic = "immigration" | "crisis" | "safety";

const PATTERNS: Record<FlagTopic, RegExp[]> = {
  immigration: [
    /\b(undocumented|daca|dreamer|green ?card|visa|deport|ice raid|asylum|refugee|permanent resident|work permit|i-?20|f-?1|tps)\b/i,
    /\b(immigration|citizenship) (status|lawyer|attorney|papers)\b/i,
    /\bwithout (a |an )?(ssn|social security)\b/i,
    /\bnotario\b/i,
  ],
  crisis: [
    /\b(suicide|suicidal|kill myself|end my life|want to die|self ?harm|cutting myself)\b/i,
    /\b(hopeless|can'?t go on|no reason to live)\b/i,
    /\b(depress(ed|ion)|anxiety attack|panic attack|eating disorder)\b/i,
  ],
  safety: [
    /\b(abuse|abusive|beaten|hit me|hurts? me|threaten(ed|ing)?)\b/i,
    /\b(unsafe|not safe|run away|kicked out|homeless)\b/i,
    /\b(traffick|assault)\w*\b/i,
  ],
};

/**
 * Returns the topics a message appears to touch. Empty array is the norm.
 */
export function flagTopics(text: string): FlagTopic[] {
  const found: FlagTopic[] = [];

  for (const [topic, patterns] of Object.entries(PATTERNS) as [
    FlagTopic,
    RegExp[],
  ][]) {
    if (patterns.some((p) => p.test(text))) {
      found.push(topic);
    }
  }

  return found;
}

/**
 * Human-facing resources shown alongside the AI answer when a topic fires.
 *
 * Deliberately short and specific. A wall of links reads as a brush-off; one
 * or two real pointers reads as help. Nothing here is invented — 988 is the
 * U.S. Suicide & Crisis Lifeline, and the others are described generically
 * rather than by naming organizations we haven't verified.
 */
export const FLAG_RESOURCES: Record<FlagTopic, { label: string; body: string }> =
  {
    immigration: {
      label: "For status-specific questions",
      body: "PathFinder can explain how forms and policies work, but not what they mean for your specific situation. A school counselor, a licensed immigration attorney, or an established immigrant-serving nonprofit can. Avoid unlicensed “notario” services — they target immigrant families and are not lawyers.",
    },
    crisis: {
      label: "If you're struggling right now",
      body: "You can call or text 988 (the Suicide & Crisis Lifeline) any time, free, in English or Spanish. If you'd rather talk to someone in person, a school counselor is a good place to start.",
    },
    safety: {
      label: "If you're not safe",
      body: "Please talk to an adult you trust — a school counselor, a teacher, or a relative. If you're in immediate danger, call 911. You can call or text 988 to talk to someone any time.",
    },
  };
