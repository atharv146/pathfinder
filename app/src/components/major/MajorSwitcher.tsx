"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { MAJOR_FAMILIES } from "@/data/majors";
import { MajorGlyph } from "./MajorGlyph";

/**
 * The eight families, as a selectable board rather than a dropdown.
 *
 * A `<select>` would be smaller and would also make the single most important
 * interaction on the page invisible. This is the page's main control, and the
 * whole point of /major existing is that major-specific content is now a place
 * you go rather than a card bolted onto the roadmap — so the control that
 * chooses between them should look like the front door.
 *
 * `layoutId` on the selection panel means the highlight physically travels
 * between cards instead of disappearing and reappearing, which is what makes
 * switching read as one continuous surface.
 *
 * ── RADIX, NOT A HAND-ROLLED RADIOGROUP (Aug 16, 2026) ─────────────────────
 * This used to be `role="radiogroup"` with a manual `onKeyDown` implementing
 * arrow-key movement. Correct, but hand-written a11y is exactly the kind of
 * code that quietly bit-rots — Radix's `Tabs` primitive gets roving tabindex,
 * arrow/Home/End navigation, and the ARIA wiring for free, tested against real
 * screen readers by people who do this for a living. `Tabs` fits the actual
 * interaction better than `RadioGroup` would, too: selecting a family doesn't
 * set a value so much as it swaps which panel of content is showing beneath
 * it, which is exactly the tablist pattern.
 *
 * This renders only `Tabs.List` / `Tabs.Trigger` — it relies on an ANCESTOR
 * `Tabs.Root` (owned by `MajorView`, which also renders the matching
 * `Tabs.Content`) for the actual selection state and all keyboard/ARIA
 * behaviour. `selectedId` is still passed in as a prop, but ONLY to drive the
 * decorative travelling highlight below — framer-motion's `layoutId` needs to
 * know which trigger is active to animate the fill between them, and Radix
 * doesn't expose that top-down without consuming its context directly. Radix
 * remains the single source of truth for what's actually selected; this prop
 * mirrors it for animation purposes only, and a mismatch between the two would
 * be a rendering bug, not a real state desync (there's nothing to desync —
 * both ultimately read the same `selectedId` state in `MajorView`).
 */
export function MajorSwitcher({
  selectedId,
  profileId,
}: {
  selectedId: string;
  /** The family on the student's profile, marked so they can find their way back. */
  profileId?: string | null;
}) {
  return (
    <Tabs.List
      aria-label="Choose a major family"
      className="grid grid-cols-2 gap-2 sm:grid-cols-4"
    >
      {MAJOR_FAMILIES.map((f) => {
        const active = f.id === selectedId;
        return (
          <Tabs.Trigger
            key={f.id}
            value={f.id}
            className={`group relative isolate flex min-h-[8.5rem] flex-col justify-between overflow-hidden rounded-2xl border p-4 text-left outline-none transition-colors duration-300 focus-visible:border-accent ${
              active
                ? "border-accent/70 text-chalk"
                : "border-line bg-panel text-ash hover:border-line-bright hover:text-chalk"
            }`}
          >
            {active && (
              <motion.span
                layoutId="major-switch-fill"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
                className="absolute inset-0 -z-10 bg-accent/[0.10]"
                aria-hidden
              />
            )}
            <span
              aria-hidden
              className={`pointer-events-none absolute -bottom-10 -right-10 -z-10 h-28 w-28 rounded-full blur-2xl transition-colors duration-500 ${
                active ? "bg-accent/25" : "bg-transparent group-hover:bg-accent/10"
              }`}
            />

            <MajorGlyph
              id={f.id}
              active={active}
              className={`h-9 w-9 transition-colors duration-300 ${
                active ? "text-accent" : "text-smoke group-hover:text-ash"
              }`}
            />

            <span className="mt-3 block">
              <span className="block text-[0.9rem] font-semibold leading-tight">
                {f.label}
              </span>
              {profileId === f.id && (
                <span className="micro mt-1 block text-accent">Your major</span>
              )}
            </span>
          </Tabs.Trigger>
        );
      })}
    </Tabs.List>
  );
}
