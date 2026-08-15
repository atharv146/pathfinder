"use client";

import { useEffect, useState } from "react";
import {
  getMotionLevel,
  setMotionLevel,
  hasExplicitChoice,
  isOsReduced,
  type MotionLevel,
} from "@/lib/motion";

/**
 * Motion control + first-run notice.
 *
 * The notice only appears when the OS is asking for reduced motion AND the
 * user hasn't chosen for themselves — i.e. exactly the case where the site
 * would otherwise silently look dead and the visitor would have no idea why.
 * It says what's happening and offers the fix inline, rather than leaving
 * someone to conclude the site is just static.
 *
 * Changing level reloads: several surfaces (Lenis, the R3F canvases, GSAP
 * ScrollTriggers) decide their behaviour at mount, and a reload is far more
 * reliable than trying to hot-swap every one of them.
 */
export function MotionToggle() {
  const [level, setLevel] = useState<MotionLevel>("calm");
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    setLevel(getMotionLevel());
    setShowNotice(isOsReduced() && !hasExplicitChoice());
  }, []);

  const choose = (next: MotionLevel) => {
    setMotionLevel(next);
    window.location.reload();
  };

  return (
    <>
      {showNotice && (
        <div className="fixed inset-x-0 bottom-0 z-[9995] flex justify-center px-4 pb-4">
          <div className="edge-glow flex max-w-2xl flex-wrap items-center gap-x-4 gap-y-2 rounded-lg bg-panel/95 px-5 py-4 backdrop-blur">
            <p className="text-[0.85rem] leading-snug text-ash">
              Your system has <span className="text-chalk">Reduce Motion</span> turned on, so
              the 3D and animation on this site are switched off.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => choose("full")}
                className="rounded-full bg-chalk px-4 py-2 text-[0.8rem] font-semibold text-ink transition-colors hover:bg-white"
              >
                Turn animation on
              </button>
              <button
                type="button"
                onClick={() => choose("calm")}
                className="rounded-full border border-line-bright px-4 py-2 text-[0.8rem] text-ash transition-colors hover:text-chalk"
              >
                Keep it calm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 left-4 z-[9994] hidden items-center gap-1 rounded-full border border-line-bright/70 bg-panel/80 p-1 backdrop-blur sm:flex">
        {(["full", "calm", "still"] as MotionLevel[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => choose(l)}
            aria-pressed={level === l}
            className={`micro rounded-full px-3 py-1.5 transition-colors ${
              level === l ? "bg-chalk text-ink" : "text-smoke hover:text-chalk"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </>
  );
}
