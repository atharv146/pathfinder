import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { PageFrame } from "@/components/PageFrame";
import { Backdrop } from "@/components/backdrop/Backdrop";
import { KineticText } from "@/components/KineticText";
import { FeeWaiverChecker } from "@/components/money/FeeWaiverChecker";
import { toolBySlug } from "@/data/tools";

const tool = toolBySlug("fee-waivers")!;

export const metadata = { title: `${tool.name} — PathFinder` };

/**
 * V2 §16K step 2 — the fee-waiver checker as its own route.
 *
 * The `promise` from the registry renders above the tool rather than below it.
 * That's the point of this page existing separately: a student arriving from a
 * roadmap item about money needs to know before they start that this thing
 * will not tell them they don't qualify. Reading that after answering the
 * questions is too late to be reassuring.
 *
 * Keeps the section's coral accent (tools read as one place) but takes its own
 * backdrop geometry, per the standing rule that a new page gets its own scene
 * rather than a recoloured copy.
 */
export default function FeeWaiversPage() {
  return (
    <PageFrame accent="coral" label="Fee waivers" index="A05·1">
      <section className="texture-dots relative min-h-[70vh] overflow-hidden px-6 py-16 sm:px-10">
        <Backdrop variant="grid" accent="coral" />

        <div className="relative mx-auto max-w-3xl">
          <FadeIn>
            <Link
              href="/tools"
              className="micro text-smoke transition-colors hover:text-chalk"
            >
              &larr; Tools
            </Link>
          </FadeIn>

          <KineticText
            as="h1"
            immediate
            className="display mt-5 text-4xl leading-[1.05] sm:text-5xl"
          >
            Money you <span className="glow-accent italic">don&rsquo;t</span> have
            to spend.
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
              <FeeWaiverChecker />
            </div>
          </FadeIn>
        </div>
      </section>
    </PageFrame>
  );
}
