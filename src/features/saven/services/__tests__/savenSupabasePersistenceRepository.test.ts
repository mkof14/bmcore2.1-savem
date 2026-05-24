import { describe, expect, it } from 'vitest';
import { createSavenPersistenceStatus, createSavenSupabasePersistenceRepository, savenPersistenceTables } from '../savenSupabasePersistenceRepository';
import { createSavenLocalBackendGateway } from '../savenLocalBackendGateway';

function createFakeClient() {
  const tables: string[] = [];
  const query = {
    select: () => query,
    insert: () => query,
    eq: () => query,
    order: () => query,
    maybeSingle: () => query,
  };
  return {
    tables,
    from(table: string) {
      tables.push(table);
      return query;
    },
  };
}

describe('savenSupabasePersistenceRepository', () => {
  it('documents every SAVEN persistence table', () => {
    expect(savenPersistenceTables.map((item) => item.table)).toEqual(expect.arrayContaining([
      'saven_profiles',
      'saven_commands',
      'saven_events',
      'saven_incidents',
      'saven_incident_actions',
    ]));
  });

  it('keeps external dispatch disabled in persistence status', () => {
    const status = createSavenPersistenceStatus();
    expect(status.safety.externalDispatchDisabled).toBe(true);
    expect(status.safety.rlsDraftReady).toBe(true);
  });

  it('maps repository calls to Supabase tables', () => {
    const fake = createFakeClient();
    const repository = createSavenSupabasePersistenceRepository(fake);

    repository.readProfile('person-anna');
    repository.listEvents('person-anna');
    repository.insertIncidentAction({ incident_id: 'incident-1', action: 'acknowledge' });

    expect(fake.tables).toEqual(['saven_profiles', 'saven_events', 'saven_incident_actions']);
  });

  it('is exposed through the local backend gateway', async () => {
    const gateway = createSavenLocalBackendGateway();
    const status = await gateway.getPersistenceStatus();
    expect(status.mode).toBe('supabase_draft');
  });
});
