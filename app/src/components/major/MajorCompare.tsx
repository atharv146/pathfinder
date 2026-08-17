"use client";

import { motion } from "framer-motion";
import { MAJOR_FAMILIES } from "@/data/majors";
import { MAJOR_PATHWAYS } from "@/data/major-pathways";
import { MajorGlyph } from "./MajorGlyph";
import { Tooltip } from "@/components/ui/Tooltip";

/**
 * All eight families on one grid — the thing the old roadmap card could never
 * show, because it only ever rendered the student's own major.
 *
 * WHY THIS EARNS ITS SPACE. Every column is a *structural* fact that changes
 * what a student has to do, and that they'd otherwise have to discover one
 * school at a time: whether the major admits directly (which decides if
 * "transfer in later" is a real plan), whether there's a portfolio (which runs
 * on an earlier calendar than everything else), and how much earlier course
 * placement constrains the path (which is the difference between a decision at
 * 13 and a decision at 17). Nothing here is an odds claim, a ranking, or a
 * recommendation to pick one over another.
 *
 * THE "LOCKED" METER IS ABOUT THE FIELD, NOT THE STUDENT. Three segments, and
 * it measures how sequence-dependent the *subject* is. It is never a reading of
 * how the student is doing — the site's standing rule against scoring students
 * applies to their progress, and this bar deliberately has nothing to do with
 * it. Every value ships with a one-line reason so the bar is never the whole
 * claim.
 *
 * Table on desktop, cards on mobile: a five-column table at 375px either
 * overflows the page or shrinks the type below readable, and horizontal-scroll
 * tables hide columns from exactly the users most likely to be on a phone.
 */

const LEVELS = { High: 3, Some: 2, Low: 1 } as const;

const LOCKED_TIP =
  "How sequence-dependent the field is — not a reading of you or how you're doing. A field can rate High because its courses build on each other for years, regardless of any individual student's progress.";

