"use client";

import {
  opportunitiesFor,
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

  if (!data) {
    if (!UNRESEARCHED_FAMILIES.includes(familyId)) return null;
    return (
      <div className="mt-6 rounded-xl border border-line bg-ink px-5 py-4">
        <p className="micro mb-2 text-smoke">Programs — not yet researched</p>
        <p className="text-[0.85rem] leading-relaxed text-ash">
          We haven&rsquo;t done the research for {familyLabel} yet, and
          we&rsquo;d rather say that than list things we haven&rsquo;t checked.
          Ask your counselor what students from your school have done, and ask
          PathFinder&rsquo;s AI what to search for.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <p className="micro mb-1 text-accent">
        Programs worth knowing about — {familyLabel}
      </p>
      <p className="mb-4 text-[0.82rem] leading-relaxed text-smoke">
        All of these are free or paid, not pay-to-attend. Most are competitive,
        so treat them as worth applying to rather than as a plan. Deadlines
        shift every year — always confirm on the program&rsquo;s own site.
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

      <p className="mt-4 text-[0.78rem] leading-relaxed text-smoke">
        Checked against official sources on{" "}
        {new Date(`${data.verifiedOn}T00:00:00Z`).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        })}
        . Programs change their dates and criteria — the site is always right
        and we might not be.
      </p>
    </div>
  );
}
