"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { shouldAnimateAggressively } from "@/lib/motion";
import type { LadderTrack } from "@/data/major-pathways";

/**
 * The course sequence, drawn as a chain.
 *
 * WHY A DIAGRAM AND NOT A LIST. The single most useful thing this page can
 * tell a 13-year-old is that these courses are a *chain* — that Algebra 1 in
 * 8th grade and Calculus in 12th are the same decision seen from two ends. A
 * bulleted list of five course names does not communicate that; a connected
 * sequence does, immediately, before any of the text is read.
 *
 * WHAT IT MUST NOT IMPLY. This is not a checklist and not a requirement. A
 * student whose school stops at Algebra 2 has not failed a test — so no step is
 * ever styled as missing, incomplete, or red, there is no progress fill, and
 * the caveat about schools differing is rendered as part of the diagram rather
 * than as fine print underneath it. Same principle as JourneyArc: the visual
 * must not be able to be read as a score.
 *
 * Built from HTML + CSS rather than one big SVG because the labels are real
 * text at real lengths — an SVG would need foreignObject or manual wrapping,
 * and would reflow badly at 375px. The connectors animate; the text never
 * hides, per the standing rule that a missed trigger must never leave content
 * blank.
 */
export function CourseLadder({ tracks }: { tracks: LadderTrack[] }) {
  const [lively, setLively] = useState(false);

  // Read once on mount rather than during render — getMotionLevel() touches
  // localStorage and matchMedia, neither of which exists during SSR.
  useEffect(() => setLively(shouldAnimateAggressively()), []);

  return (
    <div className="flex flex-col gap-10">
      {tracks.map((track) => (
        <div key={track.label}>
          <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
            <p className="micro text-accent">{track.label}</p>
            <span className="micro text-smoke">
              {track.steps.length} steps · in order
            </span>
          </div>
          <p className="mb-6 max-w-2xl text-[0.88rem] leading-relaxed text-ash">
            {track.why}
          </p>

          <ol className="flex flex-col gap-0 sm:flex-row sm:items-start sm:gap-0">
            {track.steps.map((step, i) => (
              <li
                key={step.name}
                className="relative flex gap-4 sm:flex-1 sm:flex-col sm:gap-0"
              >
                {/* ── Connector ──────────────────────────────────────────
                    Vertical on mobile, horizontal on desktop. Drawn from the
                    previous node to this one, so the first step has none. */}
                {i > 0 && (
                  <>
                    <motion.span
                      aria-hidden
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.5, delay: i * 0.09, ease: "easeOut" }}
                      className="absolute left-[7px] top-0 h-8 w-px origin-top bg-gradient-to-b from-line-bright to-accent/60 sm:hidden"
                    />
                    <motion.span
                      aria-hidden
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.5, delay: i * 0.09, ease: "easeOut" }}
                      className="absolute right-1/2 top-[7px] hidden h-px w-full origin-right bg-gradient-to-l from-accent/60 to-line-bright sm:block"
                    />
                  </>
                )}

                <div className="relative shrink-0 pt-8 sm:pt-0">
                  <motion.span
                    aria-hidden
                    initial={{ scale: 0.2, opacity: 0.4 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.45,
                      delay: i * 0.09 + 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="block h-[15px] w-[15px] rounded-full border border-accent/70 bg-ink"
                  >
                    <span className="mt-[3px] ml-[3px] block h-[7px] w-[7px] rounded-full bg-accent" />
                  </motion.span>

                  {/* The travelling pulse — decoration, and the one genuinely
                      "aggressive" piece here, so it's gated to full motion. */}
                  {lively && (
                    <motion.span
                      aria-hidden
                      className="absolute left-0 top-0 h-[15px] w-[15px] rounded-full border border-accent"
                      animate={{ scale: [1, 2.1], opacity: [0.55, 0] }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </div>

                <div className="pb-8 pt-7 sm:pb-0 sm:pr-5 sm:pt-4">
                  <p className="text-[0.92rem] font-semibold leading-snug text-chalk">
                    {step.name}
                  </p>
                  {step.note && (
                    <p className="mt-1.5 text-[0.8rem] leading-relaxed text-smoke">
                      {step.note}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}

      {/* Part of the diagram, not a footnote — see the header comment. */}
      <p className="border-l-2 border-line-bright pl-4 text-[0.8rem] leading-relaxed text-smoke">
        This is the most common U.S. sequence, not a universal one. Course names
        and order genuinely differ by district, some schools integrate maths into
        I/II/III, and plenty don&rsquo;t offer the last step at all. If yours
        doesn&rsquo;t, that isn&rsquo;t a gap in you — it&rsquo;s something to
        name in your application&rsquo;s context section, and a reason to ask
        about dual enrolment.
      </p>
    </div>
  );
}
