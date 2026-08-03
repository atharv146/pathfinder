"use client";

import { motion } from "framer-motion";

/**
 * A single sweeping line across the hero — the signature graphic device from
 * the WLT Design reference. Drawn with a stroke-dashoffset reveal on load
 * rather than appearing all at once.
 */
export function ArcLine({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 400"
      className={className}
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
    >
      <motion.path
        d="M -20 320 C 250 320, 320 60, 620 90 S 980 260, 1220 40"
        stroke="url(#arc-gradient)"
        strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      />
      <defs>
        <linearGradient id="arc-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0" />
          <stop offset="30%" stopColor="var(--color-signal)" stopOpacity="0.7" />
          <stop offset="70%" stopColor="var(--color-glow-amber)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--color-glow-ember)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
