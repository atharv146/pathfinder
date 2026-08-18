"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import * as Tabs from "@radix-ui/react-tabs";
import { createClient } from "@/lib/supabase/client";
import { MAJOR_FAMILIES, findMajorFamily } from "@/data/majors";
import { MAJOR_PATHWAYS, stageForGrade } from "@/data/major-pathways";
import { Opportunities } from "@/components/roadmap/Opportunities";
import { FadeIn } from "@/components/FadeIn";
import { KineticText } from "@/components/KineticText";
import { LightWire } from "@/components/LightWire";
import { MajorSwitcher } from "./MajorSwitcher";
import { MajorGlyph } from "./MajorGlyph";
import { PathwayTimeline } from "./PathwayTimeline";
import { CourseLadder } from "./CourseLadder";
import { MajorCompare } from "./MajorCompare";
import { Activities, GeneralPrinciples } from "./Activities";

/**
 * The body of /major — everything below the page hero.
 *
 * One client component owns all of it because every section reads the same two
 * pieces of state (which family, which stage), and threading that through four
 * sibling server sections would mean either prop-drilling through the page or a
 * context provider for two numbers.
 *
 * ── WHY THIS PAGE EXISTS AT ALL ───────────────────────────────────────────
 * Major guidance used to be `MajorLens`, a card bolted onto /roadmap/[grade].
 * That had two problems: it could only ever show the student's *own* major, so
 * a 9th grader deciding between paths could see nothing; and it couldn't grow
 * without crowding the general roadmap, which is the actual product. Per
 * master-spec-doc §16K this becomes the one home for major-specific content,
 * and the roadmap keeps a slim link out.
 *
 * ── BROWSING OTHER FIELDS IS THE POINT, NOT A SIDE EFFECT ─────────────────
 * The switcher defaults to the student's own major but never locks to it. Most
 * students this app serves are deciding, not decided, and the honest thing is
 * to let them look — including at the comparison table, which shows all eight
 * at once precisely so "what's different about these paths" is answerable
 * without eight visits.
 */
