-- PathFinder — core user tables
-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- ⚠️ THIS APP SERVES MINORS. Row Level Security is the only thing standing
-- between one student's data and another's. Every table below has RLS ENABLED
-- with owner-only policies, and every policy is scoped to auth.uid(). Never
-- add a table here without RLS, and never write a policy with `USING (true)`.

-- ---------------------------------------------------------------------------
-- profiles — one row per user, created automatically on signup
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  -- Onboarding answers. All nullable: a user exists before they answer
  -- anything, and we never block the app on an incomplete profile.
  grade smallint check (grade between 6 and 12),
  major text,
  major_undecided boolean not null default false,

  -- "Parent" changes the tone of what we show, per the V1 decision that
  -- parent accounts are standalone and not linked to a student's progress.
  account_type text not null default 'student'
    check (account_type in ('student', 'parent')),

  display_name text,
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles are self-readable" on public.profiles;
create policy "profiles are self-readable"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles are self-writable" on public.profiles;
create policy "profiles are self-writable"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles are self-insertable" on public.profiles;
create policy "profiles are self-insertable"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- roadmap_progress — replaces the localStorage "mark as done" state
-- ---------------------------------------------------------------------------
create table if not exists public.roadmap_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  -- Matches the item id in app/src/data/roadmap.json. Text, not a FK: the
  -- roadmap is static content in the repo, not a database table.
  item_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

alter table public.roadmap_progress enable row level security;

drop policy if exists "progress is self-managed" on public.roadmap_progress;
create policy "progress is self-managed"
  on public.roadmap_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- activities — the resume / activities list builder
-- ---------------------------------------------------------------------------
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  title text not null default '',
  organization text default '',
  role text default '',
  description text default '',

  -- The Common App activities section asks for both of these, so capturing
  -- them here means the entry can be transcribed straight across later.
  hours_per_week numeric(4,1),
  weeks_per_year smallint,

  -- Which grades this spanned, e.g. {9,10,11}.
  grade_levels smallint[] not null default '{}',

  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.activities enable row level security;

drop policy if exists "activities are self-managed" on public.activities;
create policy "activities are self-managed"
  on public.activities for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists activities_user_sort_idx
  on public.activities (user_id, sort_order);

-- ---------------------------------------------------------------------------
-- Auto-create a profile row when a user signs up.
--
-- SECURITY DEFINER is required: the trigger runs as the auth system inserting
-- into a table the new user cannot yet write to. `set search_path = ''` and
-- fully-qualified names prevent search_path hijacking, which is the standard
-- attack against SECURITY DEFINER functions.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Keep updated_at honest without relying on the client to send it.
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists activities_touch_updated_at on public.activities;
create trigger activities_touch_updated_at
  before update on public.activities
  for each row execute function public.touch_updated_at();
