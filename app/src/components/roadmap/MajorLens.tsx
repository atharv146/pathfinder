"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { findMajorFamily, MAJOR_FAMILIES, type MajorFamily } from "@/data/majors";

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
      <div className="mb-12 rounded-lg border border-line bg-panel/50 p-5 sm:p-6">
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

  return (
    <div className="mb-12 rounded-lg border border-accent/30 bg-accent/[0.04] p-5 sm:p-6">
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
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="micro text-chalk transition-colors hover:text-accent"
        >
          {expanded ? "— Hide details" : `+ ${family.notes.length} things to know`}
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
