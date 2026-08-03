import Link from "next/link";
import { slugify } from "@/data/guide";
import { RevealText } from "@/components/RevealText";
import { FadeIn } from "@/components/FadeIn";
import { Magnetic } from "@/components/Magnetic";
import { GradeRow } from "@/components/GradeRow";
import { DotField } from "@/components/DotField";
import { ArcLine } from "@/components/ArcLine";
import { ArrowLink } from "@/components/ArrowLink";

export default function Home() {
  return (
    <>
      <Hero />
      <StatBreak />
      <ReadingModeSample />
      <RoadmapPreview />
      <ClosingCta />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-6 pb-24 pt-14 sm:px-10 sm:pt-20">
      <DotField className="absolute inset-0" />
      <ArcLine className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] w-full opacity-70" />

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
 * A single large editorial stat, not a card grid — the kind of callout you'd
 * see mid-article in the New York Times, not a SaaS landing page.
 */
function StatBreak() {
  return (
    <section className="border-y border-border px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <RevealText
          as="h2"
          text="School counselors have about 1.5 hours a year to spend on college guidance, per student."
          className="font-display text-3xl font-medium leading-snug sm:text-4xl"
        />
        <FadeIn delay={0.4}>
          <p className="mt-5 font-mono text-xs uppercase tracking-widest text-text-faint">
            National Association for College Admission Counseling · 2019 estimate
          </p>
        </FadeIn>
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
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-3xl">
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
    <section className="px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-2xl text-center">
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
