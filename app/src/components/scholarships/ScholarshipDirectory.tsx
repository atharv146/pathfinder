"use client";

import { useMemo, useState } from "react";
import { FadeIn } from "@/components/FadeIn";
import {
  SCHOLARSHIPS,
  cycleStatus,
  type Scholarship,
  type ScholarshipTag,
} from "@/data/scholarships";

/**
 * The scholarships directory — search, filter, and an honest count.
 *
 * WHY THIS REPLACED A PLAIN LIST (Aug 17, 2026, user's request for "more of a
 * directory"): with five awards a list was fine. Past about ten, a student
 * with twenty minutes needs to answer one question — "which of these can *I*
 * actually apply to, today?" — and scrolling twelve cards to find out is the
 * wrong tool.
 *
 * RULES CARRIED OVER FROM THE LIST VERSION, none of them negotiable:
 *
 * 1. **Open-right-now still sorts to the top**, inside whatever filter is
 *    active. Actionable beats comprehensive.
 * 2. **Every computed badge appears next to the written cycle text.** The
 *    badge is derived from stored dates; the text is what the organisation
 *    actually said. A student must never act on the badge alone.
 * 3. **Filtering never says "you don't qualify."** Same rule as the fee-waiver
 *    checker. The grade filter answers "who is this open to", and an empty
 *    result says the list has nothing *listed* for that grade — not that
 *    nothing exists, because the list is deliberately short and honest about
 *    it.
 * 4. **The status filter is a facet, not a judgement.** It groups awards whose
 *    eligibility turns on citizenship or immigration status — in both
 *    directions, since Elks requires citizenship and TheDream.US exists
 *    specifically for undocumented students. It never infers anything about
 *    the person reading.
 */

const TAG_LABELS: Record<ScholarshipTag, string> = {
  need: "Need-based",
  status: "Status matters",
  early: "Before senior year",
  "full-ride": "Covers most of college",
  support: "Money + real support",
};

const TAG_HINTS: Record<ScholarshipTag, string> = {
  need: "Your family's finances are central to who wins it.",
  status:
    "Eligibility turns on citizenship or immigration status — in both directions. Read the criteria on the card.",
  early: "You apply before 12th grade. Almost nobody knows these exist in time.",
  "full-ride": "Covers most or all of a degree rather than a one-off cheque.",
  support: "Comes with advising, coaching or a community, not just money.",
};

const GRADES = [7, 8, 9, 10, 11, 12];

