import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { PageFrame } from "@/components/PageFrame";
import { Backdrop } from "@/components/backdrop/Backdrop";
import { KineticText } from "@/components/KineticText";
import {
  SCHOLARSHIPS,
  SCHOLARSHIPS_VERIFIED_ON,
  cycleStatus,
  type Scholarship,
} from "@/data/scholarships";

export const metadata = { title: "Scholarships — PathFinder" };

/**
 * V2 §16K step 3 — the scholarships hub.
 *
 * Home for researched money that isn't tied to a major (major-specific
 * programmes stay on `/major`). Gated like the rest of the app.
 *
 * Two things drive the design:
 *
 * 1. **Open-right-now sorts to the top.** A list of five awards where two are
 *    open and three closed months ago is, for a student with twenty minutes, a
 *    list of two. Sorting by what's actionable today is the difference between
 *    a reference page and a page that produces an application.
 *
 * 2. **Every date is paired with "confirm on the site".** The computed badge
 *    never appears without the written cycle text next to it, per the note on
 *    `cycleStatus` — a badge alone is exactly the kind of confidently-wrong
 *    detail this project exists not to ship.
 */
export default function ScholarshipsPage() {
  const now = new Date();
  const ranked = [...SCHOLARSHIPS].sort((a, b) => {
    const order = { open: 0, "opens-soon": 1, unknown: 2, closed: 3 } as const;
    return order[cycleStatus(a, now).kind] - order[cycleStatus(b, now).kind];
  });
  const openCount = ranked.filter((s) => cycleStatus(s, now).kind === "open").length;

  return (
    <PageFrame accent="lime" label="Scholarships" index="A07">
      <section className="texture-dots relative min-h-[70vh] overflow-hidden px-6 py-16 sm:px-10">
        <Backdrop variant="swarm" accent="lime" />

        <div className="relative mx-auto max-w-4xl">
          <FadeIn>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
              Scholarships
            </p>
          </FadeIn>
          <KineticText
            as="h1"
            immediate
            className="display text-5xl leading-[1.05] sm:text-6xl"
          >
            Money that&rsquo;s{" "}
            <span className="glow-accent italic">actually</span> there.
          </KineticText>
          <FadeIn delay={0.2}>
            <p className="mt-4 max-w-xl text-ash">
              A small, checked list rather than a directory of thousands. Every
              one of these was opened on its own official site and verified.
              Applying to all of them costs nothing but time.
            </p>
            {openCount > 0 && (
              <p className="mt-4 inline-block rounded-full border border-accent/50 bg-accent/[0.08] px-4 py-1.5 text-[0.85rem] text-chalk">
                {openCount === 1
                  ? "1 of these is open right now"
                  : `${openCount} of these are open right now`}
              </p>
            )}
          </FadeIn>

          <div className="mt-14 flex flex-col gap-4">
            {ranked.map((s, i) => (
              <FadeIn key={s.id} delay={Math.min(0.28 + i * 0.05, 0.5)}>
                <ScholarshipCard s={s} now={now} />
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <div className="mt-12 border-t border-line pt-8">
              <p className="max-w-2xl text-[0.85rem] leading-relaxed text-smoke">
                Checked against official sources on{" "}
                {new Date(`${SCHOLARSHIPS_VERIFIED_ON}T00:00:00Z`).toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }
                )}
                . Deadlines and criteria change every cycle — the organisation&rsquo;s
                own site is always right and we might not be. This list is
                deliberately short: we&rsquo;d rather check five properly than
                list five hundred we haven&rsquo;t.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                <Link
                  href="/major"
                  className="micro text-chalk underline underline-offset-4 transition-colors hover:text-accent"
                >
                  Programs for your field &rarr;
                </Link>
                <Link
                  href="/tools/fee-waivers"
                  className="micro text-smoke transition-colors hover:text-chalk"
                >
                  Check fee waivers too
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageFrame>
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

      <div className="relative mt-3">
        <StatusBadge status={status} />
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
