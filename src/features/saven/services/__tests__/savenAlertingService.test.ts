import { describe, expect, it } from 'vitest';
import { savenMockState } from '../../mock/savenMockState';
import { createSavenOpsAlerts, getSavenAlertRules } from '../savenAlertingService';
import { createSavenMonitoringSnapshot } from '../savenMonitoringService';
import { createSavenMonitoringSloReport } from '../savenMonitoringSloService';

describe('savenAlertingService', () => {
  it('keeps healthy review state quiet except watched support work', () => {
    const snapshot = createSavenMonitoringSnapshot(savenMockState);
    const report = createSavenMonitoringSloReport(snapshot);
    const alerts = createSavenOpsAlerts(report);

    expect(alerts.every((alert) => alert.runbook.length > 0)).toBe(true);
    expect(alerts.some((alert) => alert.metricId === 'robot-gate')).toBe(false);
    expect(alerts.some((alert) => alert.metricId === 'emergency-gate')).toBe(false);
  });

  it('creates critical alerts when robot and emergency gates breach', () => {
    const snapshot = createSavenMonitoringSnapshot({
      ...savenMockState,
      endpoints: savenMockState.endpoints.filter((endpoint) => endpoint.kind !== 'robot'),
      escalations: savenMockState.escalations.filter((item) => item.level !== 'emergency'),
    });
    const report = createSavenMonitoringSloReport(snapshot);
    const alerts = createSavenOpsAlerts(report);

    expect(alerts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ metricId: 'robot-gate', severity: 'critical', route: 'robot_review' }),
        expect.objectContaining({ metricId: 'emergency-gate', severity: 'critical', route: 'emergency_review' }),
      ]),
    );
  });

  it('documents all alert rules for the runbook', () => {
    const rules = getSavenAlertRules();

    expect(rules.map((rule) => rule.metricId)).toEqual([
      'command-backlog',
      'proof-wait-slo',
      'incident-severity',
      'robot-gate',
      'emergency-gate',
      'endpoint-availability',
    ]);
  });
});
