export type SavenDataClass =
  | 'support_command'
  | 'care_contact'
  | 'clinical_context'
  | 'device_signal'
  | 'robot_gate'
  | 'emergency_route'
  | 'admin_audit';

export type SavenPrivacyDecision = {
  dataClass: SavenDataClass;
  storeRawText: boolean;
  redactBeforeFamilyDigest: boolean;
  allowedRoles: string[];
  retention: string;
  reason: string;
};

export const savenPrivacyPolicyMatrix: SavenPrivacyDecision[] = [
  {
    dataClass: 'support_command',
    storeRawText: true,
    redactBeforeFamilyDigest: false,
    allowedRoles: ['Supported person', 'Caregiver', 'Admin'],
    retention: '90 days during review',
    reason: 'Commands must be auditable while support workflow is active.',
  },
  {
    dataClass: 'care_contact',
    storeRawText: true,
    redactBeforeFamilyDigest: true,
    allowedRoles: ['Caregiver', 'Nurse', 'Doctor', 'Admin'],
    retention: '90 days during review',
    reason: 'Care contact routing may include sensitive support context.',
  },
  {
    dataClass: 'clinical_context',
    storeRawText: false,
    redactBeforeFamilyDigest: true,
    allowedRoles: ['Doctor', 'Nurse', 'Caregiver', 'Admin'],
    retention: '30 days unless care team exports summary',
    reason: 'Clinical content should be summarized and reviewed, not broadcast.',
  },
  {
    dataClass: 'device_signal',
    storeRawText: false,
    redactBeforeFamilyDigest: true,
    allowedRoles: ['Supported person', 'Caregiver', 'Device', 'Admin'],
    retention: '30 days for proof windows',
    reason: 'Device data verifies support but should not expose raw telemetry broadly.',
  },
  {
    dataClass: 'robot_gate',
    storeRawText: true,
    redactBeforeFamilyDigest: false,
    allowedRoles: ['Caregiver', 'Admin'],
    retention: '180 days for safety review',
    reason: 'Robot and physical action gates require extended audit visibility.',
  },
  {
    dataClass: 'emergency_route',
    storeRawText: true,
    redactBeforeFamilyDigest: true,
    allowedRoles: ['Caregiver', 'Family', 'Admin'],
    retention: '180 days for safety review',
    reason: 'Emergency routes need strong audit while avoiding routine broadcast.',
  },
  {
    dataClass: 'admin_audit',
    storeRawText: true,
    redactBeforeFamilyDigest: true,
    allowedRoles: ['Admin'],
    retention: '365 days for operational audit',
    reason: 'Admin overrides and incident decisions must remain inspectable.',
  },
];

const sensitivePatterns = [
  /\b\d{3}-\d{2}-\d{4}\b/g,
  /\b\d{10,}\b/g,
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  /\b(?:blood pressure|medication dose|diagnosis|lab result)[:\s][^.,;]+/gi,
];

export function classifySavenCommandText(text: string): SavenDataClass {
  const normalized = text.toLowerCase();
  if (normalized.includes('emergency') || normalized.includes('urgent')) return 'emergency_route';
  if (normalized.includes('robot') || normalized.includes('physical approval')) return 'robot_gate';
  if (normalized.includes('doctor') || normalized.includes('clinical') || normalized.includes('medication')) return 'clinical_context';
  if (normalized.includes('device') || normalized.includes('wearable') || normalized.includes('sensor')) return 'device_signal';
  if (normalized.includes('nurse') || normalized.includes('caregiver') || normalized.includes('follow-up')) return 'care_contact';
  return 'support_command';
}

export function getSavenPrivacyDecision(dataClass: SavenDataClass): SavenPrivacyDecision {
  const decision = savenPrivacyPolicyMatrix.find((item) => item.dataClass === dataClass);
  if (!decision) {
    throw new Error('Unknown SAVEN data class: ' + dataClass);
  }
  return decision;
}

export function redactSavenSensitiveText(text: string): string {
  return sensitivePatterns.reduce((current, pattern) => current.replace(pattern, '[redacted]'), text);
}

export function createSavenPrivacyReview(commandText: string) {
  const dataClass = classifySavenCommandText(commandText);
  const decision = getSavenPrivacyDecision(dataClass);
  const redactedText = decision.redactBeforeFamilyDigest ? redactSavenSensitiveText(commandText) : commandText;

  return {
    dataClass,
    decision,
    redactedText,
    familyDigestText: decision.redactBeforeFamilyDigest ? redactedText : commandText,
  };
}
