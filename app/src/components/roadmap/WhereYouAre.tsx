"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { fetchProgress } from "@/lib/db/progress";
import { buildGaps, type Gaps } from "@/lib/roadmap/gaps";
import { categoryMeta } from "@/data/categories";
import { JourneyArc } from "@/components/roadmap/JourneyArc";

/**
 * The signed-in student's own view of the roadmap.
 *
 * Deliberately shows no score, no percentage and no progress bar — see the
 * reasoning in lib/roadmap/gaps.ts. Someone who joins in 11th grade should see
 * a set of open doors, not five years of unchecked boxes.
 *
 * Renders nothing at all until we know their grade: a half-personalised panel
 * guessing at grade 9 is worse than the plain grade picker underneath it.
 */
export function WhereYouAre() {
  const [grade, setGrade] = useState<number | null>(null);
  const [gaps, setGaps] = useState<Gaps | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllCatchUp, setShowAllCatchUp] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelled) setLoading(false);
        return;
      }

      const [{ data: profile }, done] = await Promise.all([
        supabase.from("profiles").select("grade").eq("id", user.id).maybeSingle(),
        fetchProgress(),
      ]);

      if (cancelled) return;

      if (typeof profile?.grade === "number") {
        setGrade(profile.grade);
        setGaps(buildGaps(profile.grade, done));
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !grade || !gaps) return null;

  const remaining = gaps.thisYear.length - gaps.doneThisYear;
  const catchUpShown = showAllCatchUp ? gaps.catchUp : gaps.catchUp.slice(0, 4);

  return (
    <div className="mb-14 rounded-2xl border border-line-bright bg-panel p-6 sm:p-8">
      <p className="micro mb-2 text-accent">Where you are</p>
      <h2 className="display-md text-2xl text-chalk sm:text-3xl">
        Grade {grade}
      </h2>

      <p className="mt-3 text-[0.95rem] leading-relaxed text-ash">
        {remaining === 0 && gaps.thisYear.length > 0 ? (
          <>
            You&rsquo;ve worked through everything listed for grade {grade}.
            Have a look at what&rsquo;s coming next when you&rsquo;re ready.
          </>
        ) : (
          <>
            There {remaining === 1 ? "is" : "are"}{" "}
            <span className="text-chalk">{remaining}</span>{" "}
            {remaining === 1 ? "thing" : "things"} on your grade {grade}{" "}
            list. None of it is urgent today, and none of it is a test.
          </>
        )}
      </p>

      <JourneyArc
        grade={grade}
        doneThisYear={gaps.doneThisYear}
        totalThisYear={gaps.thisYear.length}
      />

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <Link
          href={`/roadmap/${grade}`}
          className="rounded-xl border border-line bg-ink px-5 py-4 transition-colors hover:border-line-bright"
        >
          <p className="text-[0.95rem] font-semibold text-chalk">
            Your grade {grade} roadmap
          </p>
          <p className="micro mt-1 text-smoke">
            {gaps.doneThisYear} of {gaps.thisYear.length} marked done
          </p>
        </Link>

        {gaps.comingUp.length > 0 && (
          <Link
            href={`/roadmap/${grade + 1}`}
            className="rounded-xl border border-line bg-ink px-5 py-4 transition-colors hover:border-line-bright"
          >
            <p className="text-[0.95rem] font-semibold text-chalk">
              A look at grade {grade + 1}
            </p>
            <p className="micro mt-1 text-smoke">
              {gaps.comingUp.length} items — nothing to do yet
            </p>
          </Link>
        )}
      </div>

      {/* Earlier-grade items that still genuinely transfer. Framed as open,
          never as missed — windowed items are filtered out upstream. */}
      {gaps.catchUp.length > 0 && (
        <div className="mt-8">
          <h3 className="micro mb-2 text-smoke">
            Still worth doing, from earlier years
          </h3>
          <p className="mb-4 text-[0.85rem] leading-relaxed text-ash">
            These aren&rsquo;t things you missed — they&rsquo;re just as useful
            started now as they would have been then. Anything genuinely tied to
            a year that&rsquo;s passed has been left out.
          </p>

          <ul className="flex flex-col gap-2">
            {catchUpShown.map(({ item, grade: g }) => {
              const meta = categoryMeta[item.category];
              return (
                <li key={item.id}>
                  <Link
                    href={`/roadmap/${g}#${item.id}`}
                    className="block rounded-xl border border-line bg-ink px-4 py-3 transition-colors hover:border-line-bright"
                  >
                    <p className="text-[0.9rem] leading-snug text-chalk">
                      {item.title}
                    </p>
                    <p className="micro mt-1.5 text-smoke">
                      Grade {g}
                      {meta ? ` · ${item.category}` : ""}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>

          {gaps.catchUp.length > 4 && (
            <button
              onClick={() => setShowAllCatchUp((v) => !v)}
              className="micro mt-3 text-chalk underline underline-offset-4 hover:text-accent"
            >
              {showAllCatchUp
                ? "Show fewer"
                : `Show all ${gaps.catchUp.length}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
