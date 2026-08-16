"use client";

import { useState } from "react";
import {
  INDICATORS,
  WAIVERS,
  FAFSA_NOTE,
} from "@/data/fee-waivers";

/**
 * Fee-waiver checker.
 *
 * Never returns "you don't qualify". Thresholds are set per program and
 * revised annually, so a confident negative from this app could cost a family
 * real money they were entitled to. Checking any box surfaces the waivers and
 * the exact ask; checking none still shows the path, because a counselor can
 * grant several of these on their own judgement.
 */
export function FeeWaiverChecker({ grade }: { grade?: number | null }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState(false);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const anyChecked = checked.size > 0;

  // Sorted so what's relevant now comes first, but nothing is hidden — a 9th
  // grader benefits from knowing the senior-year waivers exist.
  const waivers = [...WAIVERS].sort((a, b) => {
    if (!grade) return a.fromGrade - b.fromGrade;
    const aNow = grade >= a.fromGrade ? 0 : 1;
    const bNow = grade >= b.fromGrade ? 0 : 1;
    return aNow - bNow || a.fromGrade - b.fromGrade;
  });

  return (
    <div className="rounded-2xl border border-line-bright bg-panel p-6 sm:p-8">
      <p className="micro mb-2 text-accent">Fee waivers</p>
      <h2 className="display-md text-2xl text-chalk sm:text-3xl">
        Tests and applications cost money. Often they don&rsquo;t have to.
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-ash">
        Fee waivers cover the cost of admissions tests and college
        applications, and they&rsquo;re one of the most under-used things in
        this whole process — mostly because nobody mentions them. Tick anything
        that applies to your family.
      </p>

      <ul className="mt-6 flex flex-col gap-2">
        {INDICATORS.map((ind) => {
          const on = checked.has(ind.id);
          return (
            <li key={ind.id}>
              <button
                type="button"
                onClick={() => toggle(ind.id)}
                aria-pressed={on}
                className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                  on
                    ? "border-accent bg-accent/10"
                    : "border-line bg-ink hover:border-line-bright"
                }`}
              >
                <span className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className={`mt-[0.15rem] flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[0.7rem] ${
                      on
                        ? "border-accent bg-accent text-ink"
                        : "border-line-bright text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <span>
                    <span className="block text-[0.92rem] leading-snug text-chalk">
                      {ind.label}
                    </span>
                    {ind.detail && (
                      <span className="mt-1 block text-[0.82rem] leading-relaxed text-smoke">
                        {ind.detail}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="mt-6 w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink"
        >
          {anyChecked ? "Show what this could cover" : "Show me anyway"}
        </button>
      ) : (
        <div className="mt-8">
          <div className="rounded-xl border border-accent/40 bg-accent/[0.06] px-5 py-4">
            <p className="text-[0.95rem] leading-relaxed text-chalk">
              {anyChecked
                ? "Based on what you ticked, it's genuinely worth asking about all of these. Nobody here decides whether you qualify — the program does — but the students who get waivers are the ones who ask."
                : "Even with none of those ticked, it's worth asking. Counselors can grant several of these on their own judgement, and the income limits change every year — don't rule yourself out on a guess."}
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            {waivers.map((w) => {
              const laterOn = grade ? grade < w.fromGrade : false;
              return (
                <div
                  key={w.id}
                  className="rounded-xl border border-line bg-ink p-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p className="text-[0.98rem] font-semibold text-chalk">
                      {w.name}
                    </p>
                    {laterOn && (
                      <span className="micro text-smoke">
                        matters from grade {w.fromGrade}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-ash">
                    {w.what}
                  </p>
                  <p className="mt-3 rounded-lg border border-line bg-panel px-4 py-3 text-[0.88rem] leading-relaxed text-chalk">
                    <span className="micro mb-1 block text-accent">
                      How to ask
                    </span>
                    {w.howToAsk}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-5 text-[0.85rem] leading-relaxed text-smoke">
            {FAFSA_NOTE}
          </p>
          <p className="mt-3 text-[0.82rem] leading-relaxed text-smoke">
            Nothing you tick here is saved or sent anywhere — it stays in this
            browser tab.
          </p>
        </div>
      )}
    </div>
  );
}
