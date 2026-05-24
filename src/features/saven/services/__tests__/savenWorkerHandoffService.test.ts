import { describe, expect, it } from 'vitest';
import { createSavenWorkerHandoffPacket, createSavenWorkerShiftBoard, savenWorkerEndpoints } from '../savenWorkerHandoffService';

describe('savenWorkerHandoffService', () => {
  it('routes nurse voice command to nurse confirmation queue', () => {
    const packet = createSavenWorkerHandoffPacket({
      source: 'voice',
      text: 'Hey SAVEN, request nurse follow-up and send recovery context.',
      targetTaskId: 'task-medication-0900',
    });

    expect(packet.worker.id).toBe('nurse-grant');
    expect(packet.status).toBe('requires_confirmation');
    expect(packet.nextSteps.join(' ')).toContain('Nurse follow-up queue');
  });

  it('keeps robot handoff locked behind approval', () => {
    const packet = createSavenWorkerHandoffPacket({
      source: 'voice',
      text: 'Hey SAVEN, check robot readiness and keep physical approval locked.',
      targetTaskId: 'task-mobility-1030',
    });

    expect(packet.worker.role).toBe('robot');
    expect(packet.status).toBe('requires_confirmation');
    expect(packet.worker.blockedActions).toContain('physical_action_without_approval');
  });

  it('blocks automatic emergency dispatch', () => {
    const packet = createSavenWorkerHandoffPacket({
      source: 'voice',
      text: 'Hey SAVEN, urgent emergency help now.',
      targetTaskId: 'task-emergency',
    });

    expect(packet.worker.role).toBe('emergency');
    expect(packet.status).toBe('blocked');
    expect(packet.message).toContain('blocked automatic external dispatch');
  });

  it('builds a shift board across worker endpoints', () => {
    const board = createSavenWorkerShiftBoard([
      { source: 'voice', text: 'Hey SAVEN, request nurse follow-up.', targetTaskId: 'task-medication-0900' },
      { source: 'voice', text: 'Hey SAVEN, check wearable sensor.', targetTaskId: 'task-mobility-1030' },
      { source: 'voice', text: 'Hey SAVEN, urgent emergency help now.', targetTaskId: 'task-emergency' },
    ]);

    expect(board.id).toBe('saven-worker-shift-board');
    expect(board.summary.blocked).toBe(1);
    expect(board.summary.prepared).toBe(1);
    expect(board.summary.requiresConfirmation).toBe(1);
  });

  it('documents every SAVEN worker command endpoint', () => {
    expect(savenWorkerEndpoints.map((endpoint) => endpoint.role)).toEqual([
      'caregiver',
      'nurse',
      'doctor',
      'robot',
      'device',
      'emergency',
      'admin',
    ]);
  });
});
