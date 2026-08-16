-- PathFinder — student-initiated counselor share links
-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- Implements the July 21, 2026 decision: a student-initiated, REVOCABLE link
-- that lets them show a counselor or mentor what they've been doing. Parent
-- accounts remain standalone and are not wired to this — the point is student
-- autonomy, not a monitoring channel.
--
-- ⚠️ THIS IS THE ONLY PLACE IN THE APP WHERE DATA LEAVES AN ACCOUNT.
-- Everything else is owner-only RLS. Read the field list in the function below
-- before changing anything here, and treat adding a column to it as a
-- privacy decision, not a feature decision.

create table if not exists public.share_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  -- Unguessable. 32 bytes of randomness, base64url-ish via encode(...,'hex').
  -- The token IS the credential, so it must never be sequential or derived
  -- from the user id.
  token text not null unique,

  -- Revocation is a timestamp rather than a delete, so a student can see that
  -- a link they shared is now dead rather than it silently vanishing.
  revoked_at timestamptz,

  -- Hard expiry regardless of revocation. A link handed to a counselor in
  -- 11th grade should not still be live after graduation.
  expires_at timestamptz not null default (now() + interval '180 days'),

  created_at timestamptz not null default now(),
  last_viewed_at timestamptz
);

alter table public.share_links enable row level security;

-- Owner-only management. Anonymous visitors NEVER select from this table
-- directly — they go through the SECURITY DEFINER function below, which
-- returns a deliberately narrow slice and nothing else.
drop policy if exists "share links are self-managed" on public.share_links;
create policy "share links are self-managed"
  on public.share_links for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists share_links_token_idx on public.share_links (token);
create index if not exists share_links_user_idx on public.share_links (user_id);

-- ---------------------------------------------------------------------------
-- The shared view
-- ---------------------------------------------------------------------------
-- SECURITY DEFINER because the caller is anonymous and has no rights to any of
-- these tables. That makes the RETURN LIST the entire security boundary, so it
-- is written out explicitly rather than selecting *.
--
-- DELIBERATELY NOT SHARED, and this list matters as much as the one above:
--   • immigration status  (status_category)
--   • GPA and test scores
--   • first-gen flag, home language
--   • target colleges
--   • ANY chat or interview transcript
--
-- A counselor helping with a roadmap does not need a student's immigration
-- status, and a link that leaked it — to whoever the URL later reached —
-- would be the single worst privacy failure this app could have. Grade,
-- progress and the activities list are enough to be useful.
create or replace function public.get_shared_progress(p_token text)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_result json;
begin
  select user_id into v_user_id
  from public.share_links
  where token = p_token
    and revoked_at is null
    and expires_at > now();

  if v_user_id is null then
    return null;
  end if;

  update public.share_links
    set last_viewed_at = now()
    where token = p_token;

  select json_build_object(
    'grade', p.grade,
    'major', p.major,
    'major_undecided', p.major_undecided,
    'completed_items', coalesce(
      (select json_agg(rp.item_id) from public.roadmap_progress rp
        where rp.user_id = v_user_id), '[]'::json),
    'activities', coalesce(
      (select json_agg(json_build_object(
          'title', a.title,
          'organization', a.organization,
          'role', a.role,
          'description', a.description,
          'hours_per_week', a.hours_per_week,
          'weeks_per_year', a.weeks_per_year
        ) order by a.sort_order)
       from public.activities a where a.user_id = v_user_id), '[]'::json)
  ) into v_result
  from public.profiles p
  where p.id = v_user_id;

  return v_result;
end;
$$;

-- Anonymous callers may execute it — that is the point — but they can still
-- only ever get back the fields listed above, for a token that is live.
revoke all on function public.get_shared_progress(text) from public;
grant execute on function public.get_shared_progress(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Verify
-- ---------------------------------------------------------------------------
-- select tablename, rowsecurity from pg_tables where tablename = 'share_links';
--   rowsecurity must be true.
-- select public.get_shared_progress('not-a-real-token');
--   must return NULL, not an error and not a row.