function LockedMeter({ level }: { level: keyof typeof LEVELS }) {
  const filled = LEVELS[level];
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className="flex gap-[3px]">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-[3px] w-4 rounded-full transition-colors duration-300 ${
              i <= filled ? "bg-accent" : "bg-line-bright"
            }`}
          />
        ))}
      </span>
      <span className="micro text-ash">{level}</span>
    </span>
  );
}

export function MajorCompare({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const rows = MAJOR_FAMILIES.map((f) => ({
    family: f,
    pathway: MAJOR_PATHWAYS[f.id],
  })).filter((r) => !!r.pathway);

  return (
    <div>
      {/* ── Desktop ─────────────────────────────────────────────────────── */}
      <div className="hidden overflow-hidden rounded-2xl border border-line md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-panel">
              {/* Explicit widths on the two short columns. Left to `auto` the
                  table gave the prose columns everything and wrapped
                  "Engineering / CS" and "Natural Sciences" onto two lines,
                  which made the row labels the hardest thing on the page to
                  scan — exactly backwards for a comparison grid. */}
              {[
                { h: "Field", w: "w-[168px]" },
                { h: "How you get in", w: "" },
                { h: "Extra to submit", w: "" },
                { h: "Locked in early", w: "", tip: LOCKED_TIP },
                { h: "Matters from", w: "w-[104px]" },
              ].map(({ h, w, tip }) => (
                <th
                  key={h}
                  scope="col"
                  className={`micro px-4 py-3.5 font-normal text-smoke ${w}`}
                >
                  {/* Tooltip puts the "this rates the field, not you" caveat
                      right where a reader might misread the meter, rather than
                      only in the paragraph below the whole table. */}
                  {tip ? (
                    <Tooltip label={tip}>
                      {/* tabIndex so keyboard users can reach this at all —
                          Radix wires an onFocus handler to reveal the tooltip
                          for exactly this case, but only if the element it's
                          attached to can actually receive focus. A bare
                          <span> can't by default. */}
                      <span
                        tabIndex={0}
                        className="cursor-help underline decoration-dotted decoration-smoke underline-offset-4 outline-none focus-visible:text-chalk"
                      >
                        {h}
                      </span>
                    </Tooltip>
                  ) : (
                    h
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ family, pathway }) => {
              const active = family.id === selectedId;
              return (
                <tr
                  key={family.id}
                  onClick={() => onSelect(family.id)}
                  className={`group cursor-pointer border-b border-line/70 align-top transition-colors last:border-b-0 ${
                    active ? "bg-accent/[0.07]" : "hover:bg-panel"
                  }`}
                >
                  <th scope="row" className="px-4 py-4 font-normal">
                    <span className="flex items-center gap-3">
                      <MajorGlyph
                        id={family.id}
                        active={active}
                        className={`h-6 w-6 shrink-0 ${
                          active ? "text-accent" : "text-smoke"
                        }`}
                      />
                      <span
                        className={`text-[0.88rem] font-semibold leading-tight ${
                          active ? "text-chalk" : "text-ash group-hover:text-chalk"
                        }`}
                      >
                        {family.label}
                      </span>
                    </span>
                  </th>
                  <td className="px-4 py-4 text-[0.82rem] leading-relaxed text-ash">
                    {pathway.structure.entry}
                  </td>
                  <td className="px-4 py-4 text-[0.82rem] leading-relaxed text-ash">
                    {pathway.structure.extra}
                  </td>
                  <td className="px-4 py-4">
                    <LockedMeter level={pathway.structure.locked} />
                    <span className="mt-1.5 block text-[0.78rem] leading-relaxed text-smoke">
                      {pathway.structure.lockedWhy}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="micro tabular-nums text-chalk">
                      Grade {family.actFrom}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 md:hidden">
        {rows.map(({ family, pathway }) => {
          const active = family.id === selectedId;
          return (
            <button
              key={family.id}
              type="button"
              onClick={() => onSelect(family.id)}
              aria-pressed={active}
              className={`relative overflow-hidden rounded-xl border p-4 text-left transition-colors ${
                active ? "border-accent/60 bg-accent/[0.07]" : "border-line bg-panel"
              }`}
            >
              <span className="flex items-center gap-3">
                <MajorGlyph
                  id={family.id}
                  active={active}
                  className={`h-6 w-6 shrink-0 ${active ? "text-accent" : "text-smoke"}`}
                />
                <span className="text-[0.92rem] font-semibold text-chalk">
                  {family.label}
                </span>
                <span className="micro ml-auto shrink-0 tabular-nums text-smoke">
                  Gr {family.actFrom}+
                </span>
              </span>

              <dl className="mt-3 flex flex-col gap-2">
                <div>
                  <dt className="micro text-smoke">How you get in</dt>
                  <dd className="text-[0.82rem] leading-relaxed text-ash">
                    {pathway.structure.entry}
                  </dd>
                </div>
                <div>
                  <dt className="micro text-smoke">Extra to submit</dt>
                  <dd className="text-[0.82rem] leading-relaxed text-ash">
                    {pathway.structure.extra}
                  </dd>
                </div>
                <div>
                  <dt className="micro text-smoke">Locked in early</dt>
                  <dd className="mt-1">
                    <LockedMeter level={pathway.structure.locked} />
                    <span className="mt-1 block text-[0.78rem] leading-relaxed text-smoke">
                      {pathway.structure.lockedWhy}
                    </span>
                  </dd>
                </div>
              </dl>

              {active && (
                <motion.span
                  layoutId="compare-edge"
                  className="absolute inset-y-0 left-0 w-[2px] bg-accent"
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-[0.8rem] leading-relaxed text-smoke">
        Every one of these varies by school — a business school that admits
        directly at one university is a later internal application at the next.
        Treat this as what to check, not as what&rsquo;s true everywhere.
      </p>
    </div>
  );
}
