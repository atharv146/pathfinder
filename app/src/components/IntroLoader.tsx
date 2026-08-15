"use client";

import { shouldAnimateAggressively } from "@/lib/motion";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Opening sequence: colour wash → counter → panel wipe.
 *
 * This is the "way the site opens" from the Intrepid reference — the page
 * doesn't just appear, it resolves. The ground cycles through the site's
 * accents while a counter runs, then four panels wipe upward in sequence to
 * reveal the page underneath.
 *
 * Shown once per tab (sessionStorage). An intro that replays on every
 * navigation stops being an entrance and starts being a toll booth.
 *
 * Critically: this overlay is rendered *on top of* a fully-built page, never
 * as a gate in front of an empty one. If the animation fails, the timeline
 * onComplete still fires the unmount, and a hard failsafe removes it after
 * 4.5s regardless — the page is never left behind a stuck curtain.
 */
export function IntroLoader() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  const [shouldRun] = useState(() => {
    if (typeof window === "undefined") return false;
    if (!shouldAnimateAggressively()) return false;
    return sessionStorage.getItem("pf-intro") !== "1";
  });

  useGSAP(
    () => {
      if (!shouldRun) {
        setDone(true);
        return;
      }
      sessionStorage.setItem("pf-intro", "1");
      document.body.style.overflow = "hidden";

      const finish = () => {
        document.body.style.overflow = "";
        setDone(true);
      };

      const failsafe = window.setTimeout(finish, 8500);

      const counter = { n: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          window.clearTimeout(failsafe);
          finish();
        },
      });

      // Longer, three-act opening. The brief was "immersive, like a spaceship
      // approach — cinematic but not flashy", so the motion is one continuous
      // push forward rather than a series of separate effects:
      //
      //   1. arrival  — rings rush past the camera and the counter spins up
      //   2. lock-on  — rings settle into a single aperture, wordmark resolves
      //   3. entry    — the whole field scales *through* the viewer and the
      //                 panels clear, so the page is revealed from inside it
      //
      // The scale-through is what sells the depth: pushing past z rather than
      // fading out reads as travelling into the page.
      tl.fromTo(
        ".intro-ring",
        { scale: 0.05, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 2.1,
          ease: "power2.out",
          stagger: 0.16,
        },
        0
      )
        .to(counter, {
          n: 100,
          duration: 2.6,
          ease: "power1.inOut",
          onUpdate: () => {
            if (countRef.current)
              countRef.current.textContent = String(Math.round(counter.n)).padStart(3, "0");
          },
        }, 0)
        .to(".intro-ring", { rotate: 180, duration: 3.4, ease: "none" }, 0)

        // Ground cycles through the site's four route accents.
        .to(".intro-wash", { backgroundColor: "#d4ff4f", duration: 0.7, ease: "power1.inOut" }, 0.4)
        .to(".intro-wash", { backgroundColor: "#ff7a4d", duration: 0.7 }, 1.2)
        .to(".intro-wash", { backgroundColor: "#b18cff", duration: 0.7 }, 2.0)
        .to(".intro-wash", { backgroundColor: "#000000", duration: 0.8 }, 2.8)

        .fromTo(
          ".intro-word",
          { scale: 0.86, opacity: 0, filter: "blur(14px)" },
          { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.3, ease: "expo.out" },
          1.5
        )

        // Act 3: travel through.
        .to(".intro-ring", { scale: 7, opacity: 0, duration: 1.5, ease: "power3.in" }, 3.3)
        .to(
          ".intro-word",
          { scale: 2.4, opacity: 0, filter: "blur(10px)", duration: 1.2, ease: "power3.in" },
          3.5
        )
        .to(
          ".intro-panel",
          { yPercent: -100, duration: 1.05, ease: "expo.inOut", stagger: 0.09 },
          4.1
        );

      return () => {
        window.clearTimeout(failsafe);
        document.body.style.overflow = "";
      };
    },
    { scope: root, dependencies: [shouldRun] }
  );

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[10000]" aria-hidden>
      <div className="intro-wash absolute inset-0 bg-[#7fd4c6]" />

      {/* Concentric rings that rush the camera. Pure CSS circles — no WebGL,
          so the opening can never be the thing that fails to load. */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="intro-ring absolute rounded-full border border-white/25 mix-blend-overlay"
            style={{ width: `${18 + i * 15}rem`, height: `${18 + i * 15}rem` }}
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

      {/* Wipe panels sit above the wash and clear upward in sequence. */}
      <div className="absolute inset-0 flex">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="intro-panel h-full flex-1 bg-ink" />
        ))}
      </div>
    </div>
  );
}
