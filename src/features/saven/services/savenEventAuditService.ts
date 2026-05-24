import type { SavenMockCommand, SavenMockEndpoint, SavenMockEscalation, SavenMockState, SavenMockTask } from '../mock/savenMockState';
import type { SavenEventAuditRecord } from '../contracts/savenBackendContract';

function taskEventType(task: SavenMockTask): SavenEventAuditRecord['type'] {
  if (task.lifecycle === 'created') return 'task_created';
  if (task.lifecycle === 'commanded' || task.lifecycle === 'assigned') return 'task_assigned';
  if (task.lifecycle === 'care_review') return 'proof_waiting';
  if (task.lifecycle === 'verified') return 'verification_received';
  return 'continuity_updated';
}

function taskSeverity(task: SavenMockTask): SavenEventAuditRecord['severity'] {
  if (task.priority === 'high' && task.lifecycle === 'care_review') return 'urgent';
  if (task.lifecycle === 'care_review') return 'watch';
  return 'info';
}

function commandRecord(command: SavenMockCommand, profileId: string, index: number): SavenEventAuditRecord {
  return {
    id: 'event-command-' + command.id,
    type: 'command_received',
    profileId,
    actorId: command.source,
    targetId: command.targetTaskId,
    severity: 'info',
    summary: 'Command received: ' + command.text,
    metadata: {
      routeStatus: command.routeStatus,
      source: command.source,
      index,
    },
    createdAt: 'development-snapshot',
  };
}

function taskRecord(task: SavenMockTask, profileId: string): SavenEventAuditRecord {
  return {
    id: 'event-task-' + task.id + '-' + task.lifecycle,
    type: taskEventType(task),
    profileId,
    actorId: task.ownerId,
    targetId: task.id,
    severity: taskSeverity(task),
    summary: task.lifecycle === 'care_review'
      ? 'Proof waiting for ' + task.title
      : 'Task moved through SAVEN lifecycle: ' + task.title,
    metadata: {
      lifecycle: task.lifecycle,
      priority: task.priority,
      verifierId: task.verifierId,
    },
    createdAt: 'development-snapshot',
  };
}

function escalationRecord(escalation: SavenMockEscalation, profileId: string): SavenEventAuditRecord {
  return {
    id: 'event-escalation-' + escalation.id,
    type: 'escalation_prepared',
    profileId,
    actorId: escalation.level,
    severity: escalation.level === 'emergency' ? 'critical' : escalation.level === 'clinical_review' ? 'urgent' : 'watch',
    summary: 'Escalation route prepared: ' + escalation.route,
    metadata: {
      trigger: escalation.trigger,
      level: escalation.level,
    },
    createdAt: 'development-snapshot',
  };
}

function endpointRecord(endpoint: SavenMockEndpoint, profileId: string): SavenEventAuditRecord | null {
  if (endpoint.kind !== 'robot') return null;

  return {
    id: 'event-endpoint-' + endpoint.id,
    type: 'robot_review_required',
    profileId,
    actorId: endpoint.kind,
    targetId: endpoint.id,
    severity: endpoint.state === 'readiness_only' ? 'watch' : 'info',
    summary: endpoint.name + ' is visible for readiness, not autonomous physical action.',
    metadata: {
      state: endpoint.state,
      allowedActions: endpoint.allowedActions,
    },
    createdAt: 'development-snapshot',
  };
}

export function createSavenEventAuditRecords(state: SavenMockState): SavenEventAuditRecord[] {
  const profileId = state.activePersonId;
  const commandEvents = state.commands.map((command, index) => commandRecord(command, profileId, index));
  const taskEvents = state.tasks.map((task) => taskRecord(task, profileId));
  const escalationEvents = state.escalations
    .filter((escalation) => escalation.level !== 'normal')
    .map((escalation) => escalationRecord(escalation, profileId));
  const endpointEvents = state.endpoints
    .map((endpoint) => endpointRecord(endpoint, profileId))
    .filter((event): event is SavenEventAuditRecord => Boolean(event));

  return [...commandEvents, ...taskEvents, ...escalationEvents, ...endpointEvents];
}
