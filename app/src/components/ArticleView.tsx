import { RevealText } from "@/components/RevealText";
import { FadeIn } from "@/components/FadeIn";
import { GuideVisual, type GuideVisualData } from "@/components/guide/GuideVisual";

type Section = {
  heading?: string;
  paragraphs: string[];
  visual?: GuideVisualData;
};

type KeyTerm = { term: string; definition: string };

type ArticleViewProps = {
  eyebrow: string;
  title: string;
  quickAnswer?: string[];
  sections: Section[];
  keyTerms?: KeyTerm[];
};

/**
 * Reading-mode component: deliberately calm relative to the hero/nav chrome.
 * Glow stays out of long-form text per the design system's two registers —
 * but sections still reveal in as you scroll, so it doesn't feel static
 * next to the rest of the site.
 */
export function ArticleView({ eyebrow, title, quickAnswer, sections, keyTerms }: ArticleViewProps) {
  return (
    <article className="mx-auto max-w-2xl px-6 py-16 sm:px-0">
      <FadeIn>
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-signal">
          {eyebrow}
        </p>
      </FadeIn>
      <RevealText
        as="h1"
        text={title}
        className="display text-3xl leading-tight sm:text-4xl"
      />

      {quickAnswer && quickAnswer.length > 0 && (
        <FadeIn delay={0.15}>
          <div className="mt-8 rounded-2xl border border-line bg-panel p-6">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-smoke">
              Quick answer
            </p>
            <ul className="space-y-2.5">
              {quickAnswer.map((point, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-ash">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-ember to-ember" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      )}

      <div className="mt-10 space-y-8">
        {sections.map((section, i) => (
          <FadeIn key={i} delay={Math.min(i * 0.05, 0.3)}>
            {section.heading && (
              <h2 className="display text-xl text-chalk">
                {section.heading}
              </h2>
            )}
            <div className={section.heading ? "mt-3 space-y-4" : "space-y-4"}>
              {section.paragraphs.map((p, j) => (
                <p key={j} className="text-base leading-relaxed text-ash">
                  {p}
                </p>
              ))}
            </div>
            {section.visual && <GuideVisual data={section.visual} />}
          </FadeIn>
        ))}
      </div>

      {keyTerms && keyTerms.length > 0 && (
        <FadeIn className="mt-12 border-t border-line pt-8">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-smoke">
            Key terms
          </p>
          <dl className="space-y-4">
            {keyTerms.map((kt) => (
              <div key={kt.term}>
                <dt className="display text-sm text-signal">
                  {kt.term}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-ash">
                  {kt.definition}
                </dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      )}
    </article>
  );
}
