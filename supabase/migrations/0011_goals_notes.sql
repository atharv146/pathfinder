-- PathFinder — the student's own goals, ideas and plans, in their own words
-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- WHY THIS EXISTS.
-- Every profile field so far is something we chose to ask about: grade, major
-- family, GPA, test scores, courses, the school's ceiling. That covers what a
-- form can anticipate. It does not cover the thing a student actually shows up
-- with — "I want to do something with computers and healthcare," "I've been
-- teaching myself Arabic," "I help run my dad's shop on weekends," "I want to
-- stay close to home." Those reshape a recommendation more than a GPA does,
-- and there has been nowhere to put them.
--
-- The user's instruction (Aug 17, 2026) was explicit: a place to enter "any
-- ideas or anything they have" so the analyzer can critique and recommend
-- against it rather than against a form.
--
-- WHY FREE TEXT, AND WHY IT IS NOT PARSED.
-- The temptation is to turn this into tags. Don't. The value here is exactly
-- the part that doesn't fit a taxonomy, and a dropdown of pre-approved
-- interests would flatten it back into what we already ask. It is passed to
-- the model as-is, quoted, with an instruction to treat it as the student's
-- own words.
--
-- SENSITIVITY: this box will collect things students haven't told anyone. It
-- is owner-only RLS like everything else, and it is deliberately NOT added to
-- `get_shared_progress` (migration 0007) — a counselor share link must not
-- start exposing a student's private notes about their own plans. Adding it
-- there would be a privacy decision, not a feature one.

alter table public.profiles
  add column if not exists goals_notes text
    check (char_length(goals_notes) <= 1500);

-- Verify after running (do not assume — migrations here are applied by hand
-- and "someone forgot one" is a normal operating state; see lib/db/resilient.ts):
--
--   select column_name, data_type from information_schema.columns
--   where table_name = 'profiles' and column_name = 'goals_notes';
--   -- expect exactly one row
