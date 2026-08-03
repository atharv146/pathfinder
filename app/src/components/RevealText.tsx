"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.02 },
  },
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.6em" },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

type RevealTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
};

/**
 * Splits text into words that fade/slide up in a stagger as the element
 * enters the viewport.
 *
 * Spacing note: the gap between words is a real `margin-right`, not a
 * literal space character inside the overflow-hidden wrapper — a plain
 * trailing space there gets trimmed when the browser computes the
 * inline-block's shrink-to-fit width, which is what caused words to
 * visually run together. Margin can't be collapsed away like that.
 */
export function RevealText({ text, as = "p", className = "", delay = 0 }: RevealTextProps) {
  const words = text.split(" ");
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      transition={{ delayChildren: delay }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "top",
            marginRight: i < words.length - 1 ? "0.27em" : 0,
          }}
        >
          <motion.span variants={word} style={{ display: "inline-block" }}>
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
