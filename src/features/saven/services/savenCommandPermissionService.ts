import type { SavenMockPerson, SavenMockState } from '../mock/savenMockState';
import type { SavenBackendCommandInput, SavenCommandIntent, SavenCommandPermissionDecision, SavenCommandPermissionReview } from '../contracts/savenBackendContract';
import { createSavenCommandExecutionPlan } from './savenCommandExecutionService';

type PermissionRule = {
  intent: SavenCommandIntent;
  requiredPermission: string;
  allowedRoles: string[];
  decision: SavenCommandPermissionDecision;
  handoff: string;
};

const permissionRules: PermissionRule[] = [
  {
    intent: 'assign_support',
    requiredPermission: 'request_support',
    allowedRoles: ['Supported person', 'Caregiver', 'Family'],
    decision: 'requires_human_confirmation',
    handoff: 'Ask caregiver or family to confirm task ownership.',
  },
  {
    intent: 'request_care_contact',
    requiredPermission: 'review_care_concern',
    allowedRoles: ['Caregiver', 'Nurse'],
    decision: 'requires_human_confirmation',
    handoff: 'Prepare nurse route and wait for human send.',
  },
  {
    intent: 'prepare_clinical_summary',
    requiredPermission: 'review_clinical_summary',
    allowedRoles: ['Doctor', 'Nurse', 'Caregiver'],
    decision: 'requires_human_confirmation',
    handoff: 'Draft clinical packet for professional review.',
  },
  {
    intent: 'check_robot_readiness',
    requiredPermission: 'pause_robot_handoff',
    allowedRoles: ['Caregiver', 'Admin'],
    decision: 'admin_review',
    handoff: 'Keep physical action locked until admin or caregiver approval.',
  },
  {
    intent: 'check_device_telemetry',
    requiredPermission: 'confirm_low_risk_routine',
    allowedRoles: ['Supported person', 'Caregiver', 'Device'],
    decision: 'allowed',
    handoff: 'Use telemetry as support proof only.',
  },
  {
    intent: 'check_environment_permissions',
    requiredPermission: 'request_support',
    allowedRoles: ['Supported person', 'Caregiver', 'Family'],
    decision: 'allowed',
    handoff: 'Show rules before any physical action.',
  },
  {
    intent: 'show_emergency_rules',
    requiredPermission: 'escalate_unresolved_item',
    allowedRoles: ['Caregiver', 'Family', 'Admin'],
    decision: 'blocked',
    handoff: 'Display emergency rules without automatic external dispatch.',
  },
  {
    intent: 'unknown',
    requiredPermission: 'request_support',
    allowedRoles: ['Supported person', 'Caregiver'],
    decision: 'requires_human_confirmation',
    handoff: 'Ask a clarifying question before routing.',
  },
];

function actorCanUseRule(actor: SavenMockPerson | undefined, rule: PermissionRule): boolean {
  if (!actor) return false;
  if (rule.allowedRoles.includes(actor.role)) return true;
  return actor.permissions.includes(rule.requiredPermission);
}

function adjustDecision(rule: PermissionRule, actor: SavenMockPerson | undefined): SavenCommandPermissionDecision {
  if (rule.decision === 'blocked') return 'blocked';
  if (!actorCanUseRule(actor, rule)) return 'admin_review';
  return rule.decision;
}

export function createSavenCommandPermissionReview(
  state: SavenMockState,
  input: SavenBackendCommandInput,
  actorId: string = state.activePersonId,
): SavenCommandPermissionReview {
  const plan = createSavenCommandExecutionPlan(input);
  const actor = state.people.find((person) => person.id === actorId);
  const rule = permissionRules.find((item) => item.intent === plan.intent) ?? permissionRules[permissionRules.length - 1];
  const decision = adjustDecision(rule, actor);

  return {
    id: 'permission-review-' + plan.id,
    plan,
    actorId,
    decision,
    requiredPermission: rule.requiredPermission,
    allowedRoles: rule.allowedRoles,
    reason: actorCanUseRule(actor, rule)
      ? 'Actor permission matches SAVEN command policy.'
      : 'Actor needs a human or admin handoff before this command can proceed.',
    handoff: rule.handoff,
  };
}
