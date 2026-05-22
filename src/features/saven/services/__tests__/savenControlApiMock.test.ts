import { describe, expect, it } from 'vitest';
import { createSavenControlApiMock } from '../savenControlApiMock';
import { savenMockState } from '../../mock/savenMockState';

describe('savenControlApiMock', () => {
  const api = createSavenControlApiMock(savenMockState);

  it('creates a task payload without persistence', () => {
    const result = api.createTask('Hydration check');
    expect(result.operation).toBe('createTask');
    expect(result.status).toBe('mock_ready');
    expect(result.payload.verificationRequired).toBe(true);
  });

  it('assigns a task to a known support circle member', () => {
    const result = api.assignTask('task-mobility-1030', 'caregiver-maya');
    expect(result.status).toBe('mock_ready');
    expect(result.payload.ownerName).toBe('Maya Carter');
  });

  it('blocks emergency escalation as a real external connection', () => {
    const result = api.escalate('emergency');
    expect(result.status).toBe('blocked_by_policy');
    expect(result.payload.realExternalConnection).toBe(false);
  });

  it('requires confirmation before continuity update', () => {
    const result = api.updateContinuity('task-mobility-1030');
    expect(result.status).toBe('requires_confirmation');
  });
});
