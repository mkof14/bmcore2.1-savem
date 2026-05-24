import type {
  SavenBackendCommandInput,
  SavenCommandIntent,
  SavenCommandPermissionDecision,
  SavenCommandSafetyGate,
} from '../contracts/savenBackendContract';

export type SavenCommandAcceptanceFixture = {
  id: string;
  label: string;
  actorId: string;
  input: SavenBackendCommandInput;
  expectedIntent: SavenCommandIntent;
  expectedSafetyGate: SavenCommandSafetyGate;
  expectedDecision: SavenCommandPermissionDecision;
  expectedTarget: string;
  evidence: string[];
};

export const savenCommandAcceptanceFixtures: SavenCommandAcceptanceFixture[] = [
  {
    id: 'nurse-follow-up',
    label: 'Nurse follow-up by voice',
    actorId: 'nurse-grant',
    input: {
      source: 'voice',
      text: 'Hey SAVEN, request nurse follow-up and send recovery context.',
      targetTaskId: 'task-medication-0900',
    },
    expectedIntent: 'request_care_contact',
    expectedSafetyGate: 'requires_human_confirmation',
    expectedDecision: 'requires_human_confirmation',
    expectedTarget: 'nurse-grant',
    evidence: ['Prepare nurse route', 'Wait for human send'],
  },
  {
    id: 'caregiver-assignment',
    label: 'Caregiver task assignment',
    actorId: 'person-anna',
    input: {
      source: 'voice',
      text: 'Hey SAVEN, assign caregiver Maya to this support task.',
      targetTaskId: 'task-mobility-1030',
    },
    expectedIntent: 'assign_support',
    expectedSafetyGate: 'requires_human_confirmation',
    expectedDecision: 'requires_human_confirmation',
    expectedTarget: 'caregiver-maya',
    evidence: ['Assign caregiver', 'Require verification'],
  },
  {
    id: 'doctor-clinical-summary',
    label: 'Doctor clinical summary',
    actorId: 'doctor-morris',
    input: {
      source: 'text',
      text: 'Prepare doctor clinical summary for Dr. Morris.',
      targetTaskId: 'task-medication-0900',
    },
    expectedIntent: 'prepare_clinical_summary',
    expectedSafetyGate: 'requires_human_confirmation',
    expectedDecision: 'requires_human_confirmation',
    expectedTarget: 'doctor-morris',
    evidence: ['Draft summary', 'Admin or caregiver review'],
  },
  {
    id: 'device-telemetry-confirmation',
    label: 'Device telemetry confirmation',
    actorId: 'person-anna',
    input: {
      source: 'voice',
      text: 'Hey SAVEN, check device telemetry from the wearable sensor.',
      targetTaskId: 'task-mobility-1030',
    },
    expectedIntent: 'check_device_telemetry',
    expectedSafetyGate: 'allowed',
    expectedDecision: 'allowed',
    expectedTarget: 'device-wearable',
    evidence: ['Read signal', 'Attach proof'],
  },
  {
    id: 'robot-readiness-review',
    label: 'Robot readiness with approval lock',
    actorId: 'caregiver-maya',
    input: {
      source: 'voice',
      text: 'Hey SAVEN, check robot readiness and keep physical approval locked.',
      targetTaskId: 'task-mobility-1030',
    },
    expectedIntent: 'check_robot_readiness',
    expectedSafetyGate: 'admin_review',
    expectedDecision: 'admin_review',
    expectedTarget: 'robot-r1',
    evidence: ['Keep action locked', 'Request approval'],
  },
  {
    id: 'emergency-rule-display',
    label: 'Emergency route without automatic dispatch',
    actorId: 'family-daniel',
    input: {
      source: 'voice',
      text: 'Hey SAVEN, urgent emergency help now.',
      targetTaskId: 'task-emergency',
    },
    expectedIntent: 'show_emergency_rules',
    expectedSafetyGate: 'blocked_external_dispatch',
    expectedDecision: 'blocked',
    expectedTarget: 'emergency-services',
    evidence: ['Show emergency rules', 'Block automatic dispatch'],
  },
];
