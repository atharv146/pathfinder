"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { migrateLocalProgress } from "@/lib/db/progress";
import { KineticText } from "@/components/KineticText";
import { ShapeField } from "@/components/backdrop/ShapeField";
import type { AccountType } from "@/lib/db/types";

/**
 * Three questions at most, then out. Deliberately short.
 *
 * Everything here is skippable and nothing is required, because the roadmap
 * works fine without it — this only decides where we *start* someone. A long
 * mandatory form in front of a free tool is how you lose the exact students
 * who most need the tool.
 *
 * ── THE ROLE STEP (added Aug 17, 2026) ────────────────────────────────────
 * `account_type` has existed in the schema since migration 0001 and had NO
 * signup path — it could only be changed from a settings toggle afterwards, so
 * in practice every account ever created was silently a student, including
 * every parent's. Section 14's "parent accounts are standalone" decision was
 * real in the schema and unreachable in the product.
 *
 * Two rules this step exists to hold:
 *
 * 1. **It states the standalone-account decision on screen, at the moment it
 *    matters.** A parent picking "parent" is told immediately that this is
 *    their own account and not a window into their child's — before they
 *    create it, not buried in settings after. PathFinder is not a monitoring
 *    tool, and the place to say so is where someone might assume otherwise.
 *
 * 2. **A parent is never asked to identify their child.** We ask what grade
 *    they're supporting purely to pick which content to open, and the copy
 *    says that. No names, no linking, no account pairing.
 *
 * Parents finish one step earlier than students — the major question is about
 * the student's own interests and asking a parent to answer it for their child
 * is exactly the wrong instinct — and they land on /guide, which is the
 * parent-facing content, rather than a student's roadmap.
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

  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [role, setRole] = useState<AccountType | null>(null);
  const [grade, setGrade] = useState<number | null>(null);
  const [major, setMajor] = useState<string | null>(null);
  const [undecided, setUndecided] = useState(false);
  const [busy, setBusy] = useState(false);
  const [migrated, setMigrated] = useState(0);

  const isParent = role === "parent";
  // Parents answer one fewer question — see the note on the role step.
  const totalSteps = isParent ? 2 : 3;

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
          // Defaults to student when skipped, matching the column default and
          // the overwhelmingly common case. A parent who skips can still set
          // it later from /account.
          account_type: role ?? "student",
          // Stamped even on skip, so we don't ask again every visit.
          onboarded_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    }

    // Parents land on the guide — it's the parent-facing content, and it is
    // the honest destination for an account that deliberately doesn't show
    // them a student's roadmap. Students land on the grade they told us about,
    // which is the whole point of asking.
    const dest = skipped
      ? next
      : role === "parent"
        ? "/guide"
        : grade
          ? `/roadmap/${grade}`
          : next;
    router.push(dest);
    router.refresh();
  };

  return (
    <>
      <ShapeField color="#7fd4c6" />

      <div className="relative w-full max-w-2xl">
        <div className="mb-10 flex items-center gap-3">
          {Array.from({ length: totalSteps }, (_, i) => (
            <span
              key={i}
              className={`h-[2px] flex-1 rounded-full transition-colors duration-500 ${
                i <= step ? "bg-accent" : "bg-line"
              }`}
            />
          ))}
          <span className="micro text-smoke">{`${step + 1}/${totalSteps}`}</span>
        </div>

        {step === 0 && (
          <div>
            <p className="micro mb-4 text-accent">(01) &nbsp;Who&rsquo;s here</p>
            <KineticText as="h1" immediate className="display mb-4 text-4xl text-chalk sm:text-5xl">
              Are you the student, or a parent?
            </KineticText>
            <p className="mb-10 text-[0.95rem] leading-relaxed text-ash">
              Both are welcome, and it only changes what we open first.
            </p>

            <div className="flex flex-wrap gap-3">
              {(
                [
                  { value: "student", label: "I'm the student" },
                  { value: "parent", label: "I'm a parent or guardian" },
                ] as { value: AccountType; label: string }[]
              ).map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  aria-pressed={role === r.value}
                  className={`rounded-full border px-6 py-3 text-[0.9rem] transition-all ${
                    role === r.value
                      ? "border-accent bg-accent/10 text-chalk"
                      : "border-line text-ash hover:border-line-bright hover:text-chalk"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* The July 21, 2026 decision, stated where a parent might
                otherwise assume the opposite — before they create the account,
                not buried in settings afterwards. */}
            {role === "parent" && (
              <div className="mt-6 rounded-lg border border-line-bright bg-ink p-5">
                <p className="text-[0.88rem] leading-relaxed text-ash">
                  Your account is <span className="text-chalk">your own</span> —
                  it isn&rsquo;t linked to your child&rsquo;s. We won&rsquo;t
                  show you their progress, and we won&rsquo;t show them yours.
                  PathFinder is built to help a student steer their own
                  application, so it&rsquo;s deliberately not a monitoring tool.
                </p>
                <p className="mt-3 text-[0.88rem] leading-relaxed text-ash">
                  You get the same roadmap and guides they do, written so you
                  can follow what&rsquo;s happening and when.
                </p>
              </div>
            )}

            <div className="mt-10 flex items-center gap-5">
              <button
                type="button"
                disabled={!role}
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
            <p className="micro mb-4 text-accent">(02) &nbsp;Where you are</p>
            <KineticText as="h1" immediate className="display mb-4 text-4xl text-chalk sm:text-5xl">
              {isParent ? "What grade are they in?" : "What grade are you in?"}
            </KineticText>
            <p className="mb-10 text-[0.95rem] leading-relaxed text-ash">
              {isParent
                ? "Just so we open the right year. We don't ask who they are, and this doesn't connect your account to theirs."
                : "There's no such thing as starting late. This just decides where your roadmap opens."}
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
              {/* Parents stop here: the next question is about the student's
                  own interests, and asking a parent to answer it for their
                  child is exactly the instinct this app shouldn't encourage. */}
              <button
                type="button"
                disabled={!grade || busy}
                onClick={() => (isParent ? finish() : setStep(2))}
                className="rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-ink transition-opacity disabled:opacity-40"
              >
                {isParent ? (busy ? "Saving…" : "Open the guide") : "Continue"}
              </button>
              <button
                type="button"
                onClick={() => setStep(0)}
                className="micro text-smoke transition-colors hover:text-chalk"
              >
                Back
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

        {step === 2 && (
          <div>
            <p className="micro mb-4 text-accent">(03) &nbsp;What you&rsquo;re drawn to</p>
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
                ✓ Brought {migrated} completed item{migrated === 1 ? "" : "s"}{" "}
                over from this browser
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
                onClick={() => setStep(1)}
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
