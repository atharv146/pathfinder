"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addCourse,
  deleteCourse,
  fetchCourses,
  updateCourse,
  type CourseDraft,
} from "@/lib/db/courses";
import type { Course, CourseLevel, CourseStatus, CourseSubject } from "@/lib/db/types";

/**
 * The per-course list — V2 §16K step 3, migration 0008.
 *
 * WHAT THIS IS FOR: `profiles.course_rigor` asks a student to grade their own
 * schedule in four buckets. That was enough for the roadmap and is not enough
 * for Profile Analysis, which has to reason about actual sequences — whether
 * the math ladder reaches calculus, whether a language sequence stops at level
 * two, what senior year is currently planned to look like.
 *
 * RULES THIS COMPONENT EXISTS TO HOLD:
 *
 * 1. **It never scores the schedule.** Same non-negotiable as `WhereYouAre`
 *    and the `/major` timeline: it counts and it displays, it does not judge.
 *    No rigor score, no "you should be taking more", no progress bar. The
 *    counts below are facts about what's listed, nothing more.
 *
 * 2. **Empty is a normal state, not a gap.** A blank list must never read as a
 *    deficiency report — plenty of students will never fill this in, and the
 *    coarse `course_rigor` answer on this same page stays the one-click
 *    alternative. Everything downstream must work with zero rows.
 *
 * 3. **Free-text titles.** Course naming is wildly inconsistent between
 *    districts; a fixed picker would make students mislabel their own
 *    transcript to fit our vocabulary. See migration 0008.
 *
 * 4. **Planned classes are first-class.** Next year's schedule is the part a
 *    student can still change, which makes it the most useful thing on the
 *    page — not an afterthought behind "courses I've taken".
 */

const LEVELS: { value: CourseLevel; label: string }[] = [
  { value: "regular", label: "Regular" },
  { value: "honors", label: "Honors" },
  { value: "ap", label: "AP" },
  { value: "ib", label: "IB" },
  { value: "dual_enrollment", label: "Dual enrollment / college" },
  { value: "other", label: "Other" },
];

const SUBJECTS: { value: CourseSubject; label: string }[] = [
  { value: "math", label: "Math" },
  { value: "english", label: "English" },
  { value: "science", label: "Science" },
  { value: "social_studies", label: "History / social studies" },
  { value: "world_language", label: "World language" },
  { value: "arts", label: "Arts" },
  { value: "cte", label: "CTE / technical" },
  { value: "other", label: "Other" },
];

const STATUSES: { value: CourseStatus; label: string }[] = [
  { value: "taken", label: "Finished" },
  { value: "taking", label: "Taking now" },
  { value: "planned", label: "Planned" },
];

const GRADES = [6, 7, 8, 9, 10, 11, 12];

const LEVEL_LABEL = Object.fromEntries(
  LEVELS.map((l) => [l.value, l.label])
) as Record<CourseLevel, string>;

const STATUS_LABEL = Object.fromEntries(
  STATUSES.map((s) => [s.value, s.label])
) as Record<CourseStatus, string>;

/** Levels that are "above the default track" — counted, never scored. */
const ADVANCED: CourseLevel[] = ["honors", "ap", "ib", "dual_enrollment"];

const fieldClass =
  "w-full rounded-md border border-line bg-ink-2 px-3 py-2.5 text-[0.9rem] text-chalk outline-none transition-colors focus:border-accent";

function emptyDraft(grade: number | null): CourseDraft {
  return {
    grade,
    title: "",
    level: null,
    subject: null,
    status: "taking",
  };
}

