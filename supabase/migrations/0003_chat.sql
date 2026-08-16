-- PathFinder — AI chat storage, rate limiting, and escalation flags
-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- ⚠️ THIS APP SERVES MINORS. Same rule as migration 0001: RLS enabled, every
-- policy scoped to auth.uid(), never `USING (true)`.
--
-- Chat transcripts are the most sensitive thing this app stores. A student may
-- type their family's immigration status, a mental-health crisis, or an abuse
-- disclosure into this box. Treat every row here as confidential.

-- ---------------------------------------------------------------------------
-- chat_messages — the "Chat Message" model from master-spec-doc.md Section 4
-- ---------------------------------------------------------------------------
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  role text not null check (role in ('user', 'assistant')),
  content text not null,

  -- Escalation signal, per the Section 6 rule that messages touching legal
  -- immigration status, mental-health crisis, or abuse/safety must get a real
  -- resource pointer rather than only an AI answer. Populated by a keyword
  -- heuristic in src/lib/ai/flags.ts — deliberately NOT a claim of accurate
  -- classification, just a marker so these are reviewable and so the UI can
  -- surface help resources.
  flagged_topics text[] not null default '{}',

  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;

-- Read/insert only. No update or delete policy: a student editing or erasing
-- assistant turns would let them rewrite the transcript, and the escalation
-- flags exist precisely so a concerning message can't be silently removed.
-- Full erasure still happens on account deletion via the cascade above.
drop policy if exists "chat messages are self-readable" on public.chat_messages;
create policy "chat messages are self-readable"
  on public.chat_messages for select
  using (auth.uid() = user_id);

drop policy if exists "chat messages are self-insertable" on public.chat_messages;
create policy "chat messages are self-insertable"
  on public.chat_messages for insert
  with check (auth.uid() = user_id);

-- Drives both conversation history and the daily rate-limit count, which are
-- the only two read patterns: "this user, recently, newest first".
create index if not exists chat_messages_user_created_idx
  on public.chat_messages (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Rate limiting
-- ---------------------------------------------------------------------------
-- This app is free and the model behind it is not. Without a cap, one script
-- (or one stuck retry loop in a student's browser) can run up a real bill.
--
-- SECURITY DEFINER so the count is computed server-side under a fixed
-- search_path rather than trusted from the client. It returns only a number —
-- never message content — so it cannot be used to read another user's chats
-- even though it runs with elevated rights.
create or replace function public.chat_messages_today(p_user_id uuid)
returns integer
language sql
security definer
set search_path = ''
as $$
  select count(*)::integer
  from public.chat_messages
  where user_id = p_user_id
    and role = 'user'
    and created_at > now() - interval '24 hours';
$$;

revoke all on function public.chat_messages_today(uuid) from public;
grant execute on function public.chat_messages_today(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Verify
-- ---------------------------------------------------------------------------
-- select tablename, rowsecurity from pg_tables where tablename = 'chat_messages';
--   rowsecurity must be true.
