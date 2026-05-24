import { describe, expect, it } from 'vitest';
import { savenMockState } from '../../mock/savenMockState';
import { createSavenEventAuditRecords } from '../savenEventAuditService';
import { createSavenLocalBackendGateway } from '../savenLocalBackendGateway';

describe('createSavenEventAuditRecords', () => {
  it('creates a readable audit timeline from local SAVEN state', () => {
    const records = createSavenEventAuditRecords(savenMockState);
    const types = records.map((record) => record.type);

    expect(types).toContain('command_received');
    expect(types).toContain('proof_waiting');
    expect(types).toContain('escalation_prepared');
    expect(types).toContain('robot_review_required');
    expect(records.every((record) => record.profileId === savenMockState.activePersonId)).toBe(true);
  });

  it('is exposed through the local backend gateway', async () => {
    const gateway = createSavenLocalBackendGateway(savenMockState);
    const records = await gateway.listEventAudit();

    expect(records.length).toBeGreaterThan(0);
    expect(records[0]).toHaveProperty('summary');
  });
});
