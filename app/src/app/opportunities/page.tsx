import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { PageFrame } from "@/components/PageFrame";
import { Backdrop } from "@/components/backdrop/Backdrop";
import { KineticText } from "@/components/KineticText";
import { OpportunityDirectory } from "@/components/opportunities/OpportunityDirectory";
import { DeadlineTimeline } from "@/components/opportunities/DeadlineTimeline";
import { allOpportunities } from "@/lib/opportunities";
import { SCHOLARSHIPS_VERIFIED_ON } from "@/data/scholarships";

export const metadata = { title: "Opportunities — PathFinder" };

/**
 * The opportunities directory — scholarships, internships, programs and
 * competitions, all in one place. Replaces `/scholarships` (Aug 17, 2026),
 * which only ever held scholarships and was reached via a nav link literally
 * labelled "Money" — both undersold what this page needs to be. See
 * `lib/opportunities.ts` for how the merge works and why it isn't a rewrite
 * of either source file.
 *
 * `/scholarships` now redirects here (see `src/app/scholarships/page.tsx`) so
 * an old link or a bookmark still lands somewhere real.
 *
 * Gated like the rest of the app, same accent/backdrop as before.
 */
export default function OpportunitiesPage() {
  const total = allOpportunities().length;

  return (
    <PageFrame accent="lime" label="Opportunities" index="A07">
      <section className="texture-dots relative min-h-[70vh] overflow-hidden px-6 py-16 sm:px-10">
        <Backdrop variant="swarm" accent="lime" />

        <div className="relative mx-auto max-w-4xl">
          <FadeIn>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
              Opportunities
            </p>
          </FadeIn>
          <KineticText
            as="h1"
            immediate
            className="display text-5xl leading-[1.05] sm:text-6xl"
          >
            Real experience,{" "}
            <span className="glow-accent italic">not just free money.</span>
          </KineticText>
          <FadeIn delay={0.2}>
            <p className="mt-4 max-w-xl text-ash">
              {total} internships, summer programs, competitions and
              scholarships — each opened on its own official site and checked,
              not a scraped list where half the deadlines are two years old.
            </p>
          </FadeIn>

          {/* Time axis first, then the searchable list. The track answers
              "what's next"; the directory answers "what exists". */}
          <div className="mt-12">
            <DeadlineTimeline />
          </div>

          <div className="mt-12">
            <OpportunityDirectory />
          </div>

          <FadeIn delay={0.5}>
            <div className="mt-12 border-t border-line pt-8">
              <p className="max-w-2xl text-[0.85rem] leading-relaxed text-smoke">
                Every entry checked on its own official site on{" "}
                {new Date(`${SCHOLARSHIPS_VERIFIED_ON}T00:00:00Z`).toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }
                )}
                . Deadlines move every cycle — confirm on the
                organisation&rsquo;s own site before you apply.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                <Link
                  href="/major"
                  className="micro text-chalk underline underline-offset-4 transition-colors hover:text-accent"
                >
                  More, by field &rarr;
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
