"use client";

import { shouldAnimateAggressively } from "@/lib/motion";

import { ReactLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Site-wide inertial smooth scrolling (Lenis), driven by GSAP's ticker.
 *
 * The sync matters: Lenis and ScrollTrigger each want to own a scroll loop,
 * and letting both run independently is the classic source of jittery pinning
 * and reveals that fire at the wrong scroll position. So Lenis' own rAF is
 * disabled (`autoRaf: false`) and GSAP's ticker drives it instead, with
 * ScrollTrigger.update called on every Lenis scroll event.
 *
 * `lagSmoothing(0)` stops GSAP trying to "catch up" after a frame spike,
 * which with a hijacked scroll reads as a lurch.
 */
function LenisRoot({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    // Sync ScrollTrigger to Lenis. Retried on a frame because ReactLenis
    // populates its ref during its own mount and it is not guaranteed to be
    // there when this effect first runs.
    //
    // THIS USED TO DISABLE Lenis' own rAF (`autoRaf: false`) and drive it from
    // the GSAP ticker instead. If the ref wasn't ready, the effect returned
    // early, the ticker was never attached, and Lenis sat there owning the
    // scroll with nothing advancing it — the page became completely
    // unscrollable and the scrollbar vanished. Lenis now runs its own loop, so
    // a missed sync costs at worst slightly stale ScrollTrigger positions
    // instead of breaking scrolling outright.
    let raf = 0;
    let lenis: ReturnType<() => NonNullable<LenisRef["lenis"]>> | undefined;
    const onScroll = () => ScrollTrigger.update();

    const attach = () => {
      lenis = lenisRef.current?.lenis;
      if (!lenis) {
        raf = requestAnimationFrame(attach);
        return;
      }
      lenis.on("scroll", onScroll);
      ScrollTrigger.refresh();
    };
    attach();

    return () => {
      cancelAnimationFrame(raf);
      lenis?.off("scroll", onScroll);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ duration: 1.05, lerp: 0.1, smoothWheel: true }}
    >
      {children}
    </ReactLenis>
  );
}

/**
 * Smooth scroll is opt-out under prefers-reduced-motion. Lenis is not mounted
 * at all in that case rather than being configured around — hijacking the
 * scrollbar is exactly the kind of motion that setting is asking us to skip,
 * and there is no "gentle" version of it.
 *
 * (Lenis' `prevent` option is not the tool for this: it decides whether an
 * individual nested node is excluded from smooth scrolling, not whether the
 * library runs.)
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Scroll hijack is the most intrusive thing on the site, so it stays
    // "full"-only — calm keeps native scrolling.
    const update = () => setEnabled(shouldAnimateAggressively());
    update();
    window.addEventListener("pf-motion-change", update);
    return () => window.removeEventListener("pf-motion-change", update);
  }, []);

  if (!enabled) return <>{children}</>;
  return <LenisRoot>{children}</LenisRoot>;
}
