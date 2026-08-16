-- PathFinder — language preference
-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- `account_type` already exists from migration 0001 ('student' | 'parent') but
-- has never had a UI path to set it. This adds the missing language field; the
-- parent-account UI is wired up in the same pass.

alter table public.profiles
  -- ISO 639-1. Deliberately a free text column with a CHECK rather than an
  -- enum: adding a language should be a one-line migration, not a type
  -- migration, because more will follow Spanish.
  add column if not exists preferred_language text not null default 'en'
    check (preferred_language in ('en', 'es'));

-- No new RLS needed — this is a column on `profiles`, which is already
-- RLS-enabled with owner-only policies from migration 0001. Verify rather
-- than assume:
--   select tablename, rowsecurity from pg_tables where tablename = 'profiles';
--   -- rowsecurity must be true
