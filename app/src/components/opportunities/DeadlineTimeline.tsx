"use client";

import { useMemo, useState } from "react";
import { allOpportunities } from "@/lib/opportunities";

/**
 * A twelve-month deadline track for the scholarships that publish real dates.
 *
 * WHY THIS EXISTS: the directory below it answers "what exists," sorted by
 * status. It does not answer the question a student actually arrives with in
 * October — "what do I need to deal with *next*." A sorted list flattens that;
 * a time axis shows it immediately, including the thing a list hides worst:
 * that several deadlines cluster in the same few weeks.
 *
 * ── HONESTY RULES, SAME AS THE DATA FILES ────────────────────────────────
 * Only entries with a published `closesOn` appear here. Awards whose
 * organisations don't publish a date are NOT given an invented or estimated
 * position on the track — they're counted in a note underneath instead, so
 * this reads as "here are the dated ones" rather than implying the undated
 * ones don't exist or don't matter. Anything already closed is dropped rather
 * than shown greyed at the far left, which would waste the axis on the past.
 *
 * Urgency colours deliberately match `DeadlineOrbit` on the homepage — inside
 * 14 days red, inside 60 amber, otherwise calm. Same thresholds, same meaning,
 * so the two surfaces read as one system rather than two palettes.
 */

const URGENT = "#ff4d4d";
const SOON = "#ffb02e";
const CALM = "#7fd4c6";

function urgencyColor(days: number) {
  if (days <= 14) return URGENT;
  if (days <= 60) return SOON;
  return CALM;
}

/** How much horizontal room one label needs, as a % of the track. */
const LABEL_WIDTH_PCT = 26;

type Marker = {
  id: string;
  name: string;
  org: string;
  closes: number;
  daysLeft: number;
  pct: number;
  lane: number;
};

const GRADES = [9, 10, 11, 12];

/**
 * The close timestamp for any unified entry that has one.
 *
 * `status` already encodes whether a cycle is live, but not the date itself,
 * so this re-parses from the source fields the merge layer copied through.
 */
function closeMsOf(e: { timing: string; closesOn?: string | null }): number | null {
  if (!e.closesOn) return null;
  const ms = Date.parse(`${e.closesOn}T00:00:00Z`);
  return Number.isNaN(ms) ? null : ms;
}

