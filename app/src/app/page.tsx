import Link from "next/link";
import { slugify } from "@/data/guide";

export default function Home() {
  return (
    <>
      <Hero />
      <ReadingModeSample />
      <RoadmapPreview />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-6 pb-28 pt-16 sm:px-10 sm:pt-24">
      <div className="glow-field" />

      {/* Floating geometric markers — abstract "asteroid" motif, kept sparse and out of the reading path */}
      <div
        className="drift-shape absolute right-[8%] top-[18%] h-20 w-20 rotate-12 rounded-2xl border border-border/80 bg-gradient-to-br from-surface to-void-soft shadow-[0_0_60px_-15px_var(--color-glow-amber)]"
        style={{ animationDelay: "0.4s" }}
        aria-hidden
      />
      <div
        className="drift-shape absolute right-[22%] top-[52%] h-10 w-10 rotate-45 rounded-lg border border-signal/40 bg-void-soft"
        style={{ animationDelay: "1.8s" }}
        aria-hidden
      />
      <div
        className="drift-shape absolute left-[6%] top-[62%] h-14 w-14 rounded-full border border-glow-amber/40"
        style={{ animationDelay: "1s" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-signal">
          Free · Student-owned · Grades 6–12
        </p>
        <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
          Your path to college,
          <br />
          <span className="bg-gradient-to-r from-glow-amber to-glow-ember bg-clip-text text-transparent">
            mapped out for real.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-text-soft sm:text-lg">
          Honest, specific guidance for immigrant and first-generation students and
          their families — from 6th grade through decision day. No school counselor
          waitlist required.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/roadmap"
            className="rounded-full bg-gradient-to-r from-glow-amber to-glow-ember px-7 py-3 font-medium text-void transition-transform hover:scale-[1.03]"
          >
            Start your roadmap
          </Link>
          <Link
            href="/guide"
            className="rounded-full border border-border px-7 py-3 font-medium text-text-soft transition-colors hover:border-text-soft hover:text-text"
          >
            See how it works
          </Link>
        </div>
        <p className="mt-14 font-mono text-xs uppercase tracking-widest text-text-faint">
          ↓ Scroll to explore
        </p>
      </div>
    </section>
  );
}

/**
 * Demonstrates the design system's second register: long-form reading stays calm
 * and high-contrast, with glow/motion confined to chrome and hero moments.
 */
function ReadingModeSample() {
  return (
    <section className="relative border-y border-border bg-void-soft px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-signal">
          From the guide
        </p>
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          How the U.S. College System Works
        </h2>
        <p className="mt-5 text-base leading-relaxed text-text-soft sm:text-lg">
          If this system feels confusing or backwards compared to what you knew
          growing up, that&rsquo;s completely normal. This isn&rsquo;t something anyone is
          expected to already know — this guide walks through the parts that trip up
          most families, starting from the very beginning.
        </p>
        <Link
          href={`/guide/${slugify("How the U.S. College System Works")}`}
          className="mt-6 inline-block font-mono text-sm text-signal underline decoration-signal/40 underline-offset-4 hover:text-text"
        >
          Read the full guide →
        </Link>
      </div>
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
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-text-faint">
          The roadmap
        </p>
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">
          Every grade, mapped.
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {grades.map((g) => (
            <Link
              key={g.grade}
              href={`/roadmap/${g.grade}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-glow-amber/60"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-text-faint">
                Grade {g.grade}
              </span>
              <h3 className="mt-2 font-display text-xl font-semibold">{g.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-soft">{g.note}</p>
              <span className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-glow-amber/0 blur-2xl transition-colors group-hover:bg-glow-amber/20" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

