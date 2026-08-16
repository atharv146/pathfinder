import { createClient } from "@/lib/supabase/server";
import { roadmapData } from "@/data/roadmap";

export const metadata = { title: "Student progress — PathFinder" };

/**
 * The counselor-facing view of a shared link.
 *
 * Public by design — a counselor has no account and shouldn't need one. The
 * security boundary is the token plus the SECURITY DEFINER function in
 * migration 0007, which returns a deliberately narrow slice: grade, roadmap
 * progress, and activities. Never immigration status, GPA, test scores, or
 * anything the student asked the AI.
 *
 * Framed for the reader: a counselor arriving here has no idea what PathFinder
 * is, so the page says what it is and what the student chose to share, rather
 * than presenting a bare dashboard.
 */
export default async function SharedPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const { data } = await supabase.rpc("get_shared_progress", {
    p_token: token,
  });

  if (!data) {
    return (
      <section className="px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="display text-3xl text-chalk">This link isn&rsquo;t active</h1>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-ash">
            It may have been turned off by the student, or it may have expired.
            Links stop working after 180 days. Ask them for a new one.
          </p>
        </div>
      </section>
    );
  }

  const shared = data as {
    grade: number | null;
    major: string | null;
    major_undecided: boolean;
    completed_items: string[];
    activities: {
      title: string;
      organization: string | null;
      role: string | null;
      description: string | null;
      hours_per_week: number | null;
      weeks_per_year: number | null;
    }[];
  };

  const doneSet = new Set(shared.completed_items ?? []);
  const gradeItems = shared.grade
    ? (roadmapData[String(shared.grade)] ?? [])
    : [];
  const doneThisGrade = gradeItems.filter((i) => doneSet.has(i.id));

  return (
    <section className="px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <p className="micro mb-3 text-smoke">Shared with you via PathFinder</p>
        <h1 className="display text-4xl leading-tight text-chalk">
          {shared.grade ? `A grade ${shared.grade} student` : "A student"}
          {shared.major && !shared.major_undecided ? (
            <>
              {" "}
              interested in <span className="text-accent">{shared.major}</span>
            </>
          ) : null}
        </h1>

        <p className="mt-4 text-[0.95rem] leading-relaxed text-ash">
          PathFinder is a free college-prep guide for immigrant and
          first-generation students. This student chose to share their progress
          with you. They can turn this link off at any time, and it doesn&rsquo;t
          include their grades, test scores, or anything private.
        </p>

        {/* Activities first — it's the part a counselor can act on, and the
            part students most often undersell in person. */}
        <div className="mt-12">
          <h2 className="display-md text-xl text-chalk">
            Activities they&rsquo;ve written down
          </h2>
          {shared.activities.length === 0 ? (
            <p className="mt-3 text-[0.9rem] leading-relaxed text-smoke">
              Nothing added yet.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {shared.activities.map((a, i) => (
                <li key={i} className="rounded-xl border border-line bg-panel p-5">
                  <p className="text-[0.98rem] font-semibold text-chalk">
                    {a.title}
                  </p>
                  {(a.role || a.organization) && (
                    <p className="micro mt-1 text-smoke">
                      {[a.role, a.organization].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {a.description && (
                    <p className="mt-2 text-[0.88rem] leading-relaxed text-ash">
                      {a.description}
                    </p>
                  )}
                  {(a.hours_per_week || a.weeks_per_year) && (
                    <p className="micro mt-2 text-smoke">
                      {a.hours_per_week ? `${a.hours_per_week} hrs/week` : ""}
                      {a.hours_per_week && a.weeks_per_year ? " · " : ""}
                      {a.weeks_per_year ? `${a.weeks_per_year} weeks/year` : ""}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {shared.grade && (
          <div className="mt-12">
            <h2 className="display-md text-xl text-chalk">
              Grade {shared.grade} roadmap
            </h2>
            <p className="mt-1 text-[0.85rem] text-smoke">
              {doneThisGrade.length} of {gradeItems.length} marked done
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {gradeItems.map((item) => {
                const done = doneSet.has(item.id);
                return (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 rounded-xl border border-line bg-panel px-4 py-3"
                  >
                    <span
                      aria-hidden
                      className={`mt-[0.2rem] flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[0.7rem] ${
                        done
                          ? "border-accent bg-accent text-ink"
                          : "border-line-bright text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    <span
                      className={`text-[0.9rem] leading-snug ${
                        done ? "text-chalk" : "text-ash"
                      }`}
                    >
                      {item.title}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <p className="mt-12 border-t border-line pt-6 text-[0.82rem] leading-relaxed text-smoke">
          Nothing here is a grade or an evaluation — students start this
          roadmap at different points on purpose. pathfinder-atharv.vercel.app
        </p>
      </div>
    </section>
  );
}
