export type SavenMockPerson = {
  id: string;
  name: string;
  role: string;
  permissions: string[];
  availability: string;
};

export type SavenMockTask = {
  id: string;
  title: string;
  lifecycle: 'need' | 'created' | 'assigned' | 'commanded' | 'care_review' | 'verified' | 'continuity';
  ownerId: string;
  verifierId: string;
  priority: 'low' | 'normal' | 'high';
  due: string;
};

export type SavenMockEndpoint = {
  id: string;
  name: string;
  kind: 'device' | 'robot' | 'environment';
  state: string;
  allowedActions: string[];
};

export type SavenMockCommand = {
  id: string;
  source: 'voice' | 'text' | 'system';
  text: string;
  targetTaskId: string;
  result: string;
};

export type SavenMockEscalation = {
  id: string;
  level: 'normal' | 'care_concern' | 'clinical_review' | 'emergency';
  route: string;
  trigger: string;
};

export type SavenMockState = {
  version: string;
  mode: 'development_mock';
  activePersonId: string;
  people: SavenMockPerson[];
  tasks: SavenMockTask[];
  endpoints: SavenMockEndpoint[];
  commands: SavenMockCommand[];
  escalations: SavenMockEscalation[];
  continuity: {
    score: number;
    state: string;
    openVerifications: number;
    lastUpdated: string;
  };
};

export const savenMockState: SavenMockState = {
  version: 'bmcore2.1-savem',
  mode: 'development_mock',
  activePersonId: 'person-anna',
  people: [
    {
      id: 'person-anna',
      name: 'Anna Roberts',
      role: 'Supported person',
      permissions: ['request_support', 'confirm_low_risk_routine'],
      availability: 'Home Recovery',
    },
    {
      id: 'caregiver-maya',
      name: 'Maya Carter',
      role: 'Caregiver',
      permissions: ['perform_recovery_task', 'verify_mobility', 'pause_robot_handoff'],
      availability: 'Active until 15:00',
    },
    {
      id: 'family-daniel',
      name: 'Daniel Roberts',
      role: 'Family',
      permissions: ['receive_digest', 'confirm_family_task', 'escalate_unresolved_item'],
      availability: 'Family fallback',
    },
    {
      id: 'doctor-morris',
      name: 'Dr. Elena Morris',
      role: 'Doctor',
      permissions: ['review_clinical_summary', 'approve_plan_change'],
      availability: 'Clinic hours',
    },
    {
      id: 'nurse-grant',
      name: 'Nurse Olivia Grant',
      role: 'Nurse',
      permissions: ['review_care_concern', 'request_follow_up'],
      availability: 'Daily check-in',
    },
  ],
  tasks: [
    {
      id: 'task-mobility-1030',
      title: 'Assisted walking session',
      lifecycle: 'commanded',
      ownerId: 'caregiver-maya',
      verifierId: 'caregiver-maya',
      priority: 'high',
      due: '10:30',
    },
    {
      id: 'task-medication-0900',
      title: 'Medication support confirmation',
      lifecycle: 'care_review',
      ownerId: 'caregiver-maya',
      verifierId: 'family-daniel',
      priority: 'high',
      due: '09:00',
    },
    {
      id: 'task-family-1900',
      title: 'Evening recovery review',
      lifecycle: 'created',
      ownerId: 'family-daniel',
      verifierId: 'family-daniel',
      priority: 'normal',
      due: '19:00',
    },
  ],
  endpoints: [
    {
      id: 'device-wearable',
      name: 'Wearable recovery tracker',
      kind: 'device',
      state: 'online',
      allowedActions: ['telemetry_support', 'mobility_trend'],
    },
    {
      id: 'device-hydration',
      name: 'Smart hydration sensor',
      kind: 'device',
      state: 'online',
      allowedActions: ['hydration_signal', 'routine_support'],
    },
    {
      id: 'robot-r1',
      name: 'SAVEN Assist R1',
      kind: 'robot',
      state: 'readiness_only',
      allowedActions: ['report_readiness', 'send_telemetry', 'wait_for_human_approval'],
    },
    {
      id: 'env-home',
      name: 'Home Recovery',
      kind: 'environment',
      state: 'active',
      allowedActions: ['quiet_hours', 'escalation_rules', 'room_permissions'],
    },
  ],
  commands: [
    {
      id: 'cmd-voice-mobility',
      source: 'voice',
      text: 'Hey SAVEN, start assisted walking support.',
      targetTaskId: 'task-mobility-1030',
      result: 'Task command routed to Maya Carter; robot physical action remains locked.',
    },
    {
      id: 'cmd-text-family',
      source: 'text',
      text: 'If Maya cannot confirm, notify Daniel and prepare nurse follow-up.',
      targetTaskId: 'task-medication-0900',
      result: 'Family fallback and nurse path are prepared as mock escalation.',
    },
  ],
  escalations: [
    {
      id: 'esc-normal',
      level: 'normal',
      route: 'Family or caregiver',
      trigger: 'Missed low-risk routine',
    },
    {
      id: 'esc-care',
      level: 'care_concern',
      route: 'Nurse Olivia Grant',
      trigger: 'Repeated missed confirmation or recovery concern',
    },
    {
      id: 'esc-clinical',
      level: 'clinical_review',
      route: 'Dr. Elena Morris',
      trigger: 'Medication concern or recovery plan change',
    },
    {
      id: 'esc-emergency',
      level: 'emergency',
      route: 'Emergency path UI only',
      trigger: 'Immediate safety concern',
    },
  ],
  continuity: {
    score: 86,
    state: 'Strong',
    openVerifications: 1,
    lastUpdated: '14:05',
  },
};
