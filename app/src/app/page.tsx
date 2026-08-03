import Link from "next/link";
import { slugify } from "@/data/guide";
import { RevealText } from "@/components/RevealText";
import { FadeIn } from "@/components/FadeIn";
import { Magnetic } from "@/components/Magnetic";
import { GradeRow } from "@/components/GradeRow";
import { OrbitField } from "@/components/OrbitField";
import { CornerLabels } from "@/components/CornerLabels";
import { ArrowLink } from "@/components/ArrowLink";
import { ScrollFade } from "@/components/ScrollFade";

export default function Home() {
  return (
    <>
      <Hero />
      <StatBreak />
      <ReadingModeSample />
      <EditorialBeat />
      <RoadmapPreview />
      <ClosingCta />
    </>
  );
}

function Hero() {
  return (
    <section className="texture-grid relative isolate min-h-[86vh] overflow-hidden px-6 pb-20 pt-10 sm:px-10">
      <CornerLabels
        topLeft="PathFinder / 001"
        topRight="Grades 06 — 12"
        bottomLeft="Free · Always"
        bottomRight="Est. 2026"
      />

      {/* Orbital graphic sits right of centre so it never sits under the headline */}
      <OrbitField className="pointer-events-none absolute -right-[18%] top-1/2 h-[46rem] w-[46rem] -translate-y-1/2 opacity-70 lg:-right-[6%]" />

      <div className="relative mx-auto grid max-w-6xl gap-14 pt-16 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:pt-24">
        <div>
          <FadeIn>
            <p className="micro mb-8 text-signal">(01) &nbsp;The roadmap you were never given</p>
          </FadeIn>

          <RevealText
            as="h1"
            text="Your path to college,"
            className="font-display text-6xl font-normal leading-[1.02] tracking-[-0.01em] text-chalk sm:text-8xl"
          />
          <RevealText
            as="h1"
            delay={0.18}
            text="mapped out for real."
            className="font-display text-6xl font-normal italic leading-[1.02] tracking-[-0.01em] text-chalk sm:text-8xl"
          />
        </div>

        <div className="lg:pb-3">
          <FadeIn delay={0.4}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-ash">
              Honest, specific guidance for immigrant and first-generation students
              and their families — from 6th grade through decision day. No school
              counselor waitlist required.
            </p>
          </FadeIn>

          <FadeIn delay={0.55}>
            <div className="mt-10 flex flex-wrap items-center gap-7">
              <Magnetic>
                <Link
                  href="/roadmap"
                  className="inline-block rounded-full bg-chalk px-8 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-white"
                >
                  Start your roadmap
                </Link>
              </Magnetic>
              <Magnetic>
                <ArrowLink href="/guide" className="text-sm text-ash hover:text-chalk">
                  See how it works
                </ArrowLink>
              </Magnetic>
            </div>
          </FadeIn>
        </div>
      </div>

      <p className="micro relative mt-24 text-smoke">↓ &nbsp;Scroll to explore</p>
    </section>
  );
}

/**
 * Two sourced statistics, set as a numbered technical index rather than a
 * full-bleed colour block — matching how the reference sites present data
 * (mono labels, hairline rules, huge light numerals, near-monochrome).
 */
