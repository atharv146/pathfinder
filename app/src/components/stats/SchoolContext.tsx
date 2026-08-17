"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile, SchoolApOffered } from "@/lib/db/types";

/**
 * What your school actually offers — the other half of the course list.
 * V2 §16K step 3, migration 0008.
 *
 * WHY THIS IS ASKED AT ALL, stated plainly because it's the whole argument for
 * the feature: two AP classes is a thin schedule at a school offering
 * twenty-five and the most rigorous schedule available at a school offering
 * three. PathFinder's students are disproportionately at the second kind of
 * school, and every generic admissions tool reads them as the first. A course
 * list without a ceiling to read it against reproduces exactly that mistake.
 *
 * WHY IT'S STUDENT-REPORTED rather than a per-school database: no maintainable
 * public catalog of U.S. high school course offerings exists, and inventing
 * one from partial scrapes would produce confident wrong answers about a
 * student's own school — the failure mode this app exists to avoid. A student
 * knows whether their school has IB. Asking is more honest than guessing.
 *
 * Every field is skippable, and "I'm not sure" is offered as a real answer
 * rather than left as an awkward blank.
 */

const AP_BANDS: { value: SchoolApOffered; label: string }[] = [
  { value: "none", label: "None — my school doesn't offer AP" },
  { value: "1_5", label: "A few (roughly 1–5)" },
  { value: "6_10", label: "Some (roughly 6–10)" },
  { value: "11_20", label: "A lot (roughly 11–20)" },
  { value: "20_plus", label: "Over 20" },
  { value: "not_sure", label: "Not sure" },
];

const fieldClass =
  "w-full rounded-md border border-line bg-ink-2 px-4 py-3 text-[0.95rem] text-chalk outline-none transition-colors focus:border-accent";

/**
 * Migration 0008 may not have been applied yet, in which case Postgres simply
 * doesn't return these columns and they arrive as `undefined` — not `null`.
 * Same trap as migration 0004 (see ProfileDetails): `x === null` is false for
 * undefined, so an unanswered yes/no would silently render as "No".
 */
function normalize(p: Profile): Profile {
  return {
    ...p,
    school_ap_offered: p.school_ap_offered ?? null,
    school_offers_ib: p.school_offers_ib ?? null,
    school_offers_dual_enrollment: p.school_offers_dual_enrollment ?? null,
    school_course_limits: p.school_course_limits ?? null,
  };
}

export function SchoolContext({ profile: initial }: { profile: Profile }) {
  const [profile, setProfile] = useState<Profile>(() => normalize(initial));
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // No prop-mirroring effect here on purpose. StatsPanel doesn't render this
  // until the profile has loaded, so the initial state is already the real
  // data, and this component owns these fields from that point on — syncing
  // from the prop would only ever fight the user's own typing.

  const save = useCallback(
    async (patch: Partial<Record<keyof Profile, unknown>>) => {
      setProfile((p) => ({ ...p, ...(patch as Partial<Profile>) }));
      setSaveError(null);

      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update(patch)
        .eq("id", initial.id);

      if (error) {
        setSaveError(
          error.message.includes("column")
            ? "Couldn't save — the database is missing these fields. Run migration 0008 in Supabase."
            : `Couldn't save: ${error.message}`
        );
        return;
      }
      setSavedAt(Date.now());
    },
    [initial.id]
  );

  const yesNo = (
    id: string,
    label: string,
    value: boolean | null,
    key: keyof Profile
  ) => (
    <div>
      <label className="micro mb-2 block text-smoke" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        value={value === null ? "" : value ? "yes" : "no"}
        onChange={(e) =>
          save({ [key]: e.target.value === "" ? null : e.target.value === "yes" })
        }
        className={fieldClass}
      >
        <option value="">Not sure</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </div>
  );

  return (
    <div className="rounded-lg border border-line bg-panel p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="display-md text-xl text-chalk">What your school offers</h2>
        {savedAt && !saveError && (
          <span className="micro text-smoke" aria-live="polite">
            Saved
          </span>
        )}
      </div>

      {saveError && (
        <p
          role="alert"
          className="mt-3 rounded-md border border-[#ff7a6b]/30 px-4 py-3 text-[0.85rem] leading-relaxed text-[#ff7a6b]"
        >
          {saveError}
        </p>
      )}

      <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-ash">
        A schedule only means something next to what was available to you. Two
        AP classes at a school that offers three is not the same as two at a
        school that offers twenty-five — and most college advice online quietly
        assumes the second school.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="micro mb-2 block text-smoke" htmlFor="ap-offered">
            Roughly how many AP classes does your school offer?
          </label>
          <select
            id="ap-offered"
            value={profile.school_ap_offered ?? ""}
            onChange={(e) => save({ school_ap_offered: e.target.value || null })}
            className={fieldClass}
          >
            <option value="">Skip this</option>
            {AP_BANDS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        {yesNo(
          "offers-ib",
          "Does your school have the IB programme?",
          profile.school_offers_ib,
          "school_offers_ib"
        )}

        {yesNo(
          "offers-de",
          "Can you take community college / dual enrollment classes?",
          profile.school_offers_dual_enrollment,
          "school_offers_dual_enrollment"
        )}
      </div>

      <div className="mt-6">
        <label className="micro mb-2 block text-smoke" htmlFor="course-limits">
          Any rules about what you&rsquo;re allowed to take?
        </label>
        <textarea
          id="course-limits"
          rows={3}
          maxLength={400}
          defaultValue={profile.school_course_limits ?? ""}
          onBlur={(e) =>
            save({ school_course_limits: e.target.value.trim() || null })
          }
          placeholder="e.g. no APs until 11th grade · honors needs a teacher recommendation · you can only take 2 APs a year"
          className={`${fieldClass} resize-y leading-relaxed`}
        />
        <p className="mt-2 max-w-2xl text-[0.8rem] leading-relaxed text-smoke">
          This is the most useful box on the page and the one nobody asks
          about. Real schools cap AP enrolment, gate honors behind a teacher
          recommendation, or lock the math track back in 8th grade. Without
          that context a capped schedule reads as an unambitious one, which
          isn&rsquo;t true and isn&rsquo;t fair.
        </p>
      </div>
    </div>
  );
}
