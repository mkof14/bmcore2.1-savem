export type SavenBackendApiRisk = 'read' | 'write' | 'admin' | 'human_confirmed';

export type SavenBackendApiRoute = {
  id: string;
  method: 'GET' | 'POST';
  httpPath: string;
  edgeAction: string;
  risk: SavenBackendApiRisk;
  purpose: string;
};

export const savenBackendApiRoutes = [
  {
    id: 'snapshot',
    method: 'GET',
    httpPath: '/snapshot',
    edgeAction: 'snapshot',
    risk: 'read',
    purpose: 'Read the current SAVEN support state.',
  },
  {
    id: 'monitoring',
    method: 'GET',
    httpPath: '/monitoring',
    edgeAction: 'monitoring',
    risk: 'read',
    purpose: 'Read monitoring signals and live queues.',
  },
  {
    id: 'event-audit',
    method: 'GET',
    httpPath: '/events',
    edgeAction: 'list_events',
    risk: 'read',
    purpose: 'Read the SAVEN audit timeline.',
  },
  {
    id: 'incident-readiness',
    method: 'GET',
    httpPath: '/incidents/readiness',
    edgeAction: 'incident_readiness',
    risk: 'read',
    purpose: 'Read admin-ready incidents derived from audit events.',
  },
  {
    id: 'tasks',
    method: 'GET',
    httpPath: '/tasks',
    edgeAction: 'list_tasks',
    risk: 'read',
    purpose: 'Read support tasks.',
  },
  {
    id: 'endpoints',
    method: 'GET',
    httpPath: '/endpoints',
    edgeAction: 'list_endpoints',
    risk: 'read',
    purpose: 'Read devices, robots, and environments.',
  },
  {
    id: 'care-contacts',
    method: 'GET',
    httpPath: '/care-contacts',
    edgeAction: 'list_care_contacts',
    risk: 'read',
    purpose: 'Read approved care contacts.',
  },
  {
    id: 'create-task',
    method: 'POST',
    httpPath: '/tasks',
    edgeAction: 'create_task',
    risk: 'write',
    purpose: 'Create a support task.',
  },
  {
    id: 'assign-task',
    method: 'POST',
    httpPath: '/tasks/:taskId/assignment',
    edgeAction: 'assign_task',
    risk: 'write',
    purpose: 'Assign a task to a person, device, or robot endpoint.',
  },
  {
    id: 'send-command',
    method: 'POST',
    httpPath: '/commands',
    edgeAction: 'send_command',
    risk: 'write',
    purpose: 'Receive voice, text, or system commands.',
  },
  {
    id: 'verify-action',
    method: 'POST',
    httpPath: '/tasks/:taskId/verification',
    edgeAction: 'verify_action',
    risk: 'human_confirmed',
    purpose: 'Record human or telemetry verification.',
  },
  {
    id: 'update-continuity',
    method: 'POST',
    httpPath: '/tasks/:taskId/continuity',
    edgeAction: 'update_continuity',
    risk: 'write',
    purpose: 'Update continuity after verification.',
  },
  {
    id: 'escalate',
    method: 'POST',
    httpPath: '/escalations',
    edgeAction: 'escalate',
    risk: 'human_confirmed',
    purpose: 'Prepare escalation routes without automatic external dispatch.',
  },
  {
    id: 'care-contact-request',
    method: 'POST',
    httpPath: '/care-contact-requests',
    edgeAction: 'request_care_contact',
    risk: 'human_confirmed',
    purpose: 'Prepare doctor, nurse, family, caregiver, or emergency contact route.',
  },
  {
    id: 'admin-override',
    method: 'POST',
    httpPath: '/admin-overrides',
    edgeAction: 'apply_admin_override',
    risk: 'admin',
    purpose: 'Record audit-first admin override decisions.',
  },
] as const satisfies SavenBackendApiRoute[];

export type SavenBackendApiRouteId = typeof savenBackendApiRoutes[number]['id'];
export type SavenBackendEdgeAction = typeof savenBackendApiRoutes[number]['edgeAction'];

export function getSavenBackendApiRoute(id: SavenBackendApiRouteId) {
  return savenBackendApiRoutes.find((route) => route.id === id);
}

export function getSavenBackendRouteByEdgeAction(action: SavenBackendEdgeAction) {
  return savenBackendApiRoutes.find((route) => route.edgeAction === action);
}

export const savenHumanConfirmedRouteIds = savenBackendApiRoutes
  .filter((route) => route.risk === 'human_confirmed' || route.risk === 'admin')
  .map((route) => route.id);
