import Link from "next/link";
import { slugify } from "@/data/guide";
import { RevealText } from "@/components/RevealText";
import { FadeIn } from "@/components/FadeIn";
import { Magnetic } from "@/components/Magnetic";
import { GradeRow } from "@/components/GradeRow";
import { DotField } from "@/components/DotField";
import { ArcLine } from "@/components/ArcLine";
import { ArrowLink } from "@/components/ArrowLink";
import { ScrollFade } from "@/components/ScrollFade";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="texture-dots relative h-14 overflow-visible border-y border-border">
        <ArcLine className="pointer-events-none absolute inset-x-0 top-0 h-24 w-full opacity-50" />
      </div>
      <StatBreak />
      <ReadingModeSample />
      <EditorialBeat />
      <RoadmapPreview />
      <ClosingCta />
    </>
  );
}

/**
 * A short editorial beat that fades in and back out as you scroll past it —
 * distinct from RevealText's reveal-once behavior. Kept to one moment on the
 * page rather than applied to everything, since fading text you're meant to
 * read would hurt usability.
 */
function EditorialBeat() {
  return (
    <section className="flex min-h-[40vh] items-center justify-center border-y border-border px-6 py-16 sm:px-10">
      <ScrollFade className="mx-auto max-w-xl text-center">
        <p className="font-display text-2xl font-medium leading-snug text-text-soft sm:text-3xl">
          Not another generic checklist. A roadmap that actually says something.
        </p>
      </ScrollFade>
    </section>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-6 pb-24 pt-14 sm:px-10 sm:pt-20">
      <DotField className="absolute inset-0 dot-field-hero-mask" />

      {/* Floating geometric markers — abstract "asteroid" motif, kept sparse and click-through */}
      <div
        className="drift-shape absolute right-[8%] top-[14%] h-20 w-20 rotate-12 rounded-2xl border border-border/80 bg-gradient-to-br from-surface to-void-soft shadow-[0_0_60px_-15px_var(--color-glow-amber)]"
        style={{ animationDelay: "0.4s" }}
        aria-hidden
      />
      <div
        className="drift-shape absolute right-[16%] top-[46%] h-10 w-10 rotate-45 rounded-lg border border-signal/40 bg-void-soft"
        style={{ animationDelay: "1.8s" }}
        aria-hidden
      />

      <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <FadeIn>
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-signal">
              Free · Student-owned · Grades 6–12
            </p>
          </FadeIn>

          <RevealText
            as="h1"
            text="Your path to college, mapped out for real."
            className="font-display text-6xl font-semibold leading-[0.98] tracking-tight sm:text-8xl"
          />
        </div>

        <div className="lg:pb-2">
          <FadeIn delay={0.35}>
            <p className="max-w-sm text-base leading-relaxed text-text-soft">
              Honest, specific guidance for immigrant and first-generation students
              and their families — from 6th grade through decision day. No school
              counselor waitlist required.
            </p>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link
                  href="/roadmap"
                  className="inline-block rounded-full bg-gradient-to-r from-glow-amber to-glow-ember px-7 py-3 font-medium text-void"
                >
                  Start your roadmap
                </Link>
              </Magnetic>
              <Magnetic>
                <ArrowLink href="/guide" className="text-text-soft hover:text-text">
                  See how it works
                </ArrowLink>
              </Magnetic>
            </div>
          </FadeIn>
        </div>
      </div>

      <p className="relative mt-20 font-mono text-xs uppercase tracking-widest text-text-faint">
        ↓ Scroll to explore
      </p>
    </section>
  );
}

/**
 * A bold full-color break in the otherwise dark chrome — the "commit to the
 * brand color" move from plusanton.com, not just an accent pop. Two real,
 * sourced statistics (the gap, then the scale) instead of one, with
 * geometric shapes drifting behind them.
 */
