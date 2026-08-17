import { FadeIn } from "@/components/FadeIn";
import { PageFrame } from "@/components/PageFrame";
import { Backdrop } from "@/components/backdrop/Backdrop";
import { KineticText } from "@/components/KineticText";
import { MajorView } from "@/components/major/MajorView";

export const metadata = { title: "Your major — PathFinder" };

/**
 * V2 §16K step 1 — major-specific guidance as its own place.
 *
 * Gated, like /roadmap and /tools: `src/proxy.ts` treats everything not on its
 * public list as requiring a session, so this needs no change there. That's the
 * established funnel decision — the landing page and /guide are the open
 * surface, and the app itself sits behind an account.
 *
 * The hero renders on the server so the page has real content in its HTML
 * before any client JS runs; everything stateful lives in <MajorView />.
 */
export default function MajorPage() {
  return (
    <PageFrame accent="azure" label="Major" index="A06">
      <section className="texture-dots relative overflow-hidden px-6 pb-8 pt-16 sm:px-10">
        {/* Nested rings — eight paths around one shared centre. See the
            Orbits note in SceneBackdrop for why this page gets its own. */}
        <Backdrop variant="orbits" accent="azure" />

        <div className="relative mx-auto max-w-5xl">
          <FadeIn>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
              Your major
            </p>
          </FadeIn>
          <KineticText
            as="h1"
            immediate
            className="display max-w-3xl text-5xl leading-[1.05] sm:text-7xl"
          >
            One roadmap. Eight{" "}
            <span className="glow-accent italic">lenses.</span>
          </KineticText>
          <FadeIn delay={0.2}>
            <p className="mt-6 max-w-xl text-ash">
              Almost everything about getting to college is the same whatever you
              study. This page is the part that isn&rsquo;t — the course chains,
              the earlier deadlines, and the programs that exist for your field.
            </p>
            <p className="mt-4 max-w-xl text-[0.85rem] leading-relaxed text-smoke">
              You don&rsquo;t have to have decided. Switching between fields here
              costs nothing, and comparing them is most of the point.
            </p>
          </FadeIn>
        </div>
      </section>

      <MajorView />
    </PageFrame>
  );
}
