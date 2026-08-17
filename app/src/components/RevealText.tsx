"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type RevealTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
};

/**
 * Word-by-word rise-in reveal.
 *
 * Two failure modes this is explicitly built to survive, both of which
 * previously left the headline stuck invisible (opacity 0, translated down,
 * clipped by the overflow-hidden wrapper):
 *
 *  1. Framer variant propagation breaking when a `transition` prop on the
 *     parent silently overrides the container variant's transition. Fixed by
 *     not using variant propagation at all — each word owns its animation.
 *  2. IntersectionObserver never firing (page not compositing, odd embed
 *     contexts, some headless/preview panes). Fixed with a timed fallback
 *     that force-reveals regardless, so text can never be permanently
 *     invisible just because a scroll observer didn't report.
 *
 * The clip wrapper carries padding-bottom (cancelled by an equal negative
 * margin) so descenders — p, g, y, j — are never sliced once settled.
 */
export function RevealText({ text, as = "p", className = "", delay = 0 }: RevealTextProps) {
  const words = text.split(" ");
  const Tag = motion[as];

  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [forceShow, setForceShow] = useState(false);
  const [snap, setSnap] = useState(false);

  useEffect(() => {
    // Safety net: if the observer hasn't reported by now, show the text anyway.
    const t = setTimeout(() => setForceShow(true), 1200);
    // Second, later net for a different failure: the observer DID report, but
    // the animation isn't progressing — a starved or throttled rAF loop, which
    // is a real state on a slow machine or a tab that loaded in the
    // background. The reveal is only ~1s when healthy, so by 2s anything still
    // sitting at y:105% is stuck, and stuck means invisible text. From here the
    // words are placed with no duration, so a single granted frame is enough.
    const s = setTimeout(() => setSnap(true), 2000);
    return () => {
      clearTimeout(t);
      clearTimeout(s);
    };
  }, []);

  const show = inView || forceShow || snap;

  return (
    <Tag ref={ref as never} className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "top",
            marginRight: i < words.length - 1 ? "0.27em" : 0,
            paddingBottom: "0.18em",
            marginBottom: "-0.18em",
          }}
        >
          <motion.span
            style={{ display: "inline-block", willChange: "transform" }}
            initial={{ y: "105%", opacity: 0 }}
            animate={show ? { y: "0%", opacity: 1 } : { y: "105%", opacity: 0 }}
            transition={
              // If the reveal is firing from the TIMEOUT rather than the
              // observer, something already went wrong — the observer never
              // reported. Snap the words in with no duration or stagger
              // instead of running a 0.65s animation that needs a healthy
              // rAF loop to finish. One granted frame is then enough to make
              // the text readable, which is the whole point of the failsafe.
              snap || (forceShow && !inView)
                ? { duration: 0 }
                : {
                    duration: 0.65,
                    delay: delay + i * 0.045,
                    ease: [0.16, 1, 0.3, 1],
                  }
            }
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
