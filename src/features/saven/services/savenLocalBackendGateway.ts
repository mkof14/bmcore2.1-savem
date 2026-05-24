import { savenMockState, type SavenMockEscalation, type SavenMockState } from '../mock/savenMockState';
import { createSavenControlApiMock } from './savenControlApiMock';
import { createSavenMonitoringSnapshot } from './savenMonitoringService';
import { createSavenEventAuditRecords } from './savenEventAuditService';
import type {
  SavenAdminOverrideInput,
  SavenBackendCommandInput,
  SavenBackendGateway,
  SavenCareContact,
  SavenContactRequest,
  SavenContactResult,
} from '../contracts/savenBackendContract';

export const savenCareContacts: SavenCareContact[] = [
  {
    id: 'caregiver-maya',
    name: 'Maya Carter',
    role: 'caregiver',
    route: 'in-app + voice confirmation',
    availability: 'Active until 15:00',
    responseTarget: 'Immediate for active recovery task',
    allowedReasons: ['task confirmation', 'handoff', 'recovery support'],
  },
  {
    id: 'family-daniel',
    name: 'Daniel Roberts',
    role: 'family',
    route: 'family notification',
    availability: 'Fallback contact',
    responseTarget: 'Within 20 minutes',
    allowedReasons: ['family fallback', 'missed routine', 'daily summary'],
  },
  {
    id: 'nurse-grant',
    name: 'Nurse Olivia Grant',
    role: 'nurse',
    route: 'care concern review',
    availability: 'Daily check-in window',
    responseTarget: 'Same day care review',
    allowedReasons: ['care concern', 'missed verification', 'recovery follow-up'],
  },
  {
    id: 'doctor-morris',
    name: 'Dr. Elena Morris',
    role: 'doctor',
    route: 'clinical review packet',
    availability: 'Clinic hours',
    responseTarget: 'Clinical review window',
    allowedReasons: ['plan change', 'medication concern', 'clinical summary'],
  },
  {
    id: 'emergency-services',
    name: 'Emergency help',
    role: 'emergency',
    route: 'human-confirmed emergency escalation',
    availability: 'Always visible',
    responseTarget: 'Requires explicit human confirmation',
    allowedReasons: ['emergency', 'serious safety concern'],
  },
];

function cloneState(state: SavenMockState): SavenMockState {
  return structuredClone(state);
}

function buildContactResult(request: SavenContactRequest, contact: SavenCareContact): SavenContactResult {
  const requiresConfirmation = request.urgency === 'emergency' || contact.role === 'emergency';

  return {
    id: `contact-${contact.id}-${request.urgency}`,
    status: requiresConfirmation ? 'requires_human_confirmation' : 'prepared',
    contact,
    message: requiresConfirmation
      ? `Prepared emergency route for ${contact.name}. Human confirmation is required before live dispatch.`
      : `Prepared ${contact.role} route for ${contact.name}: ${request.summary}`,
  };
}

function buildAdminOverrideResult(input: SavenAdminOverrideInput) {
  const requiresReview = input.action === 'approve_robot_action' || input.action === 'hold_escalation';
  const actionLabel = input.action.replace(/_/g, ' ');

  return {
    id: `admin-override-${input.action}-${input.targetId}`,
    status: requiresReview ? 'requires_review' : 'recorded',
    action: input.action,
    targetId: input.targetId,
    message: requiresReview
      ? `SAVEN admin override prepared for review: ${actionLabel}.`
      : `SAVEN admin override recorded: ${actionLabel}.`,
    auditTrail: {
      actorId: input.actorId,
      reason: input.reason,
      note: input.note,
      recordedAt: 'development-snapshot',
    },
  } as const;
}

export function createSavenLocalBackendGateway(state: SavenMockState = savenMockState): SavenBackendGateway {
  const controlApi = createSavenControlApiMock(state);

  return {
    async getSnapshot() {
      return cloneState(state);
    },
    async getMonitoringSnapshot() {
      return createSavenMonitoringSnapshot(cloneState(state));
    },
    async listEventAudit() {
      return createSavenEventAuditRecords(cloneState(state));
    },
    async listTasks() {
      return cloneState(state).tasks;
    },
    async listEndpoints() {
      return cloneState(state).endpoints;
    },
    async listCareContacts() {
      return structuredClone(savenCareContacts);
    },
    async createTask(title: string) {
      return controlApi.createTask(title);
    },
    async assignTask(taskId: string, ownerId: string) {
      return controlApi.assignTask(taskId, ownerId);
    },
    async sendCommand(input: SavenBackendCommandInput) {
      return controlApi.sendCommand(input.text, input.targetTaskId);
    },
    async verifyAction(taskId: string, verifierId: string) {
      return controlApi.verifyAction(taskId, verifierId);
    },
    async updateContinuity(taskId: string) {
      return controlApi.updateContinuity(taskId);
    },
    async escalate(level: SavenMockEscalation['level']) {
      return controlApi.escalate(level);
    },
    async requestCareContact(request: SavenContactRequest) {
      const contact = savenCareContacts.find((item) => item.id === request.contactId);

      if (!contact) {
        throw new Error(`Unknown SAVEN care contact: ${request.contactId}`);
      }

      return buildContactResult(request, contact);
    },
    async applyAdminOverride(input: SavenAdminOverrideInput) {
      return buildAdminOverrideResult(input);
    },
  };
}

export const savenLocalBackendGateway = createSavenLocalBackendGateway();
