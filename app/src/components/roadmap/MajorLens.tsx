"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  findMajorFamily,
  phaseForGrade,
  MAJOR_FAMILIES,
  type MajorFamily,
} from "@/data/majors";
import { Opportunities } from "@/components/roadmap/Opportunities";

/**
 * "What changes for your major" — shown above the grade roadmap.
 *
 * The general roadmap stays the spine; this is a lens over it, not a
 * replacement. That's deliberate: the shared advice is the same for almost
 * everyone, and pretending otherwise would mean writing seven near-identical
 * roadmaps and quietly inventing the differences.
 *
 * Undecided is treated as a legitimate answer with its own content, not as an
 * empty state — it's the most common answer at this age.
 */
export function MajorLens({ grade }: { grade: number }) {
  const [family, setFamily] = useState<MajorFamily | null>(null);
  const [undecided, setUndecided] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return setLoaded(true);

      const { data } = await supabase
        .from("profiles")
        .select("major, major_undecided")
        .eq("id", user.id)
        .maybeSingle();

      setFamily(findMajorFamily(data?.major));
      setUndecided(!!data?.major_undecided);
      setLoaded(true);
    };
    load();
  }, []);

  if (!loaded) return null;

  if (undecided || !family) {
    return (
      <div className="mb-12 border-l-2 border-line-bright pl-5 sm:pl-6">
        <p className="micro mb-2 text-smoke">Your major</p>
        <p className="mb-4 text-[0.95rem] leading-relaxed text-ash">
          {undecided
            ? "You picked “not sure yet”, which is the most common answer and costs you nothing. Everything on this page applies regardless of major."
            : "Set a major and this page will show what changes for it."}
        </p>
        <Link
          href="/account"
          className="micro text-chalk underline underline-offset-4 hover:text-accent"
        >
          {undecided ? "Change it any time" : "Choose a major"}
        </Link>
      </div>
    );
  }

  const relevant = grade >= family.actFrom;
  const phase = phaseForGrade(family, grade);

  return (
    <div className="mb-12 border-l-2 border-accent/50 pl-5 sm:pl-6">
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="micro text-accent">What changes for {family.label}</p>
        {!relevant && (
          <span className="micro text-smoke">
            · mostly matters from grade {family.actFrom}
          </span>
        )}
      </div>

      <p className="mb-5 text-[1rem] leading-relaxed text-chalk">{family.summary}</p>

      <div
        className="grid transition-all duration-500 ease-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr", opacity: expanded ? 1 : 0 }}
      >
        <div className="overflow-hidden">
          <ul className="space-y-4 pb-5">
            {family.notes.map((n) => (
              <li key={n} className="flex items-start gap-3">
                <span className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
                <span className="text-[0.92rem] leading-relaxed text-ash">{n}</span>
              </li>
            ))}
          </ul>

          {/* The grade-phased pathway — only the phase covering THIS grade.
              Showing all four at once turns a pathway back into a wall of
              text, which is what the grade pages already do well. */}
          {phase && (
            <div className="border-t border-line pb-5 pt-5">
              <p className="micro mb-1 text-accent">
                Grade {grade} · {phase.label}
              </p>
              <ul className="mt-3 space-y-3">
                {phase.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-3">
                    <span className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span className="text-[0.92rem] leading-relaxed text-ash">
                      {pt}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Questions, not answers. The answers are school-specific and we'd
              be guessing; the question itself is the thing a better-resourced
              classmate already knows to ask. */}
          <div className="border-t border-line pb-5 pt-5">
            <p className="micro mb-3 text-smoke">Worth asking your counselor</p>
            <ul className="space-y-2">
              {family.askCounselor.map((q) => (
                <li
                  key={q}
                  className="rounded-lg border border-line bg-ink px-4 py-2.5 text-[0.88rem] leading-snug text-chalk"
                >
                  &ldquo;{q}&rdquo;
                </li>
              ))}
            </ul>
          </div>

          {/* Real, researched programs (5B). Grade-gated: showing a 7th
              grader a rising-senior application deadline is noise. */}
          {grade >= 9 && (
            <div className="border-t border-line pb-5 pt-5">
              <Opportunities familyId={family.id} familyLabel={family.label} />
            </div>
          )}

          {/* Explicitly naming what we do NOT know for them. */}
          <div className="border-t border-line pb-5 pt-5">
            <p className="micro mb-3 text-smoke">
              Check these per school — they genuinely differ
            </p>
            <ul className="space-y-2">
              {family.verify.map((v) => (
                <li key={v} className="flex items-start gap-3">
                  <span className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-smoke" />
                  <span className="text-[0.88rem] leading-relaxed text-ash">
                    {v}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="micro text-chalk transition-colors hover:text-accent"
        >
          {expanded
            ? "— Hide details"
            : `+ What this means for grade ${grade}`}
        </button>
        <Link href="/account" className="micro text-smoke transition-colors hover:text-chalk">
          Change major
        </Link>
      </div>

      {expanded && (
        <p className="micro mt-5 leading-relaxed text-smoke">
          General guidance for this field — individual schools set their own requirements,
          so confirm anything specific on their admissions page.
        </p>
      )}
    </div>
  );
}

export { MAJOR_FAMILIES };
