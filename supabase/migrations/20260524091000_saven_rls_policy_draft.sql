-- SAVEN RLS policy draft.
-- Review before applying. This draft assumes public.profiles.id = auth.uid()
-- and public.profiles.is_admin is the BioMath Core admin flag.

create or replace function public.is_saven_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and is_admin = true
  );
$$;

alter table public.saven_profiles enable row level security;
alter table public.saven_people enable row level security;
alter table public.saven_tasks enable row level security;
alter table public.saven_commands enable row level security;
alter table public.saven_endpoints enable row level security;
alter table public.saven_verifications enable row level security;
alter table public.saven_escalations enable row level security;
alter table public.saven_admin_overrides enable row level security;

create policy "saven profiles owner or admin read"
on public.saven_profiles
for select
using (owner_user_id = auth.uid() or public.is_saven_admin());

create policy "saven profiles owner create"
on public.saven_profiles
for insert
with check (owner_user_id = auth.uid() or public.is_saven_admin());

create policy "saven profiles admin update"
on public.saven_profiles
for update
using (public.is_saven_admin())
with check (public.is_saven_admin());

create policy "saven child records owner or admin read"
on public.saven_people
for select
using (
  public.is_saven_admin()
  or exists (
    select 1 from public.saven_profiles p
    where p.id = saven_people.profile_id
      and p.owner_user_id = auth.uid()
  )
);

create policy "saven tasks owner or admin read"
on public.saven_tasks
for select
using (
  public.is_saven_admin()
  or exists (
    select 1 from public.saven_profiles p
    where p.id = saven_tasks.profile_id
      and p.owner_user_id = auth.uid()
  )
);

create policy "saven commands owner create"
on public.saven_commands
for insert
with check (
  exists (
    select 1 from public.saven_profiles p
    where p.id = saven_commands.profile_id
      and p.owner_user_id = auth.uid()
  )
  or public.is_saven_admin()
);

create policy "saven commands owner or admin read"
on public.saven_commands
for select
using (
  public.is_saven_admin()
  or exists (
    select 1 from public.saven_profiles p
    where p.id = saven_commands.profile_id
      and p.owner_user_id = auth.uid()
  )
);

create policy "saven endpoints owner or admin read"
on public.saven_endpoints
for select
using (
  public.is_saven_admin()
  or exists (
    select 1 from public.saven_profiles p
    where p.id = saven_endpoints.profile_id
      and p.owner_user_id = auth.uid()
  )
);

create policy "saven verifications owner or admin read"
on public.saven_verifications
for select
using (
  public.is_saven_admin()
  or exists (
    select 1 from public.saven_profiles p
    where p.id = saven_verifications.profile_id
      and p.owner_user_id = auth.uid()
  )
);

create policy "saven escalations admin read"
on public.saven_escalations
for select
using (public.is_saven_admin());

create policy "saven admin overrides admin only"
on public.saven_admin_overrides
for all
using (public.is_saven_admin())
with check (public.is_saven_admin());

-- Critical writes should be performed by approved Edge Functions or admins:
-- tasks update, endpoint state update, verification confirmation, escalation dispatch,
-- robot action approval, emergency route preparation, and admin override creation.
