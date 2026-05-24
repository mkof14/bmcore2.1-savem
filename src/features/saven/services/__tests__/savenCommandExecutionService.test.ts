import { describe, expect, it } from 'vitest';
import { createSavenCommandExecutionPlan } from '../savenCommandExecutionService';
import { createSavenLocalBackendGateway } from '../savenLocalBackendGateway';

describe('createSavenCommandExecutionPlan', () => {
  it('classifies nurse follow-up commands', () => {
    const plan = createSavenCommandExecutionPlan({
      source: 'voice',
      text: 'Hey SAVEN, request nurse follow-up and send recovery context.',
      targetTaskId: 'task-medication-0900',
    });

    expect(plan.intent).toBe('request_care_contact');
    expect(plan.safetyGate).toBe('requires_human_confirmation');
    expect(plan.route).toContain('Prepare nurse route');
  });

  it('keeps emergency commands blocked from external dispatch', () => {
    const plan = createSavenCommandExecutionPlan({
      source: 'voice',
      text: 'Hey SAVEN, urgent emergency help now.',
      targetTaskId: 'task-emergency',
    });

    expect(plan.intent).toBe('show_emergency_rules');
    expect(plan.safetyGate).toBe('blocked_external_dispatch');
  });

  it('is exposed through the local backend gateway', async () => {
    const gateway = createSavenLocalBackendGateway();
    const plan = await gateway.interpretCommand({
      source: 'text',
      text: 'Check robot readiness and keep physical approval locked.',
      targetTaskId: 'task-mobility-1030',
    });

    expect(plan.intent).toBe('check_robot_readiness');
    expect(plan.safetyGate).toBe('admin_review');
  });
});
