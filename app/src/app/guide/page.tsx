import Link from "next/link";
import { guideArticles, slugify } from "@/data/guide";
import { RevealText } from "@/components/RevealText";
import { FadeIn } from "@/components/FadeIn";
import { ArrowUpRight } from "lucide-react";

export const metadata = { title: "Guide — PathFinder" };

export default function GuideIndex() {
  return (
    <section className="texture-dots relative overflow-hidden px-6 py-16 sm:px-10">
      <span
        className="drift-shape absolute right-[10%] top-[8%] h-12 w-12 rotate-45 rounded-xl border border-signal/30"
        style={{ animationDelay: "0.9s" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl">
        <FadeIn>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-signal">
            Parent &amp; student guide
          </p>
        </FadeIn>
        <RevealText
          as="h1"
          text="Plain-language answers to the questions that come up most."
          className="font-display text-4xl font-semibold leading-tight sm:text-5xl"
        />

        <div className="mt-14 divide-y divide-line border-y border-line">
          {guideArticles.map((article, i) => (
            <FadeIn key={article.title} delay={Math.min(i * 0.06, 0.3)}>
              <Link
                href={`/guide/${slugify(article.title)}`}
                className="group flex items-start gap-5 py-6 sm:gap-8"
              >
                <span className="font-mono text-xs text-smoke">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">
                  <span className="font-display block text-lg font-semibold transition-colors group-hover:text-ember sm:text-xl">
                    {article.title}
                  </span>
                  <span className="mt-1.5 block max-w-xl text-sm leading-relaxed text-ash">
                    {article.teaser}
                  </span>
                </span>
                <ArrowUpRight
                  size={18}
                  className="mt-1 shrink-0 -translate-x-1 translate-y-1 text-smoke opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-ember group-hover:opacity-100"
                />
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
