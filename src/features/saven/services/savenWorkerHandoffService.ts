import type { SavenBackendCommandInput, SavenCommandExecutionPlan } from '../contracts/savenBackendContract';
import { createSavenCommandExecutionPlan } from './savenCommandExecutionService';

export type SavenWorkerRole =
  | 'caregiver'
  | 'nurse'
  | 'doctor'
  | 'robot'
  | 'device'
  | 'emergency'
  | 'admin';

export type SavenWorkerEndpoint = {
  id: string;
  role: SavenWorkerRole;
  label: string;
  receivesVoiceCommands: boolean;
  allowedCommandTypes: string[];
  blockedActions: string[];
  confirmationRequired: boolean;
  handoffRoute: string;
};

export type SavenWorkerHandoffPacket = {
  id: string;
  worker: SavenWorkerEndpoint;
  command: SavenBackendCommandInput;
  plan: SavenCommandExecutionPlan;
  status: 'prepared' | 'requires_confirmation' | 'blocked';
  message: string;
  nextSteps: string[];
};

export const savenWorkerEndpoints: SavenWorkerEndpoint[] = [
  {
    id: 'caregiver-maya',
    role: 'caregiver',
    label: 'Caregiver Maya',
    receivesVoiceCommands: true,
    allowedCommandTypes: ['assign_support', 'proof_wait', 'family_handoff', 'robot_review'],
    blockedActions: ['clinical_decision', 'automatic_emergency_dispatch'],
    confirmationRequired: true,
    handoffRoute: 'Caregiver review queue',
  },
  {
    id: 'nurse-grant',
    role: 'nurse',
    label: 'Nurse Olivia Grant',
    receivesVoiceCommands: true,
    allowedCommandTypes: ['request_care_contact', 'care_concern', 'recovery_follow_up'],
    blockedActions: ['automatic_dispatch', 'unreviewed_clinical_change'],
    confirmationRequired: true,
    handoffRoute: 'Nurse follow-up queue',
  },
  {
    id: 'doctor-morris',
    role: 'doctor',
    label: 'Dr. Elena Morris',
    receivesVoiceCommands: true,
    allowedCommandTypes: ['prepare_clinical_summary', 'plan_change_review'],
    blockedActions: ['raw_device_broadcast', 'automatic_plan_change'],
    confirmationRequired: true,
    handoffRoute: 'Clinical review packet',
  },
  {
    id: 'robot-r1',
    role: 'robot',
    label: 'SAVEN Assist R1',
    receivesVoiceCommands: true,
    allowedCommandTypes: ['check_robot_readiness', 'report_readiness', 'send_telemetry'],
    blockedActions: ['physical_action_without_approval', 'emergency_dispatch'],
    confirmationRequired: true,
    handoffRoute: 'Robot readiness gate',
  },
  {
    id: 'device-wearable',
    role: 'device',
    label: 'Wearable recovery tracker',
    receivesVoiceCommands: true,
    allowedCommandTypes: ['check_device_telemetry', 'attach_proof', 'routine_confirmation'],
    blockedActions: ['independent_care_decision', 'raw_sensitive_broadcast'],
    confirmationRequired: false,
    handoffRoute: 'Device proof channel',
  },
  {
    id: 'emergency-services',
    role: 'emergency',
    label: 'Emergency route',
    receivesVoiceCommands: true,
    allowedCommandTypes: ['show_emergency_rules', 'prepare_emergency_context'],
    blockedActions: ['automatic_external_dispatch'],
    confirmationRequired: true,
    handoffRoute: 'Human-confirmed emergency path',
  },
  {
    id: 'biomath-admin',
    role: 'admin',
    label: 'BioMath Core Admin',
    receivesVoiceCommands: false,
    allowedCommandTypes: ['admin_override', 'incident_review', 'audit_review', 'release_review'],
    blockedActions: ['silent_override'],
    confirmationRequired: true,
    handoffRoute: 'Admin Ops review',
  },
];

function endpointForPlan(plan: SavenCommandExecutionPlan): SavenWorkerEndpoint {
  const matchByTarget = savenWorkerEndpoints.find((endpoint) => endpoint.id === plan.target);
  if (matchByTarget) return matchByTarget;

  if (plan.intent === 'check_robot_readiness') return savenWorkerEndpoints.find((endpoint) => endpoint.role === 'robot')!;
  if (plan.intent === 'check_device_telemetry') return savenWorkerEndpoints.find((endpoint) => endpoint.role === 'device')!;
  if (plan.intent === 'show_emergency_rules') return savenWorkerEndpoints.find((endpoint) => endpoint.role === 'emergency')!;
  if (plan.intent === 'prepare_clinical_summary') return savenWorkerEndpoints.find((endpoint) => endpoint.role === 'doctor')!;
  if (plan.intent === 'request_care_contact') return savenWorkerEndpoints.find((endpoint) => endpoint.role === 'nurse')!;
  return savenWorkerEndpoints.find((endpoint) => endpoint.role === 'caregiver')!;
}

function statusForWorker(worker: SavenWorkerEndpoint, plan: SavenCommandExecutionPlan): SavenWorkerHandoffPacket['status'] {
  if (plan.safetyGate === 'blocked_external_dispatch') return 'blocked';
  if (worker.confirmationRequired || plan.safetyGate === 'requires_human_confirmation' || plan.safetyGate === 'admin_review') {
    return 'requires_confirmation';
  }
  return 'prepared';
}

export function createSavenWorkerHandoffPacket(input: SavenBackendCommandInput): SavenWorkerHandoffPacket {
  const plan = createSavenCommandExecutionPlan(input);
  const worker = endpointForPlan(plan);
  const status = statusForWorker(worker, plan);

  return {
    id: 'worker-handoff-' + worker.id + '-' + input.targetTaskId,
    worker,
    command: input,
    plan,
    status,
    message:
      status === 'blocked'
        ? 'SAVEN prepared the route but blocked automatic external dispatch.'
        : status === 'requires_confirmation'
          ? 'SAVEN prepared the handoff and is waiting for human confirmation.'
          : 'SAVEN prepared the worker handoff.',
    nextSteps: [
      worker.handoffRoute,
      plan.nextAction,
      worker.confirmationRequired ? 'Require human confirmation before execution.' : 'Attach proof and continue.',
    ],
  };
}

export function createSavenWorkerShiftBoard(commands: SavenBackendCommandInput[]) {
  const packets = commands.map(createSavenWorkerHandoffPacket);
  return {
    id: 'saven-worker-shift-board',
    generatedAt: 'development-snapshot',
    endpoints: savenWorkerEndpoints,
    packets,
    summary: {
      prepared: packets.filter((packet) => packet.status === 'prepared').length,
      requiresConfirmation: packets.filter((packet) => packet.status === 'requires_confirmation').length,
      blocked: packets.filter((packet) => packet.status === 'blocked').length,
    },
  };
}
