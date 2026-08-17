import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { PageFrame } from "@/components/PageFrame";
import { Backdrop } from "@/components/backdrop/Backdrop";
import { KineticText } from "@/components/KineticText";
import { ProfileAnalysis } from "@/components/analysis/ProfileAnalysis";
import { toolBySlug } from "@/data/tools";

const tool = toolBySlug("profile-analysis")!;

export const metadata = { title: `${tool.name} — PathFinder` };

/**
 * V2 §16K step 6 — the flagship tool.
 *
 * Takes its own accent (`rose`) and its own geometry (`lattice`) rather than
 * inheriting the tools section's coral: this is the page the homepage sends
 * people to, and it should not read as one more entry in a list.
 *
 * The `promise` renders above the tool, same as `/tools/fee-waivers` — on this
 * page more than any other, knowing *before* you start that it will not score
 * you or predict your chances is the reason to trust what it does say.
 */
export default function ProfileAnalysisPage() {
  return (
    <PageFrame accent="rose" label="Profile analysis" index="A05·3">
      <section className="texture-dots relative min-h-[70vh] overflow-hidden px-6 py-16 sm:px-10">
        <Backdrop variant="lattice" accent="rose" />

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
            className="display mt-5 text-4xl leading-[1.05] sm:text-6xl"
          >
            Everything you&rsquo;ve got,{" "}
            <span className="glow-accent italic">read properly</span>.
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
            <div className="mt-14">
              <ProfileAnalysis />
            </div>
          </FadeIn>
        </div>
      </section>
    </PageFrame>
  );
}