export function ScholarshipDirectory() {
  const now = useMemo(() => new Date(), []);
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState<number | null>(null);
  const [tags, setTags] = useState<ScholarshipTag[]>([]);
  const [openOnly, setOpenOnly] = useState(false);

  const toggleTag = (t: ScholarshipTag) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const ranked = useMemo(() => {
    const q = query.trim().toLowerCase();

    const matches = SCHOLARSHIPS.filter((s) => {
      if (grade !== null && !s.grades.includes(grade)) return false;
      if (tags.length && !tags.every((t) => s.tags.includes(t))) return false;
      if (openOnly) {
        const kind = cycleStatus(s, now).kind;
        if (kind !== "open" && kind !== "opens-soon") return false;
      }
      if (!q) return true;
      // Eligibility text is searched too: students arrive with the word from
      // their own situation ("DACA", "Pell", "junior"), not the award's name.
      return [s.name, s.org, s.whoItsFor, s.award, ...s.eligibility]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

    const order = { open: 0, "opens-soon": 1, unknown: 2, closed: 3 } as const;
    return matches.sort(
      (a, b) => order[cycleStatus(a, now).kind] - order[cycleStatus(b, now).kind]
    );
  }, [grade, now, openOnly, query, tags]);

  const openCount = SCHOLARSHIPS.filter(
    (s) => cycleStatus(s, now).kind === "open"
  ).length;
  const filtering = grade !== null || tags.length > 0 || openOnly || query.trim() !== "";

  // min-h-[44px]: measured at 38px on the first pass, under the 44px touch
  // target this project holds itself to. A filter bar you have to aim at on a
  // phone is a filter bar nobody uses.
  const chip = (active: boolean) =>
    `inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-[0.82rem] transition-colors ${
      active
        ? "border-accent bg-accent/[0.12] text-chalk"
        : "border-line text-ash hover:border-line-bright hover:text-chalk"
    }`;

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      <FadeIn delay={0.2}>
        <div className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
          <label className="sr-only" htmlFor="scholarship-search">
            Search scholarships
          </label>
          <input
            id="scholarship-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search — try “DACA”, “Pell”, “junior”, “full ride”…"
            className="w-full rounded-lg border border-line bg-ink-2 px-4 py-3 text-[0.95rem] text-chalk outline-none transition-colors placeholder:text-smoke focus:border-accent"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOpenOnly((v) => !v)}
              aria-pressed={openOnly}
              className={chip(openOnly)}
            >
              Open now ({openCount})
            </button>

            {(Object.keys(TAG_LABELS) as ScholarshipTag[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTag(t)}
                aria-pressed={tags.includes(t)}
                title={TAG_HINTS[t]}
                className={chip(tags.includes(t))}
              >
                {TAG_LABELS[t]}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="micro mr-1 text-smoke">Open to grade</span>
            <button
              type="button"
              onClick={() => setGrade(null)}
              aria-pressed={grade === null}
              className={chip(grade === null)}
            >
              Any
            </button>
            {GRADES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(grade === g ? null : g)}
                aria-pressed={grade === g}
                className={chip(grade === g)}
              >
                {g}
              </button>
            ))}
          </div>

          {tags.length > 0 && (
            <ul className="mt-4 flex flex-col gap-1.5 border-t border-line pt-4">
              {tags.map((t) => (
                <li key={t} className="text-[0.82rem] leading-relaxed text-smoke">
                  <span className="text-ash">{TAG_LABELS[t]}</span> — {TAG_HINTS[t]}
                </li>
              ))}
            </ul>
          )}
        </div>
      </FadeIn>

      {/* ---------------------------------------------------------------- */}
      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-3">
        <p className="micro text-smoke" aria-live="polite">
          {`Showing ${ranked.length} of ${SCHOLARSHIPS.length}`}
        </p>
        {filtering && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setGrade(null);
              setTags([]);
              setOpenOnly(false);
            }}
            className="micro text-ash underline underline-offset-4 transition-colors hover:text-chalk"
          >
            Clear filters
          </button>
        )}
      </div>

      {ranked.length === 0 ? (
        /* Never "you don't qualify" — see rule 3 in the header. */
        <div className="mt-6 rounded-2xl border border-line bg-panel p-6 sm:p-8">
          <p className="text-[0.95rem] leading-relaxed text-chalk">
            Nothing in <em>this</em> list matches that.
          </p>
          <p className="mt-3 max-w-2xl text-[0.88rem] leading-relaxed text-ash">
            That&rsquo;s a statement about our list, not about you. We keep it
            short on purpose — a dozen awards we&rsquo;ve actually opened and
            checked, rather than five hundred we haven&rsquo;t. Your school
            counselor, your state&rsquo;s higher-education agency, and local
            community foundations all run awards that will never appear here,
            and local ones are usually far less competitive than these.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {ranked.map((s, i) => (
            <FadeIn key={s.id} delay={Math.min(0.05 + i * 0.04, 0.4)}>
              <ScholarshipCard s={s} now={now} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}

function ScholarshipCard({ s, now }: { s: Scholarship; now: Date }) {
  const status = cycleStatus(s, now);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-panel p-6 sm:p-8 ${
        status.kind === "open" ? "border-accent/50" : "border-line"
      }`}
    >
      {status.kind === "open" && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/15 blur-3xl"
        />
      )}

      <div className="relative flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="display-md text-2xl text-chalk">{s.name}</h2>
        <span className="micro text-smoke">{s.org}</span>
      </div>

      <div className="relative mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={status} />
        {s.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-line px-2.5 py-1 text-[0.72rem] uppercase tracking-[0.12em] text-smoke"
          >
            {TAG_LABELS[t]}
          </span>
        ))}
      </div>

      <p className="relative mt-4 text-[0.95rem] leading-relaxed text-chalk">
        {s.award}
      </p>
      <p className="relative mt-3 max-w-2xl text-[0.88rem] leading-relaxed text-ash">
        {s.whoItsFor}
      </p>

      <div className="relative mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="micro mb-2 text-smoke">Who can apply</p>
          <ul className="flex flex-col gap-1.5">
            {s.eligibility.map((e) => (
              <li key={e} className="flex items-start gap-2.5">
                <span
                  aria-hidden
                  className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-accent"
                />
                <span className="text-[0.83rem] leading-relaxed text-ash">{e}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="micro mb-2 text-smoke">Timing</p>
          <p className="text-[0.83rem] leading-relaxed text-ash">{s.cycle}</p>
        </div>
      </div>

      {/* Immigration-status framing. States no assurance in either direction —
          see the header note in data/scholarships.ts. */}
      {s.sensitive && (
        <div className="relative mt-5 rounded-lg border border-line-bright bg-ink px-4 py-3">
          <p className="text-[0.82rem] leading-relaxed text-ash">
            Any application asks for personal information. What you&rsquo;re
            comfortable sharing is a decision for you and your family, and it is
            not one we can make for you or reassure you about — read the
            organisation&rsquo;s own policies, and if the stakes are unclear,
            an immigration attorney is the right person to ask, not us.
          </p>
        </div>
      )}

      <a
        href={s.url}
        target="_blank"
        rel="noopener noreferrer"
        className="micro relative mt-6 inline-block text-chalk underline underline-offset-4 transition-colors hover:text-accent"
      >
        Official site &rarr;
      </a>
    </div>
  );
}

function StatusBadge({ status }: { status: ReturnType<typeof cycleStatus> }) {
  if (status.kind === "open") {
    return (
      <span className="inline-block rounded-full border border-accent bg-accent/[0.14] px-3 py-1 text-[0.8rem] font-semibold text-chalk">
        {status.daysLeft < 0
          ? "Open now"
          : status.daysLeft === 0
            ? "Closes today"
            : `Open now — about ${status.daysLeft} day${status.daysLeft === 1 ? "" : "s"} left`}
      </span>
    );
  }
  if (status.kind === "opens-soon") {
    return (
      <span className="inline-block rounded-full border border-line-bright px-3 py-1 text-[0.8rem] text-chalk">
        {status.daysUntil <= 1
          ? "Opens tomorrow"
          : `Opens in about ${status.daysUntil} days`}
      </span>
    );
  }
  if (status.kind === "closed") {
    return (
      <span className="inline-block rounded-full border border-line px-3 py-1 text-[0.8rem] text-smoke">
        That cycle has closed — next one not yet confirmed
      </span>
    );
  }
  return (
    <span className="inline-block rounded-full border border-line px-3 py-1 text-[0.8rem] text-smoke">
      Check the site for dates
    </span>
  );
}
