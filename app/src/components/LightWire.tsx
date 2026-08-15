"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { shouldRender3D } from "@/lib/motion";

const WireCage = dynamic(() => import("./backdrop/WireCage"), { ssr: false });

/**
 * The morphing wire cage again, but tuned for a light ground: dark strokes,
 * pushed to one side so it frames the copy rather than sitting behind it.
 *
 * Reusing the same form on both the light and dark sections is deliberate —
 * it's the site's recurring object, the way Intrepid reuses its printer
 * silhouette in render, wireframe and line-art form.
 */
export function LightWire() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!shouldRender3D()) return;
    try {
      const c = document.createElement("canvas");
      setOn(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setOn(false);
    }
  }, []);

  if (!on) return null;

  // Full-bleed rather than parked off the right edge. The previous version put
  // the whole form in the right margin, which read as a stray object rather
  // than part of the composition — the section looked lopsided and empty on
  // the left. Spanning the section lets the copy sit *inside* the geometry.
  return (
    <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden data-decor>
      <WireCage color="#1a2119" />
    </div>
  );
}
