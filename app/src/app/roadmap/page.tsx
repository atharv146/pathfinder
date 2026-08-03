import Link from "next/link";
import { gradeGroups } from "@/data/roadmap";

export const metadata = { title: "Roadmap — PathFinder" };

export default function RoadmapIndex() {
  return (
    <section className="px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-signal">
          The roadmap
        </p>
        <h1 className="font-display text-4xl font-semibold">Pick your grade</h1>
        <p className="mt-4 max-w-xl text-text-soft">
          Every grade has its own guidance. There&rsquo;s no such thing as falling
          behind — start wherever you actually are.
        </p>

        <div className="mt-12 space-y-10">
          {gradeGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-text-faint">
                {group.label}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {group.grades.map((grade) => (
                  <Link
                    key={grade}
                    href={`/roadmap/${grade}`}
                    className="group rounded-2xl border border-border bg-surface px-6 py-8 text-center transition-colors hover:border-glow-amber/60"
                  >
                    <span className="font-display text-3xl font-semibold transition-colors group-hover:text-glow-amber">
                      {grade}
                    </span>
                    <span className="mt-1 block font-mono text-xs uppercase tracking-widest text-text-faint">
                      Grade
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
