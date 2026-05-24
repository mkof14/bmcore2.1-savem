import { describe, expect, it } from 'vitest';
import { savenMockState } from '../../mock/savenMockState';
import { createSavenCommandPermissionReview } from '../savenCommandPermissionService';
import { createSavenLocalBackendGateway } from '../savenLocalBackendGateway';

describe('createSavenCommandPermissionReview', () => {
  it('keeps emergency commands blocked from automatic dispatch', () => {
    const review = createSavenCommandPermissionReview(savenMockState, {
      source: 'voice',
      text: 'Hey SAVEN, urgent emergency help now.',
      targetTaskId: 'task-emergency',
    });

    expect(review.plan.intent).toBe('show_emergency_rules');
    expect(review.decision).toBe('blocked');
  });

  it('routes robot commands to admin review', () => {
    const review = createSavenCommandPermissionReview(savenMockState, {
      source: 'voice',
      text: 'Hey SAVEN, check robot readiness and physical approval.',
      targetTaskId: 'task-mobility-1030',
    });

    expect(review.plan.intent).toBe('check_robot_readiness');
    expect(review.decision).toBe('admin_review');
  });

  it('is exposed through the local backend gateway', async () => {
    const gateway = createSavenLocalBackendGateway();
    const review = await gateway.reviewCommandPermission({
      source: 'text',
      text: 'Check device telemetry from wearable sensor.',
      targetTaskId: 'task-mobility-1030',
    });

    expect(review.plan.intent).toBe('check_device_telemetry');
    expect(review.requiredPermission).toBe('confirm_low_risk_routine');
  });
});
