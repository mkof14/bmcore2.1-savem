import type { SavenIncidentActionInput, SavenIncidentActionResult } from '../contracts/savenBackendContract';

export function applySavenIncidentAction(input: SavenIncidentActionInput): SavenIncidentActionResult {
  const requiresReview = input.action === 'resolve' || input.action === 'hold';
  const actionLabel = input.action.replace(/_/g, ' ');

  return {
    id: 'incident-action-' + input.action + '-' + input.incidentId,
    incidentId: input.incidentId,
    action: input.action,
    status: requiresReview ? 'requires_review' : 'recorded',
    message: requiresReview
      ? 'SAVEN incident action prepared for review: ' + actionLabel + '.'
      : 'SAVEN incident action recorded: ' + actionLabel + '.',
    auditTrail: {
      actorId: input.actorId,
      note: input.note,
      assignTo: input.assignTo,
      recordedAt: 'development-snapshot',
    },
  };
}
