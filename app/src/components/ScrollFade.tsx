"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Ties opacity (and a slight rise/fall) directly to scroll progress through
 * the element, so content fades in AND back out as you pass it — distinct
 * from RevealText/FadeIn, which reveal once and stay. Meant for one or two
 * real "moment" beats per page, not every heading.
 */
export function ScrollFade({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "center 55%", "end 15%"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [28, 0, -28]);

  return (
    <motion.div ref={ref} className={className} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}
