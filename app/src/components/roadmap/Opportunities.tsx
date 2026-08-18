"use client";

import {
  opportunitiesFor,
  CROSS_CUTTING,
  UNRESEARCHED_FAMILIES,
} from "@/data/major-opportunities";

/**
 * Named summer programs for a major family (V2 step 5 Part B).
 *
 * Two framing decisions that matter more than the layout:
 *
 * 1. Cost is the first line of every card, not a footnote. For this audience
 *    "is this free" determines whether the rest of the card is even worth
 *    reading, and burying it is how other college sites waste their time.
 *
 * 2. A family with no researched entries says so, rather than rendering an
 *    empty section. "We haven't researched this yet" is true and actionable;
 *    an empty list reads as "there's nothing out there for you", which is
 *    false and discouraging.
 */
export function Opportunities({
  familyId,
  familyLabel,
}: {
  familyId: string;
  familyLabel: string;
}) {
  const data = opportunitiesFor(familyId);

  const crossCutting = (
    <div className="mt-6">
      <p className="micro mb-1 text-accent">Whatever you study</p>
      <p className="mb-4 text-[0.82rem] leading-relaxed text-smoke">
        Not tied to a major — and built for students in your situation.
      </p>
      <div className="flex flex-col gap-3">
        {CROSS_CUTTING.items.map((o) => (
          <div key={o.name} className="rounded-xl border border-line bg-ink p-5">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <p className="text-[0.98rem] font-semibold text-chalk">{o.name}</p>
              <span className="micro text-smoke">{o.org}</span>
            </div>
            <p className="mt-2 inline-block rounded-full border border-accent/40 bg-accent/[0.08] px-3 py-1 text-[0.8rem] text-chalk">
              {o.cost}
            </p>
            <p className="mt-3 text-[0.88rem] leading-relaxed text-ash">{o.what}</p>
            <dl className="mt-3 flex flex-col gap-1.5">
              <div className="flex gap-2">
                <dt className="micro shrink-0 text-smoke">Who</dt>
                <dd className="text-[0.83rem] leading-relaxed text-ash">{o.eligibility}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="micro shrink-0 text-smoke">When</dt>
                <dd className="text-[0.83rem] leading-relaxed text-ash">{o.timing}</dd>
              </div>
            </dl>
            <a
              href={o.url}
              target="_blank"
              rel="noopener noreferrer"
              className="micro mt-4 inline-block text-chalk underline underline-offset-4 hover:text-accent"
            >
              Official site →
            </a>
          </div>
        ))}
      </div>
    </div>
  );

  if (!data) {
    if (!UNRESEARCHED_FAMILIES.includes(familyId)) return null;
    return (
      <>
        <div className="mt-6 rounded-xl border border-line bg-ink px-5 py-4">
          <p className="micro mb-2 text-smoke">Programs — not yet researched</p>
          {/* NOTE: the space before "yet" is an explicit {" "} on purpose.
              Written as plain text after {familyLabel} it renders as
              "Social Sciencesyet" — the compiler strips the leading space of a
              text run that wraps across lines. See CLAUDE.md. */}
          <p className="text-[0.85rem] leading-relaxed text-ash">
            We haven&rsquo;t finished researching programs for {familyLabel}
            {" "}
            yet. We&rsquo;d rather say so than pad this page with things we
            haven&rsquo;t checked ourselves &mdash; but that is about us, not
            about the field: there are real programs out there for it. Two ways
            to find them now: ask your counselor what students from your school
            have actually done, and ask PathFinder&rsquo;s AI what search terms
            to use.
          </p>
        </div>
        {crossCutting}
      </>
    );
  }

  return (
    <div className="mt-6">
      <p className="micro mb-2 text-accent">
        Real programs you can apply to — {familyLabel}
      </p>
      <p className="mb-5 max-w-2xl text-[0.9rem] leading-relaxed text-ash">
        These are specific, named programs that actually exist, each one checked
        on its own official site. <span className="text-chalk">Every one is
        free or pays you</span> — nothing on this page charges thousands to
        attend. Most are competitive, so treat them as worth applying to rather
        than as a plan, and always confirm dates on the program&rsquo;s own site
        because they shift every year.
      </p>

      <div className="flex flex-col gap-3">
        {data.items.map((o) => (
          <div key={o.name} className="rounded-xl border border-line bg-ink p-5">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <p className="text-[0.98rem] font-semibold text-chalk">{o.name}</p>
              <span className="micro text-smoke">{o.org}</span>
            </div>

            {/* Cost first, deliberately. */}
            <p className="mt-2 inline-block rounded-full border border-accent/40 bg-accent/[0.08] px-3 py-1 text-[0.8rem] text-chalk">
              {o.cost}
            </p>

            <p className="mt-3 text-[0.88rem] leading-relaxed text-ash">
              {o.what}
            </p>

            <dl className="mt-3 flex flex-col gap-1.5">
              <div className="flex gap-2">
                <dt className="micro shrink-0 text-smoke">Who</dt>
                <dd className="text-[0.83rem] leading-relaxed text-ash">
                  {o.eligibility}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="micro shrink-0 text-smoke">When</dt>
                <dd className="text-[0.83rem] leading-relaxed text-ash">
                  {o.timing}
                </dd>
              </div>
            </dl>

            <a
              href={o.url}
              target="_blank"
              rel="noopener noreferrer"
              className="micro mt-4 inline-block text-chalk underline underline-offset-4 hover:text-accent"
            >
              Official site →
            </a>
          </div>
        ))}
      </div>

      {/* A short list must not read as a closed one — see `stillResearching`
          in major-opportunities.ts. */}
      {data.stillResearching && (
        <p className="mt-4 rounded-lg border border-line bg-ink px-4 py-3 text-[0.82rem] leading-relaxed text-ash">
          This list is short because we&rsquo;re still researching this field,
          not because there&rsquo;s little out there. More coming — and the ones
          here have been checked.
        </p>
      )}

      <p className="mt-4 text-[0.78rem] leading-relaxed text-smoke">
        Checked against official sources on{" "}
        {new Date(`${data.verifiedOn}T00:00:00Z`).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        })}
        . Programs change their dates and criteria each cycle — confirm on the
        program&rsquo;s own site.
      </p>

      {crossCutting}
    </div>
  );
}
