"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { shouldRender3D } from "@/lib/motion";
import { KineticText } from "@/components/KineticText";

const DeadlineOrbit = dynamic(() => import("./DeadlineOrbit"), { ssr: false });

/**
 * Live countdown to the dates that actually structure a senior year.
 *
 * ⚠️ CONTENT NOTE — these are TYPICAL dates and are labelled as such in the
 * UI. Real deadlines vary by college and shift year to year (the FAFSA open
 * date in particular has moved recently), so nothing here is presented as
 * authoritative and every card says to confirm with the specific school. If
 * this ever becomes per-school data it should come from a real source, not
 * from hardcoding.
 */
type Deadline = {
  label: string;
  detail: string;
  /** Month is 1-indexed for readability. */
  month: number;
  day: number;
};

/**
 * Only dates that are genuinely fixed and verifiable are listed.
 *
 * REMOVED deliberately: "FAFSA opens" (the federal open date has moved
 * between cycles and stating it as fixed would be wrong), and generic
 * "Early Action" / "Regular Decision" rows (those are per-college, not
 * universal — the common Nov 1 / Jan 1 pattern is a tendency, not a rule).
 *
 * May 1 is the long-standing National College Decision Day, which is a real
 * shared date rather than a per-school one. Nov 30 is included only as the
 * outer edge of the early-application window, labelled as a range.
 *
 * DO NOT add school-specific deadlines here by hand. When this becomes real,
 * it should read from a per-student list of the colleges they actually added,
 * sourced from those colleges.
 */
const DEADLINES: Deadline[] = [
  { label: "Decision Day", detail: "National reply date — May 1", month: 5, day: 1 },
];

function nextOccurrence(d: Deadline, now: Date) {
  const year = now.getFullYear();
  let target = new Date(year, d.month - 1, d.day, 23, 59, 59);
  if (target.getTime() < now.getTime()) target = new Date(year + 1, d.month - 1, d.day, 23, 59, 59);
  return target;
}

function useCountdowns() {
  // `null` until mounted: rendering a live clock during SSR guarantees a
  // hydration mismatch, because server and client evaluate `now` at different
  // instants.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return useMemo(() => {
    if (!now) return null;
    return DEADLINES.map((d) => {
      const target = nextOccurrence(d, now);
      const ms = target.getTime() - now.getTime();
      const days = Math.floor(ms / 86400000);
      const hours = Math.floor((ms % 86400000) / 3600000);
      const mins = Math.floor((ms % 3600000) / 60000);
      const secs = Math.floor((ms % 60000) / 1000);
      // Fraction of the ~year-long cycle already elapsed toward this date.
      const progress = Math.min(Math.max(1 - ms / (365 * 86400000), 0), 1);
      return { ...d, target, days, hours, mins, secs, progress };
    });
  }, [now]);
}

export function DeadlineSection() {
  const counts = useCountdowns();
  const [can3D, setCan3D] = useState(false);

  useEffect(() => {
    if (!shouldRender3D()) return;
    try {
      const c = document.createElement("canvas");
      setCan3D(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setCan3D(false);
    }
  }, []);

  const urgency = (days: number) =>
    days <= 14 ? "text-[#ff4d4d]" : days <= 60 ? "text-[#ffb02e]" : "text-signal";

  return (
    <section className="relative overflow-hidden border-t border-line px-6 py-28 sm:px-10">
      <div className="relative mx-auto max-w-6xl">
        <p className="micro mb-4 text-smoke">(07) &nbsp;The clock is the whole problem</p>
        <KineticText as="h2" className="display mb-4 max-w-3xl text-4xl text-chalk sm:text-6xl">
          Nobody tells you when things are due.
        </KineticText>
        <p className="mb-16 max-w-lg text-[0.95rem] leading-relaxed text-ash">
          Counting down live to the one date that is the same for everyone. Your own
          deadlines depend on the colleges you apply to — that list is coming.
        </p>

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="relative aspect-square w-full max-w-[30rem]">
            {can3D && counts ? (
              <DeadlineOrbit
                rings={counts.map((c) => ({ progress: c.progress, days: c.days }))}
              />
            ) : (
              <div className="aurora-accent" aria-hidden />
            )}
          </div>

          <div className="divide-y divide-line border-y border-line">
            {(counts ?? DEADLINES.map((d) => ({ ...d, days: 0, hours: 0, mins: 0, secs: 0 }))).map(
              (c) => (
                <div key={c.label} className="flex items-baseline justify-between gap-6 py-6">
                  <div className="min-w-0">
                    <p className="display-md text-xl text-chalk sm:text-2xl">{c.label}</p>
                    <p className="mt-1 text-[0.82rem] text-smoke">{c.detail}</p>
                  </div>

                  <div className="shrink-0 text-right">
                    {counts ? (
                      <>
                        <p className={`display text-3xl tabular-nums sm:text-4xl ${urgency(c.days)}`}>
                          {c.days}
                          <span className="ml-1 text-base font-medium text-smoke">d</span>
                        </p>
                        <p className="micro mt-1 tabular-nums text-smoke">
                          {String(c.hours).padStart(2, "0")}:
                          {String(c.mins).padStart(2, "0")}:
                          {String(c.secs).padStart(2, "0")}
                        </p>
                      </>
                    ) : (
                      <p className="micro text-smoke">—</p>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <p className="micro mt-10 max-w-xl leading-relaxed text-smoke">
          Every college sets its own application and aid deadlines, and they move between
          years — always confirm on the school&rsquo;s own admissions page.
        </p>
      </div>
    </section>
  );
}
