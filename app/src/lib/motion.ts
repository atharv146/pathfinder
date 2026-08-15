"use client";

/**
 * Single source of truth for "should this device animate?".
 *
 * WHY THIS EXISTS: every animated surface previously called
 * `matchMedia("(prefers-reduced-motion: reduce)")` directly. The user's own
 * machine has macOS "Reduce Motion" enabled, so every 3D scene, physics
 * simulation and scroll reveal on the site was being correctly — and
 * invisibly — switched off for them. They spent several rounds looking at
 * static fallbacks and reasonably concluded nothing had been built.
 *
 * The lesson: respecting reduced-motion must not mean "ship a dead page".
 * So there are now three levels rather than a boolean kill switch:
 *
 *   full    — everything: 3D, physics, scroll-scrub, overshoot easing
 *   calm    — 3D still renders and drifts slowly; no bounce, no scrub, no
 *             parallax, no scroll hijack. This is the honest reading of
 *             "reduce motion", not "remove motion".
 *   still   — no animation at all
 *
 * OS reduced-motion maps to `calm`, never to `still`, and an explicit user
 * choice always wins over the OS. Stored in localStorage so it survives
 * navigation.
 */

export type MotionLevel = "full" | "calm" | "still";

const KEY = "pf-motion";

export function getMotionLevel(): MotionLevel {
  if (typeof window === "undefined") return "calm";

  const stored = window.localStorage.getItem(KEY) as MotionLevel | null;
  if (stored === "full" || stored === "calm" || stored === "still") return stored;

  // `?force3d` remains a QA escape hatch for headless/preview browsers, which
  // report reduced-motion regardless of any real user preference.
  if (
    typeof window.location !== "undefined" &&
    new URLSearchParams(window.location.search).has("force3d")
  ) {
    return "full";
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "calm" : "full";
}

export function setMotionLevel(level: MotionLevel) {
  window.localStorage.setItem(KEY, level);
  window.dispatchEvent(new CustomEvent("pf-motion-change"));
}

/** Has the user explicitly chosen, or are we following the OS? */
export function hasExplicitChoice() {
  if (typeof window === "undefined") return false;
  return !!window.localStorage.getItem(KEY);
}

/** True when the OS asked for reduced motion and the user hasn't overridden. */
export function isOsReduced() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** 3D geometry renders at `full` and `calm` — only `still` removes it. */
export function shouldRender3D() {
  return getMotionLevel() !== "still";
}

/**
 * Ambient/decorative WebGL is skipped on phones.
 *
 * Several of these canvases can be alive at once, each running its own rAF
 * loop, and on a mid-range phone that shows up as scroll jank — reported
 * directly as "mobile feels laggy". Desktop keeps everything. This is only for
 * *decoration*; content-carrying 3D (the hero, the deadline clock) still
 * renders, just dimmed and smaller.
 *
 * Uses a width check rather than a UA sniff, so a narrow desktop window gets
 * the same benefit.
 */
export function shouldRenderAmbient3D() {
  if (typeof window === "undefined") return false;
  if (!shouldRender3D()) return false;
  return window.matchMedia("(min-width: 640px)").matches;
}

/** Bounce, scrub, parallax and scroll hijack are `full`-only. */
export function shouldAnimateAggressively() {
  return getMotionLevel() === "full";
}
