-- SAVEN Supabase migration kit
-- Apply only after reviewing project-specific auth roles and data retention.

create table if not exists public.saven_profiles (
  id text primary key,
  display_name text not null,
  support_mode text not null default 'home_recovery',
  active_environment text not null default 'home',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saven_tasks (
  id text primary key,
  profile_id text not null references public.saven_profiles(id) on delete cascade,
  title text not null,
  lifecycle text not null,
  owner_id text,
  verifier_id text,
  priority text not null default 'normal',
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saven_commands (
  id text primary key,
  profile_id text not null references public.saven_profiles(id) on delete cascade,
  source text not null,
  command_text text not null,
  target_task_id text,
  intent text,
  safety_gate text not null,
  permission_decision text not null,
  actor_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.saven_verifications (
  id text primary key,
  profile_id text not null references public.saven_profiles(id) on delete cascade,
  task_id text references public.saven_tasks(id) on delete set null,
  verifier_id text,
  verification_type text not null,
  evidence_summary text not null,
  status text not null default 'waiting',
  created_at timestamptz not null default now()
);

create table if not exists public.saven_admin_overrides (
  id text primary key,
  profile_id text not null references public.saven_profiles(id) on delete cascade,
  actor_id text not null,
  action text not null,
  target_id text not null,
  reason text not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.saven_events (
  id text primary key,
  profile_id text not null references public.saven_profiles(id) on delete cascade,
  event_type text not null,
  actor_id text not null,
  target_id text,
  severity text not null default 'info',
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.saven_incidents (
  id text primary key,
  profile_id text not null references public.saven_profiles(id) on delete cascade,
  title text not null,
  severity text not null,
  status text not null,
  owner text not null,
  source_event_id text references public.saven_events(id) on delete set null,
  next_step text not null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists saven_tasks_profile_lifecycle_idx on public.saven_tasks(profile_id, lifecycle);
create index if not exists saven_commands_profile_created_idx on public.saven_commands(profile_id, created_at desc);
create index if not exists saven_events_profile_created_idx on public.saven_events(profile_id, created_at desc);
create index if not exists saven_incidents_profile_status_idx on public.saven_incidents(profile_id, status);

alter table public.saven_profiles enable row level security;
alter table public.saven_tasks enable row level security;
alter table public.saven_commands enable row level security;
alter table public.saven_verifications enable row level security;
alter table public.saven_admin_overrides enable row level security;
alter table public.saven_events enable row level security;
alter table public.saven_incidents enable row level security;

-- Project owners should replace these draft policies with auth.uid() ownership joins.
-- The marker below is intentionally checked by SAVEN readiness audits.
-- saven_rls_policy_draft: critical writes require SAVEN admin or service role review.
