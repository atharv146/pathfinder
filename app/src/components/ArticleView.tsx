type Section = {
  heading?: string;
  paragraphs: string[];
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
 * Glow/motion stays out of long-form text per the design system's two registers.
 */
export function ArticleView({ eyebrow, title, quickAnswer, sections, keyTerms }: ArticleViewProps) {
  return (
    <article className="mx-auto max-w-2xl px-6 py-16 sm:px-0">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-signal">
        {eyebrow}
      </p>
      <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
        {title}
      </h1>

      {quickAnswer && quickAnswer.length > 0 && (
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-text-faint">
            Quick answer
          </p>
          <ul className="space-y-2.5">
            {quickAnswer.map((point, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-text-soft">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-glow-amber to-glow-ember" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 space-y-8">
        {sections.map((section, i) => (
          <div key={i}>
            {section.heading && (
              <h2 className="font-display text-xl font-semibold text-text">
                {section.heading}
              </h2>
            )}
            <div className={section.heading ? "mt-3 space-y-4" : "space-y-4"}>
              {section.paragraphs.map((p, j) => (
                <p key={j} className="text-base leading-relaxed text-text-soft">
                  {p}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {keyTerms && keyTerms.length > 0 && (
        <div className="mt-12 border-t border-border pt-8">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-text-faint">
            Key terms
          </p>
          <dl className="space-y-4">
            {keyTerms.map((kt) => (
              <div key={kt.term}>
                <dt className="font-display text-sm font-semibold text-signal">
                  {kt.term}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-text-soft">
                  {kt.definition}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </article>
  );
}
