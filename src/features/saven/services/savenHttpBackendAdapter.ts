import type { SavenMockEscalation } from '../mock/savenMockState';
import type {
  SavenAdminOverrideInput,
  SavenAdminOverrideResult,
  SavenBackendCommandInput,
  SavenBackendGateway,
  SavenCareContact,
  SavenContactRequest,
  SavenContactResult,
  SavenEventAuditRecord,
  SavenIncidentReadiness,
  SavenMonitoringSnapshot,
} from '../contracts/savenBackendContract';
import type { SavenMockEndpoint, SavenMockState, SavenMockTask } from '../mock/savenMockState';
import type { SavenControlApiResult } from './savenControlApiMock';

type SavenHttpBackendAdapterOptions = {
  baseUrl: string;
  fetchImpl?: typeof fetch;
  getAuthToken?: () => string | undefined | Promise<string | undefined>;
};

async function parseJsonResponse<T>(response: Response, path: string): Promise<T> {
  if (!response.ok) {
    throw new Error('SAVEN backend request failed: ' + path + ' returned HTTP ' + response.status);
  }

  return response.json() as Promise<T>;
}

export function createSavenHttpBackendAdapter(options: SavenHttpBackendAdapterOptions): SavenBackendGateway {
  const fetchImpl = options.fetchImpl ?? fetch;
  const baseUrl = options.baseUrl.replace(/\/$/, '');

  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await options.getAuthToken?.();
    const headers = new Headers(init.headers);
    headers.set('content-type', 'application/json');
    if (token) headers.set('authorization', 'Bearer ' + token);

    const response = await fetchImpl(baseUrl + path, {
      ...init,
      headers,
    });

    return parseJsonResponse<T>(response, path);
  }

  return {
    getSnapshot() {
      return request<SavenMockState>('/snapshot');
    },
    getMonitoringSnapshot() {
      return request<SavenMonitoringSnapshot>('/monitoring');
    },
    listEventAudit() {
      return request<SavenEventAuditRecord[]>('/events');
    },
    getIncidentReadiness() {
      return request<SavenIncidentReadiness>('/incidents/readiness');
    },
    listTasks() {
      return request<SavenMockTask[]>('/tasks');
    },
    listEndpoints() {
      return request<SavenMockEndpoint[]>('/endpoints');
    },
    listCareContacts() {
      return request<SavenCareContact[]>('/care-contacts');
    },
    createTask(title: string) {
      return request<SavenControlApiResult>('/tasks', {
        method: 'POST',
        body: JSON.stringify({ title }),
      });
    },
    assignTask(taskId: string, ownerId: string) {
      return request<SavenControlApiResult>('/tasks/' + encodeURIComponent(taskId) + '/assignment', {
        method: 'POST',
        body: JSON.stringify({ ownerId }),
      });
    },
    sendCommand(input: SavenBackendCommandInput) {
      return request<SavenControlApiResult>('/commands', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    },
    verifyAction(taskId: string, verifierId: string) {
      return request<SavenControlApiResult>('/tasks/' + encodeURIComponent(taskId) + '/verification', {
        method: 'POST',
        body: JSON.stringify({ verifierId }),
      });
    },
    updateContinuity(taskId: string) {
      return request<SavenControlApiResult>('/tasks/' + encodeURIComponent(taskId) + '/continuity', {
        method: 'POST',
      });
    },
    escalate(level: SavenMockEscalation['level']) {
      return request<SavenControlApiResult>('/escalations', {
        method: 'POST',
        body: JSON.stringify({ level }),
      });
    },
    requestCareContact(input: SavenContactRequest) {
      return request<SavenContactResult>('/care-contact-requests', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    },
    applyAdminOverride(input: SavenAdminOverrideInput) {
      return request<SavenAdminOverrideResult>('/admin-overrides', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    },
  };
}
