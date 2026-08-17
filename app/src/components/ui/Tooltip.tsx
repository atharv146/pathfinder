"use client";

import * as RadixTooltip from "@radix-ui/react-tooltip";

/**
 * House-styled wrapper over Radix Tooltip.
 *
 * First use of Radix in the project (Aug 16, 2026) — picked for the same
 * reason Tabs was: it's a headless behaviour primitive with zero visual
 * opinion, so it slots into the existing look instead of fighting it, and it
 * gets positioning-collision handling, focus/hover/touch triggering, and
 * escape-to-dismiss for free instead of hand-rolled.
 *
 * Each call wraps its own `Provider` rather than relying on one hoisted to
 * the root layout. Radix explicitly supports nested/multiple providers, and
 * scoping it here keeps this component self-contained while Tooltip usage is
 * limited to /major. If a second page starts using this, hoist one
 * `RadixTooltip.Provider` into `layout.tsx` instead so delay durations stay
 * consistent app-wide.
 *
 * Pure CSS animation, not GSAP/framer — Radix's data-state attributes drive a
 * plain CSS transition, so there's no rAF dependency and nothing for the
 * `.swap-in`-style frozen-tab failure mode to catch.
 */
export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <RadixTooltip.Provider delayDuration={250}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            sideOffset={8}
            className="z-50 max-w-[15rem] rounded-md border border-line-bright bg-panel-2 px-3 py-2 text-[0.78rem] leading-relaxed text-ash shadow-lg data-[state=delayed-open]:animate-[tooltip-in_0.15s_ease-out]"
          >
            {label}
            <RadixTooltip.Arrow className="fill-panel-2" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
