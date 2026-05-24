// SAVEN Supabase Edge Function gateway
// Deploy as: supabase functions deploy saven-gateway

type SavenGatewayAction =
  | 'send_command'
  | 'interpret_command'
  | 'review_command_permission'
  | 'persistence_status'
  | 'list_events'
  | 'incident_readiness'
  | 'apply_admin_override';

type SavenGatewayRequest = {
  action: SavenGatewayAction;
  actorId?: string;
  payload?: Record<string, unknown>;
};

const ALLOWED_ACTIONS: SavenGatewayAction[] = [
  'send_command',
  'interpret_command',
  'review_command_permission',
  'persistence_status',
  'list_events',
  'incident_readiness',
  'apply_admin_override',
];

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function requireAdminActor(request: SavenGatewayRequest) {
  const actorId = request.actorId || String(request.payload?.actorId || '');
  if (!actorId || (!actorId.includes('admin') && !actorId.includes('caregiver'))) {
    return jsonResponse({ error: 'Admin access required for this SAVEN gateway action.' }, 403);
  }
  return null;
}

function buildCommandPlan(payload: Record<string, unknown> = {}) {
  const text = String(payload.text || payload.commandText || '').toLowerCase();
  const targetTaskId = String(payload.targetTaskId || 'task-unassigned');

  if (text.includes('emergency') || text.includes('urgent')) {
    return {
      id: 'edge-command-plan-' + targetTaskId,
      intent: 'show_emergency_rules',
      target: 'emergency-services',
      safetyGate: 'blocked_external_dispatch',
      route: ['Show emergency rules', 'Require human confirmation', 'Block automatic dispatch'],
      nextAction: 'Display emergency route rules without calling external services.',
    };
  }

  if (text.includes('robot')) {
    return {
      id: 'edge-command-plan-' + targetTaskId,
      intent: 'check_robot_readiness',
      target: 'robot-r1',
      safetyGate: 'admin_review',
      route: ['Check readiness', 'Keep action locked', 'Request approval'],
      nextAction: 'Show robot readiness while physical action remains locked.',
    };
  }

  if (text.includes('device') || text.includes('wearable') || text.includes('sensor')) {
    return {
      id: 'edge-command-plan-' + targetTaskId,
      intent: 'check_device_telemetry',
      target: 'device-wearable',
      safetyGate: 'allowed',
      route: ['Read signal', 'Match task', 'Attach proof'],
      nextAction: 'Use telemetry as supporting proof.',
    };
  }

  if (text.includes('doctor') || text.includes('clinical')) {
    return {
      id: 'edge-command-plan-' + targetTaskId,
      intent: 'prepare_clinical_summary',
      target: 'doctor-morris',
      safetyGate: 'requires_human_confirmation',
      route: ['Collect verified data', 'Draft summary', 'Admin or caregiver review'],
      nextAction: 'Draft clinical summary for review.',
    };
  }

  if (text.includes('nurse') || text.includes('follow-up')) {
    return {
      id: 'edge-command-plan-' + targetTaskId,
      intent: 'request_care_contact',
      target: 'nurse-grant',
      safetyGate: 'requires_human_confirmation',
      route: ['Collect context', 'Prepare nurse route', 'Wait for human send'],
      nextAction: 'Prepare nurse follow-up package without external dispatch.',
    };
  }

  return {
    id: 'edge-command-plan-' + targetTaskId,
    intent: 'assign_support',
    target: 'caregiver-maya',
    safetyGate: 'requires_human_confirmation',
    route: ['Create task', 'Assign caregiver', 'Require verification'],
    nextAction: 'Prepare caregiver assignment and proof requirement.',
  };
}

Deno.serve(async (httpRequest) => {
  if (httpRequest.method === 'OPTIONS') {
    return new Response('ok', { headers: jsonHeaders });
  }

  if (httpRequest.method !== 'POST') {
    return jsonResponse({ error: 'SAVEN gateway accepts POST only.' }, 405);
  }

  let request: SavenGatewayRequest;
  try {
    request = await httpRequest.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400);
  }

  if (!ALLOWED_ACTIONS.includes(request.action)) {
    return jsonResponse({ error: 'Unsupported SAVEN gateway action.', allowedActions: ALLOWED_ACTIONS }, 400);
  }

  if (request.action === 'apply_admin_override') {
    const adminError = requireAdminActor(request);
    if (adminError) return adminError;
  }

  if (request.action === 'interpret_command') {
    return jsonResponse({ action: request.action, plan: buildCommandPlan(request.payload) });
  }

  if (request.action === 'review_command_permission') {
    const plan = buildCommandPlan(request.payload);
    const decision = plan.safetyGate === 'blocked_external_dispatch'
      ? 'blocked'
      : plan.safetyGate === 'admin_review'
        ? 'admin_review'
        : plan.safetyGate === 'allowed'
          ? 'allowed'
          : 'requires_human_confirmation';
    return jsonResponse({
      action: request.action,
      review: {
        id: 'edge-permission-review-' + plan.id,
        plan,
        actorId: request.actorId || request.payload?.actorId || 'unknown',
        decision,
        handoff: 'SAVEN Edge gateway keeps command execution gated for human review.',
      },
    });
  }

  if (request.action === 'send_command') {
    return jsonResponse({
      action: request.action,
      status: 'prepared',
      message: 'SAVEN Edge gateway received command. No external dispatch happens inside this draft function.',
    });
  }

  if (request.action === 'persistence_status') {
    return jsonResponse({
      action: request.action,
      status: 'ready',
      tables: ['saven_profiles', 'saven_tasks', 'saven_commands', 'saven_events', 'saven_incidents'],
    });
  }

  if (request.action === 'list_events') {
    return jsonResponse({
      action: request.action,
      events: [
        {
          id: 'edge-event-command-ready',
          type: 'command_received',
          severity: 'watch',
          summary: 'SAVEN Edge gateway can expose event audit entries.',
        },
      ],
    });
  }

  if (request.action === 'incident_readiness') {
    return jsonResponse({
      action: request.action,
      summary: { open: 1, urgent: 0, critical: 0, waitingHuman: 1 },
      incidents: [
        {
          id: 'edge-incident-review',
          title: 'Human review required',
          status: 'waiting_human',
          nextStep: 'Operator reviews SAVEN command before external action.',
        },
      ],
    });
  }

  return jsonResponse({
    action: request.action,
    status: 'recorded',
    message: 'SAVEN admin override was accepted by the gateway draft.',
  });
});
