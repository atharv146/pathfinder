import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { PageFrame } from "@/components/PageFrame";
import { Backdrop } from "@/components/backdrop/Backdrop";
import { KineticText } from "@/components/KineticText";
import { TOOLS, toolHref } from "@/data/tools";

export const metadata = { title: "Tools — PathFinder" };

/**
 * The tools index — V2 §16K step 2.
 *
 * Was a single page with both tools stacked on it; each now has its own route
 * and this became the gallery. See `data/tools.ts` for why.
 *
 * Sign-in required (user decision, Aug 15 2026), inherited from `proxy.ts`
 * rather than configured here: these are support tools around the roadmap
 * rather than the front door. The roadmap is the product, and the public
 * surface is the landing page plus /guide.
 *
 * Each card leads with what the tool does and then states what it refuses to
 * do. That ordering is deliberate — for this audience the refusal is usually
 * the reason to trust it.
 */
export default function ToolsPage() {
  return (
    <PageFrame accent="coral" label="Tools" index="A05">
      <section className="texture-dots relative min-h-[70vh] overflow-hidden px-6 py-16 sm:px-10">
        <Backdrop variant="sheets" accent="coral" />

        <div className="relative mx-auto max-w-4xl">
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
              Not more reading. Each of these saves real money or real time, for
              when your roadmap says it&rsquo;s time for them.
            </p>
          </FadeIn>

          <div className="mt-14 flex flex-col gap-4">
            {TOOLS.map((tool, i) => (
              <FadeIn key={tool.slug} delay={0.3 + i * 0.06}>
                <Link
                  href={toolHref(tool.slug)}
                  className="group relative block overflow-hidden rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-accent/60 sm:p-8"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-accent/0 blur-3xl transition-colors duration-500 group-hover:bg-accent/20"
                  />

                  <div className="relative flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h2 className="display-md text-2xl text-chalk sm:text-3xl">
                      {tool.name}
                    </h2>
                    <span className="micro text-smoke">{tool.effort}</span>
                  </div>

                  <p className="relative mt-3 text-[1rem] leading-relaxed text-chalk">
                    {tool.tagline}
                  </p>
                  <p className="relative mt-3 max-w-2xl text-[0.9rem] leading-relaxed text-ash">
                    {tool.what}
                  </p>

                  <div className="relative mt-5 border-t border-line pt-4">
                    <p className="micro mb-1.5 text-accent">What it won&rsquo;t do</p>
                    <p className="max-w-2xl text-[0.86rem] leading-relaxed text-ash">
                      {tool.promise}
                    </p>
                  </div>

                  <span className="micro relative mt-6 inline-block text-chalk underline underline-offset-4 transition-colors group-hover:text-accent">
                    Open {tool.name.toLowerCase()} &rarr;
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <p className="mt-12 max-w-xl text-[0.85rem] leading-relaxed text-smoke">
              These are support for the roadmap, not a replacement for it. If
              you&rsquo;re not sure whether one applies to you yet, your grade
              roadmap will tell you when it does.
            </p>
            <Link
              href="/roadmap"
              className="micro mt-4 inline-block text-chalk underline underline-offset-4 transition-colors hover:text-accent"
            >
              Back to the roadmap &rarr;
            </Link>
          </FadeIn>
        </div>
      </section>
    </PageFrame>
  );
}
