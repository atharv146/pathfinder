"use client";

import { shouldAnimateAggressively } from "@/lib/motion";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * The literal product metaphor, drawn: a single continuous line from 6th grade
 * to decision day that draws itself as you scroll, with each grade lighting up
 * as the line reaches it.
 *
 * Node coordinates are not hand-authored — they're sampled off the real path
 * with getPointAtLength() after mount, so the dots sit exactly on the curve
 * and stay correct if the path data is ever retuned. Hand-placed dots drift
 * the moment anyone touches the `d` attribute.
 */

const STOPS = [
  { grade: 6, label: "Explore", note: "Nothing here is evaluated." },
  { grade: 7, label: "Habits", note: "Reading, math, curiosity." },
  { grade: 8, label: "Set up", note: "Course placement matters now." },
  { grade: 9, label: "Transcript starts", note: "This one counts." },
  { grade: 10, label: "Find the spike", note: "Depth over breadth." },
  { grade: 11, label: "The busiest year", note: "Testing, essays, aid." },
  { grade: 12, label: "Decision day", note: "Apply, compare, choose." },
];

const VB_W = 420;
const VB_H = 1560;

// One continuous S-curve down the section. Kept shallow so labels on both
// sides stay clear of the line at narrow widths.
const PATH_D = `
  M 210 40
  C 120 170, 300 250, 210 380
  C 120 510, 300 590, 210 720
  C 120 850, 300 930, 210 1060
  C 120 1190, 300 1270, 210 1400
  L 210 1520
`;

export function RoadmapPath() {
  const scope = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [nodes, setNodes] = useState<{ x: number; y: number }[]>([]);

  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;

      // Sample the real geometry for node placement.
      const len = path.getTotalLength();
      const pts = STOPS.map((_, i) => {
        // Inset the ends so the first/last dot sits on the line, not its tip.
        const t = (i + 0.5) / STOPS.length;
        const p = path.getPointAtLength(t * len);
        return { x: p.x, y: p.y };
      });
      setNodes(pts);

      const reduced = !shouldAnimateAggressively();
      if (reduced) {
        gsap.set(path, { drawSVG: "100%" });
        gsap.set(".rp-node, .rp-label", { autoAlpha: 1 });
        return;
      }

      gsap.set(path, { drawSVG: "0%" });

      // Scrubbed draw — the line advances with the scrollbar rather than
      // playing on a fixed timer, so it reads as the user pulling it forward.
      gsap.to(path, {
        drawSVG: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top 72%",
          end: "bottom 88%",
          scrub: 0.6,
        },
      });
    },
    { scope }
  );

  // Each node/label fades in on its own trigger once the line has reached it.
  useGSAP(
    () => {
      if (!nodes.length) return;
      if (!shouldAnimateAggressively()) return;

      // Hidden at runtime rather than in the markup, so if JS fails, never
      // loads, or a trigger misfires, the content is simply visible instead of
      // permanently blank. This project has shipped that failure once already.
      gsap.set(".rp-node, .rp-label", { autoAlpha: 0 });

      const failsafe = window.setTimeout(() => {
        gsap.set(".rp-node, .rp-label", { autoAlpha: 1 });
      }, 4000);

      STOPS.forEach((_, i) => {
        gsap.fromTo(
          [`.rp-node-${i}`, `.rp-label-${i}`],
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: {
              trigger: `.rp-label-${i}`,
              start: "top 86%",
              once: true,
              // Cancel the blanket failsafe as soon as the real reveals are
              // proven to be firing.
              onEnter: () => window.clearTimeout(failsafe),
            },
          }
        );
      });

      return () => window.clearTimeout(failsafe);
    },
    { scope, dependencies: [nodes.length] }
  );

  return (
    <section
      ref={scope}
      className="relative overflow-hidden border-t border-line px-6 py-28 sm:px-10"
    >
      <p className="micro mb-4 text-smoke">(05) &nbsp;Seven years, one line</p>
      <h2 className="display mb-20 max-w-xl text-4xl leading-[1.1] text-chalk sm:text-5xl">
        It isn&rsquo;t seven separate races. It&rsquo;s one path.
      </h2>

      <div className="relative mx-auto w-full max-w-[420px]">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="w-full overflow-visible"
          fill="none"
          aria-hidden
        >
          {/* Ghost of the full route, so the destination is implied before
              the drawn line gets there. */}
          <path d={PATH_D} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          <path
            ref={pathRef}
            d={PATH_D}
            stroke="var(--color-signal)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {nodes.map((n, i) => (
            <g key={STOPS[i].grade} className={`rp-node rp-node-${i}`}>
              <circle cx={n.x} cy={n.y} r="16" fill="var(--color-ink)" />
              <circle
                cx={n.x}
                cy={n.y}
                r="5.5"
                fill="var(--color-ink)"
                stroke="var(--color-signal)"
                strokeWidth="1.5"
              />
            </g>
          ))}
        </svg>

        {/* Labels are HTML, not SVG text — real type rendering, real links,
            and they stay selectable and accessible. Positioned as a percentage
            of the same viewBox the nodes were sampled from. */}
        {nodes.map((n, i) => {
          const stop = STOPS[i];
          const left = (n.x / VB_W) * 100;
          const top = (n.y / VB_H) * 100;
          const flip = i % 2 === 1;

          return (
            <Link
              key={stop.grade}
              href={`/roadmap/${stop.grade}`}
              className={`rp-label rp-label-${i} group absolute w-[42%] ${
                flip ? "text-left" : "text-right"
              }`}
              style={{
                top: `${top}%`,
                left: flip ? `${left + 7}%` : undefined,
                right: flip ? undefined : `${100 - left + 7}%`,
                transform: "translateY(-50%)",
              }}
            >
              <span className="micro block text-smoke transition-colors group-hover:text-signal">
                Grade {stop.grade}
              </span>
              <span className="display mt-1 block text-2xl leading-tight text-chalk sm:text-3xl">
                {stop.label}
              </span>
              <span className="mt-1 block text-[0.8rem] leading-snug text-ash">
                {stop.note}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
