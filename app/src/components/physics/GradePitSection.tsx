"use client";

import { shouldRender3D } from "@/lib/motion";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";

const GradePit = dynamic(() => import("./GradePit"), { ssr: false });

/**
 * Section wrapper for the physics pit.
 *
 * Same progressive-enhancement contract as the 3D hero: the WebGL + physics
 * bundle is the heaviest thing on the site, so it is only fetched once we know
 * the device can take it, and the fallback is a real, useful grade index
 * rather than an empty box.
 */
function useCanRender3D() {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    // Physics is interactive, not ambient — it stays available in "calm".
    if (!shouldRender3D()) {
      setOk(false);
      return;
    }
    const nav = navigator as Navigator & { deviceMemory?: number };
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return setOk(false);
    if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4)
      return setOk(false);
    try {
      const c = document.createElement("canvas");
      setOk(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setOk(false);
    }
  }, []);

  return ok;
}

const GRADES = [6, 7, 8, 9, 10, 11, 12];

export function GradePitSection() {
  const can3D = useCanRender3D();
  const [shake, setShake] = useState(0);

  return (
    <section className="relative overflow-hidden border-t border-line px-6 py-24 sm:px-10">
      <div className="aurora" aria-hidden />

      <div className="relative mx-auto max-w-5xl">
        <p className="micro mb-4 text-smoke">(08) &nbsp;Seven years, one pile</p>
        <h2 className="display mb-4 max-w-2xl text-4xl leading-[1.1] text-chalk sm:text-5xl">
          None of these years are <span className="glow-ember italic">separate races</span>.
        </h2>
        <p className="mb-10 max-w-md text-[0.95rem] leading-relaxed text-ash">
          {can3D
            ? "Push them around. Nothing here breaks — which is roughly the point."
            : "Every grade builds on the one before it."}
        </p>

        {can3D ? (
          <div className="relative">
            <div className="edge-glow h-[26rem] overflow-hidden rounded-xl bg-ink-2/60 sm:h-[32rem]">
              <GradePit shake={shake} />
            </div>
            <button
              type="button"
              onClick={() => setShake((s) => s + 1)}
              className="edge-glow absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-panel/90 px-6 py-3 text-sm text-chalk backdrop-blur transition-colors hover:bg-panel-2"
            >
              Throw them again
            </button>
          </div>
        ) : (
          // Static floor: the same seven grades, still navigable.
          <div className="grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:grid-cols-4">
            {GRADES.map((g) => (
              <Link
                key={g}
                href={`/roadmap/${g}`}
                className="group bg-ink-2 p-6 transition-colors hover:bg-panel"
              >
                <span className="micro text-smoke">Grade</span>
                <span className="display mt-2 block text-4xl text-chalk transition-colors group-hover:text-signal">
                  {g}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
