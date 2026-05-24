import { describe, expect, it } from 'vitest';
import { createSavenLocalBackendGateway } from '../savenLocalBackendGateway';

describe('saven admin overrides', () => {
  it('records a local pause override with audit details', async () => {
    const gateway = createSavenLocalBackendGateway();
    const result = await gateway.applyAdminOverride({
      action: 'pause_support',
      actorId: 'admin-test',
      targetId: 'person-anna',
      reason: 'Manual review',
    });

    expect(result.status).toBe('recorded');
    expect(result.auditTrail.actorId).toBe('admin-test');
    expect(result.message).toContain('pause support');
  });

  it('requires review for robot action approval', async () => {
    const gateway = createSavenLocalBackendGateway();
    const result = await gateway.applyAdminOverride({
      action: 'approve_robot_action',
      actorId: 'admin-test',
      targetId: 'robot-r1',
      reason: 'Robot action requires human approval',
    });

    expect(result.status).toBe('requires_review');
  });
});
