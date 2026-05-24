import type { SavenBackendCommandInput, SavenCommandExecutionPlan, SavenCommandIntent, SavenCommandSafetyGate } from '../contracts/savenBackendContract';

type IntentRule = {
  intent: SavenCommandIntent;
  keywords: string[];
  target: string;
  route: string[];
  safetyGate: SavenCommandSafetyGate;
  nextAction: string;
};

const intentRules: IntentRule[] = [
  {
    intent: 'assign_support',
    keywords: ['assign', 'caregiver', 'maya', 'support task'],
    target: 'caregiver-maya',
    route: ['Create task', 'Assign caregiver', 'Require verification'],
    safetyGate: 'requires_human_confirmation',
    nextAction: 'Prepare caregiver assignment and proof requirement.',
  },
  {
    intent: 'request_care_contact',
    keywords: ['nurse', 'follow-up', 'care concern', 'olivia'],
    target: 'nurse-grant',
    route: ['Collect context', 'Prepare nurse route', 'Wait for human send'],
    safetyGate: 'requires_human_confirmation',
    nextAction: 'Prepare nurse follow-up package without external dispatch.',
  },
  {
    intent: 'prepare_clinical_summary',
    keywords: ['doctor', 'clinical', 'summary', 'morris'],
    target: 'doctor-morris',
    route: ['Collect verified data', 'Draft summary', 'Admin or caregiver review'],
    safetyGate: 'requires_human_confirmation',
    nextAction: 'Draft clinical summary for review.',
  },
  {
    intent: 'check_robot_readiness',
    keywords: ['robot', 'readiness', 'physical', 'approval'],
    target: 'robot-r1',
    route: ['Check readiness', 'Keep action locked', 'Request approval'],
    safetyGate: 'admin_review',
    nextAction: 'Show robot readiness while physical action remains locked.',
  },
  {
    intent: 'check_device_telemetry',
    keywords: ['device', 'telemetry', 'wearable', 'sensor'],
    target: 'device-wearable',
    route: ['Read signal', 'Match task', 'Attach proof'],
    safetyGate: 'allowed',
    nextAction: 'Use telemetry as supporting proof.',
  },
  {
    intent: 'check_environment_permissions',
    keywords: ['environment', 'room', 'permissions', 'home'],
    target: 'env-home',
    route: ['Read room rules', 'Check support window', 'Apply permission gate'],
    safetyGate: 'allowed',
    nextAction: 'Show environment permissions before action.',
  },
  {
    intent: 'show_emergency_rules',
    keywords: ['emergency', 'urgent', 'safety', 'help now'],
    target: 'emergency-services',
    route: ['Show emergency rules', 'Require human confirmation', 'Block automatic dispatch'],
    safetyGate: 'blocked_external_dispatch',
    nextAction: 'Display emergency route rules without calling external services.',
  },
];

function scoreRule(text: string, rule: IntentRule): number {
  const hits = rule.keywords.filter((keyword) => text.includes(keyword)).length;
  return hits / rule.keywords.length;
}

export function createSavenCommandExecutionPlan(input: SavenBackendCommandInput): SavenCommandExecutionPlan {
  const normalized = input.text.toLowerCase();
  const ranked = intentRules
    .map((rule) => ({ rule, score: scoreRule(normalized, rule) }))
    .sort((a, b) => b.score - a.score);
  const best = ranked[0];
  const matched = best && best.score > 0 ? best.rule : null;
  const confidence = matched ? Math.max(0.42, Math.min(0.96, best.score + 0.36)) : 0.18;

  return {
    id: 'command-plan-' + input.targetTaskId + '-' + input.source,
    input,
    intent: matched?.intent ?? 'unknown',
    confidence,
    target: matched?.target ?? input.targetTaskId,
    route: matched?.route ?? ['Capture command', 'Ask clarifying question', 'Wait for human choice'],
    safetyGate: matched?.safetyGate ?? 'requires_human_confirmation',
    nextAction: matched?.nextAction ?? 'Ask the user to choose caregiver, nurse, device, robot, or emergency route.',
    auditSummary: matched
      ? 'SAVEN interpreted command as ' + matched.intent + ' with ' + matched.safetyGate + ' gate.'
      : 'SAVEN could not confidently classify this command.',
  };
}
