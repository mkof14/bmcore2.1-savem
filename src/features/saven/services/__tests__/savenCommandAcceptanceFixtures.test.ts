import { describe, expect, it } from 'vitest';
import { savenMockState } from '../../mock/savenMockState';
import { savenCommandAcceptanceFixtures } from '../savenCommandAcceptanceFixtures';
import { createSavenCommandExecutionPlan } from '../savenCommandExecutionService';
import { createSavenCommandPermissionReview } from '../savenCommandPermissionService';
import { createSavenLocalBackendGateway } from '../savenLocalBackendGateway';

describe('saven command acceptance fixtures', () => {
  it.each(savenCommandAcceptanceFixtures)('maps $label through execution and permission review', (fixture) => {
    const plan = createSavenCommandExecutionPlan(fixture.input);
    const review = createSavenCommandPermissionReview(savenMockState, fixture.input, fixture.actorId);

    expect(plan.intent).toBe(fixture.expectedIntent);
    expect(plan.safetyGate).toBe(fixture.expectedSafetyGate);
    expect(plan.target).toBe(fixture.expectedTarget);
    expect(review.decision).toBe(fixture.expectedDecision);
    expect(review.plan.intent).toBe(fixture.expectedIntent);

    for (const evidence of fixture.evidence) {
      expect(plan.route.join(' ')).toContain(evidence);
    }
  });

  it('exposes acceptance commands through the local backend gateway', async () => {
    const gateway = createSavenLocalBackendGateway();

    for (const fixture of savenCommandAcceptanceFixtures) {
      const plan = await gateway.interpretCommand(fixture.input);
      const review = await gateway.reviewCommandPermission(fixture.input, fixture.actorId);

      expect(plan.intent).toBe(fixture.expectedIntent);
      expect(review.decision).toBe(fixture.expectedDecision);
    }
  });
});
