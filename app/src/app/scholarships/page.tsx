import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { PageFrame } from "@/components/PageFrame";
import { Backdrop } from "@/components/backdrop/Backdrop";
import { KineticText } from "@/components/KineticText";
import { ScholarshipDirectory } from "@/components/scholarships/ScholarshipDirectory";
import { SCHOLARSHIPS, SCHOLARSHIPS_VERIFIED_ON } from "@/data/scholarships";

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
              {SCHOLARSHIPS.length} awards, each one opened on its own official
              site and checked — not a scraped directory of thousands where half
              the deadlines are two years old. Search it, filter it, and apply
              to everything you can: it costs nothing but time.
            </p>
          </FadeIn>

          <div className="mt-12">
            <ScholarshipDirectory />
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
