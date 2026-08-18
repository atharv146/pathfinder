-- PathFinder — saved opportunities
-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- WHY THIS EXISTS.
-- `/opportunities` is 46 entries and growing, and the deadline timeline made
-- the real problem visible: the deadlines CLUSTER, seven of them between
-- mid-September and mid-January. A student who finds four awards they qualify
-- for in August has no way to come back to those four in October. They are
-- re-filtering a 46-entry list from scratch every visit, which in practice
-- means they don't come back at all.
--
-- WHY IT STORES A STRING KEY AND NOT A FOREIGN KEY.
-- The opportunities are code, not rows — `data/scholarships.ts` and
-- `data/major-opportunities.ts` are hand-verified TypeScript, deliberately so
-- (see those files' headers on why the verification discipline lives with the
-- content). There is no opportunities table to reference. So this stores the
-- same id `lib/opportunities.ts` already computes for its React keys.
--
-- The consequence is honest and worth stating: if an entry is renamed or
-- removed from the data files, a saved row can point at nothing. That is
-- handled at read time by simply not rendering unmatched ids, NOT by deleting
-- the row — a scholarship pulled for one cycle often returns the next, and
-- silently destroying a student's saved list to tidy up our own data would be
-- the wrong trade.

create table if not exists public.saved_opportunities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  -- Matches the id built in lib/opportunities.ts. Text, because it is a
  -- content key ("gates", "opportunity:HOSA…"), not a database identity.
  opportunity_id text not null
    check (char_length(btrim(opportunity_id)) between 1 and 200),

  created_at timestamptz not null default now()
);

-- One save per opportunity per user. Unlike the courses table — where
-- repeating a title is legitimate — a duplicate save is always a double-click
-- or a double-submit, never intent. The UI upserts against this.
create unique index if not exists saved_opportunities_user_opp_idx
  on public.saved_opportunities (user_id, opportunity_id);

alter table public.saved_opportunities enable row level security;

-- Owner-only, matching every other table in this schema. Note for the
-- counselor share link (migration 0007): saved opportunities are NOT in
-- `get_shared_progress`'s return list and must not be added without treating
-- it as a privacy decision. What a student is considering applying for —
-- particularly status-dependent awards — is more sensitive than their
-- roadmap progress, not less.
drop policy if exists "saved opportunities are self-managed" on public.saved_opportunities;
create policy "saved opportunities are self-managed"
  on public.saved_opportunities for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Verify after running (do not assume — migrations here are applied by hand
-- and "someone forgot one" is a normal operating state; see lib/db/resilient.ts):
--
--   select tablename, rowsecurity from pg_tables
--   where tablename = 'saved_opportunities';
--   -- rowsecurity must be true
--
--   select policyname, cmd from pg_policies
--   where tablename = 'saved_opportunities';
--   -- expect one ALL policy, self-managed
