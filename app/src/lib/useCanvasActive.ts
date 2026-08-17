"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Pause a WebGL canvas whenever it can't be seen.
 *
 * WHY (Aug 17, 2026): the user reported the site feeling laggy "even on my
 * type of laptop". Several `<Canvas>` elements can be alive on one page — the
 * home page carries five — and by default React Three Fiber renders every one
 * of them on every frame regardless of whether it is anywhere near the
 * viewport. Five scenes, each with its own instanced-matrix loop and a
 * post-processing pass, all running to draw pixels nobody is looking at.
 *
 * Feeding the returned `active` flag into R3F's `frameloop` prop
 * (`"always"` / `"never"`) means only the scene actually on screen costs
 * anything, and a backgrounded tab costs nothing at all.
 *
 * Two details worth keeping:
 *  - `rootMargin` starts the loop slightly before the canvas scrolls in, so it
 *    is already moving when it arrives rather than snapping to life.
 *  - `visibilitychange` matters as much as the observer. rAF is throttled in a
 *    hidden tab but a WebGL context still holds GPU memory and can still be
 *    asked to draw; stopping outright is both cheaper and the honest reading
 *    of "the user isn't here".
 */
export function useCanvasActive<T extends HTMLElement>(rootMargin = "300px") {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let onScreen = false;
    const sync = () => setActive(onScreen && !document.hidden);

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin }
    );
    observer.observe(el);

    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [rootMargin]);

  return { ref, active };
}
