"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/db/types";

/**
 * The optional part of a student profile — academics, goals, and the
 * Section 7 context fields.
 *
 * DESIGN RULES THIS COMPONENT EXISTS TO HONOUR:
 *
 * 1. Everything is optional and says so out loud. The Lovable-era testing
 *    lesson was that "N/A is okay" has to be visible on screen, not merely
 *    true in the schema — a student who doesn't know their GPA scale, or has
 *    no test scores because they're in 9th grade, must not feel behind.
 *
 * 2. Immigration status is separate, last, and explained. Per the July 21,
 *    2026 decision it is never part of required onboarding and never a signup
 *    barrier. Per Section 7 it carries a plain statement of why it's asked and
 *    that it is never shared — this audience is, with good reason, wary of
 *    institutions collecting exactly this field.
 *
 * 3. Nothing here gates anything. The roadmap, guides, and chat all work with
 *    every field blank.
 */

const RIGOR = [
  { value: "standard", label: "Standard classes" },
  { value: "some_honors", label: "A few honors/AP" },
  { value: "mostly_honors_ap", label: "Mostly honors/AP" },
  { value: "most_rigorous", label: "The most rigorous available to me" },
] as const;

const STATUS = [
  { value: "us_citizen", label: "U.S. citizen" },
  { value: "permanent_resident", label: "Permanent resident (green card)" },
  { value: "eligible_noncitizen", label: "Eligible non-citizen" },
  { value: "daca", label: "DACA" },
  { value: "undocumented", label: "Undocumented" },
  { value: "international", label: "International student" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

type Patch = Partial<Record<keyof Profile, unknown>>;

export function ProfileDetails({ profile: initial }: { profile: Profile }) {
  const [profile, setProfile] = useState<Profile>(initial);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [collegeInput, setCollegeInput] = useState("");

  useEffect(() => setProfile(initial), [initial]);

  const save = useCallback(
    async (patch: Patch) => {
      setProfile((p) => ({ ...p, ...(patch as Partial<Profile>) }));
      const supabase = createClient();
      await supabase.from("profiles").update(patch).eq("id", initial.id);
      setSavedAt(Date.now());
    },
    [initial.id]
  );

  /** Empty string means "cleared" — store null, never 0 or "". */
  const saveNumber = (key: keyof Profile, raw: string) => {
    const trimmed = raw.trim();
    save({ [key]: trimmed === "" ? null : Number(trimmed) });
  };

  const addCollege = () => {
    const name = collegeInput.trim();
    if (!name || profile.target_colleges.includes(name)) return;
    save({ target_colleges: [...profile.target_colleges, name] });
    setCollegeInput("");
  };

  const fieldClass =
    "w-full rounded-md border border-line bg-ink-2 px-4 py-3 text-[0.95rem] text-chalk outline-none transition-colors focus:border-accent";

  return (
    <div className="mt-10 rounded-lg border border-line bg-panel p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="display-md text-xl text-chalk">Your details</h2>
        {savedAt && (
          <span className="micro text-smoke" aria-live="polite">
            Saved
          </span>
        )}
      </div>

      <p className="mt-2 text-[0.9rem] leading-relaxed text-ash">
        All of this is optional and you can change it any time. Leaving
        something blank is completely fine — most students don&rsquo;t have
        every answer yet, and nothing here is required to use PathFinder.
      </p>

      {/* ---------------------------------------------------------------- */}
      <h3 className="micro mt-8 mb-4 text-smoke">Academics</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="micro mb-2 block text-smoke" htmlFor="gpa">
            GPA
          </label>
          <input
            id="gpa"
            type="number"
            step="0.01"
            min="0"
            max="6"
            inputMode="decimal"
            defaultValue={profile.gpa ?? ""}
            onBlur={(e) => saveNumber("gpa", e.target.value)}
            placeholder="e.g. 3.7"
            className={fieldClass}
          />
        </div>

        <div>
          <label className="micro mb-2 block text-smoke" htmlFor="gpa_scale">
            Weighted or unweighted?
          </label>
          <select
            id="gpa_scale"
            value={profile.gpa_scale ?? ""}
            onChange={(e) =>
              save({ gpa_scale: e.target.value || null })
            }
            className={fieldClass}
          >
            <option value="">Not sure</option>
            <option value="unweighted">Unweighted</option>
            <option value="weighted">Weighted</option>
          </select>
        </div>

        <div>
          <label className="micro mb-2 block text-smoke" htmlFor="sat">
            SAT <span className="text-ash">(if you&rsquo;ve taken it)</span>
          </label>
          <input
            id="sat"
            type="number"
            min="400"
            max="1600"
            inputMode="numeric"
            defaultValue={profile.sat_score ?? ""}
            onBlur={(e) => saveNumber("sat_score", e.target.value)}
            placeholder="400–1600"
            className={fieldClass}
          />
        </div>

        <div>
          <label className="micro mb-2 block text-smoke" htmlFor="act">
            ACT <span className="text-ash">(if you&rsquo;ve taken it)</span>
          </label>
          <input
            id="act"
            type="number"
            min="1"
            max="36"
            inputMode="numeric"
            defaultValue={profile.act_score ?? ""}
            onBlur={(e) => saveNumber("act_score", e.target.value)}
            placeholder="1–36"
            className={fieldClass}
          />
        </div>
      </div>

      <p className="mt-3 text-[0.8rem] leading-relaxed text-smoke">
        Most four-year colleges are still test-optional, and plenty of students
        never take either test. Blank here is not a gap.
      </p>

      <div className="mt-5">
        <label className="micro mb-2 block text-smoke" htmlFor="rigor">
          Course load
        </label>
        <select
          id="rigor"
          value={profile.course_rigor ?? ""}
          onChange={(e) => save({ course_rigor: e.target.value || null })}
          className={fieldClass}
        >
          <option value="">Not sure</option>
          {RIGOR.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* ---------------------------------------------------------------- */}
      <h3 className="micro mt-9 mb-4 text-smoke">Schools you&rsquo;re curious about</h3>

      <div className="flex gap-2">
        <input
          value={collegeInput}
          onChange={(e) => setCollegeInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCollege();
            }
          }}
          placeholder="Add a college…"
          className={fieldClass}
        />
        <button
          onClick={addCollege}
          disabled={!collegeInput.trim()}
          className="shrink-0 rounded-md border border-line-bright px-5 text-sm font-semibold text-chalk transition-opacity disabled:opacity-40"
        >
          Add
        </button>
      </div>

      {profile.target_colleges.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {profile.target_colleges.map((c) => (
            <li key={c}>
              <button
                onClick={() =>
                  save({
                    target_colleges: profile.target_colleges.filter(
                      (x) => x !== c
                    ),
                  })
                }
                className="rounded-full border border-line bg-ink px-3 py-1.5 text-[0.85rem] text-chalk hover:border-line-bright"
                aria-label={`Remove ${c}`}
              >
                {c} <span className="text-smoke">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-[0.8rem] leading-relaxed text-smoke">
        Just a list to think with — nothing here is a commitment, and
        &ldquo;undecided&rdquo; is the honest answer for most students.
      </p>

      {/* ---------------------------------------------------------------- */}
      <h3 className="micro mt-9 mb-4 text-smoke">A bit about you</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="micro mb-2 block text-smoke" htmlFor="firstgen">
            First in your family to go to college in the U.S.?
          </label>
          <select
            id="firstgen"
            value={
              profile.first_gen === null ? "" : profile.first_gen ? "yes" : "no"
            }
            onChange={(e) =>
              save({
                first_gen:
                  e.target.value === "" ? null : e.target.value === "yes",
              })
            }
            className={fieldClass}
          >
            <option value="">Prefer not to say</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label className="micro mb-2 block text-smoke" htmlFor="lang">
            Language spoken at home
          </label>
          <input
            id="lang"
            defaultValue={profile.home_language ?? ""}
            onBlur={(e) =>
              save({ home_language: e.target.value.trim() || null })
            }
            placeholder="Optional"
            className={fieldClass}
          />
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Deliberately last, visually separated, and explained before asked. */}
      <div className="mt-9 rounded-lg border border-line-bright bg-ink p-5">
        <h3 className="micro mb-3 text-accent">
          Immigration status — optional
        </h3>

        <p className="text-[0.85rem] leading-relaxed text-ash">
          You can skip this entirely and everything still works. We ask only
          because financial aid rules genuinely differ by status, and generic
          advice here is often flat-out wrong for immigrant families.
        </p>
        <p className="mt-2 text-[0.85rem] leading-relaxed text-ash">
          This is <span className="text-chalk">never shared, never sold</span>,
          and never used for anything but tailoring what PathFinder shows you.
          You can clear it or delete your whole account at any time.
        </p>

        <label className="micro mt-5 mb-2 block text-smoke" htmlFor="status">
          Your status
        </label>
        <select
          id="status"
          value={profile.status_category ?? ""}
          onChange={(e) => save({ status_category: e.target.value || null })}
          className={fieldClass}
        >
          <option value="">Skip this</option>
          {STATUS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <p className="mt-3 text-[0.8rem] leading-relaxed text-smoke">
          PathFinder explains how rules and forms work. It can&rsquo;t give
          legal advice — for anything status-specific, a school counselor or a
          licensed immigration attorney is the right person.
        </p>
      </div>
    </div>
  );
}