export function DeadlineTimeline() {
  const [grade, setGrade] = useState<number | null>(null);

  const { markers, months, undated, laneCount } = useMemo(() => {
    const now = new Date();
    const startMs = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    );
    // Twelve months forward. Anything past that sits beyond the point where a
    // student can act on it anyway, and stretching the axis to fit one distant
    // date would compress everything that actually matters.
    const end = new Date(startMs);
    end.setUTCFullYear(end.getUTCFullYear() + 1);
    const endMs = end.getTime();
    const span = endMs - startMs;

    // Every entry that carries a real published close date — scholarships
    // and, since Aug 17 2026, the handful of programmes/competitions whose
    // organisations publish one too. Entries without a date are absent by
    // design rather than estimated onto the axis.
    const unified = allOpportunities(now);
    const dated = unified
      .filter((e) => e.status?.kind === "open" || e.status?.kind === "opens-soon")
      .map((e) => ({ e, closes: closeMsOf(e) }))
      .filter((x): x is { e: (typeof unified)[number]; closes: number } =>
        x.closes !== null
      );

    const inWindow = dated
      .filter(({ closes }) => closes >= startMs && closes <= endMs)
      .filter(({ e }) => {
        // Grade filter mirrors the directory's: it can only narrow entries
        // that carry a structured grade list. Programmes state eligibility in
        // prose, so they are never filtered OUT by grade — hiding a programme
        // because we couldn't parse "rising seniors" would be the tool lying
        // about what exists.
        if (grade === null) return true;
        return e.grades.length === 0 || e.grades.includes(grade);
      })
      .sort((a, b) => a.closes - b.closes);

    // Lane packing: walk in date order and drop each marker in the first lane
    // whose last label ended far enough back to not collide with this one.
    const laneEnds: number[] = [];
    const placed: Marker[] = inWindow.map(({ e: s, closes }) => {
      const pct = ((closes - startMs) / span) * 100;
      let lane = laneEnds.findIndex((endPct) => pct - endPct >= LABEL_WIDTH_PCT);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(pct);
      } else {
        laneEnds[lane] = pct;
      }
      return {
        id: s.id,
        name: s.name,
        org: s.org,
        closes,
        daysLeft: Math.round((closes - startMs) / 86_400_000),
        pct,
        lane,
      };
    });

    // Month ticks across the same span, so markers and labels share one scale.
    const ticks: { label: string; pct: number }[] = [];
    const cursor = new Date(startMs);
    cursor.setUTCDate(1);
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    while (cursor.getTime() < endMs) {
      ticks.push({
        label: cursor.toLocaleDateString("en-US", {
          month: "short",
          timeZone: "UTC",
        }),
        pct: ((cursor.getTime() - startMs) / span) * 100,
      });
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }

    // Everything real that this track cannot honestly place: no published
    // close date at all, or a cycle that has already ended.
    const undatedCount = unified.length - placed.length;

    return {
      markers: placed,
      months: ticks,
      undated: undatedCount,
      laneCount: Math.max(laneEnds.length, 1),
    };
  }, [grade]);

  if (markers.length === 0 && grade === null) return null;

  const trackHeight = laneCount * 52 + 28;

  return (
    <section
      aria-labelledby="deadline-track-heading"
      className="rounded-2xl border border-line bg-panel p-5 sm:p-7"
    >
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2
          id="deadline-track-heading"
          className="display-md text-lg text-chalk sm:text-xl"
        >
          The next twelve months
        </h2>
        <p className="font-mono text-[0.7rem] uppercase tracking-widest text-smoke">
          {markers.length} dated deadline{markers.length === 1 ? "" : "s"}
        </p>
      </div>

      <p className="mb-4 max-w-xl text-[0.85rem] leading-relaxed text-ash">
        Only the ones whose organisations publish an actual closing date.
        Notice where they bunch up — that clustering is the real reason to start
        early, and a sorted list hides it completely.
      </p>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="micro mr-1 text-smoke">Open to grade</span>
        {[null, ...GRADES].map((g) => (
          <button
            key={g ?? "any"}
            type="button"
            onClick={() => setGrade(g)}
            aria-pressed={grade === g}
            className={`inline-flex min-h-[36px] items-center rounded-full border px-3 text-[0.78rem] transition-colors ${
              grade === g
                ? "border-accent bg-accent/[0.12] text-chalk"
                : "border-line text-ash hover:border-line-bright hover:text-chalk"
            }`}
          >
            {g ?? "Any"}
          </button>
        ))}
      </div>

      {markers.length === 0 && (
        <p className="mb-6 text-[0.85rem] leading-relaxed text-ash">
          Nothing with a published deadline is open to grade {grade} in the next
          twelve months. That is a gap in what we can date, not a statement
          about what you can apply to — the list below still applies.
        </p>
      )}

      {/* Wide content scrolls in its own container rather than pushing the
          page sideways — a hard rule in this codebase. min-w keeps the axis
          readable on a phone instead of crushing twelve months into 320px. */}
      <div className="-mx-1 overflow-x-auto px-1 pb-2">
        <div className="relative min-w-[640px]" style={{ height: trackHeight }}>
          {/* Month gridlines */}
          {months.map((m) => (
            <div
              key={m.label + m.pct}
              className="absolute top-0 border-l border-line"
              style={{ left: `${m.pct}%`, height: trackHeight - 22 }}
              aria-hidden
            >
              <span className="absolute -bottom-5 left-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-smoke">
                {m.label}
              </span>
            </div>
          ))}

          {/* "Today" edge — the axis starts now, so this anchors the reader. */}
          <div
            className="absolute top-0 border-l-2 border-chalk/70"
            style={{ left: 0, height: trackHeight - 22 }}
            aria-hidden
          >
            <span className="absolute -top-0.5 left-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-chalk">
              Today
            </span>
          </div>

          {markers.map((m) => {
            const color = urgencyColor(m.daysLeft);
            // Flip the label to the left of its dot near the right edge, so it
            // can't run off the track.
            const flip = m.pct > 100 - LABEL_WIDTH_PCT;
            return (
              <div
                key={m.id}
                className="absolute"
                style={{ left: `${m.pct}%`, top: m.lane * 52 + 26 }}
              >
                <span
                  className="absolute -left-[3px] -top-[3px] block h-1.5 w-1.5 rounded-full"
                  style={{ background: color, boxShadow: `0 0 10px ${color}` }}
                  aria-hidden
                />
                <div
                  className={`absolute top-2.5 ${flip ? "right-0 text-right" : "left-0"}`}
                  style={{ width: `${LABEL_WIDTH_PCT * 6.4}px` }}
                >
                  <p className="truncate text-[0.78rem] font-semibold leading-tight text-chalk">
                    {m.name}
                  </p>
                  <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-wider text-smoke">
                    {new Date(m.closes).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                    {" · "}
                    <span style={{ color }}>{m.daysLeft}d</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4">
        <Key color={URGENT} label="Under 2 weeks" />
        <Key color={SOON} label="Under 2 months" />
        <Key color={CALM} label="Further out" />
      </div>

      {undated > 0 && (
        <p className="mt-3 text-[0.8rem] leading-relaxed text-smoke">
          {undated} more scholarship{undated === 1 ? "" : "s"} in the list below
          {undated === 1 ? " isn't" : " aren't"} on this track — either the
          organisation publishes no closing date, or this cycle has already
          closed. {undated === 1 ? "It's" : "They're"}{" "}still real, and still
          worth reading. We&rsquo;d rather leave a gap than invent a date.
        </p>
      )}
    </section>
  );
}

function Key({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span
        className="block h-1.5 w-1.5 rounded-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
        aria-hidden
      />
      <span className="font-mono text-[0.65rem] uppercase tracking-widest text-smoke">
        {label}
      </span>
    </span>
  );
}
