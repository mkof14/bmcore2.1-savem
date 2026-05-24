import type {
  SavenMockCommand,
  SavenMockEndpoint,
  SavenMockEscalation,
  SavenMockState,
  SavenMockTask,
} from '../mock/savenMockState';
import type { SavenControlApiResult } from '../services/savenControlApiMock';

export type SavenCareContactRole = 'doctor' | 'nurse' | 'emergency' | 'family' | 'caregiver';

export type SavenCareContact = {
  id: string;
  name: string;
  role: SavenCareContactRole;
  route: string;
  availability: string;
  responseTarget: string;
  allowedReasons: string[];
};

export type SavenContactUrgency = 'routine' | 'care_concern' | 'clinical_review' | 'emergency';

export type SavenContactRequest = {
  contactId: string;
  urgency: SavenContactUrgency;
  reason: string;
  summary: string;
};

export type SavenContactResult = {
  id: string;
  status: 'prepared' | 'routed' | 'requires_human_confirmation';
  contact: SavenCareContact;
  message: string;
};

export type SavenBackendCommandInput = {
  source: SavenMockCommand['source'];
  text: string;
  targetTaskId: string;
};

export type SavenMonitoringSignal = {
  id: string;
  label: string;
  status: 'healthy' | 'watch' | 'blocked';
  value: string;
  detail: string;
};

export type SavenMonitoringQueueItem = {
  id: string;
  queue: 'command' | 'proof' | 'escalation' | 'endpoint' | 'admin_override';
  title: string;
  owner: string;
  severity: 'low' | 'normal' | 'high' | 'critical';
  waitingFor: string;
};

export type SavenMonitoringSnapshot = {
  generatedAt: string;
  mode: SavenMockState['mode'];
  activePersonId: string;
  signals: SavenMonitoringSignal[];
  queues: SavenMonitoringQueueItem[];
  summary: {
    openProofWaits: number;
    activeCommands: number;
    escalationRoutes: number;
    onlineEndpoints: number;
    robotReadinessOnly: number;
  };
};

export type SavenAdminOverrideAction =
  | 'pause_support'
  | 'resume_support'
  | 'reassign_owner'
  | 'approve_robot_action'
  | 'deny_robot_action'
  | 'hold_escalation';

export type SavenAdminOverrideInput = {
  action: SavenAdminOverrideAction;
  actorId: string;
  targetId: string;
  reason: string;
  note?: string;
};

export type SavenAdminOverrideResult = {
  id: string;
  status: 'recorded' | 'requires_review';
  action: SavenAdminOverrideAction;
  targetId: string;
  message: string;
  auditTrail: {
    actorId: string;
    reason: string;
    note?: string;
    recordedAt: string;
  };
};

export type SavenEventType =
  | 'command_received'
  | 'task_created'
  | 'task_assigned'
  | 'proof_waiting'
  | 'verification_received'
  | 'continuity_updated'
  | 'care_contact_prepared'
  | 'robot_review_required'
  | 'admin_override'
  | 'escalation_prepared';

export type SavenEventAuditRecord = {
  id: string;
  type: SavenEventType;
  profileId: string;
  actorId: string;
  targetId?: string;
  severity: 'info' | 'watch' | 'urgent' | 'critical';
  summary: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type SavenIncidentSeverity = 'watch' | 'urgent' | 'critical';

export type SavenIncidentStatus = 'open' | 'waiting_human' | 'admin_review';

export type SavenIncidentRecord = {
  id: string;
  title: string;
  severity: SavenIncidentSeverity;
  status: SavenIncidentStatus;
  owner: string;
  sourceEventId?: string;
  nextStep: string;
  createdAt: string;
};

export type SavenIncidentReadiness = {
  generatedAt: string;
  profileId: string;
  incidents: SavenIncidentRecord[];
  summary: {
    open: number;
    urgent: number;
    critical: number;
    waitingHuman: number;
  };
};

export type SavenBackendGateway = {
  getSnapshot(): Promise<SavenMockState>;
  getMonitoringSnapshot(): Promise<SavenMonitoringSnapshot>;
  listEventAudit(): Promise<SavenEventAuditRecord[]>;
  getIncidentReadiness(): Promise<SavenIncidentReadiness>;
  listTasks(): Promise<SavenMockTask[]>;
  listEndpoints(): Promise<SavenMockEndpoint[]>;
  listCareContacts(): Promise<SavenCareContact[]>;
  createTask(title: string): Promise<SavenControlApiResult>;
  assignTask(taskId: string, ownerId: string): Promise<SavenControlApiResult>;
  sendCommand(input: SavenBackendCommandInput): Promise<SavenControlApiResult>;
  verifyAction(taskId: string, verifierId: string): Promise<SavenControlApiResult>;
  updateContinuity(taskId: string): Promise<SavenControlApiResult>;
  escalate(level: SavenMockEscalation['level']): Promise<SavenControlApiResult>;
  requestCareContact(request: SavenContactRequest): Promise<SavenContactResult>;
  applyAdminOverride(input: SavenAdminOverrideInput): Promise<SavenAdminOverrideResult>;
};
