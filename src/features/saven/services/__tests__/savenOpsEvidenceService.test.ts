import { describe, expect, it } from 'vitest';
import { createSavenOpsEvidencePack } from '../savenOpsEvidenceService';

describe('createSavenOpsEvidencePack', () => {
  it('summarizes the SAVEN command, worker, privacy, monitoring, and alert evidence', () => {
    const pack = createSavenOpsEvidencePack();

    expect(pack.id).toBe('saven-ops-evidence-pack');
    expect(pack.evidence.commandFixtures).toBeGreaterThanOrEqual(6);
    expect(pack.evidence.workerEndpoints).toBeGreaterThanOrEqual(7);
    expect(pack.evidence.privacyReviews).toBe(pack.evidence.commandFixtures);
    expect(pack.evidence.monitoringMetrics).toBeGreaterThanOrEqual(6);
  });

  it('keeps release posture explicit for operators', () => {
    const pack = createSavenOpsEvidencePack();

    expect(['review_ready', 'needs_operator_review', 'blocked']).toContain(pack.releasePosture);
    expect(pack.gates.map((gate) => gate.id)).toEqual([
      'command-contract',
      'worker-handoff',
      'privacy-guardrails',
      'monitoring-slo',
      'alert-routes',
    ]);
    expect(pack.operatorNarrative.join(' ')).toContain('Admin Ops');
  });
});
