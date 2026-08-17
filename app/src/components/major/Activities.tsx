"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { activitiesFor, GENERAL_PRINCIPLES } from "@/data/major-activities";
import { FadeIn } from "@/components/FadeIn";

/**
 * Extracurriculars and projects for a major family, plus the universal part.
 *
 * ── WHY THIS IS THE BIGGEST SECTION ON THE PAGE ───────────────────────────
 * Until Aug 16, 2026 the app said essentially nothing about what to do outside
 * class, which is a large fraction of what an application is. It covered
 * courses, deadlines and money well and left this blank. The visual weight here
 * is deliberate and proportional to that gap.
 *
 * ── THE COST BADGE IS THE POINT, NOT DECORATION ───────────────────────────
 * Same reasoning as the cost-first rule in the Opportunities cards. For this
 * audience "can I actually do this" is decided by price before anything else,
 * so it is rendered before the description rather than buried under it. Most of
 * these read "Free" — which is the substantive claim this section is making:
 * the highest-value activities in nearly every field cost nothing but time.
 *
 * ── SPLIT INTO TWO TABS RATHER THAN ONE LONG SCROLL ───────────────────────
 * Activities and projects are answers to two different questions ("what do I
 * join" vs "what do I make") and a student usually arrives wanting one of them.
 * Radix Tabs, consistent with the rest of the page, so the keyboard and ARIA
 * behaviour matches the family and stage selectors above.
 */
export function Activities({
  familyId,
  familyLabel,
}: {
  familyId: string;
  familyLabel: string;
}) {
  const data = activitiesFor(familyId);
  if (!data) return null;

  return (
    <div>
      {/* How work is shown in this field — the framing that makes the rest of
          the section make sense, so it leads. */}
      <FadeIn>
        <div className="edge-glow rounded-2xl bg-panel p-6 sm:p-8">
          <p className="micro mb-3 text-accent">
            How you show your work in {familyLabel}
          </p>
          <p className="text-[1.02rem] leading-relaxed text-chalk sm:text-[1.1rem]">
            {data.showYourWork}
          </p>
        </div>
      </FadeIn>

      <Tabs.Root defaultValue="ecs" className="mt-10">
        <Tabs.List
          aria-label="Activities or projects"
          className="flex gap-2 border-b border-line"
        >
          {[
            { v: "ecs", label: "What to join", count: data.ecs.length },
            { v: "projects", label: "What to make", count: data.projects.length },
          ].map((t) => (
            <Tabs.Trigger
              key={t.v}
              value={t.v}
              className="group relative -mb-px border-b-2 border-transparent px-1 pb-3 pr-6 text-left outline-none transition-colors data-[state=active]:border-accent"
            >
              <span className="block text-[1rem] font-semibold text-ash transition-colors group-hover:text-chalk group-data-[state=active]:text-chalk">
                {t.label}
              </span>
              <span className="micro text-smoke tabular-nums">
                {t.count} ideas
              </span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="ecs" className="swap-in mt-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {data.ecs.map((ec) => (
              <div
                key={ec.title}
                className="flex flex-col rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-line-bright"
              >
                <h4 className="text-[1.02rem] font-semibold leading-snug text-chalk">
                  {ec.title}
                </h4>

                {/* Cost first — see the header note. */}
                <p className="mt-3 inline-block self-start rounded-full border border-accent/40 bg-accent/[0.08] px-3 py-1 text-[0.78rem] leading-snug text-chalk">
                  {ec.cost}
                </p>

                <p className="mt-4 text-[0.88rem] leading-relaxed text-ash">
                  {ec.what}
                </p>
                <p className="mt-3 text-[0.88rem] leading-relaxed text-ash">
                  {ec.why}
                </p>

                {/* mt-auto pins this to the card's bottom edge so the "Start
                    here" line sits on a common baseline across the grid. */}
                <div className="mt-auto border-t border-line pt-4">
                  <p className="micro mb-1.5 text-accent">Start here</p>
                  <p className="text-[0.86rem] leading-relaxed text-chalk">
                    {ec.firstStep}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="projects" className="swap-in mt-8">
          <div className="flex flex-col gap-4">
            {data.projects.map((p, i) => (
              <div
                key={p.title}
                className="rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-line-bright sm:p-7"
              >
                <div className="flex items-baseline gap-4">
                  <span className="micro shrink-0 text-accent tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="text-[1.05rem] font-semibold leading-snug text-chalk">
                      {p.title}
                    </h4>
                    <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ash">
                      {p.what}
                    </p>

                    <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="micro mb-1 text-smoke">
                          How long it takes
                        </dt>
                        <dd className="text-[0.86rem] leading-relaxed text-ash">
                          {p.scale}
                        </dd>
                      </div>
                      <div>
                        <dt className="micro mb-1 text-smoke">
                          What you end up with
                        </dt>
                        <dd className="text-[0.86rem] leading-relaxed text-ash">
                          {p.evidence}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

/**
 * The universal principles, rendered separately from the per-major content.
 *
 * Kept as its own exported component (and its own section on the page) because
 * it is true regardless of which family is selected, and re-rendering it inside
 * the family-specific block would imply it changes when you switch — which
 * would undercut the whole point that these apply to everyone.
 */
export function GeneralPrinciples() {
  return (
    <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
      {GENERAL_PRINCIPLES.map((p, i) => (
        <FadeIn key={p.title} delay={Math.min(i * 0.05, 0.25)}>
          <div className="border-t border-line-bright pt-5">
            <div className="mb-2 flex items-baseline gap-3">
              <span className="micro text-accent tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="text-[1.02rem] font-semibold leading-snug text-chalk">
                {p.title}
              </h4>
            </div>
            <p className="text-[0.9rem] leading-relaxed text-ash">{p.body}</p>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
