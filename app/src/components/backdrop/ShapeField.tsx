"use client";

import dynamic from "next/dynamic";
import { useWebglAllowed } from "@/lib/useWebglGate";

const FloatingShapes = dynamic(() => import("./FloatingShapes"), { ssr: false });

/**
 * Drop-in ambient shape field for sections that would otherwise be flat empty
 * space. Same progressive-enhancement contract as every other WebGL surface
 * here: gated, lazy, and it simply renders nothing rather than a broken box if
 * the device can't take it.
 */
export function ShapeField({ color }: { color?: string }) {
  const on = useWebglAllowed("ambient");

  if (!on) return null;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden data-decor>
      <FloatingShapes color={color} />
    </div>
  );
}
