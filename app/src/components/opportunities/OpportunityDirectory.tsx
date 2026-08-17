"use client";

import { useMemo, useState } from "react";
import { FadeIn } from "@/components/FadeIn";
import { allOpportunities, type EntryKind, type UnifiedEntry } from "@/lib/opportunities";
import type { ScholarshipTag } from "@/data/scholarships";

/**
 * The unified opportunities directory — scholarships, internships, programs
 * and competitions, searchable and filterable. Replaces the scholarships-only
 * list (Aug 17, 2026) — see `lib/opportunities.ts` for why.
 *
 * RULES, carried over from the scholarships-only version and still binding:
 *
 * 1. **Open-right-now sorts to the top**, inside whatever filter is active —
 *    only meaningful for scholarships, which have real dated cycles; programs
 *    without a computed status sort after anything open, before anything
 *    closed.
 * 2. **A computed badge always sits next to the organisation's own words.**
 *    Never act on the badge alone.
 * 3. **Filtering never says "you don't qualify."** An empty result is a
 *    statement about this list, never about the student.
 * 4. **The status/immigration facet groups both directions** — awards that
 *    require citizenship and awards that exist specifically for undocumented
 *    students both carry it. It never infers anything about the reader.
 */

const KIND_LABELS: Record<EntryKind, string> = {
  scholarship: "Scholarship",
  internship: "Internship",
  program: "Program",
  competition: "Competition",
};

const KIND_ORDER: EntryKind[] = ["scholarship", "internship", "program", "competition"];

const TAG_LABELS: Record<ScholarshipTag, string> = {
  need: "Need-based",
  status: "Status matters",
  early: "Before senior year",
  "full-ride": "Covers most of college",
  support: "Money + real support",
};

const GRADES = [7, 8, 9, 10, 11, 12];

