import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { PageFrame } from "@/components/PageFrame";
import { Backdrop } from "@/components/backdrop/Backdrop";
import { KineticText } from "@/components/KineticText";
import { EssayBrainstorm } from "@/components/essay/EssayBrainstorm";
import { toolBySlug } from "@/data/tools";

const tool = toolBySlug("essay-brainstorm")!;

export const metadata = { title: `${tool.name} — PathFinder` };

/**
 * V2 §16K step 2 — essay brainstorming as its own route.
 *
 * Same structure as the fee-waiver page, and the `promise` leads for a
 * sharper reason here: a student sitting down to write about family hardship
 * needs to know up front that this tool writes nothing and that their notes
 * never leave the device. Both facts change how honestly someone is willing to
 * type, so they belong before the exercises rather than in a footnote.
 */
export default function EssayBrainstormPage() {
  return (
    <PageFrame accent="coral" label="Essay" index="A05·2">
      <section className="texture-dots relative min-h-[70vh] overflow-hidden px-6 py-16 sm:px-10">
        <Backdrop variant="swarm" accent="coral" />

        <div className="relative mx-auto max-w-3xl">
          <FadeIn>
            <Link
              href="/tools"
              className="tap-target micro text-smoke transition-colors hover:text-chalk"
            >
              &larr; Tools
            </Link>
          </FadeIn>

          <KineticText
            as="h1"
            immediate
            className="display mt-5 text-4xl leading-[1.05] sm:text-5xl"
          >
            Find the <span className="glow-accent italic">story</span> first.
          </KineticText>

          <FadeIn delay={0.15}>
            <p className="mt-4 max-w-xl text-ash">{tool.what}</p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-8 rounded-xl border border-accent/40 bg-accent/[0.06] px-5 py-4">
              <p className="micro mb-1.5 text-accent">Before you start</p>
              <p className="text-[0.88rem] leading-relaxed text-chalk">
                {tool.promise}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="mt-12">
              <EssayBrainstorm />
            </div>
          </FadeIn>
        </div>
      </section>
    </PageFrame>
  );
}
