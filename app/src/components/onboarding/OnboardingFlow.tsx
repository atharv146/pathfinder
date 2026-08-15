"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { migrateLocalProgress } from "@/lib/db/progress";
import { KineticText } from "@/components/KineticText";
import { ShapeField } from "@/components/backdrop/ShapeField";

/**
 * Two questions, then out. Deliberately short.
 *
 * Everything here is skippable and nothing is required, because the roadmap
 * works fine without it — this only decides where we *start* someone. A long
 * mandatory form in front of a free tool is how you lose the exact students
 * who most need the tool.
 */

const GRADES = [6, 7, 8, 9, 10, 11, 12];

// A deliberately short list. These are broad buckets students recognise, not
// a taxonomy — the roadmap content is still major-agnostic, so pretending to
// offer 200 precise majors would promise personalisation that doesn't exist
// yet.
const MAJORS = [
  "Engineering / CS",
  "Health & Medicine",
  "Business",
  "Arts & Design",
  "Humanities",
  "Social Sciences",
  "Natural Sciences",
  "Education",
];

export function OnboardingFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const rawNext = params.get("next");
  const next = rawNext && rawNext.startsWith("/") ? rawNext : "/roadmap";

  const [step, setStep] = useState<0 | 1>(0);
  const [grade, setGrade] = useState<number | null>(null);
  const [major, setMajor] = useState<string | null>(null);
  const [undecided, setUndecided] = useState(false);
  const [busy, setBusy] = useState(false);
  const [migrated, setMigrated] = useState(0);

  // Lift any pre-accounts localStorage progress the moment we have a session.
  useEffect(() => {
    migrateLocalProgress().then(setMigrated);
  }, []);

  const finish = async (skipped = false) => {
    setBusy(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("profiles")
        .update({
          grade,
          major: undecided ? null : major,
          major_undecided: undecided,
          // Stamped even on skip, so we don't ask again every visit.
          onboarded_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    }

    // Land on the grade they told us about — the whole point of asking.
    const dest = !skipped && grade ? `/roadmap/${grade}` : next;
    router.push(dest);
    router.refresh();
  };

  return (
    <>
      <ShapeField color="#7fd4c6" />

      <div className="relative w-full max-w-2xl">
        <div className="mb-10 flex items-center gap-3">
          {[0, 1].map((i) => (
            <span
              key={i}
              className={`h-[2px] flex-1 rounded-full transition-colors duration-500 ${
                i <= step ? "bg-accent" : "bg-line"
              }`}
            />
          ))}
          <span className="micro text-smoke">{step + 1}/2</span>
        </div>

        {step === 0 && (
          <div>
            <p className="micro mb-4 text-accent">(01) &nbsp;Where you are</p>
            <KineticText as="h1" immediate className="display mb-4 text-4xl text-chalk sm:text-5xl">
              What grade are you in?
            </KineticText>
            <p className="mb-10 text-[0.95rem] leading-relaxed text-ash">
              There&rsquo;s no such thing as starting late. This just decides where your
              roadmap opens.
            </p>

            <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
              {GRADES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  aria-pressed={grade === g}
                  className={`display rounded-lg border py-6 text-2xl transition-all ${
                    grade === g
                      ? "border-accent bg-accent/10 text-chalk"
                      : "border-line text-ash hover:border-line-bright hover:text-chalk"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-5">
              <button
                type="button"
                disabled={!grade}
                onClick={() => setStep(1)}
                className="rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-ink transition-opacity disabled:opacity-40"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={() => finish(true)}
                className="micro text-smoke transition-colors hover:text-chalk"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="micro mb-4 text-accent">(02) &nbsp;What you&rsquo;re drawn to</p>
            <KineticText as="h1" immediate className="display mb-4 text-4xl text-chalk sm:text-5xl">
              Any idea what you want to study?
            </KineticText>
            <p className="mb-10 text-[0.95rem] leading-relaxed text-ash">
              &ldquo;Not sure&rdquo; is the most common answer and it costs you nothing —
              the roadmap is the same either way for now.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {MAJORS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMajor(m);
                    setUndecided(false);
                  }}
                  aria-pressed={major === m && !undecided}
                  className={`rounded-full border px-5 py-2.5 text-[0.85rem] transition-all ${
                    major === m && !undecided
                      ? "border-accent bg-accent/10 text-chalk"
                      : "border-line text-ash hover:border-line-bright hover:text-chalk"
                  }`}
                >
                  {m}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setUndecided(true);
                  setMajor(null);
                }}
                aria-pressed={undecided}
                className={`rounded-full border px-5 py-2.5 text-[0.85rem] transition-all ${
                  undecided
                    ? "border-accent bg-accent/10 text-chalk"
                    : "border-line text-ash hover:border-line-bright hover:text-chalk"
                }`}
              >
                Not sure yet
              </button>
            </div>

            {migrated > 0 && (
              <p className="micro mt-8 text-signal">
                ✓ Brought {migrated} completed item{migrated === 1 ? "" : "s"} over from this
                browser
              </p>
            )}

            <div className="mt-10 flex items-center gap-5">
              <button
                type="button"
                disabled={busy || (!major && !undecided)}
                onClick={() => finish()}
                className="rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-ink transition-opacity disabled:opacity-40"
              >
                {busy ? "Saving…" : "Open my roadmap"}
              </button>
              <button
                type="button"
                onClick={() => setStep(0)}
                className="micro text-smoke transition-colors hover:text-chalk"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
