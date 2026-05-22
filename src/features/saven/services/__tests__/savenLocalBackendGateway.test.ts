import { describe, expect, it } from 'vitest';
import { createSavenLocalBackendGateway } from '../savenLocalBackendGateway';

describe('savenLocalBackendGateway', () => {
  it('returns a development snapshot without exposing mutable state', async () => {
    const gateway = createSavenLocalBackendGateway();
    const first = await gateway.getSnapshot();
    first.tasks[0].title = 'Mutated outside gateway';

    const second = await gateway.getSnapshot();
    expect(second.tasks[0].title).toBe('Assisted walking session');
  });

  it('lists doctor, nurse, emergency, family, and caregiver contact routes', async () => {
    const gateway = createSavenLocalBackendGateway();
    const contacts = await gateway.listCareContacts();

    expect(contacts.map((contact) => contact.role).sort()).toEqual([
      'caregiver',
      'doctor',
      'emergency',
      'family',
      'nurse',
    ]);
  });

  it('prepares a nurse route for care concerns', async () => {
    const gateway = createSavenLocalBackendGateway();
    const result = await gateway.requestCareContact({
      contactId: 'nurse-grant',
      urgency: 'care_concern',
      reason: 'Missed verification',
      summary: 'Maya missed the medication confirmation window.',
    });

    expect(result.status).toBe('prepared');
    expect(result.contact.role).toBe('nurse');
    expect(result.message).toContain('Nurse Olivia Grant');
  });

  it('requires human confirmation for emergency routing', async () => {
    const gateway = createSavenLocalBackendGateway();
    const result = await gateway.requestCareContact({
      contactId: 'emergency-services',
      urgency: 'emergency',
      reason: 'Serious safety concern',
      summary: 'Emergency escalation test.',
    });

    expect(result.status).toBe('requires_human_confirmation');
  });
});
