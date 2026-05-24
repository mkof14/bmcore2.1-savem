import type { SavenMockEscalation, SavenMockEndpoint, SavenMockState, SavenMockTask } from '../mock/savenMockState';
import type {
  SavenAdminOverrideInput,
  SavenAdminOverrideResult,
  SavenBackendCommandInput,
  SavenCommandExecutionPlan,
  SavenCommandPermissionReview,
  SavenBackendGateway,
  SavenCareContact,
  SavenContactRequest,
  SavenContactResult,
  SavenEventAuditRecord,
  SavenIncidentReadiness,
  SavenIncidentActionInput,
  SavenIncidentActionResult,
  SavenMonitoringSnapshot,
  SavenPersistenceStatus,
} from '../contracts/savenBackendContract';
import type { SavenControlApiResult } from './savenControlApiMock';

type SavenEdgeFunctionBackendAdapterOptions = {
  functionUrl: string;
  fetchImpl?: typeof fetch;
  getAuthToken?: () => string | undefined | Promise<string | undefined>;
};

type EdgeGatewayResponse<T> = {
  data?: T;
  error?: string;
  action?: string;
  status?: string;
  payload?: T;
};

async function parseEdgeResponse<T>(response: Response, action: string): Promise<T> {
  if (!response.ok) {
    throw new Error('SAVEN edge gateway request failed: ' + action + ' returned HTTP ' + response.status);
  }

  const body = await response.json() as EdgeGatewayResponse<T>;
  if (body.error) {
    throw new Error('SAVEN edge gateway request failed: ' + body.error);
  }

  return (body.data ?? body.payload ?? body) as T;
}

export function createSavenEdgeFunctionBackendAdapter(options: SavenEdgeFunctionBackendAdapterOptions): SavenBackendGateway {
  const fetchImpl = options.fetchImpl ?? fetch;
  const functionUrl = options.functionUrl.replace(/\/$/, '');

  async function call<T>(action: string, payload: unknown = {}): Promise<T> {
    const token = await options.getAuthToken?.();
    const headers = new Headers();
    headers.set('content-type', 'application/json');
    if (token) headers.set('authorization', 'Bearer ' + token);

    const response = await fetchImpl(functionUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action, payload }),
    });

    return parseEdgeResponse<T>(response, action);
  }

  return {
    getSnapshot() {
      return call<SavenMockState>('snapshot');
    },
    getMonitoringSnapshot() {
      return call<SavenMonitoringSnapshot>('monitoring');
    },
    listEventAudit() {
      return call<SavenEventAuditRecord[]>('list_events');
    },
    getIncidentReadiness() {
      return call<SavenIncidentReadiness>('incident_readiness');
    },
    getPersistenceStatus() {
      return call<SavenPersistenceStatus>('persistence_status');
    },
    applyIncidentAction(input: SavenIncidentActionInput) {
      return call<SavenIncidentActionResult>('apply_incident_action', input);
    },
    listTasks() {
      return call<SavenMockTask[]>('list_tasks');
    },
    listEndpoints() {
      return call<SavenMockEndpoint[]>('list_endpoints');
    },
    listCareContacts() {
      return call<SavenCareContact[]>('list_care_contacts');
    },
    createTask(title: string) {
      return call<SavenControlApiResult>('create_task', { title });
    },
    assignTask(taskId: string, ownerId: string) {
      return call<SavenControlApiResult>('assign_task', { taskId, ownerId });
    },
    sendCommand(input: SavenBackendCommandInput) {
      return call<SavenControlApiResult>('send_command', input);
    },
    interpretCommand(input: SavenBackendCommandInput) {
      return call<SavenCommandExecutionPlan>('interpret_command', input);
    },
    reviewCommandPermission(input: SavenBackendCommandInput, actorId?: string) {
      return call<SavenCommandPermissionReview>('review_command_permission', { ...input, actorId });
    },
    verifyAction(taskId: string, verifierId: string) {
      return call<SavenControlApiResult>('verify_action', { taskId, verifierId });
    },
    updateContinuity(taskId: string) {
      return call<SavenControlApiResult>('update_continuity', { taskId });
    },
    escalate(level: SavenMockEscalation['level']) {
      return call<SavenControlApiResult>('escalate', { level });
    },
    requestCareContact(input: SavenContactRequest) {
      return call<SavenContactResult>('request_care_contact', input);
    },
    applyAdminOverride(input: SavenAdminOverrideInput) {
      return call<SavenAdminOverrideResult>('apply_admin_override', input);
    },
  };
}