export function MajorView() {
  const [profileMajorId, setProfileMajorId] = useState<string | null>(null);
  const [undecided, setUndecided] = useState(false);
  const [grade, setGrade] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [selectedId, setSelectedId] = useState<string>(MAJOR_FAMILIES[0].id);
  const [stageIndex, setStageIndex] = useState(0);
  /** Set once the student clicks a stage, so their choice isn't overwritten. */
  const [stagePinned, setStagePinned] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return setLoaded(true);

      const { data } = await supabase
        .from("profiles")
        .select("major, major_undecided, grade")
        .eq("id", user.id)
        .maybeSingle();

      const family = findMajorFamily(data?.major);
      if (family) {
        setProfileMajorId(family.id);
        setSelectedId(family.id);
      }
      setUndecided(!!data?.major_undecided);
      if (typeof data?.grade === "number") setGrade(data.grade);
      setLoaded(true);
    };
    load();
  }, []);

  const family = useMemo(
    () => MAJOR_FAMILIES.find((f) => f.id === selectedId) ?? MAJOR_FAMILIES[0],
    [selectedId]
  );
  const pathway = MAJOR_PATHWAYS[selectedId];

  /**
   * Open on the stage covering the student's own grade.
   *
   * Deliberately re-runs when the family changes: stage arrays differ per
   * family, so index 2 does not mean the same years everywhere, and carrying a
   * raw index across a switch would silently show a 12th grader the junior-year
   * panel. Skipped once the student has picked a stage themselves — at that
   * point their choice outranks our guess.
   */
  useEffect(() => {
    if (!pathway || stagePinned) return;
    if (grade == null) return setStageIndex(0);
    const stage = stageForGrade(pathway, grade);
    setStageIndex(stage ? pathway.stages.indexOf(stage) : 0);
  }, [pathway, grade, stagePinned]);

  const stage = pathway?.stages[stageIndex] ?? null;
  const isOwnGradeStage =
    !!stage && grade != null && grade >= stage.from && grade <= stage.to;

  return (
    <>
      {/* ── Pick a field ──────────────────────────────────────────────── */}
      <section className="relative px-6 pb-20 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <p className="micro text-smoke">(01) &nbsp;Pick a field</p>
              {loaded && undecided && !profileMajorId && (
                <p className="micro text-smoke">
                  You picked &ldquo;not sure yet&rdquo; — look around, that&rsquo;s
                  what this is for
                </p>
              )}
            </div>
          </FadeIn>

          {/* One Tabs.Root spans the switcher (Tabs.List/Trigger, rendered
              inside MajorSwitcher) and its matching Tabs.Content below — see
              the "RADIX, NOT A HAND-ROLLED RADIOGROUP" note in
              MajorSwitcher.tsx for why. `selectedId` stays the single React
              source of truth; Radix's `value`/`onValueChange` just reads and
              writes the same state instead of keeping its own copy. */}
          <Tabs.Root
            value={selectedId}
            onValueChange={(id) => {
              setSelectedId(id);
              setStagePinned(false);
            }}
          >
            <FadeIn delay={0.05}>
              <MajorSwitcher selectedId={selectedId} profileId={profileMajorId} />
            </FadeIn>

            {/* `.swap-in` still does the arrival animation — Radix Tabs
                unmounts inactive Content by default, so a fresh DOM node
                mounts on every switch and the keyframe replays exactly as it
                did with the plain div + key before. */}
            <Tabs.Content value={family.id} className="swap-in mt-12">
              <div className="flex items-start gap-5">
                <MajorGlyph
                  id={family.id}
                  active
                  className="mt-1 hidden h-14 w-14 shrink-0 text-accent sm:block"
                />
                <div>
                  <h2 className="display-md text-3xl leading-tight text-chalk sm:text-4xl">
                    {family.summary}
                  </h2>
                  <p className="micro mt-4 text-smoke">
                    Mostly starts mattering from grade {family.actFrom}
                  </p>
                </div>
              </div>

              <ul className="mt-9 grid gap-4 sm:grid-cols-3">
                {family.notes.map((n, i) => (
                  <li
                    key={n}
                    className="rounded-xl border border-line bg-panel p-5"
                  >
                    <span className="micro mb-3 block text-accent tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="block text-[0.86rem] leading-relaxed text-ash">
                      {n}
                    </span>
                  </li>
                ))}
              </ul>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </section>

      {/* ── The seven-year view ───────────────────────────────────────── */}
      {pathway && stage && (
        <section className="texture-grid relative border-t border-line px-6 py-20 sm:px-10">
          <div className="mx-auto max-w-5xl">
            <FadeIn>
              <p className="micro mb-5 text-smoke">(02) &nbsp;Across seven years</p>
            </FadeIn>
            <KineticText as="h2" className="display max-w-2xl text-4xl sm:text-5xl">
              What changes, and <span className="glow-accent italic">when.</span>
            </KineticText>

            {/* A second, independent Tabs.Root — the family switcher above and
                the stage selector here are two separate tablists with two
                separate values, not one compound control. Keyed by family id
                so switching families (which can reset stageIndex via the
                effect above) can't leave Radix holding a stale `value` that
                no Tabs.Trigger in the new family's list actually has. */}
            <Tabs.Root
              key={family.id}
              value={String(stageIndex)}
              onValueChange={(v) => {
                setStageIndex(Number(v));
                setStagePinned(true);
              }}
            >
              <FadeIn delay={0.1}>
                <div className="mt-12">
                  <PathwayTimeline
                    stages={pathway.stages}
                    selectedIndex={stageIndex}
                    grade={grade}
                  />
                </div>
              </FadeIn>

              <Tabs.Content value={String(stageIndex)} className="swap-in mt-12">
                <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <p className="display-md text-2xl text-chalk sm:text-3xl">
                    {stage.gist}
                  </p>
                  {isOwnGradeStage && (
                    <span className="micro rounded-full border border-accent/50 bg-accent/[0.08] px-3 py-1 text-accent">
                      Where you are
                    </span>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <StageList
                    label="Courses"
                    items={stage.courses}
                    hint="What to take, and what it unlocks."
                  />
                  <StageList
                    label="Outside class"
                    items={stage.activities}
                    hint="Free and already-in-your-life options first, deliberately."
                  />
                </div>
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </section>
      )}

      {/* ── The narrative angle, on a light ground ────────────────────────
          The page's one inversion. Intrepid alternates dark → light → dark and
          that rhythm does more to break up a long page than any single
          animation — and this is the most editorial content on the page, so it
          gets the editorial treatment. */}
      {stage && (
        <section className="bone-surface relative overflow-hidden px-6 py-24 text-ink sm:px-10 sm:py-32">
          <LightWire />
          <div className="relative mx-auto max-w-4xl">
            <FadeIn>
              <p className="micro mb-8 text-ink/45">
                (03) &nbsp;The story this field tends to tell
              </p>
            </FadeIn>
            <blockquote
              key={`${family.id}-${stageIndex}-narrative`}
              className="swap-in"
            >
              <p className="display-md text-2xl leading-[1.3] text-ink sm:text-[2.1rem]">
                {stage.narrative}
              </p>
              <footer className="micro mt-8 text-ink/50">
                {family.label} · {stage.label}
              </footer>
            </blockquote>
            <FadeIn delay={0.15}>
              <p className="mt-12 max-w-xl text-[0.85rem] leading-relaxed text-ink/60">
                This is what applications in this field commonly look like — not
                a formula, and not a claim about what gets anyone admitted. If it
                doesn&rsquo;t describe you, that is genuinely fine; it&rsquo;s a
                starting point for a draft, not a specification.
              </p>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ── Course ladder ─────────────────────────────────────────────── */}
      {pathway && (
        <section className="relative border-t border-line px-6 py-20 sm:px-10">
          <div className="mx-auto max-w-5xl">
            <FadeIn>
              <p className="micro mb-5 text-smoke">(04) &nbsp;The course chain</p>
            </FadeIn>
            <KineticText as="h2" className="display max-w-3xl text-4xl sm:text-5xl">
              Where you finish depends on where you{" "}
              <span className="glow-accent italic">start.</span>
            </KineticText>
            <FadeIn delay={0.1}>
              <p className="mt-4 max-w-2xl text-ash">
                These courses are a chain, not a list. Each one is the
                prerequisite for the next, which is why a decision made in 8th
                grade can still be binding in 12th.
              </p>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="mt-14">
                <CourseLadder tracks={pathway.ladders} />
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ── Outside the classroom ─────────────────────────────────────────
          Deliberately the largest section on the page: this is the part of an
          application the app previously said nothing about. See the header
          note in data/major-activities.ts. */}
      <section className="relative border-t border-line px-6 py-20 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <p className="micro mb-5 text-smoke">(05) &nbsp;Outside the classroom</p>
          </FadeIn>
          <KineticText as="h2" className="display max-w-3xl text-4xl sm:text-5xl">
            Courses are half of it. This is the{" "}
            <span className="glow-accent italic">other half.</span>
          </KineticText>
          <FadeIn delay={0.1}>
            <p className="mt-4 max-w-2xl text-ash">
              What you do outside class is a large part of an application, and
              almost none of the good options cost money. Here&rsquo;s what
              tends to fit {family.label}, and what to make.
            </p>
          </FadeIn>

          <div className="mt-12">
            <Activities familyId={family.id} familyLabel={family.label} />
          </div>
        </div>
      </section>

      {/* ── The universal part ───────────────────────────────────────────
          Its own section, not folded into the block above, because these are
          true whatever you study — rendering them inside the family-specific
          area would imply they change when you switch fields. */}
      <section className="texture-dots relative border-t border-line px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <p className="micro mb-5 text-smoke">
              (06) &nbsp;True whatever you study
            </p>
          </FadeIn>
          <KineticText as="h2" className="display max-w-3xl text-4xl sm:text-5xl">
            Seven things nobody{" "}
            <span className="glow-accent italic">tells you.</span>
          </KineticText>
          <FadeIn delay={0.1}>
            <p className="mt-4 max-w-2xl text-ash">
              These don&rsquo;t change with your major. Several of them exist to
              contradict advice you&rsquo;ll hear elsewhere.
            </p>
          </FadeIn>

          <div className="mt-14">
            <GeneralPrinciples />
          </div>
        </div>
      </section>

      {/* ── Real programs (moved here from MajorLens) ─────────────────── */}
      <section className="relative border-t border-line px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <p className="micro mb-5 text-smoke">(07) &nbsp;Real programs</p>
          </FadeIn>
          <KineticText as="h2" className="display max-w-2xl text-4xl sm:text-5xl">
            Checked, dated, and{" "}
            <span className="glow-accent italic">free.</span>
          </KineticText>
          <FadeIn delay={0.1}>
            <div className="mt-10">
              {/* Grade gate lifted deliberately: on /roadmap this was hidden
                  below grade 9 because a rising-senior deadline is noise inside
                  a 7th grader's checklist. Here, a student who navigated to a
                  page about their field is browsing on purpose, and knowing
                  these exist years early is the advantage this app is for. */}
              <Opportunities familyId={family.id} familyLabel={family.label} />
            </div>
          </FadeIn>

          {/* The programmes above are the competitive route. Most students
              never learn there are two other routes into research that don't
              require getting accepted to anything, which is what this points
              at — it belongs here, next to the list that can otherwise read
              as "these or nothing". */}
          <FadeIn delay={0.15}>
            <div className="mt-8 rounded-2xl border border-line bg-panel p-6">
              <h3 className="display-md text-lg text-chalk">
                Didn&rsquo;t get into one of those? You can still do research.
              </h3>
              <p className="mt-2 max-w-2xl text-[0.88rem] leading-relaxed text-ash">
                Structured programmes are competitive enough that they belong on
                a list of things you apply to, never a plan. The other two
                routes — emailing a professor at a nearby university directly,
                or running your own project — need nobody&rsquo;s permission and
                cost nothing.
              </p>
              <Link
                href="/guide/how-to-actually-do-research-in-high-school"
                className="micro mt-4 inline-block text-chalk underline underline-offset-4 transition-colors hover:text-accent"
              >
                How to actually do research in high school &rarr;
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Questions and unknowns ────────────────────────────────────── */}
      <section className="relative border-t border-line px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <p className="micro mb-5 text-smoke">(08) &nbsp;What to ask, what we don&rsquo;t know</p>
          </FadeIn>

          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="display-md text-2xl text-chalk">
                Worth asking your counselor
              </h3>
              <p className="mt-3 text-[0.86rem] leading-relaxed text-ash">
                Questions, not answers — deliberately. The answers are
                school-specific and we&rsquo;d be guessing at them. The question
                itself is the thing a better-resourced classmate already knows to
                ask.
              </p>
              {/* FadeIn rather than a bare motion.li: these carry real text,
                  and FadeIn is the component that already owns the failsafe
                  timer for "the IntersectionObserver never reported". A raw
                  whileInView with initial opacity 0 would leave the questions
                  permanently blank if the trigger missed. */}
              <ul className="mt-6 flex flex-col gap-2.5">
                {family.askCounselor.map((q, i) => (
                  <li key={q}>
                    <FadeIn delay={i * 0.07} y={0}>
                      <span className="group relative block overflow-hidden rounded-lg border border-line bg-ink px-4 py-3 text-[0.88rem] leading-snug text-chalk transition-colors hover:border-accent/50">
                        <span
                          aria-hidden
                          className="absolute inset-y-0 left-0 w-[2px] bg-accent/0 transition-colors group-hover:bg-accent"
                        />
                        &ldquo;{q}&rdquo;
                      </span>
                    </FadeIn>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="display-md text-2xl text-chalk">
                Check these per school
              </h3>
              <p className="mt-3 text-[0.86rem] leading-relaxed text-ash">
                These genuinely differ school to school. We&rsquo;re naming what
                we don&rsquo;t know for you rather than guessing and sounding
                confident.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {family.verify.map((v) => (
                  <li key={v} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-smoke"
                    />
                    <span className="text-[0.88rem] leading-relaxed text-ash">
                      {v}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/ask-ai"
                className="micro mt-8 inline-block text-chalk underline underline-offset-4 transition-colors hover:text-accent"
              >
                Ask the AI how to find these out →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Compare all eight ─────────────────────────────────────────── */}
      <section className="texture-grid relative border-t border-line px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <p className="micro mb-5 text-smoke">(09) &nbsp;Side by side</p>
          </FadeIn>
          <KineticText as="h2" className="display max-w-3xl text-4xl sm:text-5xl">
            How the eight fields actually{" "}
            <span className="glow-accent italic">differ.</span>
          </KineticText>
          <FadeIn delay={0.1}>
            <p className="mt-4 max-w-2xl text-ash">
              Not which is better — that question has no answer. These are the
              structural differences that change what you have to do, and when.
              Pick a row to see that field in full.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="mt-12">
              <MajorCompare selectedId={selectedId} onSelect={setSelectedId} />
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Link
                href={grade ? `/roadmap/${grade}` : "/roadmap"}
                className="micro text-chalk underline underline-offset-4 transition-colors hover:text-accent"
              >
                {grade ? `Back to your grade ${grade} roadmap` : "Back to the roadmap"} →
              </Link>
              <Link
                href="/stats"
                className="micro text-smoke transition-colors hover:text-chalk"
              >
                Change your major
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

function StageList({
  label,
  items,
  hint,
}: {
  label: string;
  items: string[];
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-panel p-6">
      <p className="micro text-accent">{label}</p>
      <p className="mt-1.5 text-[0.78rem] leading-relaxed text-smoke">{hint}</p>
      <ul className="mt-5 flex flex-col gap-3.5">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-accent"
            />
            <span className="text-[0.88rem] leading-relaxed text-ash">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
