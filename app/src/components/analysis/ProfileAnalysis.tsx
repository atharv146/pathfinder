"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { readStructure, type StructuralReading } from "@/lib/analysis/structure";
import { opportunitiesFor, CROSS_CUTTING } from "@/data/major-opportunities";
import type { Activity, Course, Profile } from "@/lib/db/types";

/**
 * V2 §16K step 6 — Profile Analysis, the flagship tool.
 *
 * ── WHAT IT IS, AND THE LINE IT DOES NOT CROSS ────────────────────────────
 * It reads everything the student has entered and gives back four things:
 * what their course path looks like against their field's usual sequence,
 * their own activities written up in application language, programmes worth
 * knowing about, and — for their college list — the specific published
 * documents to look up.
 *
 * What it never does, and this is the whole design constraint:
 *
 * 1. **No score, no odds, no chance of admission.** Not a percentage, not a
 *    "strong/weak", not a reach/target/safety verdict of our own. That was
 *    settled Aug 16, 2026 (§16N): the ML model stays a side project and the
 *    live product uses published, citable facts instead. A confident number
 *    handed to a nervous first-gen student is the exact failure this app was
 *    built as an alternative to, and it is *more* dangerous coming from us
 *    because we sound like we're on their side.
 *
 * 2. **No invented college data.** The dream-college section does not print a
 *    single admitted-class statistic, because we have not verified one. It
 *    names the two documents every U.S. college is required to publish and
 *    tells the student how to read them. Pointing accurately at a primary
 *    source beats quoting a number we didn't check.
 *
 * 3. **The AI writes only about activities the student entered**, and never
 *    saves anything on its own. See lib/ai/resume-prompt.ts for the
 *    never-inflate rule that makes that safe.
 *
 * 4. **Missing data is an invitation, not a deficiency.** Every empty state
 *    here links to the page that fills it and explains what it would add.
 */

type ResumeEntry = { id: string; description: string; note: string | null };

