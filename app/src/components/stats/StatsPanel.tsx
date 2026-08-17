"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CourseList } from "@/components/stats/CourseList";
import { SchoolContext } from "@/components/stats/SchoolContext";
import { ProfileDetails } from "@/components/account/ProfileDetails";
import { MAJOR_FAMILIES } from "@/data/majors";
import type { Profile } from "@/lib/db/types";

/**
 * `/stats` — everything PathFinder knows about the student, in one editable
 * place. V2 §16K step 3.
 *
 * WHY IT'S SEPARATE FROM `/account`: the split is by what the thing *is*, not
 * by what table it lives in. `/account` is your login, your language, sharing
 * and deletion — the things you do to an account. `/stats` is the picture of
 * you that the roadmap, the AI and (next) Profile Analysis read from. Mixing
 * "delete everything I own" into the same scroll as "add a class" made the
 * profile fields hard to find and the destructive one too easy to reach.
 *
 * The count tiles moved here with the fields, and a Courses count joins them.
 * NOTE ON THOSE TILES: they are counts of what you've entered, never a score.
 * No target, no denominator, no "X of Y" — same rule as `WhereYouAre`.
 */

const GRADES = [6, 7, 8, 9, 10, 11, 12];

export function StatsPanel() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [doneCount, setDoneCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);
  const [courseCount, setCourseCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return setLoading(false);

      const [{ data: p }, { count: pc }, { count: ac }, courses] =
        await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
          supabase
            .from("roadmap_progress")
            .select("*", { count: "exact", head: true }),
          supabase.from("activities").select("*", { count: "exact", head: true }),
          // Its own query rather than a join: migration 0008 may not be applied,
          // and a missing table must not take the rest of the page down with it.
          supabase.from("courses").select("*", { count: "exact", head: true }),
        ]);

      setProfile((p as Profile) ?? null);
      setDoneCount(pc ?? 0);
      setActivityCount(ac ?? 0);
      setCourseCount(courses.error ? null : courses.count ?? 0);
      setLoading(false);
    };
    load();
  }, []);

  const patchProfile = async (patch: Partial<Profile>) => {
    if (!profile) return;
    setProfile({ ...profile, ...patch });
    setSaved(false);
    const supabase = createClient();
    await supabase.from("profiles").update(patch).eq("id", profile.id);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <p className="micro text-smoke">Loading…</p>;

  if (!profile) {
    return (
      <p className="text-[0.95rem] leading-relaxed text-ash">
        Sign in to edit your details.{" "}
        <Link href="/login" className="text-chalk underline underline-offset-4">
          Log in
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="space-y-12">
      {/* ---------------------------------------------------------------- */}
      <section>
        <div className="flex items-baseline justify-between gap-4">
          <p className="micro text-smoke">Your grade</p>
          {saved && <span className="micro text-signal">✓ Saved</span>}
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7 sm:gap-3">
          {GRADES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => patchProfile({ grade: g })}
              aria-pressed={profile.grade === g}
              className={`display rounded-lg border py-4 text-xl transition-all sm:py-5 sm:text-2xl ${
                profile.grade === g
                  ? "border-accent bg-accent/10 text-chalk"
                  : "border-line text-ash hover:border-line-bright hover:text-chalk"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Major lives here because this is the only page that can actually
          change it. `/major` used to link to `/account` for this, where no
          such control existed — a dead end, now fixed. */}
      <section>
        <p className="micro mb-4 text-smoke">What you might study</p>
        <div className="flex flex-wrap gap-2.5">
          {MAJOR_FAMILIES.map((m) => {
            const active = profile.major === m.label && !profile.major_undecided;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() =>
                  patchProfile({ major: m.label, major_undecided: false })
                }
                aria-pressed={active}
                className={`rounded-full border px-5 py-2.5 text-[0.85rem] transition-all ${
                  active
                    ? "border-accent bg-accent/10 text-chalk"
                    : "border-line text-ash hover:border-line-bright hover:text-chalk"
                }`}
              >
                {m.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => patchProfile({ major: null, major_undecided: true })}
            aria-pressed={profile.major_undecided}
            className={`rounded-full border px-5 py-2.5 text-[0.85rem] transition-all ${
              profile.major_undecided
                ? "border-accent bg-accent/10 text-chalk"
                : "border-line text-ash hover:border-line-bright hover:text-chalk"
            }`}
          >
            Still deciding
          </button>
        </div>
        <p className="mt-3 text-[0.8rem] leading-relaxed text-smoke">
          Changing this changes what{" "}
          <Link href="/major" className="text-ash underline underline-offset-4">
            your major page
          </Link>{" "}
          shows you. Switching it costs nothing and loses nothing.
        </p>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Counts of what you've entered. Never a score — see the header note. */}
      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
        <div className="bg-ink-2 p-5 sm:p-6">
          <p className="display text-3xl text-chalk sm:text-4xl">{doneCount}</p>
          <p className="micro mt-2 text-smoke">Roadmap items done</p>
        </div>
        <div className="bg-ink-2 p-5 sm:p-6">
          <p className="display text-3xl text-chalk sm:text-4xl">
            {activityCount}
          </p>
          <p className="micro mt-2 text-smoke">Activities saved</p>
        </div>
        <div className="bg-ink-2 p-5 sm:p-6">
          <p className="display text-3xl text-chalk sm:text-4xl">
            {courseCount ?? "—"}
          </p>
          <p className="micro mt-2 text-smoke">Classes listed</p>
        </div>
      </section>

      <CourseList grade={profile.grade} />

      <SchoolContext profile={profile} />

      <ProfileDetails profile={profile} />

      <p className="text-[0.85rem] leading-relaxed text-smoke">
        Looking for your email, language, sharing or account deletion? Those
        live on{" "}
        <Link href="/account" className="text-ash underline underline-offset-4">
          your account page
        </Link>
        .
      </p>
    </div>
  );
}
