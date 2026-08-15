"use client";

import { shouldAnimateAggressively } from "@/lib/motion";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Words that *arrive* rather than fade in — overshoot easing, a little
 * rotation, staggered per word.
 *
 * `back.out` is the whole point: it carries each word slightly past its
 * resting position and settles back, which is what reads as "bouncing into
 * frame" instead of "appearing". Kept to ~1.4 overshoot; higher starts to feel
 * cartoonish against serif display type.
 *
 * Same failsafe contract as the rest of the site: nothing is hidden in the
 * markup, the hide happens at runtime, and a timeout force-reveals if the
 * split or trigger never fires.
 */
export function KineticText({
  children,
  as: Tag = "h2",
  className = "",
  delay = 0,
  immediate = false,
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!shouldAnimateAggressively()) return;

      let split: InstanceType<typeof SplitText> | null = null;
      let cancelled = false;

      gsap.set(el, { autoAlpha: 0 });
      // Revert the split, not just the opacity — otherwise words stay
      // translated inside their masks and the heading reads as blank/clipped
      // even though the element is technically visible.
      const failsafe = window.setTimeout(() => {
        if (cancelled || !ref.current) return;
        split?.revert();
        split = null;
        gsap.set(ref.current, { autoAlpha: 1, clearProps: "transform" });
      }, 1600);

      document.fonts.ready.then(() => {
        if (cancelled || !ref.current) return;

        split = new SplitText(el, { type: "words,lines", mask: "lines" });
        gsap.set(el, { autoAlpha: 1 });

        gsap.from(split.words, {
          yPercent: 120,
          rotate: 5,
          opacity: 0,
          duration: 1,
          ease: "back.out(1.4)",
          stagger: 0.045,
          delay,
          scrollTrigger: immediate
            ? undefined
            : { trigger: el, start: "top 88%", once: true },
          onComplete: () => window.clearTimeout(failsafe),
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
