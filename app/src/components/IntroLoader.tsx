"use client";

import { useEffect, useRef, useState } from "react";
import { shouldAnimateAggressively } from "@/lib/motion";

/**
 * Opening sequence — CSS-driven, deliberately not GSAP.
 *
 * WHY CSS: the GSAP version repeatedly failed to play. GSAP animates off its
 * own ticker, which is rAF-backed and halts whenever the tab isn't being
 * painted (backgrounded, occluded, throttled). The result was an overlay that
 * mounted, never advanced, never fired `onComplete`, and so never unmounted —
 * it just sat there invisibly while the user saw no intro at all. Verified in
 * the real browser: `.intro-wash` was still in the DOM minutes after load.
 *
 * CSS animations are driven by the compositor and are far more robust here,
 * and the unmount is a plain `setTimeout` rather than an animation callback,
 * so the curtain lifts on a wall clock no matter what the renderer is doing.
 *
 * Three acts over ~4.6s:
 *   1. rings rush the camera while the counter spins up
 *   2. wordmark resolves out of blur
 *   3. everything scales *through* the viewer and the panels clear
 */

const TOTAL_MS = 4600;

export function IntroLoader() {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!shouldAnimateAggressively()) {
      setPhase("done");
      return;
    }

    setPhase("running");

    // NOTE: body scroll is deliberately NOT locked. An earlier version set
    // `overflow: hidden` for the duration, which meant any failure to unmount
    // left the entire page unscrollable. The overlay covers the viewport
    // anyway, so the lock bought nothing and risked everything.
    const started = Date.now();

    let n = 0;
    const tick = window.setInterval(() => {
      n = Math.min(n + 2, 100);
      if (countRef.current) countRef.current.textContent = String(n).padStart(3, "0");
    }, TOTAL_MS / 2 / 50);

    // Wall-clock, not elapsed-timer. Background tabs get their timers heavily
    // throttled by the browser, so a plain setTimeout can fire far too late —
    // measured here as the overlay still being mounted 6s into a 4.6s intro.
    // Comparing real timestamps means the sequence self-corrects, and the
    // visibility listener finishes it the instant the user comes back.
    const finishIfElapsed = () => {
      if (Date.now() - started >= TOTAL_MS) setPhase("done");
    };
    const poll = window.setInterval(finishIfElapsed, 250);
    document.addEventListener("visibilitychange", finishIfElapsed);

    return () => {
      window.clearInterval(tick);
      window.clearInterval(poll);
      document.removeEventListener("visibilitychange", finishIfElapsed);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className="intro-root fixed inset-0 z-[10000]" aria-hidden data-running={phase === "running"}>
      <div className="intro-wash absolute inset-0" />

      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="intro-ring absolute rounded-full border border-white/30"
            style={{
              width: `${16 + i * 14}rem`,
              height: `${16 + i * 14}rem`,
              animationDelay: `${i * 0.13}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="intro-word flex items-baseline gap-5 mix-blend-difference">
          <span className="display text-6xl text-white sm:text-8xl">PathFinder</span>
          <span ref={countRef} className="font-mono text-lg text-white sm:text-2xl">
            000
          </span>
        </div>
      </div>

      <div className="absolute inset-0 flex">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="intro-panel h-full flex-1 bg-ink"
            style={{ animationDelay: `${3.85 + i * 0.09}s` }}
          />
        ))}
      </div>
    </div>
  );
}
