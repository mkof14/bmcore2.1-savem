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

export type SavenBackendGateway = {
  getSnapshot(): Promise<SavenMockState>;
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
};
