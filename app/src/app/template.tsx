"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { shouldAnimateAggressively } from "@/lib/motion";

/**
 * Per-navigation transition.
 *
 * `template.tsx` (not `layout.tsx`) is the right file for this in the App
 * Router: a layout persists across navigations, while a template remounts on
 * every route change, which is exactly the lifecycle a transition needs.
 *
 * A wipe panel sweeps up and off while the incoming page rises into place.
 * Nothing is hidden in the markup — the panel starts covering the viewport and
 * animates away, so if the animation never runs the page is simply visible,
 * and the failsafe removes the panel regardless.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  // Every navigation should start at the top; a smooth-scroll library will
  // otherwise happily keep your old offset on the new page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useGSAP(() => {
    if (!shouldAnimateAggressively()) {
      gsap.set(panel.current, { display: "none" });
      return;
    }

    const tl = gsap.timeline();
    tl.set(panel.current, { yPercent: 0, display: "block" })
      .fromTo(
        content.current,
        { y: 26, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out" },
        0.12
      )
      .to(
        panel.current,
        {
          yPercent: -100,
          duration: 0.75,
          ease: "expo.inOut",
          onComplete: () => gsap.set(panel.current, { display: "none" }),
        },
        0
      );

    const failsafe = window.setTimeout(() => {
      gsap.set(panel.current, { display: "none" });
      gsap.set(content.current, { autoAlpha: 1, y: 0 });
    }, 2000);

    return () => window.clearTimeout(failsafe);
  }, []);

  return (
    <>
      <div
        ref={panel}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9990] hidden bg-ink"
      />
      <div ref={content}>{children}</div>
    </>
  );
}
