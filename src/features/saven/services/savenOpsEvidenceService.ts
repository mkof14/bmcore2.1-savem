import type { SavenBackendCommandInput } from '../contracts/savenBackendContract';
import { savenMockState } from '../mock/savenMockState';
import { createSavenMonitoringSnapshot } from './savenMonitoringService';
import { createSavenMonitoringSloReport } from './savenMonitoringSloService';
import { createSavenOpsAlerts } from './savenAlertingService';
import { createSavenWorkerShiftBoard } from './savenWorkerHandoffService';
import { createSavenPrivacyReview } from './savenPrivacyGuardrailsService';
import { savenCommandAcceptanceFixtures } from './savenCommandAcceptanceFixtures';

export type SavenOpsEvidencePack = {
  id: string;
  generatedAt: string;
  releasePosture: 'review_ready' | 'needs_operator_review' | 'blocked';
  evidence: {
    commandFixtures: number;
    workerEndpoints: number;
    activeAlerts: number;
    privacyReviews: number;
    monitoringMetrics: number;
  };
  gates: Array<{
    id: string;
    status: 'ready' | 'watch' | 'blocked';
    summary: string;
  }>;
  operatorNarrative: string[];
};

const evidenceCommands: SavenBackendCommandInput[] = savenCommandAcceptanceFixtures.map((fixture) => fixture.input);

function gateStatusFromCounts(activeAlerts: number, blockedHandoffs: number): SavenOpsEvidencePack['releasePosture'] {
  if (blockedHandoffs > 1) return 'blocked';
  if (activeAlerts > 0 || blockedHandoffs > 0) return 'needs_operator_review';
  return 'review_ready';
}

export function createSavenOpsEvidencePack(): SavenOpsEvidencePack {
  const monitoringSnapshot = createSavenMonitoringSnapshot(savenMockState);
  const sloReport = createSavenMonitoringSloReport(monitoringSnapshot);
  const alerts = createSavenOpsAlerts(sloReport);
  const workerShiftBoard = createSavenWorkerShiftBoard(evidenceCommands);
  const privacyReviews = evidenceCommands.map((command) => createSavenPrivacyReview(command.text));
  const blockedHandoffs = workerShiftBoard.summary.blocked;
  const releasePosture = gateStatusFromCounts(alerts.length, blockedHandoffs);

  return {
    id: 'saven-ops-evidence-pack',
    generatedAt: 'development-snapshot',
    releasePosture,
    evidence: {
      commandFixtures: savenCommandAcceptanceFixtures.length,
      workerEndpoints: workerShiftBoard.endpoints.length,
      activeAlerts: alerts.length,
      privacyReviews: privacyReviews.length,
      monitoringMetrics: sloReport.metrics.length,
    },
    gates: [
      {
        id: 'command-contract',
        status: savenCommandAcceptanceFixtures.length >= 6 ? 'ready' : 'watch',
        summary: 'Nurse, caregiver, doctor, device, robot, and emergency commands have acceptance fixtures.',
      },
      {
        id: 'worker-handoff',
        status: blockedHandoffs > 1 ? 'blocked' : blockedHandoffs > 0 ? 'watch' : 'ready',
        summary: 'Worker shift board shows prepared, confirmation, and blocked handoff states.',
      },
      {
        id: 'privacy-guardrails',
        status: privacyReviews.every((review) => review.decision.allowedRoles.length > 0) ? 'ready' : 'blocked',
        summary: 'Every evidence command has a privacy data class, role policy, and family-digest rule.',
      },
      {
        id: 'monitoring-slo',
        status: sloReport.status === 'breach' ? 'blocked' : sloReport.status === 'watch' ? 'watch' : 'ready',
        summary: 'SLO report covers command backlog, proof waits, incidents, robot gate, emergency gate, and endpoints.',
      },
      {
        id: 'alert-routes',
        status: alerts.some((alert) => alert.severity === 'critical') ? 'blocked' : alerts.length ? 'watch' : 'ready',
        summary: 'Alerting maps watch and breach states to admin, caregiver, robot, emergency, or device review.',
      },
    ],
    operatorNarrative: [
      'SAVEN commands are no longer loose UI examples; they pass through command fixtures.',
      'Worker handoff proves who receives nurse, caregiver, device, robot, and emergency commands.',
      'Privacy guardrails classify what can be stored, redacted, and shown to each role.',
      'Monitoring and alerts turn support risk into specific operator action.',
      'Admin Ops can review SLO posture, alerts, event audit, incident readiness, and worker handoffs.',
    ],
  };
}
