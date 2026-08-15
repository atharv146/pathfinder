"use client";

import { shouldAnimateAggressively, getMotionLevel } from "@/lib/motion";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Two-part cursor: a hard dot that tracks the pointer exactly, and a lagging
 * ring that springs behind it and expands over interactive targets.
 *
 * Only mounts for real mouse users — a fine-pointer media query check, not a
 * user-agent sniff. On touch devices there is no cursor to replace and the
 * lagging ring would just be a stray artifact.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const ringX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.55 });
  const ringY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.55 });

  useEffect(() => {
    // Pointer-following is an interaction, not decoration, so it survives
    // "calm" — only "still" removes it.
    const fine = window.matchMedia("(pointer: fine)");
    const decide = () => setEnabled(fine.matches && getMotionLevel() !== "still");
    decide();
    fine.addEventListener("change", decide);
    window.addEventListener("pf-motion-change", decide);
    return () => {
      fine.removeEventListener("change", decide);
      window.removeEventListener("pf-motion-change", decide);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const el = e.target as Element | null;
      setHovering(
        !!el?.closest?.("a, button, [role='button'], input, textarea, select, [data-cursor='hover']")
      );
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-chalk mix-blend-difference"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border border-chalk/50 mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hovering ? 46 : 26,
          height: hovering ? 46 : 26,
          opacity: visible ? (hovering ? 0.9 : 0.45) : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      />
    </>
  );
}
