import { describe, expect, it } from 'vitest';
import { createSavenLaunchControlReport } from '../savenLaunchControlService';

describe('createSavenLaunchControlReport', () => {
  it('creates a go or hold launch decision from SAVEN release gates', () => {
    const report = createSavenLaunchControlReport();

    expect(report.id).toBe('saven-launch-control-report');
    expect(['go', 'hold']).toContain(report.decision);
    expect(report.gates.map((gate) => gate.id)).toEqual([
      'ops-evidence',
      'command-worker-loop',
      'privacy-safety',
      'monitoring-alerting',
      'backend-foundation',
      'admin-visibility',
      'production-preview',
    ]);
  });

  it('keeps production preview as a production-candidate review gate', () => {
    const production = createSavenLaunchControlReport('production_candidate');
    const local = createSavenLaunchControlReport('local_review');

    expect(production.gates.find((gate) => gate.id === 'production-preview')?.requiredBeforeProduction).toBe(true);
    expect(local.gates.find((gate) => gate.id === 'production-preview')?.requiredBeforeProduction).toBe(false);
  });

  it('always returns operator next actions', () => {
    const report = createSavenLaunchControlReport();

    expect(report.nextActions.length).toBeGreaterThan(0);
    expect(report.gates.every((gate) => gate.evidence.length > 0)).toBe(true);
  });
});