function StatBreak() {
  const stats = [
    {
      index: "01",
      figure: "1.5",
      unit: "hrs / year",
      claim:
        "That is roughly all the college guidance a school counselor can give a single student, once caseloads are accounted for.",
      source: "NACAC · 2019 estimate",
    },
    {
      index: "02",
      figure: "5.9",
      unit: "million",
      claim:
        "Immigrant-origin students now in U.S. higher education — about 32% of everyone enrolled.",
      source: "Presidents' Alliance · 2023",
    },
  ];

  return (
    <section className="relative border-y border-line bg-ink-2 px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <p className="micro mb-14 text-smoke">(02) &nbsp;Why this exists</p>
        </FadeIn>

        <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
          {stats.map((s, i) => (
            <FadeIn key={s.index} delay={i * 0.12} className="bg-ink-2">
              <div className="flex h-full flex-col p-8 sm:p-10">
                <span className="micro text-smoke">{s.index}</span>
                <div className="mt-8 flex items-baseline gap-3">
                  <span className="font-display text-7xl leading-none text-chalk sm:text-8xl">
                    {s.figure}
                  </span>
                  <span className="micro text-ash">{s.unit}</span>
                </div>
                <p className="mt-8 max-w-sm text-[0.95rem] leading-relaxed text-ash">
                  {s.claim}
                </p>
                <p className="micro mt-auto pt-10 text-smoke">{s.source}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReadingModeSample() {
  return (
    <section className="relative px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <FadeIn>
          <p className="micro mb-8 text-smoke">(03) &nbsp;From the guide</p>
        </FadeIn>
        <RevealText
          as="h2"
          text="How the U.S. college system actually works"
          className="font-display text-4xl font-normal leading-[1.1] text-chalk sm:text-5xl"
        />
        <FadeIn delay={0.2}>
          <p className="mt-8 text-base leading-relaxed text-ash">
            If this system feels confusing or backwards compared to what you knew
            growing up, that&rsquo;s completely normal. This isn&rsquo;t something anyone is
            expected to already know — this guide walks through the parts that trip up
            most families, starting from the very beginning.
          </p>
          <ArrowLink
            href={`/guide/${slugify("How the U.S. College System Works")}`}
            className="micro mt-10 text-chalk hover:text-signal"
          >
            Read the full guide
          </ArrowLink>
        </FadeIn>
      </div>
    </section>
  );
}

function EditorialBeat() {
  return (
    <section className="flex min-h-[44vh] items-center justify-center border-y border-line px-6 py-20 sm:px-10">
      <ScrollFade className="mx-auto max-w-2xl text-center">
        <p className="font-display text-3xl font-normal italic leading-snug text-ash sm:text-4xl">
          Not another generic checklist. A roadmap that actually says something.
        </p>
      </ScrollFade>
    </section>
  );
}

function RoadmapPreview() {
  const grades = [
    { grade: 6, label: "Middle School", note: "Explore. Nothing here is evaluated by any college, ever." },
    { grade: 9, label: "Early High School", note: "Build habits, find your spike, start the family conversation." },
    { grade: 11, label: "Junior Year", note: "Essays, testing, financial aid research — the busiest year." },
    { grade: 12, label: "Senior Year", note: "Applications, offers, and the decision that follows." },
  ];

  return (
    <section className="texture-dots relative overflow-hidden px-6 py-28 sm:px-10">
      <span
        className="font-display pointer-events-none absolute -right-4 top-10 select-none text-[10rem] leading-none text-panel-2 sm:text-[15rem]"
        aria-hidden
      >
        06/12
      </span>

      <div className="relative mx-auto max-w-3xl">
        <FadeIn>
          <p className="micro mb-8 text-smoke">(04) &nbsp;The roadmap</p>
        </FadeIn>
        <RevealText
          as="h2"
          text="Every grade, mapped."
          className="font-display text-4xl font-normal text-chalk sm:text-5xl"
        />

        <div className="mt-14 divide-y divide-line border-y border-line">
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
    <section className="relative overflow-hidden border-t border-line px-6 py-32 sm:px-10">
      <OrbitField className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 opacity-30" />

      <div className="relative mx-auto max-w-2xl text-center">
        <RevealText
          as="h2"
          text="No waitlist. No paywall."
          className="font-display text-5xl font-normal leading-[1.05] text-chalk sm:text-6xl"
        />
        <RevealText
          as="h2"
          delay={0.15}
          text="Start now."
          className="font-display text-5xl font-normal italic leading-[1.05] text-chalk sm:text-6xl"
        />
        <FadeIn delay={0.4}>
          <div className="mt-12">
            <Magnetic>
              <Link
                href="/roadmap"
                className="inline-block rounded-full bg-chalk px-9 py-4 text-sm font-medium text-ink transition-colors hover:bg-white"
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
