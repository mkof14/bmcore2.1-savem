import { supabase } from '../../../lib/supabase';
import type { SavenPersistenceStatus, SavenPersistenceTableStatus } from '../contracts/savenBackendContract';

type SupabaseLike = {
  from: (table: string) => {
    select: (...args: unknown[]) => unknown;
    insert?: (...args: unknown[]) => unknown;
    update?: (...args: unknown[]) => unknown;
  };
};

export const savenPersistenceTables: SavenPersistenceTableStatus[] = [
  { table: 'saven_profiles', purpose: 'Supported person profile and active environment.', mode: 'draft', criticalWrites: false },
  { table: 'saven_people', purpose: 'Caregivers, family, nurses, doctors, and approved support actors.', mode: 'draft', criticalWrites: false },
  { table: 'saven_tasks', purpose: 'Daily support tasks and lifecycle state.', mode: 'draft', criticalWrites: true },
  { table: 'saven_commands', purpose: 'Voice, text, and system command intake.', mode: 'draft', criticalWrites: true },
  { table: 'saven_events', purpose: 'Audit timeline for every operational move.', mode: 'draft', criticalWrites: false },
  { table: 'saven_incidents', purpose: 'Admin-ready incident list derived from audit events.', mode: 'draft', criticalWrites: true },
  { table: 'saven_incident_actions', purpose: 'Admin acknowledgement, assignment, hold, and resolution audit.', mode: 'draft', criticalWrites: true },
  { table: 'saven_verifications', purpose: 'Human and telemetry proof records.', mode: 'draft', criticalWrites: true },
  { table: 'saven_admin_overrides', purpose: 'Admin override audit records.', mode: 'draft', criticalWrites: true },
];

export function createSavenPersistenceStatus(): SavenPersistenceStatus {
  return {
    generatedAt: 'development-snapshot',
    mode: 'supabase_draft',
    tables: savenPersistenceTables,
    safety: {
      rlsDraftReady: true,
      edgeGatewayDraftReady: true,
      externalDispatchDisabled: true,
    },
  };
}

export function createSavenSupabasePersistenceRepository(client: SupabaseLike = supabase as unknown as SupabaseLike) {
  return {
    getStatus() {
      return createSavenPersistenceStatus();
    },
    readProfile(profileId: string) {
      return client.from('saven_profiles').select('*').eq?.('id', profileId).maybeSingle?.();
    },
    listTasks(profileId: string) {
      return client.from('saven_tasks').select('*').eq?.('profile_id', profileId).order?.('created_at', { ascending: false });
    },
    listEvents(profileId: string) {
      return client.from('saven_events').select('*').eq?.('profile_id', profileId).order?.('created_at', { ascending: false });
    },
    listIncidents(profileId: string) {
      return client.from('saven_incidents').select('*').eq?.('profile_id', profileId).order?.('created_at', { ascending: false });
    },
    insertCommand(command: Record<string, unknown>) {
      return client.from('saven_commands').insert?.(command);
    },
    insertIncidentAction(action: Record<string, unknown>) {
      return client.from('saven_incident_actions').insert?.(action);
    },
  };
}

export const savenSupabasePersistenceRepository = createSavenSupabasePersistenceRepository();
