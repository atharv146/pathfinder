"use client";

import { shouldRender3D } from "@/lib/motion";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { BackdropVariant } from "./SceneBackdrop";

const SceneBackdrop = dynamic(() => import("./SceneBackdrop"), { ssr: false });

const ACCENT_HEX: Record<string, string> = {
  teal: "#7fd4c6",
  lime: "#d4ff4f",
  coral: "#ff7a4d",
  violet: "#b18cff",
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
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    // 3D survives "calm" — only "still" drops to the CSS aurora.
    if (!shouldRender3D()) return setOk(false);

    // deviceMemory/hardwareConcurrency gate removed — Brave and other
    // privacy-hardening browsers report capped, fake values for these
    // (commonly 2 and 4) to resist fingerprinting, which was silently
    // disabling WebGL for every such user regardless of real hardware.
    // WebGL context creation below is the real, unspoofed capability test.
    try {
      const c = document.createElement("canvas");
      setOk(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setOk(false);
    }
  }, []);

  if (ok !== true) return <div className={`aurora-accent ${className}`} aria-hidden data-decor />;

  return (
    <div className={`pointer-events-none absolute inset-0 opacity-70 ${className}`} data-decor aria-hidden>
      <SceneBackdrop variant={variant} color={ACCENT_HEX[accent] ?? "#7fd4c6"} />
    </div>
  );
}