function StatBreak() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-glow-ember via-glow-ember to-glow-amber px-6 py-24 sm:px-10">
      <span
        className="drift-shape absolute left-[6%] top-[10%] h-24 w-24 rotate-12 rounded-3xl border border-void/20 bg-void/10"
        style={{ animationDelay: "0.2s" }}
        aria-hidden
      />
      <span
        className="drift-shape absolute right-[10%] top-[18%] h-14 w-14 rotate-45 rounded-xl border border-void/20 bg-void/10"
        style={{ animationDelay: "1.2s" }}
        aria-hidden
      />
      <span
        className="drift-shape absolute bottom-[14%] left-[16%] h-10 w-10 rounded-full border border-void/25"
        style={{ animationDelay: "2s" }}
        aria-hidden
      />
      <span
        className="drift-shape absolute bottom-[20%] right-[20%] h-20 w-20 rotate-[20deg] rounded-2xl border border-void/20 bg-void/10"
        style={{ animationDelay: "0.8s" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl text-center text-void">
        <RevealText
          as="h2"
          text="School counselors have about 1.5 hours a year to spend on college guidance, per student."
          className="font-display text-3xl font-semibold leading-snug sm:text-4xl"
        />
        <FadeIn delay={0.35}>
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-void/70">
            National Association for College Admission Counseling · 2019 estimate
          </p>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="mx-auto mt-14 h-px w-16 bg-void/30" />
        </FadeIn>

        <div className="mt-14">
          <RevealText
            as="h2"
            text="Nearly 6 million immigrant-origin students are in U.S. higher ed today — 32% of the total."
            className="font-display text-2xl font-semibold leading-snug sm:text-3xl"
          />
          <FadeIn delay={0.35}>
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-void/70">
              Presidents&rsquo; Alliance on Higher Education &amp; Immigration · 2023
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function ReadingModeSample() {
  return (
    <section className="relative bg-void-soft px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <FadeIn>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-signal">
            From the guide
          </p>
        </FadeIn>
        <RevealText
          as="h2"
          text="How the U.S. College System Works"
          className="font-display text-2xl font-semibold sm:text-3xl"
        />
        <FadeIn delay={0.2}>
          <p className="mt-5 text-base leading-relaxed text-text-soft sm:text-lg">
            If this system feels confusing or backwards compared to what you knew
            growing up, that&rsquo;s completely normal. This isn&rsquo;t something anyone is
            expected to already know — this guide walks through the parts that trip up
            most families, starting from the very beginning.
          </p>
          <ArrowLink
            href={`/guide/${slugify("How the U.S. College System Works")}`}
            className="mt-6 font-mono text-sm text-signal hover:text-text"
          >
            Read the full guide
          </ArrowLink>
        </FadeIn>
      </div>
    </section>
  );
}

/**
 * Deliberately not a uniform card grid — a stacked, numbered list with each
 * row revealing on scroll, closer to an editorial table of contents than a
 * template pricing-tier layout.
 */
function RoadmapPreview() {
  const grades = [
    { grade: 6, label: "Middle School", note: "Explore. Nothing here is evaluated by any college, ever." },
    { grade: 9, label: "Early High School", note: "Build habits, find your spike, start the family conversation." },
    { grade: 11, label: "Junior Year", note: "Essays, testing, financial aid research — the busiest year." },
    { grade: 12, label: "Senior Year", note: "Applications, offers, and the decision that follows." },
  ];

  return (
    <section className="texture-dots relative overflow-hidden px-6 py-24 sm:px-10">
      <span
        className="font-display pointer-events-none absolute -right-6 top-4 select-none text-[9rem] font-bold leading-none text-void-soft sm:text-[13rem]"
        aria-hidden
      >
        06–12
      </span>
      <span
        className="drift-shape absolute bottom-[10%] left-[4%] h-12 w-12 rotate-[15deg] rounded-xl border border-signal/30"
        style={{ animationDelay: "1.4s" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl">
        <FadeIn>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-text-faint">
            The roadmap
          </p>
        </FadeIn>
        <RevealText
          as="h2"
          text="Every grade, mapped."
          className="font-display text-3xl font-semibold sm:text-4xl"
        />

        <div className="mt-12 divide-y divide-border border-y border-border">
          {grades.map((g, i) => (
            <GradeRow key={g.grade} grade={g.grade} label={g.label} note={g.note} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="relative overflow-hidden px-6 py-28 sm:px-10">
      <span
        className="drift-shape absolute right-[10%] top-[16%] h-16 w-16 rotate-[30deg] rounded-2xl border border-glow-amber/30"
        style={{ animationDelay: "0.6s" }}
        aria-hidden
      />
      <span
        className="drift-shape absolute bottom-[18%] left-[12%] h-9 w-9 rounded-full border border-signal/30"
        style={{ animationDelay: "1.9s" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <RevealText
          as="h2"
          text="No waitlist. No paywall. Start now."
          className="font-display text-4xl font-semibold sm:text-5xl"
        />
        <FadeIn delay={0.3}>
          <div className="mt-8">
            <Magnetic>
              <Link
                href="/roadmap"
                className="inline-block rounded-full bg-gradient-to-r from-glow-amber to-glow-ember px-8 py-3.5 font-medium text-void"
              >
                Start your roadmap
              </Link>
            </Magnetic>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
