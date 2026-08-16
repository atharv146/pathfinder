import Link from "next/link";
import { gradeGroups } from "@/data/roadmap";
import { FadeIn } from "@/components/FadeIn";
import { PageFrame } from "@/components/PageFrame";
import { Backdrop } from "@/components/backdrop/Backdrop";
import { KineticText } from "@/components/KineticText";
import { WhereYouAre } from "@/components/roadmap/WhereYouAre";

export const metadata = { title: "Roadmap — PathFinder" };

export default function RoadmapIndex() {
  return (
    <PageFrame accent="lime" label="Roadmap" index="A02">
    <section className="texture-dots relative min-h-[70vh] overflow-hidden px-6 py-16 sm:px-10">
      {/* Digital terrain — grades as ground being crossed. */}
      <Backdrop variant="grid" accent="lime" />

      <div className="relative mx-auto max-w-4xl">
        <FadeIn>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
            The roadmap
          </p>
        </FadeIn>
        <KineticText
          as="h1"
          immediate
          className="display text-5xl leading-[1.05] sm:text-7xl"
        >
          Pick your <span className="glow-accent italic">grade.</span>
        </KineticText>
        <FadeIn delay={0.2}>
          <p className="mt-4 max-w-xl text-ash">
            Every grade has its own guidance. There&rsquo;s no such thing as falling
            behind — start wherever you actually are.
          </p>
        </FadeIn>

        {/* Renders only for a signed-in student who has told us their grade;
            otherwise the plain grade picker below stands on its own. */}
        <div className="mt-14">
          <WhereYouAre />
        </div>

        <div className="space-y-12">
          {gradeGroups.map((group, gi) => (
            <div key={group.label}>
              <FadeIn delay={gi * 0.1}>
                <p className="mb-4 font-mono text-xs uppercase tracking-widest text-smoke">
                  {group.label}
                </p>
              </FadeIn>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {group.grades.map((grade, i) => (
                  <FadeIn key={grade} delay={gi * 0.1 + i * 0.05}>
                    <Link
                      href={`/roadmap/${grade}`}
                      className="group relative block overflow-hidden rounded-2xl border border-line bg-panel px-6 py-8 text-center transition-colors hover:border-ember/60"
                    >
                      <span className="display block text-3xl transition-colors group-hover:text-ember">
                        {grade}
                      </span>
                      <span className="mt-1 block font-mono text-xs uppercase tracking-widest text-smoke">
                        Grade
                      </span>
                      <span className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-ember/0 blur-2xl transition-colors group-hover:bg-ember/20" />
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </PageFrame>
  );
}
