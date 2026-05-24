import { describe, expect, it } from 'vitest';
import { savenMockState } from '../../mock/savenMockState';
import { createSavenMonitoringSnapshot } from '../savenMonitoringService';
import { createSavenMonitoringSloReport } from '../savenMonitoringSloService';

describe('createSavenMonitoringSloReport', () => {
  it('creates SAVEN-specific SLO metrics from the monitoring snapshot', () => {
    const snapshot = createSavenMonitoringSnapshot(savenMockState);
    const report = createSavenMonitoringSloReport(snapshot);

    expect(report.id).toBe('saven-monitoring-slo-report');
    expect(report.metrics.map((metric) => metric.id)).toEqual([
      'command-backlog',
      'proof-wait-slo',
      'incident-severity',
      'robot-gate',
      'emergency-gate',
      'endpoint-availability',
    ]);
    expect(report.summary.healthy + report.summary.watch + report.summary.breach).toBe(report.metrics.length);
  });

  it('breaches when robot or emergency gates disappear', () => {
    const snapshot = createSavenMonitoringSnapshot({
      ...savenMockState,
      endpoints: savenMockState.endpoints.filter((endpoint) => endpoint.kind !== 'robot'),
      escalations: savenMockState.escalations.filter((item) => item.level !== 'emergency'),
    });
    const report = createSavenMonitoringSloReport(snapshot);

    expect(report.status).toBe('breach');
    expect(report.metrics.find((metric) => metric.id === 'robot-gate')?.status).toBe('breach');
    expect(report.metrics.find((metric) => metric.id === 'emergency-gate')?.status).toBe('breach');
  });
});
