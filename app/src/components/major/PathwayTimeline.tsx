"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import type { StageDetail } from "@/data/major-pathways";

const GRADES = [6, 7, 8, 9, 10, 11, 12];

/**
 * Grades 6–12 as a spine, with the four stages of this major sitting under it.
 *
 * ⚠️ SAME RULE AS JourneyArc, AND FOR THE SAME REASON. This is not a progress
 * bar. Nothing fills proportionally to what a student has completed, no stage
 * is ever styled as failed or missed, and a student who lands here in 11th
 * grade sees three stages behind them drawn at the same weight as the one ahead
 * — dimmed as *history*, not marked as *debt*. The gap analysis on /roadmap
 * makes exactly this distinction (`WhereYouAre` deliberately has no score), and
 * a timeline is the easiest place on the site to accidentally undo it.
 *
 * Construction: an SVG spine for the geometry (which needs to be crisp and to
 * curve), with every piece of *text* rendered as real HTML positioned over it.
 * SVG text at a 700-unit viewBox scales down to ~5px on a 375px phone, which is
 * the reason the first pass at this was unreadable on mobile.
 *
 * ── STAGE BUTTONS ARE Radix `Tabs.Trigger` (Aug 16, 2026) ──────────────────
 * Same reasoning as `MajorSwitcher`: this used to be plain `<button
 * aria-pressed>` elements with a manual `onClick`. They're now `Tabs.Trigger`,
 * relying on an ANCESTOR `Tabs.Root` owned by `MajorView` (which also renders
 * the matching `Tabs.Content` for the stage-detail panel below). That gets
 * roving-tabindex arrow-key navigation between stages for free, and keeps
 * `MajorView` as the single place that owns `stageIndex` — this component no
 * longer takes an `onSelect` callback at all. `selectedIndex` is still a prop,
 * used only to drive the SVG spine highlight and the travelling fill, exactly
 * as `selectedId` is in `MajorSwitcher`.
 */
