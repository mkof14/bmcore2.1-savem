-- SAVEN review seed
-- Safe mock data for local Supabase review only.

insert into public.saven_profiles (id, display_name, support_mode, active_environment)
values ('profile-anna-review', 'Anna Roberts', 'home_recovery', 'home')
on conflict (id) do update set
  display_name = excluded.display_name,
  support_mode = excluded.support_mode,
  active_environment = excluded.active_environment,
  updated_at = now();

insert into public.saven_tasks (id, profile_id, title, lifecycle, owner_id, verifier_id, priority)
values
  ('task-mobility-1030', 'profile-anna-review', 'Assisted walking session', 'commanded', 'caregiver-maya', 'caregiver-maya', 'high'),
  ('task-medication-0900', 'profile-anna-review', 'Medication support confirmation', 'care_review', 'caregiver-maya', 'family-daniel', 'high'),
  ('task-family-1900', 'profile-anna-review', 'Evening recovery review', 'created', 'family-daniel', 'family-daniel', 'normal')
on conflict (id) do update set
  title = excluded.title,
  lifecycle = excluded.lifecycle,
  owner_id = excluded.owner_id,
  verifier_id = excluded.verifier_id,
  priority = excluded.priority,
  updated_at = now();

insert into public.saven_commands (id, profile_id, source, command_text, target_task_id, intent, safety_gate, permission_decision, actor_id)
values
  ('cmd-nurse-follow-up', 'profile-anna-review', 'voice', 'Hey SAVEN, request nurse follow-up and send recovery context.', 'task-medication-0900', 'request_care_contact', 'requires_human_confirmation', 'requires_human_confirmation', 'nurse-grant'),
  ('cmd-robot-readiness', 'profile-anna-review', 'voice', 'Hey SAVEN, check robot readiness and keep physical approval locked.', 'task-mobility-1030', 'check_robot_readiness', 'admin_review', 'admin_review', 'caregiver-maya'),
  ('cmd-emergency-rules', 'profile-anna-review', 'voice', 'Hey SAVEN, urgent emergency help now.', 'task-emergency', 'show_emergency_rules', 'blocked_external_dispatch', 'blocked', 'family-daniel')
on conflict (id) do nothing;

insert into public.saven_events (id, profile_id, event_type, actor_id, target_id, severity, summary, metadata)
values
  ('event-command-nurse', 'profile-anna-review', 'command_received', 'nurse-grant', 'task-medication-0900', 'watch', 'Nurse follow-up command prepared for human send.', '{"fixture":"nurse-follow-up"}'),
  ('event-robot-review', 'profile-anna-review', 'robot_review_required', 'caregiver-maya', 'task-mobility-1030', 'urgent', 'Robot readiness visible; physical action remains locked.', '{"fixture":"robot-readiness-review"}'),
  ('event-emergency-rules', 'profile-anna-review', 'escalation_prepared', 'family-daniel', 'task-emergency', 'critical', 'Emergency rules displayed without automatic external dispatch.', '{"fixture":"emergency-rule-display"}')
on conflict (id) do nothing;

insert into public.saven_incidents (id, profile_id, title, severity, status, owner, source_event_id, next_step)
values
  ('incident-emergency-review', 'profile-anna-review', 'Emergency path review', 'critical', 'waiting_human', 'caregiver-maya', 'event-emergency-rules', 'Confirm emergency path with human operator.')
on conflict (id) do nothing;
