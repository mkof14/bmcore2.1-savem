import type { SavenMockState, SavenMockTask } from '../mock/savenMockState';
import type { SavenMonitoringQueueItem, SavenMonitoringSignal, SavenMonitoringSnapshot } from '../contracts/savenBackendContract';

function taskSeverity(task: SavenMockTask): SavenMonitoringQueueItem['severity'] {
  if (task.priority === 'high' && task.lifecycle === 'care_review') return 'high';
  if (task.priority === 'high') return 'normal';
  return 'low';
}

export function createSavenMonitoringSnapshot(state: SavenMockState): SavenMonitoringSnapshot {
  const openProofTasks = state.tasks.filter((task) => task.lifecycle === 'care_review');
  const activeCommands = state.commands.length;
  const onlineEndpoints = state.endpoints.filter((endpoint) => endpoint.state === 'online' || endpoint.state === 'active').length;
  const robotReadinessOnly = state.endpoints.filter((endpoint) => endpoint.kind === 'robot' && endpoint.state === 'readiness_only').length;
  const emergencyRoutes = state.escalations.filter((item) => item.level === 'emergency').length;

  const signals: SavenMonitoringSignal[] = [
    {
      id: 'command-latency',
      label: 'Command latency',
      status: activeCommands > 0 ? 'healthy' : 'watch',
      value: activeCommands + ' active',
      detail: 'Voice, text, and system commands are visible before routing.',
    },
    {
      id: 'proof-waits',
      label: 'Open proof waits',
      status: openProofTasks.length > 0 ? 'watch' : 'healthy',
      value: String(openProofTasks.length),
      detail: 'Tasks waiting for caregiver, family, device, or robot confirmation.',
    },
    {
      id: 'endpoint-health',
      label: 'Endpoint health',
      status: onlineEndpoints >= 2 ? 'healthy' : 'watch',
      value: onlineEndpoints + '/' + state.endpoints.length,
      detail: 'Devices, robots, and environments available for SAVEN routing.',
    },
    {
      id: 'robot-policy',
      label: 'Robot policy',
      status: robotReadinessOnly > 0 ? 'healthy' : 'blocked',
      value: robotReadinessOnly + ' readiness only',
      detail: 'Robot physical action remains permissioned by human approval.',
    },
    {
      id: 'emergency-safety',
      label: 'Emergency safety gate',
      status: emergencyRoutes > 0 ? 'healthy' : 'blocked',
      value: 'Human confirmation',
      detail: 'Emergency routes are visible but not live-dispatched by the local backend.',
    },
  ];

  const proofQueue: SavenMonitoringQueueItem[] = openProofTasks.map((task) => ({
    id: 'proof-' + task.id,
    queue: 'proof',
    title: task.title,
    owner: task.verifierId,
    severity: taskSeverity(task),
    waitingFor: 'verification before continuity update',
  }));

  const escalationQueue: SavenMonitoringQueueItem[] = state.escalations
    .filter((item) => item.level !== 'normal')
    .map((item) => ({
      id: 'escalation-' + item.id,
      queue: 'escalation',
      title: item.route,
      owner: item.level,
      severity: item.level === 'emergency' ? 'critical' : item.level === 'clinical_review' ? 'high' : 'normal',
      waitingFor: item.trigger,
    }));

  const endpointQueue: SavenMonitoringQueueItem[] = state.endpoints
    .filter((endpoint) => endpoint.kind === 'robot' || endpoint.state !== 'online')
    .map((endpoint) => ({
      id: 'endpoint-' + endpoint.id,
      queue: 'endpoint',
      title: endpoint.name,
      owner: endpoint.kind,
      severity: endpoint.kind === 'robot' ? 'normal' : 'low',
      waitingFor: endpoint.state,
    }));

  return {
    generatedAt: 'development-snapshot',
    mode: state.mode,
    activePersonId: state.activePersonId,
    signals,
    queues: [...proofQueue, ...escalationQueue, ...endpointQueue],
    summary: {
      openProofWaits: openProofTasks.length,
      activeCommands,
      escalationRoutes: state.escalations.length,
      onlineEndpoints,
      robotReadinessOnly,
    },
  };
}
