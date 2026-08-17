import { FadeIn } from "@/components/FadeIn";
import { PageFrame } from "@/components/PageFrame";
import { Backdrop } from "@/components/backdrop/Backdrop";
import { KineticText } from "@/components/KineticText";
import { StatsPanel } from "@/components/stats/StatsPanel";

export const metadata = { title: "Your details — PathFinder" };

/**
 * V2 §16K step 3 — the settings/stats page.
 *
 * Keeps `/account`'s violet, the way `/tools/fee-waivers` keeps the tools
 * coral: these two pages are one place in a student's head. It takes its own
 * backdrop geometry (`strata`) per the standing rule that a new page gets its
 * own scene rather than a recoloured copy of someone else's.
 *
 * Gated by `proxy.ts` without any change there — it isn't on the public list,
 * so it inherits the redirect to /signup?next=/stats.
 */
export default function StatsPage() {
  return (
    <PageFrame accent="violet" label="Details" index="A10">
      <section className="texture-dots relative min-h-[70vh] overflow-hidden px-6 py-16 sm:px-10 sm:py-20">
        <Backdrop variant="strata" accent="violet" />

        <div className="relative mx-auto max-w-3xl">
          <FadeIn>
            <p className="micro mb-4 text-accent">(10) &nbsp;Your details</p>
          </FadeIn>

          <KineticText
            as="h1"
            immediate
            className="display mb-4 text-[2.5rem] leading-[1.05] text-chalk sm:text-6xl"
          >
            The <span className="glow-accent italic">whole</span> picture.
          </KineticText>

          <FadeIn delay={0.15}>
            <p className="mb-6 max-w-xl text-[0.95rem] leading-relaxed text-ash">
              Your grade, your classes, and what your school actually offers.
              Everything here is optional, and everything in PathFinder works
              with all of it blank.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mb-12 max-w-xl text-[0.85rem] leading-relaxed text-smoke">
              The more of it you fill in, the more specific the roadmap and the
              AI can be — but nothing here is graded, compared to anyone else,
              or shown to anyone unless you create a share link yourself.
            </p>
          </FadeIn>

          <StatsPanel />
        </div>
      </section>
    </PageFrame>
  );
}
