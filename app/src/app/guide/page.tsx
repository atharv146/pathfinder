import Link from "next/link";
import { guideArticles, slugify } from "@/data/guide";
import { FadeIn } from "@/components/FadeIn";
import { ArrowUpRight } from "lucide-react";
import { PageFrame } from "@/components/PageFrame";
import { Backdrop } from "@/components/backdrop/Backdrop";
import { KineticText } from "@/components/KineticText";

export const metadata = { title: "Guide — PathFinder" };

export default function GuideIndex() {
  return (
    <PageFrame accent="coral" label="Guide" index="A03">
    <section className="texture-dots relative min-h-[70vh] overflow-hidden px-6 py-16 sm:px-10">
      {/* Pages caught mid-air — the guide as physical documents. */}
      <Backdrop variant="sheets" accent="coral" />

      <div className="relative mx-auto max-w-3xl">
        <FadeIn>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
            Parent &amp; student guide
          </p>
        </FadeIn>
        <KineticText
          as="h1"
          immediate
          className="display text-4xl leading-[1.08] sm:text-6xl"
        >
          Plain-language answers to the questions that{" "}
          <span className="glow-accent italic">come up most.</span>
        </KineticText>

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
                  <span className="display block text-lg transition-colors group-hover:text-ember sm:text-xl">
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
    </PageFrame>
  );
}
