-- PathFinder — profile expansion (V2 step 2)
-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- Fills in the rest of the master-spec-doc.md Section 4 student model. These
-- feed the gap analysis ("what's still available to you") and major-pathway
-- personalization — neither of which can exist without knowing where a student
-- actually stands.
--
-- ⚠️ EVERY COLUMN HERE IS NULLABLE, ON PURPOSE.
-- The Lovable-era testing lesson was that "N/A is okay" has to be real, not a
-- slogan: a 9th grader has no test scores, plenty of students don't know their
-- GPA scale, and a nervous family should never be blocked by a field they
-- can't answer. Nothing in the app may require any of these to render.

alter table public.profiles
  -- Academics. gpa_scale matters more than it looks — a 4.3 weighted and a
  -- 4.3 unweighted are very different transcripts, and reading one as the
  -- other produces confidently wrong advice.
  add column if not exists gpa numeric(4, 2) check (gpa >= 0 and gpa <= 6),
  add column if not exists gpa_scale text
    check (gpa_scale in ('weighted', 'unweighted')),

  -- Self-reported, optional. Stored as smallint rather than text so a typo
  -- surfaces at write time instead of silently poisoning later logic.
  add column if not exists sat_score smallint
    check (sat_score between 400 and 1600),
  add column if not exists act_score smallint
    check (act_score between 1 and 36),

  -- Course rigor, coarse buckets rather than a course list. The roadmap's
  -- advice branches on "are you on the most rigorous track available to you",
  -- which is a judgement the student can answer; enumerating every course
  -- they've taken is a data-entry chore that buys nothing extra.
  add column if not exists course_rigor text
    check (course_rigor in ('standard', 'some_honors', 'mostly_honors_ap', 'most_rigorous')),

  add column if not exists target_colleges text[] not null default '{}',

  -- ---------------------------------------------------------------------
  -- Section 7 fields — sensitive, optional, never required.
  -- ---------------------------------------------------------------------
  -- Per the July 21, 2026 decision: immigration status is a separate, optional
  -- field the student may fill in later — never part of required onboarding.
  -- It is not a signup barrier and must never feel like an interrogation.
  --
  -- These exist to make guidance accurate (aid eligibility genuinely differs),
  -- NOT for analytics, and they are never shared or sold. If that ever stops
  -- being true, delete these columns rather than repurposing them.
  add column if not exists first_gen boolean,
  add column if not exists home_language text,
  add column if not exists status_category text
    check (status_category in (
      'us_citizen',
      'permanent_resident',
      'eligible_noncitizen',
      'daca',
      'undocumented',
      'international',
      'prefer_not_to_say'
    ));

-- No new RLS policies needed: these are columns on `profiles`, which is
-- already RLS-enabled with owner-only select/update/insert from migration
-- 0001. Verify that's still true rather than assuming it:
--
--   select tablename, rowsecurity from pg_tables where tablename = 'profiles';
--   -- rowsecurity must be true
--
--   select policyname, cmd from pg_policies where tablename = 'profiles';
--   -- expect self-readable (select), self-writable (update), self-insertable (insert)
