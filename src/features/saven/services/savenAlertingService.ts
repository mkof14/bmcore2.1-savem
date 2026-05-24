import type { SavenMonitoringSloReport, SavenSloMetric, SavenSloStatus } from './savenMonitoringSloService';

export type SavenAlertSeverity = 'info' | 'watch' | 'urgent' | 'critical';

export type SavenAlertRoute =
  | 'admin_ops'
  | 'caregiver_review'
  | 'emergency_review'
  | 'robot_review'
  | 'device_review';

export type SavenOpsAlert = {
  id: string;
  metricId: string;
  severity: SavenAlertSeverity;
  route: SavenAlertRoute;
  title: string;
  message: string;
  runbook: string[];
};

type AlertRule = {
  metricId: string;
  route: SavenAlertRoute;
  watchSeverity: SavenAlertSeverity;
  breachSeverity: SavenAlertSeverity;
  title: string;
  runbook: string[];
};

const alertRules: AlertRule[] = [
  {
    metricId: 'command-backlog',
    route: 'admin_ops',
    watchSeverity: 'watch',
    breachSeverity: 'urgent',
    title: 'Command backlog needs review',
    runbook: ['Open SAVEN Commands', 'Resolve stale voice/text items', 'Confirm owner for each active command'],
  },
  {
    metricId: 'proof-wait-slo',
    route: 'caregiver_review',
    watchSeverity: 'watch',
    breachSeverity: 'urgent',
    title: 'Proof wait SLO is at risk',
    runbook: ['Open Today support flow', 'Ask caregiver or device for confirmation', 'Hold continuity update until proof arrives'],
  },
  {
    metricId: 'incident-severity',
    route: 'admin_ops',
    watchSeverity: 'urgent',
    breachSeverity: 'critical',
    title: 'Incident severity requires ownership',
    runbook: ['Open Admin Ops incident readiness', 'Assign a human owner', 'Record event audit note'],
  },
  {
    metricId: 'robot-gate',
    route: 'robot_review',
    watchSeverity: 'urgent',
    breachSeverity: 'critical',
    title: 'Robot gate is unsafe',
    runbook: ['Freeze robot physical action', 'Open command permission review', 'Require caregiver/admin approval'],
  },
  {
    metricId: 'emergency-gate',
    route: 'emergency_review',
    watchSeverity: 'urgent',
    breachSeverity: 'critical',
    title: 'Emergency gate is unsafe',
    runbook: ['Show emergency rules', 'Require human confirmation', 'Do not perform automatic external dispatch'],
  },
  {
    metricId: 'endpoint-availability',
    route: 'device_review',
    watchSeverity: 'watch',
    breachSeverity: 'urgent',
    title: 'Endpoint availability needs attention',
    runbook: ['Check device connection', 'Check robot readiness', 'Check environment permissions'],
  },
];

function severityForStatus(rule: AlertRule, status: SavenSloStatus): SavenAlertSeverity | null {
  if (status === 'healthy') return null;
  if (status === 'watch') return rule.watchSeverity;
  return rule.breachSeverity;
}

function createAlert(metric: SavenSloMetric, rule: AlertRule): SavenOpsAlert | null {
  const severity = severityForStatus(rule, metric.status);
  if (!severity) return null;

  return {
    id: 'saven-alert-' + metric.id + '-' + metric.status,
    metricId: metric.id,
    severity,
    route: rule.route,
    title: rule.title,
    message: metric.label + ' is ' + metric.status + ': ' + metric.value + '. ' + metric.action,
    runbook: rule.runbook,
  };
}

export function createSavenOpsAlerts(report: SavenMonitoringSloReport): SavenOpsAlert[] {
  return report.metrics
    .map((metric) => {
      const rule = alertRules.find((item) => item.metricId === metric.id);
      return rule ? createAlert(metric, rule) : null;
    })
    .filter((alert): alert is SavenOpsAlert => Boolean(alert));
}

export function getSavenAlertRules() {
  return alertRules.map((rule) => ({ ...rule, runbook: [...rule.runbook] }));
}
