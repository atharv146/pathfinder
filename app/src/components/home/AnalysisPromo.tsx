import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { KineticText } from "@/components/KineticText";

/**
 * V2 §16K step 7 — the homepage promotion for Profile Analysis.
 *
 * Placed directly after `ResumePaper`, which is the section that shows the
 * same student's activities written two different ways. That's the argument
 * this tool makes, so the promotion lands as the answer to a question the
 * previous section just raised rather than as an ad dropped into the scroll.
 *
 * Carries `data-accent="rose"` — the tool's own colour, not the homepage's
 * teal — so the section reads as a door into somewhere else. The accent
 * system is scoped by attribute, so this works without touching PageFrame.
 *
 * The three lines below are what it does; the fourth is what it refuses to do.
 * Keeping the refusal on the homepage is deliberate: "we will never tell you
 * your chances" is the most differentiating sentence on this page, and hiding
 * it inside the tool would waste it.
 */
export function AnalysisPromo() {
  return (
    <section
      data-accent="rose"
      className="relative overflow-hidden border-t border-line px-6 py-28 sm:px-10"
    >
      <div className="aurora-accent" aria-hidden data-decor />

      <div className="relative mx-auto max-w-4xl">
        <p className="micro mb-5 text-accent">(New) &nbsp;Profile analysis</p>

        <KineticText
          as="h2"
          className="display max-w-3xl text-4xl leading-[1.02] sm:text-6xl"
        >
          Everything you&rsquo;ve got,{" "}
          <span className="glow-accent italic">read properly</span>.
        </KineticText>

        <FadeIn delay={0.1}>
          <p className="mt-6 max-w-xl text-[1rem] leading-relaxed text-ash">
            One page that reads your classes, your activities and your college
            list together — the way a counselor with an hour would, if you had
            one.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          <Cell
            index="01"
            title="Your course path"
            body="Your classes matched onto the sequence your field usually runs — read against what your own school actually offers, not against a school with twenty-five APs."
          />
          <Cell
            index="02"
            title="Your activities, written up"
            body="Caregiving, translating, a weekend job — written the way an application expects, using only what you actually did. It never inflates a single word."
          />
          <Cell
            index="03"
            title="Your colleges, honestly"
            body="No odds. Instead: the two documents every U.S. college publishes about itself, and how to read the one that most sites get wrong."
          />
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/tools/profile-analysis"
              className="rounded-full bg-chalk px-7 py-3.5 text-[0.85rem] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-white"
            >
              Run it on your profile
            </Link>
            <p className="max-w-sm text-[0.85rem] leading-relaxed text-smoke">
              It will never give you a percentage or a chance of admission.
              Nobody can honestly calculate that — and a confident number from a
              site that sounds like it&rsquo;s on your side is worse than none.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Cell({
  index,
  title,
  body,
}: {
  index: string;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-ink-2 p-6 sm:p-7">
      <p className="micro mb-4 text-accent">{index}</p>
      <h3 className="display-md text-xl text-chalk">{title}</h3>
      <p className="mt-3 text-[0.88rem] leading-relaxed text-ash">{body}</p>
    </div>
  );
}
