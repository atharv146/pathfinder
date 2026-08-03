import Link from "next/link";
import { gradeGroups } from "@/data/roadmap";
import { RevealText } from "@/components/RevealText";
import { FadeIn } from "@/components/FadeIn";

export const metadata = { title: "Roadmap — PathFinder" };

export default function RoadmapIndex() {
  return (
    <section className="texture-dots relative overflow-hidden px-6 py-16 sm:px-10">
      <span
        className="drift-shape absolute right-[8%] top-[10%] h-14 w-14 rotate-12 rounded-2xl border border-glow-amber/30"
        style={{ animationDelay: "0.5s" }}
        aria-hidden
      />
      <span
        className="drift-shape absolute bottom-[12%] left-[6%] h-9 w-9 rounded-full border border-signal/30"
        style={{ animationDelay: "1.6s" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl">
        <FadeIn>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-signal">
            The roadmap
          </p>
        </FadeIn>
        <RevealText
          as="h1"
          text="Pick your grade."
          className="font-display text-4xl font-semibold sm:text-5xl"
        />
        <FadeIn delay={0.2}>
          <p className="mt-4 max-w-xl text-text-soft">
            Every grade has its own guidance. There&rsquo;s no such thing as falling
            behind — start wherever you actually are.
          </p>
        </FadeIn>

        <div className="mt-14 space-y-12">
          {gradeGroups.map((group, gi) => (
            <div key={group.label}>
              <FadeIn delay={gi * 0.1}>
                <p className="mb-4 font-mono text-xs uppercase tracking-widest text-text-faint">
                  {group.label}
                </p>
              </FadeIn>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {group.grades.map((grade, i) => (
                  <FadeIn key={grade} delay={gi * 0.1 + i * 0.05}>
                    <Link
                      href={`/roadmap/${grade}`}
                      className="group relative block overflow-hidden rounded-2xl border border-border bg-surface px-6 py-8 text-center transition-colors hover:border-glow-amber/60"
                    >
                      <span className="font-display block text-3xl font-semibold transition-colors group-hover:text-glow-amber">
                        {grade}
                      </span>
                      <span className="mt-1 block font-mono text-xs uppercase tracking-widest text-text-faint">
                        Grade
                      </span>
                      <span className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-glow-amber/0 blur-2xl transition-colors group-hover:bg-glow-amber/20" />
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
