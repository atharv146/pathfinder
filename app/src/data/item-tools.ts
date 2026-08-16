/**
 * Which roadmap items have a tool attached.
 *
 * The roadmap is the product. The tools on `/tools` are support for it, and a
 * student who just wants "what do I do this year" should never have to go
 * hunting in a separate tab to find them — the fee-waiver checker is only
 * useful at the moment the roadmap says money is coming up, and the essay
 * exercises are only useful in 11th and 12th grade.
 *
 * So the tools are surfaced from inside the relevant roadmap items instead of
 * relying on the nav. Anything not listed here shows nothing, which is most of
 * the roadmap and should stay that way.
 */

export type ItemTool = {
  href: string;
  label: string;
  /** One line on why it's here, at this item. */
  why: string;
};

export const ITEM_TOOLS: Record<string, ItemTool> = {
  // Fee waivers — surfaced wherever the roadmap raises cost.
  "g7-fee-waiver-awareness": {
    href: "/tools#fee-waivers",
    label: "Check which fee waivers you could get",
    why: "Nothing to do yet, but you can see now what this unlocks later.",
  },
  "10-6": {
    href: "/tools#fee-waivers",
    label: "Check which fee waivers you could get",
    why: "Test and application fees are waivable. Worth knowing before you pay any.",
  },
  "11-7": {
    href: "/tools#fee-waivers",
    label: "Check which fee waivers you could get",
    why: "Same idea as scholarships — money you don't have to spend counts as money found.",
  },
  "12-2": {
    href: "/tools#fee-waivers",
    label: "Check which fee waivers you could get",
    why: "The FAFSA is free, but application and test fees aren't. These often are.",
  },

  // Essay work — 11th and 12th only.
  "11-5": {
    href: "/tools#essay",
    label: "Start brainstorming your essay",
    why: "Three exercises for the part everyone gets stuck on: finding the story.",
  },
  "12-4": {
    href: "/tools#essay",
    label: "Brainstorming exercises",
    why: "Same exercises work for supplements — start from a real moment, not a theme.",
  },
};

export function toolForItem(itemId: string): ItemTool | null {
  return ITEM_TOOLS[itemId] ?? null;
}