export function OpportunityDirectory() {
  const now = useMemo(() => new Date(), []);
  const all = useMemo(() => allOpportunities(now), [now]);

  const [query, setQuery] = useState("");
  const [kinds, setKinds] = useState<EntryKind[]>([]);
  const [grade, setGrade] = useState<number | null>(null);
  const [openOnly, setOpenOnly] = useState(false);

  const toggleKind = (k: EntryKind) =>
    setKinds((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  const ranked = useMemo(() => {
    const q = query.trim().toLowerCase();

    const matches = all.filter((e) => {
      if (kinds.length && !kinds.includes(e.kind)) return false;
      if (grade !== null && e.grades.length && !e.grades.includes(grade)) return false;
      if (openOnly) {
        const k = e.status?.kind;
        if (k !== "open" && k !== "opens-soon") return false;
      }
      if (!q) return true;
      return [e.name, e.org, e.headline, e.subline, e.familyLabel ?? "", ...e.eligibility]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

    const statusOrder = { open: 0, "opens-soon": 1, unknown: 2, closed: 3 } as const;
    return matches.sort((a, b) => {
      const av = a.status ? statusOrder[a.status.kind] : 2;
      const bv = b.status ? statusOrder[b.status.kind] : 2;
      return av - bv;
    });
  }, [all, grade, kinds, openOnly, query]);

  const openCount = all.filter((e) => e.status?.kind === "open").length;
  const filtering = kinds.length > 0 || grade !== null || openOnly || query.trim() !== "";

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
          <label className="sr-only" htmlFor="opportunity-search">
            Search scholarships, internships and programs
          </label>
          <input
            id="opportunity-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search — try “DACA”, “paid research”, “junior”, “free summer program”…"
            className="w-full rounded-lg border border-line bg-ink-2 px-4 py-3 text-[0.95rem] text-chalk outline-none transition-colors placeholder:text-smoke focus:border-accent"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {KIND_ORDER.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => toggleKind(k)}
                aria-pressed={kinds.includes(k)}
                className={chip(kinds.includes(k))}
              >
                {KIND_LABELS[k]}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setOpenOnly((v) => !v)}
              aria-pressed={openOnly}
              className={chip(openOnly)}
            >
              Open now ({openCount})
            </button>
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
          <p className="mt-2 text-[0.78rem] leading-relaxed text-smoke">
            The grade filter only narrows scholarships — internships and
            programs list eligibility in their own words below, since schools
            phrase it too differently to force into a clean list.
          </p>
        </div>
      </FadeIn>

      {/* ---------------------------------------------------------------- */}
      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-3">
        <p className="micro text-smoke" aria-live="polite">
          {`Showing ${ranked.length} of ${all.length}`}
        </p>
        {filtering && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setKinds([]);
              setGrade(null);
              setOpenOnly(false);
            }}
            className="micro text-ash underline underline-offset-4 transition-colors hover:text-chalk"
          >
            Clear filters
          </button>
        )}
      </div>

      {ranked.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-line bg-panel p-6 sm:p-8">
          <p className="text-[0.95rem] leading-relaxed text-chalk">
            Nothing in <em>this</em> list matches that.
          </p>
          <p className="mt-3 max-w-2xl text-[0.88rem] leading-relaxed text-ash">
            That&rsquo;s a statement about our list, not about you. Every entry
            here was checked by hand on its own site, which keeps the list
            short — your counselor, your state&rsquo;s higher-education agency
            and local community foundations all run awards and programs that
            will never appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {ranked.map((e, i) => (
            <FadeIn key={e.id} delay={Math.min(0.05 + i * 0.03, 0.4)}>
              <EntryCard e={e} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}

function EntryCard({ e }: { e: UnifiedEntry }) {
  const open = e.status?.kind === "open";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-panel p-6 sm:p-8 ${
        open ? "border-accent/50" : "border-line"
      }`}
    >
      {open && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/15 blur-3xl"
        />
      )}

      <div className="relative flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="display-md text-2xl text-chalk">{e.name}</h2>
        <span className="micro text-smoke">{e.org}</span>
      </div>

      <div className="relative mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-line-bright px-2.5 py-1 text-[0.72rem] uppercase tracking-[0.12em] text-chalk">
          {KIND_LABELS[e.kind]}
        </span>
        {e.familyLabel && (
          <span className="rounded-full border border-line px-2.5 py-1 text-[0.72rem] uppercase tracking-[0.12em] text-smoke">
            {e.familyLabel}
          </span>
        )}
        {e.status && <StatusBadge status={e.status} />}
        {e.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-line px-2.5 py-1 text-[0.72rem] uppercase tracking-[0.12em] text-smoke"
          >
            {TAG_LABELS[t]}
          </span>
        ))}
      </div>

      <p className="relative mt-4 text-[0.95rem] leading-relaxed text-chalk">
        {e.headline}
      </p>
      {e.cost && (
        <p className="relative mt-2 text-[0.88rem] leading-relaxed text-accent">
          {e.cost}
        </p>
      )}
      <p className="relative mt-3 max-w-2xl text-[0.88rem] leading-relaxed text-ash">
        {e.subline}
      </p>

      <div className="relative mt-5 grid gap-5 sm:grid-cols-2">
        {e.eligibility.length > 1 ? (
          <div>
            <p className="micro mb-2 text-smoke">Who can apply</p>
            <ul className="flex flex-col gap-1.5">
              {e.eligibility.map((el) => (
                <li key={el} className="flex items-start gap-2.5">
                  <span
                    aria-hidden
                    className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-accent"
                  />
                  <span className="text-[0.83rem] leading-relaxed text-ash">{el}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div />
        )}
        <div>
          <p className="micro mb-2 text-smoke">Timing</p>
          <p className="text-[0.83rem] leading-relaxed text-ash">{e.timing}</p>
        </div>
      </div>

      {e.sensitive && (
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
        href={e.url}
        target="_blank"
        rel="noopener noreferrer"
        className="micro relative mt-6 inline-block text-chalk underline underline-offset-4 transition-colors hover:text-accent"
      >
        Official site &rarr;
      </a>
    </div>
  );
}

function StatusBadge({ status }: { status: NonNullable<UnifiedEntry["status"]> }) {
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
        That cycle has closed
      </span>
    );
  }
  return (
    <span className="inline-block rounded-full border border-line px-3 py-1 text-[0.8rem] text-smoke">
      Check the site for dates
    </span>
  );
}
