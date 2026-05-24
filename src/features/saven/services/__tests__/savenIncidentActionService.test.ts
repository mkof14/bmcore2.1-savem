import { describe, expect, it } from 'vitest';
import { applySavenIncidentAction } from '../savenIncidentActionService';
import { createSavenLocalBackendGateway } from '../savenLocalBackendGateway';

describe('applySavenIncidentAction', () => {
  it('records admin incident actions audit-first', () => {
    const result = applySavenIncidentAction({
      incidentId: 'incident-proof-task-medication-0900',
      action: 'acknowledge',
      actorId: 'biomath-admin',
      note: 'Acknowledged by SAVEN Ops.',
    });

    expect(result.status).toBe('recorded');
    expect(result.message).toContain('acknowledge');
  });

  it('marks hold and resolve actions for review', async () => {
    const gateway = createSavenLocalBackendGateway();
    const result = await gateway.applyIncidentAction({
      incidentId: 'incident-escalation-event-escalation-esc-care',
      action: 'hold',
      actorId: 'biomath-admin',
      note: 'Hold route for human review.',
    });

    expect(result.status).toBe('requires_review');
  });
});
