"use client";

import dynamic from "next/dynamic";
import type { BackdropVariant } from "./SceneBackdrop";
import { useWebglAllowed } from "@/lib/useWebglGate";

const SceneBackdrop = dynamic(() => import("./SceneBackdrop"), { ssr: false });

const ACCENT_HEX: Record<string, string> = {
  teal: "#7fd4c6",
  lime: "#d4ff4f",
  coral: "#ff7a4d",
  violet: "#b18cff",
  azure: "#5ab8ff",
  rose: "#ff5fa2",
};

/**
 * Capability-gated mount for the per-page 3D background.
 *
 * Shared contract with the other WebGL surfaces on the site: never the
 * baseline, never blocking, and the fallback is the CSS aurora — which already
 * carries the page's accent, so a device that can't run WebGL still gets the
 * page's identity rather than a blank ground.
 */
export function Backdrop({
  variant,
  accent,
  className = "",
}: {
  variant: BackdropVariant;
  accent: keyof typeof ACCENT_HEX;
  className?: string;
}) {
  // The motion gate and the WebGL capability probe both live in
  // useWebglAllowed now — four components carried identical copies of this,
  // which is four places for a capability gate to drift. The reasoning that
  // used to sit here (why deviceMemory/hardwareConcurrency are NOT used —
  // Brave reports capped fake values) moved there with it.
  const ok = useWebglAllowed("ambient");

  if (!ok) return <div className={`aurora-accent ${className}`} aria-hidden data-decor />;

  return (
    <div className={`pointer-events-none absolute inset-0 opacity-70 ${className}`} data-decor aria-hidden>
      <SceneBackdrop variant={variant} color={ACCENT_HEX[accent] ?? "#7fd4c6"} />
    </div>
  );
}
