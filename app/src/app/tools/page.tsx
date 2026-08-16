import { FadeIn } from "@/components/FadeIn";
import { PageFrame } from "@/components/PageFrame";
import { Backdrop } from "@/components/backdrop/Backdrop";
import { KineticText } from "@/components/KineticText";
import { FeeWaiverChecker } from "@/components/money/FeeWaiverChecker";
import { EssayBrainstorm } from "@/components/essay/EssayBrainstorm";

export const metadata = { title: "Tools — PathFinder" };

/**
 * Two things a student can sit down and actually do, rather than read.
 *
 * Public on purpose: neither tool stores anything server-side, and the
 * fee-waiver information in particular is worth reaching someone who hasn't
 * signed up. Gating money-saving information behind an account would be the
 * wrong trade for this audience.
 */
export default function ToolsPage() {
  return (
    <PageFrame accent="coral" label="Tools" index="A05">
      <section className="texture-dots relative min-h-[70vh] overflow-hidden px-6 py-16 sm:px-10">
        <Backdrop variant="sheets" accent="coral" />

        <div className="relative mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
              Tools
            </p>
          </FadeIn>
          <KineticText
            as="h1"
            immediate
            className="display text-5xl leading-[1.05] sm:text-6xl"
          >
            Things you can <span className="glow-accent italic">do</span> today.
          </KineticText>
          <FadeIn delay={0.2}>
            <p className="mt-4 max-w-xl text-ash">
              Not more reading. Two things that save real money and real time,
              and neither one asks you to sign in.
            </p>
          </FadeIn>

          <div className="mt-14 flex flex-col gap-10">
            <FadeIn delay={0.3}>
              <FeeWaiverChecker />
            </FadeIn>
            <FadeIn delay={0.35}>
              <EssayBrainstorm />
            </FadeIn>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
