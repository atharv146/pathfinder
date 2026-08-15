"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Hairline read-progress bar pinned to the top of the viewport.
 *
 * Springed rather than bound directly to scrollYProgress so it glides with the
 * Lenis inertia instead of stepping ahead of it.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 34,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[9997] h-px origin-left bg-gradient-to-r from-signal/70 via-chalk/60 to-transparent"
    />
  );
}
