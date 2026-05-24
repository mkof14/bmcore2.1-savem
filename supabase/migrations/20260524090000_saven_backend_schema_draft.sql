-- SAVEN backend schema draft.
-- This migration is a backend blueprint and should be reviewed before applying to production.

create table if not exists public.saven_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  display_name text not null,
  support_mode text not null default 'daily_support',
  active_environment text not null default 'home_recovery',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saven_people (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.saven_profiles(id) on delete cascade,
  role text not null,
  display_name text not null,
  availability text,
  permissions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.saven_tasks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.saven_profiles(id) on delete cascade,
  title text not null,
  lifecycle text not null,
  priority text not null default 'normal',
  owner_id uuid references public.saven_people(id) on delete set null,
  verifier_id uuid references public.saven_people(id) on delete set null,
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saven_commands (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.saven_profiles(id) on delete cascade,
  task_id uuid references public.saven_tasks(id) on delete set null,
  source text not null,
  command_text text not null,
  route_status text not null default 'received',
  result_summary text,
  created_at timestamptz not null default now()
);

create table if not exists public.saven_endpoints (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.saven_profiles(id) on delete cascade,
  kind text not null,
  name text not null,
  state text not null,
  allowed_actions jsonb not null default '[]'::jsonb,
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.saven_verifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.saven_profiles(id) on delete cascade,
  task_id uuid not null references public.saven_tasks(id) on delete cascade,
  method text not null,
  status text not null default 'waiting',
  confirmed_by uuid references public.saven_people(id) on delete set null,
  evidence jsonb not null default '{}'::jsonb,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.saven_escalations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.saven_profiles(id) on delete cascade,
  task_id uuid references public.saven_tasks(id) on delete set null,
  level text not null,
  route text not null,
  status text not null default 'prepared',
  requires_human_confirmation boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.saven_admin_overrides (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.saven_profiles(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_id text not null,
  status text not null,
  reason text not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.saven_incidents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.saven_profiles(id) on delete cascade,
  source_event_id uuid,
  title text not null,
  severity text not null,
  status text not null default 'open',
  owner text not null,
  next_step text not null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists saven_incidents_profile_status_idx on public.saven_incidents(profile_id, status);
create index if not exists saven_incidents_severity_idx on public.saven_incidents(severity);

create table if not exists public.saven_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.saven_profiles(id) on delete cascade,
  actor_id text not null,
  target_id text,
  event_type text not null,
  severity text not null default 'info',
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists saven_events_profile_created_idx on public.saven_events(profile_id, created_at desc);
create index if not exists saven_events_type_idx on public.saven_events(event_type);

create index if not exists saven_tasks_profile_lifecycle_idx on public.saven_tasks(profile_id, lifecycle);
create index if not exists saven_commands_profile_created_idx on public.saven_commands(profile_id, created_at desc);
create index if not exists saven_verifications_profile_status_idx on public.saven_verifications(profile_id, status);
create index if not exists saven_escalations_profile_level_idx on public.saven_escalations(profile_id, level);
create index if not exists saven_admin_overrides_created_idx on public.saven_admin_overrides(created_at desc);
