-- PathFinder — count Profile Analysis against the AI spend cap
-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- ⚠️ THIS CLOSES A REAL HOLE, found Aug 17, 2026 while hardening the AI
-- limits for real traffic.
--
-- `/api/analysis/resume` calls `guardAiRequest()`, which enforces the daily cap
-- by counting rows in `chat_messages`. But that route never WRITES a row — it
-- returns drafts and saves nothing, deliberately, so the model can't put words
-- on a student's application unsupervised.
--
-- The consequence: resume generations passed the cap check without ever
-- counting toward it. "Write them again" was effectively unlimited, and it is
-- the most expensive call in the app — it processes the student's entire
-- activities list, not one message. With one test user that's invisible. With
-- real traffic it is the thing that exhausts the free tier first.
--
-- The fix keeps the existing rule intact: spend is spend, and every kind counts
-- against one shared per-user budget. `chat_messages_today` already counts ALL
-- kinds, so simply allowing an 'analysis' row and writing one is enough — no
-- change to the function is needed, and none is made here.

alter table public.chat_messages
  drop constraint if exists chat_messages_kind_check;

alter table public.chat_messages
  add constraint chat_messages_kind_check
    check (kind in ('chat', 'interview', 'analysis'));

-- The chat UI filters to kind = 'chat', so analysis rows are invisible there
-- by construction — same mechanism that already hides interview turns.
-- Nothing else needs to change.

-- Verify after running (don't assume — migrations here are applied by hand):
--
--   select conname, pg_get_constraintdef(oid)
--   from pg_constraint where conname = 'chat_messages_kind_check';
--   -- expect: CHECK (kind = ANY (ARRAY['chat', 'interview', 'analysis']))
