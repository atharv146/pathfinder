"use client";

import { shouldAnimateAggressively } from "@/lib/motion";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, EASE_EXPO } from "@/lib/gsap";

type SplitRevealProps = {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "div";
  className?: string;
  delay?: number;
  stagger?: number;
  /** Play as soon as it mounts rather than waiting to be scrolled into view. */
  immediate?: boolean;
};

/**
 * Line-by-line masked reveal using GSAP SplitText.
 *
 * Two details that are easy to get wrong and were deliberate here:
 *
 *  1. Splitting BEFORE webfonts load measures line breaks against the fallback
 *     face, so lines re-wrap after the split and the masks end up in the wrong
 *     places. `document.fonts.ready` is awaited first.
 *  2. `mask: "lines"` (GSAP 3.13+) generates the overflow-hidden wrapper per
 *     line, so we don't hand-roll clip wrappers — but a masked wrapper still
 *     slices descenders (p, g, y), so each line gets a little bottom padding
 *     cancelled by an equal negative margin. Same bug class that bit the
 *     earlier hand-built RevealText.
 *
 * Under prefers-reduced-motion nothing is split or animated — the text just
 * renders, which is also the safest failure mode if SplitText ever throws.
 */
export function SplitReveal({
  children,
  as: Tag = "p",
  className = "",
  delay = 0,
  stagger = 0.09,
  immediate = false,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!shouldAnimateAggressively()) return;

      let split: InstanceType<typeof SplitText> | null = null;
      let cancelled = false;

      // Hide until the split is ready so there is no flash of unmasked text.
      gsap.set(el, { autoAlpha: 0 });

      // Safety net. This project has already shipped a bug once where headings
      // stayed permanently invisible because the reveal never fired, so text
      // is force-shown if the split hasn't happened in time — a missed
      // animation is recoverable, unreadable content is not.
      // The failsafe must undo the SPLIT, not just the container opacity.
      // Restoring `autoAlpha` alone left every line still translated 108%
      // inside its overflow-hidden mask — the element was "visible" while the
      // text itself remained clipped out of view. Reverting the split puts the
      // original markup back, which is the only state guaranteed readable.
      const failsafe = window.setTimeout(() => {
        if (cancelled || !ref.current) return;
        split?.revert();
        split = null;
        gsap.set(ref.current, { autoAlpha: 1, clearProps: "transform" });
      }, 1500);

      document.fonts.ready.then(() => {
        if (cancelled || !ref.current) return;

        split = new SplitText(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
        });

        gsap.set(el, { autoAlpha: 1 });

        gsap.from(split.lines, {
          yPercent: 108,
          duration: 1.05,
          ease: EASE_EXPO,
          delay,
          stagger,
          scrollTrigger: immediate
            ? undefined
            : { trigger: el, start: "top 88%", once: true },
        });
      });

      return () => {
        cancelled = true;
        window.clearTimeout(failsafe);
        split?.revert();
      };
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref as React.RefObject<never>} className={className}>
      {children}
    </Tag>
  );
}
