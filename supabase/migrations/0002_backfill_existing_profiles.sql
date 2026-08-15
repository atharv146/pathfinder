-- Backfill profiles for users who signed up BEFORE migration 0001 ran.
--
-- The `on_auth_user_created` trigger only fires on new inserts into
-- auth.users. Anyone who already had an account when 0001 was applied —
-- including the earlier test signups on this project, and any Google sign-in
-- done before the migration — has no profile row and never will without this.
--
-- Safe to run repeatedly: the NOT EXISTS guard makes it idempotent.

insert into public.profiles (id, display_name)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'full_name', '')
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
);

-- Confirm what you now have. Both numbers should match.
select
  (select count(*) from auth.users)      as auth_users,
  (select count(*) from public.profiles) as profiles;
