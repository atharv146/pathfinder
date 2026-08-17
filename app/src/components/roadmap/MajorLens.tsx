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
import { MajorGlyph } from "@/components/major/MajorGlyph";

/**
 * The pointer from a grade roadmap out to /major.
 *
 * ⚠️ THIS USED TO BE THE WHOLE FEATURE. Until Aug 16, 2026 this component
 * carried every piece of major-specific content — notes, the grade phase,
 * counselor questions, researched programs, the per-school verify list — inside
 * an expandable card sitting above the grade roadmap. That was the right shape
 * when there were three bullet points; it stopped being right once there was a
 * course ladder and a comparison table to show, and it could only ever render
 * the student's own major, which is useless to the many students still
 * deciding.
 *
 * So per master-spec-doc §16K it is now deliberately ONE LINE. The general
 * roadmap is the spine and stays uncluttered; /major is the place that content
 * lives. Resist re-growing this — if something needs saying about a major, it
 * belongs on /major, not here.
 */
export function MajorLens({ grade }: { grade: number }) {
  const [family, setFamily] = useState<MajorFamily | null>(null);
  const [undecided, setUndecided] = useState(false);
  const [loaded, setLoaded] = useState(false);

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

  // No major set, or explicitly undecided. Both point at /major rather than at
  // /account: browsing the fields is now possible without choosing one, and
  // sending an undecided student to a settings form to "pick" is the wrong ask.
  if (undecided || !family) {
    return (
      <Link
        href="/major"
        className="group mb-12 flex items-center gap-4 border-l-2 border-line-bright pl-5 transition-colors hover:border-accent/60 sm:pl-6"
      >
        <div className="min-w-0">
          <p className="micro mb-1.5 text-smoke">Your major</p>
          <p className="text-[0.95rem] leading-relaxed text-ash">
            {undecided
              ? "You picked “not sure yet”, which is the most common answer and costs you nothing — everything on this page applies regardless."
              : "You haven’t set a major, which is fine."}{" "}
            <span className="text-chalk underline underline-offset-4 transition-colors group-hover:text-accent">
              Compare what changes across the eight fields
            </span>
          </p>
        </div>
      </Link>
    );
  }

  const phase = phaseForGrade(family, grade);
  const relevant = grade >= family.actFrom;

  return (
    <Link
      href="/major"
      className="group mb-12 flex items-center gap-4 border-l-2 border-accent/50 pl-5 transition-colors hover:border-accent sm:pl-6"
    >
      <MajorGlyph
        id={family.id}
        className="hidden h-9 w-9 shrink-0 text-accent/70 transition-colors group-hover:text-accent sm:block"
      />
      <div className="min-w-0">
        <p className="micro mb-1.5 text-accent">{family.label}</p>
        <p className="text-[0.95rem] leading-relaxed text-chalk">
          {phase
            ? phase.label
            : relevant
              ? family.summary
              : `Mostly starts mattering from grade ${family.actFrom}`}
          <span className="ml-2 inline-block text-ash underline underline-offset-4 transition-colors group-hover:text-accent">
            what changes for grade {grade} →
          </span>
        </p>
      </div>
    </Link>
  );
}

export { MAJOR_FAMILIES };
