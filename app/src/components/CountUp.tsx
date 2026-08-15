"use client";

import { shouldAnimateAggressively } from "@/lib/motion";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Counts a figure up when it scrolls into view.
 *
 * Renders the final value in the markup so the real number is present for
 * search engines, screen readers and no-JS — the animation only overwrites
 * textContent once it actually starts. `decimals` keeps "1.5" from settling
 * as "2" or flickering through integer states.
 */
export function CountUp({
  value,
  decimals = 0,
  duration = 1.9,
  className = "",
}: {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!shouldAnimateAggressively()) return;

      const counter = { n: 0 };
      gsap.to(counter, {
        n: value,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => {
          el.textContent = counter.n.toFixed(decimals);
        },
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={className}>
      {value.toFixed(decimals)}
    </span>
  );
}
