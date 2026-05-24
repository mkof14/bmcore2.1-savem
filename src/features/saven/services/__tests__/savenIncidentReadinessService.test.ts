import { describe, expect, it } from 'vitest';
import { savenMockState } from '../../mock/savenMockState';
import { createSavenIncidentReadiness } from '../savenIncidentReadinessService';
import { createSavenLocalBackendGateway } from '../savenLocalBackendGateway';

describe('createSavenIncidentReadiness', () => {
  it('groups audit events into admin-ready incidents', () => {
    const readiness = createSavenIncidentReadiness(savenMockState);

    expect(readiness.profileId).toBe(savenMockState.activePersonId);
    expect(readiness.summary.open).toBeGreaterThan(0);
    expect(readiness.summary.waitingHuman).toBeGreaterThan(0);
    expect(readiness.incidents.map((incident) => incident.status)).toContain('admin_review');
  });

  it('is exposed through the local backend gateway', async () => {
    const gateway = createSavenLocalBackendGateway(savenMockState);
    const readiness = await gateway.getIncidentReadiness();

    expect(readiness.incidents.length).toBeGreaterThan(0);
    expect(readiness.incidents[0]).toHaveProperty('nextStep');
  });
});