export function ProfileAnalysis() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const [entries, setEntries] = useState<ResumeEntry[] | null>(null);
  const [writing, setWriting] = useState(false);
  const [writeError, setWriteError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return setLoading(false);

      const [{ data: p }, coursesRes, activitiesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("courses").select("*"),
        supabase.from("activities").select("*").order("sort_order"),
      ]);

      setProfile((p as Profile) ?? null);
      // A missing courses table (migration 0008 unapplied) degrades this
      // section rather than the page — same contract as lib/db/resilient.ts.
      setCourses(coursesRes.error ? [] : ((coursesRes.data ?? []) as Course[]));
      setActivities(
        activitiesRes.error ? [] : ((activitiesRes.data ?? []) as Activity[])
      );
      setLoading(false);
    };
    load();
  }, []);

  const writeUp = useCallback(async () => {
    setWriting(true);
    setWriteError(null);
    try {
      const res = await fetch("/api/analysis/resume", { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setWriteError(body.error ?? "Couldn't write those up just now.");
      } else {
        setEntries(body.entries ?? []);
      }
    } catch {
      setWriteError("Couldn't reach the server. Nothing was changed.");
    }
    setWriting(false);
  }, []);

  const copy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(id);
      window.setTimeout(() => setCopied(null), 1800);
    });
  };

  if (loading) return <p className="micro text-smoke">Reading your profile…</p>;

  if (!profile) {
    return (
      <p className="text-[0.95rem] leading-relaxed text-ash">
        Sign in to run this on your own profile.{" "}
        <Link href="/login" className="text-chalk underline underline-offset-4">
          Log in
        </Link>
        .
      </p>
    );
  }

  const reading = readStructure(profile, courses);
  const opportunities = reading.familyId
    ? opportunitiesFor(reading.familyId)
    : null;

  return (
    <div className="space-y-14">
      <Snapshot
        profile={profile}
        courseCount={courses.length}
        activityCount={activities.length}
      />

      <YourGoals notes={profile.goals_notes ?? null} />

      <CoursePath reading={reading} grade={profile.grade} />

      {/* ---------------------------------------------------------------- */}
      <section>
        <h2 className="display-md text-2xl text-chalk">
          Your activities, written up
        </h2>
        <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-ash">
          Takes what you already entered and writes each one the way an
          application expects it — about 150 characters, starting with what you
          did.
        </p>
        <p className="mt-2 max-w-2xl text-[0.85rem] leading-relaxed text-smoke">
          It will not add anything you didn&rsquo;t tell it. No invented titles,
          no numbers you didn&rsquo;t give, no &ldquo;founded&rdquo; where you
          wrote &ldquo;helped&rdquo;. You have to be able to defend every word
          of this in an interview, so it stays true or it stays out.
        </p>

        {activities.length === 0 ? (
          <div className="mt-6 rounded-xl border border-line bg-panel p-6">
            <p className="text-[0.92rem] leading-relaxed text-chalk">
              Your activities list is empty, so there&rsquo;s nothing to write
              up yet.
            </p>
            <p className="mt-2 max-w-2xl text-[0.88rem] leading-relaxed text-ash">
              The AI interview is the fastest way to fill it, and it&rsquo;s
              built for exactly the students who say &ldquo;I don&rsquo;t really
              do anything&rdquo; — caring for siblings, translating for your
              parents, or a weekend job all belong on an application.
            </p>
            <Link
              href="/activities"
              className="micro mt-5 inline-block text-chalk underline underline-offset-4 transition-colors hover:text-accent"
            >
              Start the interview &rarr;
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={writeUp}
                disabled={writing}
                className="rounded-full border border-accent bg-accent/[0.12] px-7 py-3 text-[0.9rem] font-semibold text-chalk transition-opacity disabled:opacity-50"
              >
                {writing
                  ? "Writing…"
                  : entries
                    ? "Write them again"
                    : `Write up my ${activities.length} activities`}
              </button>
              {entries && (
                <span className="micro text-smoke">
                  Nothing has been saved — copy what you want
                </span>
              )}
            </div>

            {writeError && (
              <p
                role="alert"
                className="mt-4 rounded-md border border-[#ff7a6b]/30 px-4 py-3 text-[0.85rem] leading-relaxed text-[#ff7a6b]"
              >
                {writeError}
              </p>
            )}

            {entries && entries.length > 0 && (
              <ul className="mt-6 flex flex-col gap-3">
                {entries.map((e) => {
                  const source = activities.find((a) => a.id === e.id);
                  return (
                    <li
                      key={e.id}
                      className="rounded-xl border border-line bg-panel p-5"
                    >
                      <p className="micro mb-2 text-smoke">
                        {source?.title ?? "Activity"}
                      </p>
                      <p className="text-[0.95rem] leading-relaxed text-chalk">
                        {e.description}
                      </p>
                      {e.note && (
                        <p className="mt-3 border-t border-line pt-3 text-[0.83rem] leading-relaxed text-ash">
                          <span className="text-accent">To make it stronger:</span>{" "}
                          {e.note}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => copy(e.id, e.description)}
                        className="micro mt-4 text-chalk underline underline-offset-4 transition-colors hover:text-accent"
                      >
                        {copied === e.id ? "Copied" : "Copy"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </section>

      {/* ---------------------------------------------------------------- */}
      {opportunities && (
        <section>
          <h2 className="display-md text-2xl text-chalk">
            Worth knowing about in {reading.familyLabel}
          </h2>
          <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-ash">
            Real programmes, each checked on its own site. Free ones first —
            nothing here assumes your family can spend thousands on a summer.
          </p>
          <ul className="mt-5 flex flex-col gap-3">
            {[...opportunities.items, ...CROSS_CUTTING.items]
              .slice(0, 4)
              .map((o) => (
                <li
                  key={o.name}
                  className="rounded-xl border border-line bg-panel p-5"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h3 className="display-md text-lg text-chalk">{o.name}</h3>
                    <span className="micro text-accent">{o.cost}</span>
                  </div>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-ash">
                    {o.what}
                  </p>
                </li>
              ))}
          </ul>
          <Link
            href="/major"
            className="micro mt-5 inline-block text-chalk underline underline-offset-4 transition-colors hover:text-accent"
          >
            All of them, plus the full pathway &rarr;
          </Link>
        </section>
      )}

      <CollegeList colleges={profile.target_colleges ?? []} />
    </div>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * Their own words (migration 0011), shown back to them near the top.
 *
 * Deliberately NOT run through a model here. This page's one AI call rewrites
 * activity text; adding a second that "evaluates your goals" would be both new
 * spend on every page load and exactly the kind of judgement this tool refuses
 * to make. What it does instead is anchor the page visibly to what the student
 * said they want, and hand them the surface that CAN discuss it — Ask AI,
 * which already receives this text as context.
 */
function YourGoals({ notes }: { notes: string | null }) {
  return (
    <section>
      <h2 className="display-md text-2xl text-chalk">What you said you want</h2>
      {notes ? (
        <>
          <blockquote className="mt-4 rounded-xl border border-line bg-panel p-5">
            <p className="whitespace-pre-line text-[0.95rem] leading-relaxed text-chalk">
              {notes}
            </p>
          </blockquote>
          <p className="mt-4 max-w-2xl text-[0.9rem] leading-relaxed text-ash">
            Everything below is read against this, not against a default plan
            for someone your age. Nothing on this page scores it — if you want
            it pushed on properly, including where it might conflict with your
            current schedule, ask about it directly.{" "}
            <Link
              href="/ask-ai"
              className="text-chalk underline underline-offset-4 transition-colors hover:text-accent"
            >
              Take it to Ask AI &rarr;
            </Link>
          </p>
        </>
      ) : (
        <p className="mt-3 max-w-2xl text-[0.9rem] leading-relaxed text-ash">
          You haven&rsquo;t written anything here yet, so this page can only
          work from numbers and course names — which is the thinnest possible
          version of you.{" "}
          <Link
            href="/stats"
            className="text-chalk underline underline-offset-4 transition-colors hover:text-accent"
          >
            Say what you actually want on your stats page
          </Link>{" "}
          — half-formed is genuinely fine, and it changes what this page and
          Ask AI can tell you.
        </p>
      )}
    </section>
  );
}

function Snapshot({
  profile,
  courseCount,
  activityCount,
}: {
  profile: Profile;
  courseCount: number;
  activityCount: number;
}) {
  const missing: { label: string; href: string; why: string }[] = [];
  if (profile.grade === null)
    missing.push({
      label: "your grade",
      href: "/stats",
      why: "almost everything here is grade-specific",
    });
  if (!profile.major && !profile.major_undecided)
    missing.push({
      label: "a field you're curious about",
      href: "/stats",
      why: "the course path below needs one to compare against",
    });
  if (courseCount === 0)
    missing.push({
      label: "your classes",
      href: "/stats",
      why: "this is what makes the course path real rather than generic",
    });
  if (activityCount === 0)
    missing.push({
      label: "your activities",
      href: "/activities",
      why: "nothing can be written up without them",
    });

  return (
    <section>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
        <Tile value={profile.grade ?? "—"} label="Grade" />
        <Tile value={courseCount} label="Classes listed" />
        <Tile value={activityCount} label="Activities" />
        <Tile value={(profile.target_colleges ?? []).length} label="Colleges" />
      </div>

      {missing.length > 0 && (
        <div className="mt-4 rounded-xl border border-line bg-panel p-5">
          <p className="micro mb-3 text-accent">
            This gets sharper with a bit more
          </p>
          <ul className="flex flex-col gap-2">
            {missing.map((m) => (
              <li key={m.label} className="text-[0.88rem] leading-relaxed text-ash">
                <Link
                  href={m.href}
                  className="text-chalk underline underline-offset-4 hover:text-accent"
                >
                  Add {m.label}
                </Link>{" "}
                — {m.why}.
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.82rem] leading-relaxed text-smoke">
            None of it is required. Everything below works with whatever you
            have.
          </p>
        </div>
      )}
    </section>
  );
}

function Tile({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="bg-ink-2 p-5">
      <p className="display text-3xl text-chalk">{value}</p>
      <p className="micro mt-1.5 text-smoke">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function CoursePath({
  reading,
  grade,
}: {
  reading: StructuralReading;
  grade: number | null;
}) {
  return (
    <section>
      <h2 className="display-md text-2xl text-chalk">Your course path</h2>
      <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-ash">
        {reading.familyLabel
          ? `The sequence most ${reading.familyLabel} students move through, with the classes you've listed matched onto it.`
          : "Pick a field on your details page and this compares your classes against that field's usual sequence."}
      </p>
      <p className="mt-2 max-w-2xl text-[0.85rem] leading-relaxed text-smoke">
        This is a common sequence, not a requirement, and district course names
        differ. Nothing here is a score, and &ldquo;not listed yet&rdquo; means
        exactly that — it&rsquo;s about the list, not about you.
      </p>

      {reading.caveats.length > 0 && (
        <ul className="mt-5 flex flex-col gap-2 rounded-xl border border-accent/30 bg-accent/[0.05] p-5">
          {reading.caveats.map((c) => (
            <li key={c} className="text-[0.86rem] leading-relaxed text-chalk">
              {c}
            </li>
          ))}
        </ul>
      )}

      {reading.ladders.length === 0 ? (
        <div className="mt-5 rounded-xl border border-line bg-panel p-6">
          <p className="text-[0.9rem] leading-relaxed text-ash">
            Nothing to compare yet.{" "}
            <Link
              href="/stats"
              className="text-chalk underline underline-offset-4 hover:text-accent"
            >
              Add your classes and a field
            </Link>{" "}
            and this fills in.
          </p>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-4">
          {reading.ladders.map((l) => (
            <div key={l.label} className="rounded-xl border border-line bg-panel p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="display-md text-lg text-chalk">{l.label}</h3>
                <span className="micro text-smoke">common sequence</span>
              </div>
              <p className="mt-2 max-w-2xl text-[0.85rem] leading-relaxed text-ash">
                {l.why}
              </p>

              <ol className="mt-5 flex flex-col gap-2.5">
                {l.steps.map((s) => (
                  <li key={s.step} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className={`mt-[0.4rem] h-2 w-2 shrink-0 rounded-full ${
                        s.matched ? "bg-accent" : "border border-line-bright"
                      }`}
                    />
                    <span className="min-w-0">
                      <span
                        className={`text-[0.92rem] leading-relaxed ${
                          s.matched ? "text-chalk" : "text-ash"
                        }`}
                      >
                        {s.step}
                      </span>
                      {s.matched ? (
                        <span className="micro ml-2 text-accent">
                          you listed {s.matched}
                        </span>
                      ) : (
                        <span className="micro ml-2 text-smoke">not listed yet</span>
                      )}
                      {s.note && (
                        <span className="mt-1 block text-[0.82rem] leading-relaxed text-smoke">
                          {s.note}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}

      {reading.unplannedGrades.length > 0 && grade !== null && (
        <div className="mt-4 rounded-xl border border-line bg-panel p-5">
          <p className="text-[0.9rem] leading-relaxed text-chalk">
            {`You haven't listed classes for grade${
              reading.unplannedGrades.length > 1 ? "s" : ""
            } ${reading.unplannedGrades.join(", ")}.`}
          </p>
          <p className="mt-2 max-w-2xl text-[0.86rem] leading-relaxed text-ash">
            Those are the years you can still change — course selection usually
            happens months before the year starts, and it&rsquo;s the one part
            of an application you can still redirect a year out.
          </p>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * The dream-college section, built exactly as §16N settled it: published
 * primary sources, and NOT ONE NUMBER we haven't verified.
 *
 * The Common Data Set is the specific unlock here — nearly every U.S. college
 * publishes one, section C tells you what the last admitted class actually
 * looked like, and essentially no student has heard of it. Section C9 also
 * carries the test-optional caveat most sites get wrong: the score range only
 * describes the admitted students who *submitted* scores, which is a
 * self-selected group, not the class.
 */
function CollegeList({ colleges }: { colleges: string[] }) {
  return (
    <section>
      <h2 className="display-md text-2xl text-chalk">Your list of colleges</h2>

      {colleges.length === 0 ? (
        <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-ash">
          You haven&rsquo;t added any yet.{" "}
          <Link
            href="/stats"
            className="text-chalk underline underline-offset-4 hover:text-accent"
          >
            Add a few
          </Link>{" "}
          — it&rsquo;s a list to think with, not a commitment.
        </p>
      ) : (
        <>
          <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-ash">
            We will not tell you your chances at these, and you should be
            suspicious of any free site that will. What we can do is point you
            at the two documents each of these schools publishes about itself.
          </p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {colleges.map((c) => (
              <li
                key={c}
                className="rounded-full border border-line bg-panel px-4 py-2 text-[0.88rem] text-chalk"
              >
                {c}
              </li>
            ))}
          </ul>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-panel p-5">
              <p className="micro mb-2 text-accent">Look up: Common Data Set</p>
              <p className="text-[0.88rem] leading-relaxed text-ash">
                Search &ldquo;<span className="text-chalk">[school name] common data set</span>&rdquo;.
                Almost every U.S. college publishes one, and section C describes
                the class they actually admitted — GPA distribution, what they
                say they weigh, and how many applied.
              </p>
              <p className="mt-3 text-[0.82rem] leading-relaxed text-smoke">
                One caveat most websites get wrong: a test-score range only
                covers admitted students who <em>submitted</em> scores. At a
                test-optional school that&rsquo;s a self-selected group, usually
                the ones with high scores — it is not the middle of the class.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-panel p-5">
              <p className="micro mb-2 text-accent">
                Look up: net price calculator
              </p>
              <p className="text-[0.88rem] leading-relaxed text-ash">
                Federal law requires every college to host one. It estimates
                what your family would actually pay after aid, which is a
                completely different number from the sticker price — often by
                tens of thousands of dollars.
              </p>
              <p className="mt-3 text-[0.82rem] leading-relaxed text-smoke">
                Run it before you rule a school out on price. Ruling out an
                expensive-looking school you could have afforded is the most
                common and most expensive mistake in this whole process.
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
