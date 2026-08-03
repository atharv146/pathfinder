import Link from "next/link";
import { guideArticles, slugify } from "@/data/guide";

export const metadata = { title: "Guide — PathFinder" };

export default function GuideIndex() {
  return (
    <section className="px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-signal">
          Parent &amp; student guide
        </p>
        <h1 className="font-display text-4xl font-semibold">
          Plain-language answers to the questions that come up most.
        </h1>

        <div className="mt-10 space-y-3">
          {guideArticles.map((article) => (
            <Link
              key={article.title}
              href={`/guide/${slugify(article.title)}`}
              className="group block rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-glow-amber/60"
            >
              <h2 className="font-display text-lg font-semibold transition-colors group-hover:text-glow-amber">
                {article.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-soft">
                {article.teaser}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
