import Link from "next/link";
import { slugify } from "@/data/guide";
import { RevealText } from "@/components/RevealText";
import { FadeIn } from "@/components/FadeIn";
import { Magnetic } from "@/components/Magnetic";
import { GradeRow } from "@/components/GradeRow";
import { OrbitField } from "@/components/OrbitField";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { CornerLabels } from "@/components/CornerLabels";
import { ArrowLink } from "@/components/ArrowLink";
import { ScrollFade } from "@/components/ScrollFade";
import { SplitReveal } from "@/components/SplitReveal";
import { CountUp } from "@/components/CountUp";
import { RoadmapPath } from "@/components/RoadmapPath";
import { TruthSpotlight } from "@/components/TruthSpotlight";
import { ResumePaper } from "@/components/ResumePaper";
import { Marquee } from "@/components/Marquee";
import { KineticText } from "@/components/KineticText";
import { ClosingWire } from "@/components/ClosingWire";
import { LightWire } from "@/components/LightWire";
import { DeadlineSection } from "@/components/deadlines/DeadlineSection";

export default function Home() {
  return (
    <>
      <Hero />
      <StatBreak />
      <Marquee
        pingpong
        duration={46}
        items={[
          "Free forever",
          "No waitlist",
          "Grades 6–12",
          "Built by a student",
          "No consultant fees",
          "Immigrant & first-gen",
          "Parents welcome",
          "Financial aid explained",          "Nothing sold to you",
          "Sources cited",
          "Español-aware guidance",
        ]}
      />
      <ReadingModeSample />
      <EditorialBeat />
      <RoadmapPath />
      <TruthSpotlight />
      <ResumePaper />
      <DeadlineSection />
      <RoadmapPreview />
      <ClosingWire />
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

      <div className="aurora" aria-hidden />

      {/* Orbital graphic sits centred low in the section, behind the copy, so it
          fills the empty space under the headline instead of floating off to
          the side disconnected from the content. */}
      {/* Large and dominant — it should read as the environment the headline
          sits in. Anchored right so it fills the space beside the copy rather
          than printing through it, which is what made the centred version
          unreadable. */}
      {/* On phones the object is pushed below the copy and dimmed hard. At
          full size and 75% opacity it printed straight through the paragraph
          and the CTA, which is a readability problem, not a taste one — and
          this audience is phone-first. Desktop keeps the dominant version. */}
      <HeroVisual className="pointer-events-none absolute left-1/2 top-[82%] h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 opacity-30 sm:top-[62%] sm:h-[58rem] sm:w-[58rem] sm:opacity-90" />

      <div className="relative mx-auto flex max-w-6xl flex-col justify-center gap-10 pt-14 lg:min-h-[52vh] lg:pt-20">
        <div>
          <FadeIn>
            <p className="micro mb-8 text-signal">(01) &nbsp;The roadmap you were never given</p>
          </FadeIn>

          <SplitReveal
            as="h1"
            immediate
            className="display text-[2.75rem] leading-[1.04] tracking-[-0.02em] text-chalk sm:text-8xl sm:leading-[1.02]"
          >
            Your path to college,
          </SplitReveal>
          <SplitReveal
            as="h1"
            immediate
            delay={0.16}
            className="display text-[2.75rem] leading-[1.04] tracking-[-0.02em] text-chalk sm:text-8xl sm:leading-[1.02]"
          >
            mapped out for <span className="glow-signal">real.</span>
          </SplitReveal>
        </div>

        <div className="max-w-xl">
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

      <p className="micro relative mt-14 text-smoke">↓ &nbsp;Scroll to explore</p>
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
      figure: 1.5,
      decimals: 1,
      unit: "hrs / year",
      claim:
        "That is roughly all the college guidance a school counselor can give a single student, once caseloads are accounted for.",
      source: "NACAC · 2019 estimate",
    },
    {
      index: "02",
      figure: 5.9,
      decimals: 1,
      unit: "million",
      claim:
        "Immigrant-origin students now in U.S. higher education — about 32% of everyone enrolled.",
      source: "Presidents' Alliance · 2023",
    },
  ];

  return (
    <section className="relative overflow-hidden border-y border-line bg-ink-2 px-6 py-24 sm:px-10">
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
                  <CountUp
                    value={s.figure}
                    decimals={s.decimals}
                    className="display text-7xl leading-none text-chalk sm:text-8xl"
                  />
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

/**
 * Light section. Intrepid inverts to a cool off-white between dark sections,
 * and that inversion is doing more work than any single animation — it's what
 * makes a long page feel like it has chapters instead of one endless black
 * scroll. Type colours flip to the dark ramp inside here.
 */
function ReadingModeSample() {
  return (
    <section className="bone-surface relative overflow-hidden px-6 py-32 text-ink sm:px-10">
      {/* Wireframe geometry on the light ground, the way Intrepid sets its
          light sections — line art, not photography. */}
      <LightWire />

      <div className="relative mx-auto max-w-5xl">
        <FadeIn>
          <p className="micro mb-8 text-ink/45">(03) &nbsp;From the guide</p>
        </FadeIn>
        <KineticText
          as="h2"
          className="display max-w-3xl text-5xl text-ink sm:text-7xl"
        >
          How the U.S. college system actually works
        </KineticText>
        <FadeIn delay={0.2}>
          <p className="mt-10 max-w-xl text-base leading-relaxed text-ink/70">
            If this system feels confusing or backwards compared to what you knew
            growing up, that&rsquo;s completely normal. This isn&rsquo;t something anyone is
            expected to already know — this guide walks through the parts that trip up
            most families, starting from the very beginning.
          </p>
          <ArrowLink
            href={`/guide/${slugify("How the U.S. College System Works")}`}
            className="micro mt-10 text-ink hover:text-ember"
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
        <p className="display text-3xl leading-snug text-ash sm:text-4xl">
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
        className="display pointer-events-none absolute -right-4 top-10 select-none text-[10rem] leading-none text-panel-2 sm:text-[15rem]"
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
          className="display text-4xl text-chalk sm:text-5xl"
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
      <div className="aurora" aria-hidden />
      <OrbitField className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 opacity-30" />

      <div className="relative mx-auto max-w-2xl text-center">
        <RevealText
          as="h2"
          text="No waitlist. No paywall."
          className="display text-5xl leading-[1.05] text-chalk sm:text-6xl"
        />
        <RevealText
          as="h2"
          delay={0.15}
          text="Start now."
          className="display text-5xl leading-[1.05] text-chalk sm:text-6xl"
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
