import type { SavenMockState } from '../mock/savenMockState';
import type { SavenIncidentReadiness, SavenIncidentRecord } from '../contracts/savenBackendContract';
import { createSavenEventAuditRecords } from './savenEventAuditService';

function incidentFromEvent(event: ReturnType<typeof createSavenEventAuditRecords>[number]): SavenIncidentRecord | null {
  if (event.type === 'proof_waiting') {
    return {
      id: 'incident-proof-' + event.targetId,
      title: 'Proof is waiting for human confirmation',
      severity: event.severity === 'urgent' || event.severity === 'critical' ? event.severity : 'watch',
      status: 'waiting_human',
      owner: event.actorId,
      sourceEventId: event.id,
      nextStep: 'Ask caregiver, family, device, or robot telemetry to confirm the action.',
      createdAt: event.createdAt,
    };
  }

  if (event.type === 'escalation_prepared') {
    return {
      id: 'incident-escalation-' + event.id,
      title: 'Escalation route needs admin visibility',
      severity: event.severity === 'critical' ? 'critical' : 'urgent',
      status: 'admin_review',
      owner: event.actorId,
      sourceEventId: event.id,
      nextStep: 'Review route before any clinical, family, or emergency dispatch.',
      createdAt: event.createdAt,
    };
  }

  if (event.type === 'robot_review_required') {
    return {
      id: 'incident-robot-' + event.targetId,
      title: 'Robot action remains readiness-only',
      severity: 'watch',
      status: 'admin_review',
      owner: event.actorId,
      sourceEventId: event.id,
      nextStep: 'Keep physical robot action locked until human approval policy is active.',
      createdAt: event.createdAt,
    };
  }

  if (event.type === 'admin_override') {
    return {
      id: 'incident-admin-' + event.id,
      title: 'Admin override requires audit review',
      severity: event.severity === 'critical' ? 'critical' : 'watch',
      status: 'admin_review',
      owner: event.actorId,
      sourceEventId: event.id,
      nextStep: 'Confirm reason, target, and policy before the override is treated as final.',
      createdAt: event.createdAt,
    };
  }

  return null;
}

export function createSavenIncidentReadiness(state: SavenMockState): SavenIncidentReadiness {
  const events = createSavenEventAuditRecords(state);
  const incidents = events
    .map(incidentFromEvent)
    .filter((incident): incident is SavenIncidentRecord => Boolean(incident));

  return {
    generatedAt: 'development-snapshot',
    profileId: state.activePersonId,
    incidents,
    summary: {
      open: incidents.length,
      urgent: incidents.filter((incident) => incident.severity === 'urgent').length,
      critical: incidents.filter((incident) => incident.severity === 'critical').length,
      waitingHuman: incidents.filter((incident) => incident.status === 'waiting_human').length,
    },
  };
}
