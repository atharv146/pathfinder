"use client";

import { shouldRender3D } from "@/lib/motion";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { OrbitField } from "@/components/OrbitField";

// WebGL bundle is ~200kb+; keep it out of the initial payload entirely and
// only fetch it once we've decided the device should actually render it.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

/**
 * Decides whether this visitor gets the real 3D hero or the flat SVG one.
 *
 * PathFinder's audience includes families on older/budget phones and metered
 * connections, so the WebGL scene is treated as progressive enhancement, not
 * the baseline. The SVG `OrbitField` stays the guaranteed floor — it is the
 * same motif, so nobody gets a visibly "broken" or empty hero.
 */
function useCanRender3D() {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    // 3D renders at "full" and "calm"; only "still" falls back to the SVG.
    if (!shouldRender3D()) {
      setOk(false);
      return;
    }

    // Coarse device-capability heuristic. deviceMemory/hardwareConcurrency are
    // not in every browser, so a missing value is treated as "probably fine"
    // rather than excluding capable browsers that just don't report.
    const nav = navigator as Navigator & { deviceMemory?: number };
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) {
      setOk(false);
      return;
    }
    if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4) {
      setOk(false);
      return;
    }

    // Confirm WebGL actually exists before committing to the dynamic import.
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      setOk(!!gl);
    } catch {
      setOk(false);
    }
  }, []);

  return ok;
}

export function HeroVisual({ className = "" }: { className?: string }) {
  const can3D = useCanRender3D();

  // Render the SVG while deciding too, so there is never an empty frame.
  if (can3D !== true) return <OrbitField className={className} />;

  return (
    <div className={className} aria-hidden>
      <HeroScene />
    </div>
  );
}
