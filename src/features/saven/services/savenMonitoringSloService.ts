import type { SavenMonitoringSnapshot } from '../contracts/savenBackendContract';

export type SavenSloStatus = 'healthy' | 'watch' | 'breach';

export type SavenSloMetric = {
  id: string;
  label: string;
  status: SavenSloStatus;
  value: string;
  objective: string;
  action: string;
};

export type SavenMonitoringSloReport = {
  id: string;
  status: SavenSloStatus;
  generatedAt: string;
  metrics: SavenSloMetric[];
  summary: {
    healthy: number;
    watch: number;
    breach: number;
  };
};

function statusByCount(value: number, watchAt: number, breachAt: number): SavenSloStatus {
  if (value >= breachAt) return 'breach';
  if (value >= watchAt) return 'watch';
  return 'healthy';
}

function worstStatus(metrics: SavenSloMetric[]): SavenSloStatus {
  if (metrics.some((metric) => metric.status === 'breach')) return 'breach';
  if (metrics.some((metric) => metric.status === 'watch')) return 'watch';
  return 'healthy';
}

export function createSavenMonitoringSloReport(snapshot: SavenMonitoringSnapshot): SavenMonitoringSloReport {
  const criticalQueues = snapshot.queues.filter((item) => item.severity === 'critical').length;
  const highQueues = snapshot.queues.filter((item) => item.severity === 'high').length;
  const robotGate = snapshot.signals.find((signal) => signal.id === 'robot-policy');
  const emergencyGate = snapshot.signals.find((signal) => signal.id === 'emergency-safety');
  const endpointHealth = snapshot.signals.find((signal) => signal.id === 'endpoint-health');

  const metrics: SavenSloMetric[] = [
    {
      id: 'command-backlog',
      label: 'Command backlog',
      status: statusByCount(snapshot.summary.activeCommands, 6, 12),
      value: String(snapshot.summary.activeCommands),
      objective: 'Keep active command backlog below 6 during review.',
      action: 'Open command queue and resolve stale voice or text requests.',
    },
    {
      id: 'proof-wait-slo',
      label: 'Proof wait SLO',
      status: statusByCount(snapshot.summary.openProofWaits, 3, 7),
      value: String(snapshot.summary.openProofWaits),
      objective: 'Keep proof waits below 3 before continuity updates.',
      action: 'Ask caregiver, family, device, or robot endpoint for verification.',
    },
    {
      id: 'incident-severity',
      label: 'Incident severity',
      status: criticalQueues > 0 ? 'breach' : highQueues > 0 ? 'watch' : 'healthy',
      value: criticalQueues + ' critical / ' + highQueues + ' high',
      objective: 'No critical queue should remain without human ownership.',
      action: 'Open Admin Ops incident readiness and assign an owner.',
    },
    {
      id: 'robot-gate',
      label: 'Robot gate',
      status: robotGate?.status === 'healthy' ? 'healthy' : 'breach',
      value: robotGate?.value ?? 'missing',
      objective: 'Robot physical support remains readiness-only until approved.',
      action: 'Hold robot action and route command permission review.',
    },
    {
      id: 'emergency-gate',
      label: 'Emergency gate',
      status: emergencyGate?.status === 'healthy' ? 'healthy' : 'breach',
      value: emergencyGate?.value ?? 'missing',
      objective: 'Emergency path is visible but not automatically dispatched.',
      action: 'Show emergency rules and require human confirmation.',
    },
    {
      id: 'endpoint-availability',
      label: 'Endpoint availability',
      status: endpointHealth?.status === 'healthy' ? 'healthy' : 'watch',
      value: endpointHealth?.value ?? 'missing',
      objective: 'Keep at least two support endpoints available.',
      action: 'Check device, robot, and environment connection status.',
    },
  ];

  return {
    id: 'saven-monitoring-slo-report',
    status: worstStatus(metrics),
    generatedAt: snapshot.generatedAt,
    metrics,
    summary: {
      healthy: metrics.filter((metric) => metric.status === 'healthy').length,
      watch: metrics.filter((metric) => metric.status === 'watch').length,
      breach: metrics.filter((metric) => metric.status === 'breach').length,
    },
  };
}