export function PathwayTimeline({
  stages,
  selectedIndex,
  /** The student's own grade, if we know it. Marks "you are here". */
  grade,
}: {
  stages: StageDetail[];
  selectedIndex: number;
  grade?: number | null;
}) {
  const W = 700;
  const H = 64;
  const padX = 22;
  const span = W - padX * 2;

  const x = (i: number) => padX + (span * i) / (GRADES.length - 1);
  // A shallow rise — enough to read as a path being walked rather than a ruler.
  const y = (i: number) => 44 - Math.sin((i / (GRADES.length - 1)) * Math.PI) * 16;

  const spine = GRADES.map(
    (_, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(i).toFixed(1)}`
  ).join(" ");

  const currentIndex = grade ? GRADES.indexOf(grade) : -1;
  const selected = stages[selectedIndex];

  /**
   * Where a stage sits along the spine, as a 0–1 fraction of the drawn path.
   *
   * The path is parameterised by SEGMENTS, not by grades: seven nodes means six
   * segments, so grade node `i` sits at `i / 6`. A stage covering a single
   * grade (junior year) would therefore have zero length if measured node-to-
   * node, so each end is extended by half a segment — which also makes the four
   * stages tile the spine exactly, with no gaps between them.
   */
  const stageExtent = (s: StageDetail) => {
    const segs = GRADES.length - 1;
    const half = 0.5 / segs;
    const start = Math.max(0, GRADES.indexOf(s.from) / segs - half);
    const end = Math.min(1, GRADES.indexOf(s.to) / segs + half);
    return { offset: start, length: end - start };
  };

  return (
    <div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label={`Grades 6 to 12.${
            grade ? ` You are in grade ${grade}.` : ""
          } Currently showing ${selected?.label ?? ""}.`}
        >
          <motion.path
            d={spine}
            fill="none"
            stroke="currentColor"
            className="text-line-bright"
            strokeWidth={1.25}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* The stretch of spine covered by the selected stage, lit. Slides
              between stages rather than cutting, so the connection between the
              button you pressed and the years it covers is visible. */}
          {selected && (
            <motion.path
              d={spine}
              fill="none"
              stroke="currentColor"
              className="text-accent"
              strokeWidth={2}
              strokeLinecap="round"
              initial={false}
              animate={{
                pathLength: stageExtent(selected).length,
                pathOffset: stageExtent(selected).offset,
              }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            />
          )}

          {GRADES.map((g, i) => {
            const inSelected =
              !!selected && g >= selected.from && g <= selected.to;
            const isCurrent = i === currentIndex;
            return (
              <g key={g}>
                {isCurrent && (
                  <motion.circle
                    cx={x(i)}
                    cy={y(i)}
                    r={11}
                    fill="none"
                    className="stroke-accent"
                    strokeWidth={1}
                    animate={{ opacity: [0.55, 0.12, 0.55], r: [10, 15, 10] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <motion.circle
                  cx={x(i)}
                  cy={y(i)}
                  r={isCurrent ? 5.5 : 3.5}
                  className={
                    isCurrent
                      ? "fill-accent"
                      : inSelected
                        ? "fill-chalk"
                        : "fill-line-bright"
                  }
                  initial={false}
                  animate={{ scale: inSelected ? 1 : 0.85 }}
                  style={{ transformOrigin: `${x(i)}px ${y(i)}px` }}
                  transition={{ duration: 0.4 }}
                />
              </g>
            );
          })}
        </svg>

        {/* Grade numbers as real HTML — see the header note on SVG text. */}
        <div aria-hidden className="relative -mt-1 h-4">
          {GRADES.map((g, i) => {
            const inSelected =
              !!selected && g >= selected.from && g <= selected.to;
            return (
              <span
                key={g}
                className={`absolute -translate-x-1/2 font-mono text-[0.68rem] tabular-nums transition-colors duration-300 ${
                  i === currentIndex
                    ? "text-accent"
                    : inSelected
                      ? "text-chalk"
                      : "text-smoke"
                }`}
                style={{ left: `${(x(i) / W) * 100}%` }}
              >
                {g}
              </span>
            );
          })}
        </div>
      </div>

      {/* Stage buttons, sized to the number of grades each one covers — so the
          three years of middle school are visibly three years wide and the
          single year of senior year isn't inflated to match. */}
      <Tabs.List aria-label="Choose a stage" className="mt-6 flex gap-1.5">
        {stages.map((s, i) => {
          const active = i === selectedIndex;
          const slots = s.to - s.from + 1;
          return (
            <Tabs.Trigger
              key={s.label}
              value={String(i)}
              style={{ flexGrow: slots, flexBasis: 0 }}
              className={`group relative min-w-0 overflow-hidden rounded-xl border px-2.5 py-3 text-left outline-none transition-colors duration-300 focus-visible:border-accent sm:px-4 ${
                active
                  ? "border-accent/70"
                  : "border-line bg-panel hover:border-line-bright"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="stage-fill"
                  transition={{ type: "spring", stiffness: 420, damping: 38 }}
                  className="absolute inset-0 -z-10 bg-accent/[0.10]"
                  aria-hidden
                />
              )}
              <span
                className={`micro block tabular-nums ${
                  active ? "text-accent" : "text-smoke"
                }`}
              >
                {s.from === s.to ? s.from : `${s.from}–${s.to}`}
              </span>
              <span
                className={`mt-1 block text-[0.8rem] font-semibold leading-tight sm:text-[0.88rem] ${
                  active ? "text-chalk" : "text-ash group-hover:text-chalk"
                }`}
              >
                {s.label}
              </span>
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>

      {grade != null && (
        <p className="micro mt-3 text-smoke">
          You&rsquo;re in grade {grade}{" "}
          &mdash; starting later isn&rsquo;t starting behind.
        </p>
      )}
    </div>
  );
}