export function CourseList({ grade }: { grade: number | null }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missingTable, setMissingTable] = useState(false);
  const [draft, setDraft] = useState<CourseDraft>(() => emptyDraft(grade));
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchCourses().then((res) => {
      if (cancelled) return;
      setCourses(res.courses);
      setMissingTable(res.missingTable);
      // A missing table gets its own explanatory panel below, so it isn't
      // also reported as a raw Postgres error.
      setError(res.missingTable ? null : res.error);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // The student's own grade is the sensible default for a new row, but only
  // until they pick a different one — re-syncing after that would fight them.
  useEffect(() => {
    setDraft((d) => (d.grade === null ? { ...d, grade } : d));
  }, [grade]);

  const submit = useCallback(async () => {
    const title = draft.title.trim();
    if (!title || adding) return;

    setAdding(true);
    setError(null);
    const sortOrder = courses.filter((c) => c.grade === draft.grade).length;
    const { course, error: err } = await addCourse({ ...draft, title }, sortOrder);
    setAdding(false);

    if (err || !course) {
      setError(err ?? "Couldn't save that class.");
      return;
    }
    setCourses((prev) => [...prev, course]);
    // Keep grade and status — someone entering a schedule is entering several
    // rows for the same year, and resetting those every time is a chore.
    setDraft((d) => ({ ...d, title: "", level: null, subject: null }));
  }, [adding, courses, draft]);

  const patch = useCallback(
    async (id: string, change: Partial<CourseDraft>) => {
      setCourses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...change } : c))
      );
      const err = await updateCourse(id, change);
      if (err) setError(err);
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    const previous = courses;
    setCourses((prev) => prev.filter((c) => c.id !== id));
    const err = await deleteCourse(id);
    if (err) {
      setCourses(previous);
      setError(err);
    }
  }, [courses]);

  /** Chronological, and only the years that actually have something in them. */
  const byGrade = useMemo(() => {
    const groups = new Map<number | null, Course[]>();
    for (const c of courses) {
      const key = c.grade ?? null;
      groups.set(key, [...(groups.get(key) ?? []), c]);
    }
    return [...groups.entries()].sort((a, b) => (a[0] ?? 99) - (b[0] ?? 99));
  }, [courses]);

  const advancedCount = courses.filter(
    (c) => c.level && ADVANCED.includes(c.level)
  ).length;

  // Assembled as one string rather than interpolated beside prose in JSX —
  // that pattern is a live source of user-visible defects in this codebase
  // (see the whitespace note in CLAUDE.md). It is also, plainly, a count of
  // what's been entered: no target, no denominator, no judgement.
  const summary =
    `${courses.length} listed` +
    (advancedCount > 0 ? ` · ${advancedCount} honors/AP/IB/college` : "");

  return (
    <div className="rounded-lg border border-line bg-panel p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="display-md text-xl text-chalk">Your classes</h2>
        {courses.length > 0 && (
          <p className="micro text-smoke">{summary}</p>
        )}
      </div>

      <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-ash">
        List what you&rsquo;ve taken, what you&rsquo;re in now, and what
        you&rsquo;re planning. This is optional — the quick &ldquo;course
        load&rdquo; answer below covers you if you&rsquo;d rather not type them
        all out.
      </p>
      <p className="mt-2 max-w-2xl text-[0.85rem] leading-relaxed text-smoke">
        Why it&rsquo;s worth the five minutes: a schedule only means something
        next to what your school actually offers, and the planned years are the
        part you can still change.
      </p>

      {missingTable && (
        <p
          role="alert"
          className="mt-5 rounded-md border border-[#ff7a6b]/30 px-4 py-3 text-[0.85rem] leading-relaxed text-[#ff7a6b]"
        >
          The database doesn&rsquo;t have a courses table yet — run migration
          0008 in Supabase. Nothing you type here will save until then.
        </p>
      )}

      {error && !missingTable && (
        <p
          role="alert"
          className="mt-5 rounded-md border border-[#ff7a6b]/30 px-4 py-3 text-[0.85rem] leading-relaxed text-[#ff7a6b]"
        >
          {error}
        </p>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Add a class */}
      <div className="mt-7 rounded-md border border-line-bright bg-ink p-4 sm:p-5">
        <h3 className="micro mb-4 text-smoke">Add a class</h3>

        <div className="grid gap-3 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label className="sr-only" htmlFor="course-title">
              Class name
            </label>
            <input
              id="course-title"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Class name — e.g. Algebra 2"
              className={fieldClass}
            />
          </div>

          <div>
            <label className="sr-only" htmlFor="course-grade">
              Grade
            </label>
            <select
              id="course-grade"
              value={draft.grade ?? ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  grade: e.target.value ? Number(e.target.value) : null,
                })
              }
              className={fieldClass}
            >
              <option value="">Year?</option>
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="sr-only" htmlFor="course-level">
              Level
            </label>
            <select
              id="course-level"
              value={draft.level ?? ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  level: (e.target.value || null) as CourseLevel | null,
                })
              }
              className={fieldClass}
            >
              <option value="">Level?</option>
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="sr-only" htmlFor="course-status">
              Status
            </label>
            <select
              id="course-status"
              value={draft.status}
              onChange={(e) =>
                setDraft({ ...draft, status: e.target.value as CourseStatus })
              }
              className={fieldClass}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="course-subject">
            Subject
          </label>
          <select
            id="course-subject"
            value={draft.subject ?? ""}
            onChange={(e) =>
              setDraft({
                ...draft,
                subject: (e.target.value || null) as CourseSubject | null,
              })
            }
            className={`${fieldClass} sm:w-56`}
          >
            <option value="">Subject (optional)</option>
            {SUBJECTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={submit}
            disabled={!draft.title.trim() || adding}
            className="rounded-full border border-accent/60 bg-accent/10 px-6 py-2.5 text-[0.85rem] font-semibold text-chalk transition-opacity disabled:opacity-40"
          >
            {adding ? "Adding…" : "Add class"}
          </button>
        </div>

        <p className="micro mt-3 leading-relaxed text-smoke">
          Not sure whether something counts as honors? Leave it blank — a guess
          you can&rsquo;t back up is worse than an empty field.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* The list */}
      {loading ? (
        <p className="micro mt-7 text-smoke">Loading…</p>
      ) : courses.length === 0 ? (
        <p className="mt-7 text-[0.9rem] leading-relaxed text-smoke">
          Nothing listed yet. That&rsquo;s completely fine — everything in
          PathFinder works without this.
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          {byGrade.map(([g, rows]) => (
            <section key={g ?? "unknown"}>
              <h3 className="micro mb-3 text-accent">
                {g === null ? "Year not set" : `Grade ${g}`}
                <span className="ml-3 text-smoke">{rows.length}</span>
              </h3>

              <ul className="divide-y divide-line overflow-hidden rounded-md border border-line">
                {rows.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-ink-2 px-4 py-3"
                  >
                    <span className="min-w-0 flex-1 text-[0.95rem] text-chalk">
                      {c.title}
                    </span>

                    {/* Editable in place: a student's schedule changes mid-year
                        and re-typing the row to fix a dropdown is friction for
                        no reason. */}
                    <select
                      aria-label={`Level for ${c.title}`}
                      value={c.level ?? ""}
                      onChange={(e) =>
                        patch(c.id, {
                          level: (e.target.value || null) as CourseLevel | null,
                        })
                      }
                      className="rounded border border-line bg-ink px-2 py-1 text-[0.78rem] text-ash outline-none focus:border-accent"
                    >
                      <option value="">Level —</option>
                      {LEVELS.map((l) => (
                        <option key={l.value} value={l.value}>
                          {LEVEL_LABEL[l.value]}
                        </option>
                      ))}
                    </select>

                    <select
                      aria-label={`Status for ${c.title}`}
                      value={c.status}
                      onChange={(e) =>
                        patch(c.id, { status: e.target.value as CourseStatus })
                      }
                      className="rounded border border-line bg-ink px-2 py-1 text-[0.78rem] text-ash outline-none focus:border-accent"
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {STATUS_LABEL[s.value]}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => remove(c.id)}
                      aria-label={`Remove ${c.title}`}
                      className="rounded px-2 py-1 text-[0.78rem] text-smoke transition-colors hover:text-[#ff7a6b]"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
