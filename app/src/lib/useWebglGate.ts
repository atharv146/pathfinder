"use client";

import { useSyncExternalStore } from "react";
import { shouldRender3D, shouldRenderAmbient3D } from "@/lib/motion";

/**
 * "May this surface render WebGL right now?" — the one answer, in one place.
 *
 * ── WHY THIS EXISTS ───────────────────────────────────────────────────────
 * Four components (Backdrop, ShapeField, ClosingWire, LightWire) each carried
 * a byte-identical copy of this: an effect that checks the motion level, then
 * creates a throwaway canvas to probe for a WebGL context, then setStates the
 * result. Four copies of a capability check is four places for the gate to
 * drift — and this project has already learned once, expensively, what happens
 * when a motion gate is wrong (see the reduced-motion incident in CLAUDE.md).
 *
 * ── WHY useSyncExternalStore RATHER THAN useEffect ────────────────────────
 * The motion level is external state that lives in localStorage and an OS
 * media query, and it can change while the page is open (the MotionToggle
 * fires `pf-motion-change`). That is precisely what this hook is for. Reading
 * it in an effect meant a guaranteed second render on every mount, which is
 * what `react-hooks/set-state-in-effect` was flagging — correctly.
 *
 * ── THE WEBGL PROBE ───────────────────────────────────────────────────────
 * Cached at module scope after the first call. Creating a context is the only
 * honest capability test (see the note in Backdrop about Brave reporting fake
 * `deviceMemory`/`hardwareConcurrency` values), but the answer cannot change
 * within a session, so probing once and reusing keeps `getSnapshot` cheap and
 * stable — which `useSyncExternalStore` requires.
 */

let webglProbe: boolean | null = null;

function canUseWebgl(): boolean {
  if (webglProbe !== null) return webglProbe;
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    webglProbe = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    webglProbe = false;
  }
  return webglProbe;
}

/**
 * Re-runs the snapshot whenever the user changes motion level, or the OS
 * preference changes underneath us.
 */
function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const width = window.matchMedia("(min-width: 640px)");

  window.addEventListener("pf-motion-change", onChange);
  media.addEventListener("change", onChange);
  width.addEventListener("change", onChange);

  return () => {
    window.removeEventListener("pf-motion-change", onChange);
    media.removeEventListener("change", onChange);
    width.removeEventListener("change", onChange);
  };
}

/**
 * @param scope `"ambient"` for decorative backdrops, which are additionally
 * skipped on phone-width screens; `"content"` for 3D that carries meaning
 * (the hero, the deadline clock) and survives on any screen the motion level
 * allows.
 *
 * Always false during SSR and on the first client snapshot before hydration,
 * so the markup the server produced and the markup the client produces agree.
 */
export function useWebglAllowed(scope: "ambient" | "content" = "ambient"): boolean {
  return useSyncExternalStore(
    subscribe,
    () => {
      const motionOk = scope === "ambient" ? shouldRenderAmbient3D() : shouldRender3D();
      return motionOk && canUseWebgl();
    },
    // Server snapshot: never render WebGL in HTML that has no browser behind it.
    () => false
  );
}
