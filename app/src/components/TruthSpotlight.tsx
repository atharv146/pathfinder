"use client";

import { getMotionLevel } from "@/lib/motion";

import { useEffect, useState } from "react";

/**
 * Cursor-as-torch section: the generic advice everyone already hears sits on
 * top, and dragging the cursor across it burns through to the specific answer
 * underneath.
 *
 * This is the product thesis made physical — PathFinder exists because the
 * surface-level version of this advice is everywhere and the useful version
 * isn't. Worth keeping in mind if the copy is ever edited: the top layer
 * should always be a real thing people are actually told, not a strawman.
 *
 * Falls back to showing only the "truth" layer when there is no fine pointer
 * (touch) or under reduced-motion — a reveal you cannot operate is just
 * hidden content, so the useful half is the half that survives.
 */

const PAIRS = [
  {
    myth: "Just be well-rounded.",
    truth:
      "Depth in one or two things is easier for a reader to see — and far easier for you to write about — than a thin layer of everything.",
  },
  {
    myth: "You need to pay someone to guide you.",
    truth:
      "Almost everything a paid consultant knows is public information. The real barrier is knowing which questions to ask and when — not money.",
  },
  {
    myth: "Financial aid is only for families with nothing.",
    truth:
      "Aid formulas weigh income, household size, and how many siblings are in college at once. Families who assume they won't qualify often do.",
  },
  {
    myth: "You can start thinking about this junior year.",
    truth:
      "Course placement in middle school decides which classes are even available to you by 11th grade. The earliest decisions are the quietest ones.",
  },
];

/**
 * Row layout replaced (Aug 14, 2026): the cursor-torch version masked the
 * answer behind a moving hole, which meant you could never actually *read* a
 * full sentence — you were chasing words with the mouse. Reading is the whole
 * point of this section, so the reveal moved from "mask" to "card flip":
 * hovering (or focusing, or tapping) swaps the myth for the truth, and once
 * swapped the full sentence sits still and legible.
 */
function Pair({
  myth,
  truth,
  index,
  interactive,
}: {
  myth: string;
  truth: string;
  index: number;
  interactive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const active = interactive ? open : true;

  return (
    <button
      type="button"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      aria-expanded={active}
      data-cursor="hover"
      className="group relative block w-full border-t border-line py-8 text-left transition-colors hover:border-accent/50"
    >
      <div className="flex items-start gap-6 sm:gap-10">
        <span className="micro mt-2 shrink-0 text-smoke">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          {/* The myth stays on screen, struck through, so the contrast between
              the two is visible rather than remembered. */}
          <p
            className={`display-md text-2xl leading-tight transition-all duration-500 sm:text-3xl ${
              active ? "text-smoke line-through decoration-accent/70" : "text-chalk"
            }`}
          >
            {myth}
          </p>

          {/* Grid-rows trick: animates height from 0 without needing a fixed
              pixel height, so long answers are never clipped. */}
          <div
            className="grid transition-all duration-500 ease-out"
            style={{
              gridTemplateRows: active ? "1fr" : "0fr",
              opacity: active ? 1 : 0,
            }}
          >
            <div className="overflow-hidden">
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-chalk sm:text-xl">
                {truth}
              </p>
            </div>
          </div>
        </div>

        <span
          className={`micro mt-2 shrink-0 transition-colors ${
            active ? "text-accent" : "text-smoke"
          }`}
        >
          {active ? "—" : "+"}
        </span>
      </div>
    </button>
  );
}

export function TruthSpotlight() {
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    // The torch reveal is driven by pointer position, not by an animation, so
    // it stays available in "calm" — only "still" falls back to plain text.
    const fine = window.matchMedia("(pointer: fine)");
    const decide = () => setInteractive(fine.matches && getMotionLevel() !== "still");
    decide();
    fine.addEventListener("change", decide);
    window.addEventListener("pf-motion-change", decide);
    return () => {
      fine.removeEventListener("change", decide);
      window.removeEventListener("pf-motion-change", decide);
    };
  }, []);

  return (
    <section className="relative border-t border-line px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="micro mb-4 text-smoke">(06) &nbsp;What you were told / what&rsquo;s true</p>
        <h2 className="display mb-4 max-w-2xl text-4xl leading-[1.1] text-chalk sm:text-5xl">
          Most college advice is technically true and practically useless.
        </h2>
        <p className="micro mb-14 text-accent">
          {interactive ? "→ Hover or tap a line to see the real answer" : "→ The specific version"}
        </p>

        <div className="border-b border-line">
          {PAIRS.map((p, i) => (
            <Pair
              key={p.myth}
              index={i}
              myth={p.myth}
              truth={p.truth}
              interactive={interactive}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
