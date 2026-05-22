import { describe, expect, it } from 'vitest';
import { savenReducer, initialSavenState } from '../savenReducer';

describe('savenReducer', () => {
  it('creates a new task', () => {
    const next = savenReducer(initialSavenState, {
      type: 'createTask',
      task: {
        id: 'task-new',
        title: 'New support task',
        lifecycle: 'created',
        ownerId: 'caregiver-maya',
        verifierId: 'caregiver-maya',
        priority: 'normal',
        due: '16:00',
      },
    });
    expect(next.tasks).toHaveLength(initialSavenState.tasks.length + 1);
  });

  it('assigns a task and moves it to assigned lifecycle', () => {
    const next = savenReducer(initialSavenState, {
      type: 'assignTask',
      taskId: 'task-mobility-1030',
      ownerId: 'family-daniel',
    });
    const task = next.tasks.find((item) => item.id === 'task-mobility-1030');
    expect(task?.ownerId).toBe('family-daniel');
    expect(task?.lifecycle).toBe('assigned');
  });

  it('verifies an action and reduces open verifications', () => {
    const next = savenReducer(initialSavenState, {
      type: 'verifyAction',
      taskId: 'task-mobility-1030',
      verifierId: 'caregiver-maya',
    });
    const task = next.tasks.find((item) => item.id === 'task-mobility-1030');
    expect(task?.lifecycle).toBe('verified');
    expect(next.continuity.openVerifications).toBe(0);
  });

  it('updates continuity only through explicit action', () => {
    const next = savenReducer(initialSavenState, {
      type: 'updateContinuity',
      taskId: 'task-mobility-1030',
    });
    expect(next.continuity.score).toBeGreaterThan(initialSavenState.continuity.score);
  });
});
