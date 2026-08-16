-- PathFinder — separate the activities interview from the Ask AI chat
-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- The activities interview (V2 step 3) is a second conversational surface. It
-- shares the model, the spend, and therefore the rate limit — but it is NOT
-- the same conversation, and its turns must not appear in the Ask AI
-- transcript.
--
-- One column solves both: the rate-limit function keeps counting every row
-- (spend is spend), while the chat UI filters to kind = 'chat'.

alter table public.chat_messages
  add column if not exists kind text not null default 'chat'
    check (kind in ('chat', 'interview'));

-- The chat UI reads "this user, this kind, newest first".
create index if not exists chat_messages_user_kind_created_idx
  on public.chat_messages (user_id, kind, created_at desc);

-- Unchanged and restated for clarity: the rate limit deliberately counts BOTH
-- kinds. A student who spends their day in the interview has still spent the
-- day's model budget. Re-created here so the counting rule lives next to the
-- column that could otherwise be mistaken for a reason to split it.
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
