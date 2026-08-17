import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { KineticText } from "@/components/KineticText";
import { allOpportunities } from "@/lib/opportunities";

/**
 * The homepage promotion for `/opportunities`. Added Aug 17, 2026, alongside
 * the social-sciences research pass that finished the major-family content —
 * the user's explicit ask was to make this "obvious to the public," the same
 * way `AnalysisPromo` already does for Profile Analysis.
 *
 * Carries `data-accent="lime"` — `/opportunities`' own accent, not the
 * homepage's teal — same reasoning as `AnalysisPromo`: this section is a door
 * into somewhere else, so it wears that page's colour, not this one's.
 *
 * The count is pulled from `allOpportunities()` rather than hardcoded, so this
 * component can't silently go stale the way a written-out number would the
 * next time an entry is added or removed.
 */
export function OpportunitiesPromo() {
  const total = allOpportunities().length;

  return (
    <section
      data-accent="lime"
      className="relative overflow-hidden border-t border-line px-6 py-28 sm:px-10"
    >
      <div className="aurora-accent" aria-hidden data-decor />

      <div className="relative mx-auto max-w-4xl">
        <p className="micro mb-5 text-accent">
          {total} verified &nbsp;·&nbsp; Opportunities
        </p>

        <KineticText
          as="h2"
          className="display max-w-3xl text-4xl leading-[1.02] sm:text-6xl"
        >
          Money, and <span className="glow-accent italic">everywhere else</span>{" "}
          it comes from.
        </KineticText>

        <FadeIn delay={0.1}>
          <p className="mt-6 max-w-xl text-[1rem] leading-relaxed text-ash">
            Scholarships, paid internships, real summer jobs, and
            competitions — {total} of them, every one opened on its own
            official site and checked by hand. Not a scraped list where half
            the deadlines are two years old.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          <Cell
            index="01"
            title="Free money"
            body="Need-based and merit scholarships, from four-figure local awards to full rides — with the eligibility that actually decides it, not just the headline number."
          />
          <Cell
            index="02"
            title="Paid work, not just resume lines"
            body="Federal research stipends, a real paycheck doing conservation work outdoors, competitive placements — sorted honestly by how selective each one really is."
          />
          <Cell
            index="03"
            title="Filtered to your grade"
            body="Search by keyword, filter by grade level and what's open right now — so a ninth grader isn't wading through fifty senior-only deadlines."
          />
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/opportunities"
              className="rounded-full bg-chalk px-7 py-3.5 text-[0.85rem] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-white"
            >
              Browse everything, free
            </Link>
            <p className="max-w-sm text-[0.85rem] leading-relaxed text-smoke">
              Short on purpose &mdash; we&rsquo;d rather verify thirty of these
              properly than list three hundred we haven&rsquo;t checked.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Cell({
  index,
  title,
  body,
}: {
  index: string;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-ink-2 p-6 sm:p-7">
      <p className="micro mb-4 text-accent">{index}</p>
      <h3 className="display-md text-xl text-chalk">{title}</h3>
      <p className="mt-3 text-[0.88rem] leading-relaxed text-ash">{body}</p>
    </div>
  );
}
