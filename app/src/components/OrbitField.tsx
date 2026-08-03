"use client";

import { motion } from "framer-motion";

/**
 * Hairline orbital system, drawn from the DOSS ARP reference: thin ellipses
 * on a true-black ground, rotating very slowly, with small labelled nodes
 * riding them. Replaces the earlier blurred-gradient / dot-blob treatment,
 * which read as a generic AI hero rather than a designed graphic.
 *
 * Purely decorative: aria-hidden, pointer-events none, and rendered behind a
 * mask so it never competes with headline type.
 */
export function OrbitField({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 600 600" className="h-full w-full" fill="none">
        {/* Orbits */}
        <g className="spin-slow" style={{ transformOrigin: "300px 300px" }}>
          <ellipse
            cx="300"
            cy="300"
            rx="230"
            ry="96"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="0.75"
          />
        </g>
        <g className="spin-slow-reverse" style={{ transformOrigin: "300px 300px" }}>
          <ellipse
            cx="300"
            cy="300"
            rx="96"
            ry="230"
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="0.75"
          />
        </g>
        <g className="spin-slow" style={{ transformOrigin: "300px 300px", animationDuration: "78s" }}>
          <ellipse
            cx="300"
            cy="300"
            rx="185"
            ry="185"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.75"
          />
        </g>

        {/* Nodes riding the orbits */}
        <motion.circle
          cx="300"
          cy="115"
          r="4.5"
          fill="var(--color-ink)"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="0.9"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        />
        <motion.circle
          cx="118"
          cy="300"
          r="3"
          fill="var(--color-signal)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="482"
          cy="300"
          r="2.5"
          fill="rgba(255,255,255,0.6)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
        />

        {/* Centre mark — a small wireframe cube echoing the DOSS core object */}
        <g stroke="rgba(255,255,255,0.3)" strokeWidth="0.8">
          <path d="M268 288 L300 272 L332 288 L300 304 Z" />
          <path d="M268 288 L268 322 L300 338 L300 304" />
          <path d="M332 288 L332 322 L300 338" />
        </g>
      </svg>
    </div>
  );
}
