-- PathFinder — the per-course list (V2 §16K step 3)
-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- WHY THIS EXISTS, AND WHY IT ISN'T `course_rigor`.
-- Migration 0004 added `profiles.course_rigor` — four coarse buckets, chosen
-- then on the reasoning that enumerating courses is a data-entry chore that
-- buys nothing extra. That reasoning was right for the roadmap and wrong for
-- what comes next. The user's instruction (Aug 16, 2026) was explicit: a
-- student should be able to describe the classes they are actually taking
-- *against what their school offers*, so course rigor can be read honestly
-- rather than guessed at.
--
-- The distinction is the whole point for this audience. "Two APs" is a weak
-- schedule at a school offering twenty-five and the most rigorous schedule
-- available at a school offering three — and the students PathFinder is built
-- for are disproportionately at the second kind of school. A bucket can't
-- express that. A course list plus a school-context answer can.
--
-- `course_rigor` STAYS. It is the one-click answer for a student who won't
-- type out twenty-four classes, and the standing "N/A is okay" rule means the
-- detailed list must never be the price of admission to anything.

-- ---------------------------------------------------------------------------
-- The course list
-- ---------------------------------------------------------------------------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  -- Nullable like everything else here. The UI always sets it, but a student
  -- adding a class they took "sometime in middle school" should not be
  -- blocked on remembering which year.
  grade smallint check (grade between 6 and 12),

  -- Free text, deliberately. Course names are wildly inconsistent between
  -- districts ("Algebra II", "Algebra 2 CP", "Integrated Math III" are often
  -- the same class), and a fixed picker would force students to mislabel
  -- their own transcript to fit our list.
  title text not null check (char_length(btrim(title)) between 1 and 120),

  -- Nullable on purpose: plenty of students genuinely don't know whether the
  -- class their counselor put them in is "honors" on the transcript.
  level text check (
    level in ('regular', 'honors', 'ap', 'ib', 'dual_enrollment', 'other')
  ),

  subject text check (
    subject in (
      'math', 'english', 'science', 'social_studies',
      'world_language', 'arts', 'cte', 'other'
    )
  ),

  -- Past / present / future in one column, so a planned senior-year schedule
  -- lives in the same place as a finished sophomore one. §16K's Profile
  -- Analysis needs the planned rows as much as the completed ones — course
  -- sequences are the one thing you can still fix a year ahead of time.
  status text not null default 'taking'
    check (status in ('taken', 'taking', 'planned')),

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- No unique constraint on (user_id, grade, title). Repeating a title within a
-- year is legitimate (two semesters of "Independent Study", a retake), and a
-- constraint violation would surface to a student as an unexplained failure to
-- save their own transcript. Duplicates are a UI concern, not a data one.
create index if not exists courses_user_grade_idx
  on public.courses (user_id, grade, sort_order);

alter table public.courses enable row level security;

-- Owner-only, matching every other table in this schema. Note what this means
-- for the counselor share link from migration 0007: courses are NOT in
-- `get_shared_progress`'s return list, so they do not leave the account.
-- Adding them there later would be a privacy decision, not a feature one.
drop policy if exists "courses are self-managed" on public.courses;
create policy "courses are self-managed"
  on public.courses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop trigger if exists courses_touch_updated_at on public.courses;
create trigger courses_touch_updated_at
  before update on public.courses
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- The other half: what the school actually offers
-- ---------------------------------------------------------------------------
-- A course list on its own still can't answer "is this a rigorous schedule?"
-- — that question is only meaningful against the ceiling the school sets.
--
-- These are STUDENT-REPORTED, and that is a deliberate choice over scraping
-- per-school course catalogs: catalogs go stale, cover a fraction of U.S. high
-- schools, and would need per-school maintenance forever. A student knows
-- whether their school has IB. Asking them is more accurate and more honest
-- than pretending to a database we don't have.
--
-- All nullable, all skippable, same as migration 0004.
alter table public.profiles
  -- Banded rather than an exact count: nobody knows their school offers
  -- exactly 14 APs, and a free-form number invites a made-up one.
  add column if not exists school_ap_offered text
    check (school_ap_offered in (
      'none', '1_5', '6_10', '11_20', '20_plus', 'not_sure'
    )),

  add column if not exists school_offers_ib boolean,
  add column if not exists school_offers_dual_enrollment boolean,

  -- Free text, and the most under-asked question in this whole schema. Real
  -- schools cap AP enrolment, gate honors behind teacher recommendation, or
  -- lock the math track by 8th grade. Without this, a capped student reads as
  -- an unambitious one — exactly the misreading this app exists to prevent.
  add column if not exists school_course_limits text
    check (char_length(school_course_limits) <= 400);

-- Verify after running (do not assume — migrations here are applied by hand
-- and "someone forgot one" is a normal operating state; see lib/db/resilient.ts):
--
--   select tablename, rowsecurity from pg_tables where tablename = 'courses';
--   -- rowsecurity must be true
--
--   select policyname, cmd from pg_policies where tablename = 'courses';
--   -- expect one ALL policy, self-managed
--
--   select column_name from information_schema.columns
--   where table_name = 'profiles' and column_name like 'school_%';
--   -- expect 4 rows
