"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { shouldRenderAmbient3D } from "@/lib/motion";

const FloatingShapes = dynamic(() => import("./FloatingShapes"), { ssr: false });

/**
 * Drop-in ambient shape field for sections that would otherwise be flat empty
 * space. Same progressive-enhancement contract as every other WebGL surface
 * here: gated, lazy, and it simply renders nothing rather than a broken box if
 * the device can't take it.
 */
export function ShapeField({ color }: { color?: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!shouldRenderAmbient3D()) return;
    try {
      const c = document.createElement("canvas");
      setOn(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setOn(false);
    }
  }, []);

  if (!on) return null;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden data-decor>
      <FloatingShapes color={color} />
    </div>
  );
}
