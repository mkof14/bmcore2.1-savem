import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Bot,
  AlertCircle,
  BookOpen,
  Building2,
  CalendarCheck,
  Check,
  ClipboardCheck,
  Clock3,
  Cpu,
  HeartPulse,
  Home,
  LockKeyhole,
  MessageSquareText,
  Mic,
  Radar,
  ShieldCheck,
  UserRound,
  UsersRound,
  Watch,
  Waypoints,
  BellRing,
  PhoneCall,
  Stethoscope,
  Siren,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import BackButton from '../components/BackButton';
import SEO from '../components/SEO';
import { SavenDeveloperReadinessStack } from '../features/saven/components/SavenDeveloperReadinessStack';
import { savenCareContacts } from '../features/saven/services/savenLocalBackendGateway';

interface SavenProps {
  onNavigate: (page: string) => void;
}

type PublicPageId =
  | 'home'
  | 'architecture'
  | 'dashboard'
  | 'timeline'
  | 'care-graph'
  | 'registry'
  | 'environments'
  | 'verification'
  | 'data'
  | 'access'
  | 'roadmap'
  | 'positioning';

type AppPageId =
  | 'app-start'
  | 'app-life-setup'
  | 'app-today'
  | 'app-profile'
  | 'app-modes'
  | 'app-command'
  | 'app-support'
  | 'app-lifecycle'
  | 'app-plan'
  | 'app-policies'
  | 'app-continuity'
  | 'app-timeline'
  | 'app-circle'
  | 'app-devices'
  | 'app-robots'
  | 'app-environments'
  | 'app-recovery'
  | 'app-verification'
  | 'app-settings'
  | 'app-care-routes'
  | 'app-faq'
  | 'app-learning';

type SavenPageId = PublicPageId | AppPageId;

interface SectionPage {
  id: Exclude<PublicPageId, 'home'>;
  label: string;
  eyebrow: string;
  title: string;
  summary: string;
  accent: string;
  visual?: string;
  visualAlt?: string;
  visualNote?: string;
  blocks: Array<{
    title: string;
    text: string;
    items: string[];
  }>;
}

type SupportTask = {
  title: string;
  reason: string;
  category: string;
  assignedTo: string;
  executorType: string;
  dueTime: string;
  status: 'active' | 'completed' | 'needs_attention' | 'delayed' | 'pending_confirmation' | 'planned';
  verificationMethod: string;
  priority: 'low' | 'normal' | 'high';
};

type VerifiedAction = {
  time: string;
  action: string;
  confirmedBy: string;
  method: string;
  status: string;
};

type DeviceItem = {
  name: string;
  type: string;
  status: 'online' | 'standby' | 'maintenance' | 'offline';
  environment: string;
  capabilities: string[];
  telemetry: string;
};

type RobotItem = {
  name: string;
  model: string;
  readiness: 'ready' | 'standby' | 'limited' | 'maintenance';
  capability: string;
  assignment: string;
  limits: string[];
};

type LifeSetupState = {
  relationship: string;
  firstName: string;
  preferredName: string;
  ageGroup: string;
  sex: string;
  language: string;
  livingSituation: string;
  supportMode: string;
  mobility: string;
  rhythm: string;
  supportCircle: string[];
  technologyComfort: string;
  communication: string;
  goals: string[];
};

const sectionPages: SectionPage[] = [
  {
    id: 'architecture',
    label: 'Architecture',
    eyebrow: 'BioMath Core Environment',
    title: 'SAVEN is the execution and verification layer inside BioMath Core.',
    summary:
      'BioMath Core understands the person. SAVEN coordinates and verifies support actions. Body Layer systems execute actions physically under SAVEN safety rules.',
    accent: 'BioMath Core -> SAVEN -> Body Layer',
    visual: '/saven-architecture-levels.png',
    visualAlt: 'SAVEN level in the BioMath architecture',
    visualNote: 'Architecture reference: BioMath Life, BioMath Core, SAVEN, and Body Layer.',
    blocks: [
      {
        title: 'BioMath Core Layer',
        text: 'Maintains the continuously evolving digital human model and generates structured support recommendations and state signals.',
        items: ['Physiological trends', 'Routines', 'Recovery patterns', 'Mobility patterns', 'Hydration', 'Sleep', 'Nutrition', 'Activity monitoring'],
      },
      {
        title: 'SAVEN Execution Layer',
        text: 'Converts BioMath Core outputs into structured human support tasks with scheduling, assignment, escalation, and verification handling.',
        items: ['Task orchestration', 'Executor assignment', 'Environment rules', 'Continuity tracking', 'Safety and accountability'],
      },
      {
        title: 'Body Layer',
        text: 'Physical execution systems receive structured tasks, operate under SAVEN safety rules, and return telemetry or status.',
        items: ['Caregiver applications', 'Wearables', 'Smart beds', 'Mobility systems', 'Rehabilitation devices', 'Future humanoid robots'],
      },
    ],
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    eyebrow: 'Operational Overview',
    title: 'The SAVEN Dashboard shows current support status without creating stress.',
    summary:
      'The dashboard is the main operational view for active support, delayed tasks, device status, caregiver status, environment alerts, and wellness continuity indicators.',
    accent: 'Status. Tasks. Devices. Continuity.',
    visual: '/saven-model-control-action.png',
    visualAlt: 'SAVEN model control action flow',
    visualNote: 'The dashboard makes the execution flow visible: model signal, controlled task, verified action.',
    blocks: [
      {
        title: 'Current Support Status',
        text: 'A calm overview that shows whether the person is supported, what is active, and what needs attention.',
        items: ['Current support status', 'Active tasks', 'Delayed tasks', 'Completed actions', 'Wellness continuity indicators'],
      },
      {
        title: 'Operational Signals',
        text: 'The dashboard should summarize device, robot, caregiver, and environment readiness without technical overload.',
        items: ['Device status', 'Robot status', 'Caregiver status', 'Environment alerts', 'Online/offline state'],
      },
      {
        title: 'UI Direction',
        text: 'The dashboard must feel calm, premium, human-centered, and low-stress.',
        items: ['Large typography', 'Soft colors', 'Minimal clutter', 'Clear status language', 'No panic-first design'],
      },
    ],
  },
  {
    id: 'timeline',
    label: 'Support Timeline',
    eyebrow: 'Verified Human Support History',
    title: 'The Human Support Timeline is the operational memory of SAVEN.',
    summary:
      'This timeline stores verified human support history: what happened, when it happened, who or what performed it, and how it was confirmed.',
    accent: 'Verified history becomes continuity.',
    visual: '/saven-orbit-system.png',
    visualAlt: 'SAVEN orbital continuity system',
    visualNote: 'Timeline logic keeps every support event connected to one continuity record.',
    blocks: [
      {
        title: 'Timeline Events',
        text: 'Every confirmed support action becomes part of the continuity record.',
        items: ['Hydration confirmed', 'Walking completed', 'Rehabilitation completed', 'Medication support verified', 'Caregiver visit completed', 'Sleep support activated'],
      },
      {
        title: 'Operational Memory',
        text: 'The timeline gives families, caregivers, and operators a shared history instead of scattered notes.',
        items: ['Continuity history', 'Accountability record', 'Execution proof', 'Care context over time'],
      },
      {
        title: 'Verification Status',
        text: 'SAVEN distinguishes confirmed work from assumed work.',
        items: ['Completed', 'Partial', 'Failed', 'Not confirmed', 'Delayed', 'Exception'],
      },
    ],
  },
  {
    id: 'care-graph',
    label: 'Care Graph',
    eyebrow: 'Relationship System',
    title: 'Care Graph maps the people, systems, and environments around the person.',
    summary:
      'SAVEN should visually show the relationship between user, family, caregivers, clinicians, robots, devices, and environments.',
    accent: 'Person-centered support network.',
    visual: '/saven-orbit-dark.png',
    visualAlt: 'SAVEN relationship orbit around the central support mark',
    visualNote: 'Care Graph uses relationship mapping around the person, not a technical network map.',
    blocks: [
      {
        title: 'Human Relationships',
        text: 'The user is at the center. Family, caregivers, clinicians, and support providers are connected by responsibility and permissions.',
        items: ['User', 'Family', 'Caregivers', 'Clinicians', 'Support providers'],
      },
      {
        title: 'Execution Relationships',
        text: 'Physical support systems connect to the person through tasks, permissions, and safety rules.',
        items: ['Robots', 'Devices', 'Sensors', 'Smart environments', 'Caregiver applications'],
      },
      {
        title: 'Visual Purpose',
        text: 'The Care Graph should make responsibility visible without turning the interface into a technical network map.',
        items: ['Clear connections', 'Support roles', 'Environment scope', 'Escalation routes'],
      },
    ],
  },
  {
    id: 'registry',
    label: 'Device & Robot Registry',
    eyebrow: 'Body Layer Management',
    title: 'The registry tracks devices, robots, capabilities, telemetry, and safety limitations.',
    summary:
      'Body Layer systems are not autonomous caregivers. They receive structured tasks, return telemetry and status, and operate under SAVEN rules.',
    accent: 'Capabilities under control.',
    visual: '/saven-scalable-infrastructure.png',
    visualAlt: 'SAVEN scalable infrastructure with many execution bodies',
    visualNote: 'Registry direction: one intelligence, many controlled physical systems.',
    blocks: [
      {
        title: 'Device Status',
        text: 'Each connected system must have a clear operational state.',
        items: ['Available devices', 'Online/offline state', 'API status', 'Telemetry streams', 'Environment permissions'],
      },
      {
        title: 'Robot Profile',
        text: 'Robots should be tracked by model, capabilities, safety limits, online status, and endpoint.',
        items: ['model', 'manufacturer', 'capabilities', 'safety_limits', 'online_status', 'api_endpoint'],
      },
      {
        title: 'Visual Direction',
        text: 'Robotic visuals should be friendly, calm, premium, human-safe, and non-threatening.',
        items: ['Soft lighting', 'Rounded surfaces', 'Warm environments', 'No military aesthetics', 'No dystopian visuals'],
      },
    ],
  },
  {
    id: 'environments',
    label: 'Environments',
    eyebrow: 'Operational Context',
    title: 'SAVEN adapts support rules to the environment where care happens.',
    summary:
      'Each environment has permissions, safety rules, connected devices, escalation rules, and operational policies.',
    accent: 'One person. Multiple environments.',
    visual: '/saven-environments-one-logic.png',
    visualAlt: 'Three SAVEN environments: home, hospital, and institution',
    visualNote: 'Environment management keeps one support logic across home, hospital recovery, and care institutions.',
    blocks: [
      {
        title: 'Supported Environments',
        text: 'The same SAVEN logic should operate across daily life, recovery, and care facilities.',
        items: ['Home', 'Rehabilitation center', 'Clinic', 'Assisted living', 'Hospital recovery', 'Senior care'],
      },
      {
        title: 'Environment Rules',
        text: 'Tasks and permissions must be scoped to the current physical and operational setting.',
        items: ['Permissions', 'Safety rules', 'Connected devices', 'Escalation rules', 'Operational policies'],
      },
      {
        title: 'Continuity',
        text: 'The environment can change, but the person, history, and accountability record should not reset.',
        items: ['Transfer between locations', 'Shared support history', 'Role changes', 'Policy changes'],
      },
    ],
  },
  {
    id: 'verification',
    label: 'Verification',
    eyebrow: 'Critical Concept',
    title: 'SAVEN is based on verified execution, not assumptions.',
    summary:
      'Every action must support verification. Verification can come from people, sensors, wearables, robot telemetry, smart environments, or automated detection.',
    accent: 'No assumption without confirmation.',
    visual: '/saven-post-hospital-bridge.png',
    visualAlt: 'SAVEN post-hospital bridge',
    visualNote: 'Verification is the bridge between planned care and confirmed support.',
    blocks: [
      {
        title: 'Verification Sources',
        text: 'The system should accept multiple confirmation sources depending on the task and environment.',
        items: ['Caregiver confirmation', 'User confirmation', 'Sensor confirmation', 'Robot telemetry', 'Wearable telemetry', 'Smart environment events'],
      },
      {
        title: 'Verification Types',
        text: 'A support action is not always simply complete or incomplete. SAVEN needs nuanced verification states.',
        items: ['Completed', 'Partial', 'Failed', 'Not confirmed', 'Delayed', 'Exception'],
      },
      {
        title: 'Event History',
        text: 'All verification results become part of the support record.',
        items: ['Full event history', 'Timestamped actions', 'Executor identity', 'Telemetry payload', 'Notes'],
      },
    ],
  },
  {
    id: 'access',
    label: 'Access Control',
    eyebrow: 'Strict Role-Based Access',
    title: 'Every SAVEN action must be logged, timestamped, and auditable.',
    summary:
      'Access should be limited by role, environment, task, and time. SAVEN must support accountability without overwhelming users.',
    accent: 'Roles. Scope. Logs. Accountability.',
    visual: '/saven-control-verified.png',
    visualAlt: 'SAVEN control verified accountability',
    visualNote: 'Access control keeps roles, boundaries, and accountability explicit.',
    blocks: [
      {
        title: 'Roles',
        text: 'SAVEN roles define responsibility and permission boundaries.',
        items: ['User', 'Family', 'Caregiver', 'Clinician', 'Support provider', 'Robot operator', 'Environment admin', 'System admin'],
      },
      {
        title: 'Audit Requirements',
        text: 'Every meaningful action should be traceable.',
        items: ['Logged', 'Timestamped', 'Auditable', 'Role-scoped', 'Environment-scoped'],
      },
      {
        title: 'Product Boundary',
        text: 'Access control protects users and keeps SAVEN positioned as support infrastructure.',
        items: ['No diagnosis claims', 'No treatment control', 'No clinician replacement', 'No autonomous AI caregiver positioning'],
      },
    ],
  },
  {
    id: 'data',
    label: 'Data Models',
    eyebrow: 'Development Foundation',
    title: 'The first SAVEN data layer should stay execution-focused.',
    summary:
      'The initial models define the person, tasks, verification events, robot and device profiles, and access control.',
    accent: 'Profile. Task. Event. Robot.',
    visual: '/saven-acronym.png',
    visualAlt: 'SAVEN system acronym',
    visualNote: 'Data models stay close to SAVEN anatomy: support, action, verification, environment, network.',
    blocks: [
      {
        title: 'UserProfile',
        text: 'Stores support context and the link to the BioMath Core model.',
        items: ['id', 'name', 'age', 'support_context', 'mobility_status', 'primary_environment', 'linked_biomath_model_id'],
      },
      {
        title: 'CareTask',
        text: 'Represents a structured support action that can be scheduled, assigned, tracked, and verified.',
        items: ['id', 'user_id', 'category', 'priority', 'description', 'assigned_executor', 'executor_type', 'scheduled_time', 'status', 'verification_method', 'escalation_level'],
      },
      {
        title: 'ExecutionEvent',
        text: 'Stores verified execution history and telemetry.',
        items: ['id', 'task_id', 'executor_id', 'event_type', 'timestamp', 'telemetry_payload', 'verification_status', 'notes'],
      },
      {
        title: 'RobotProfile',
        text: 'Defines robotic execution capabilities and safety limits.',
        items: ['id', 'model', 'manufacturer', 'capabilities', 'safety_limits', 'online_status', 'api_endpoint'],
      },
    ],
  },
  {
    id: 'roadmap',
    label: 'Roadmap',
    eyebrow: 'Development Plan',
    title: 'Build the human workflow first. Add physical execution carefully.',
    summary:
      'SAVEN should grow from a dashboard and task system into controlled physical orchestration, smart environments, and humanoid robot integration.',
    accent: 'Human workflow first. Robotics carefully.',
    visual: '/saven-infrastructure.png',
    visualAlt: 'SAVEN infrastructure development direction',
    visualNote: 'Roadmap direction: execution infrastructure that can expand without losing human control.',
    blocks: [
      {
        title: 'Phase 1',
        text: 'Create the operational foundation.',
        items: ['SAVEN dashboard', 'Task system', 'Manual verification', 'Event history', 'Access control'],
      },
      {
        title: 'Phase 2',
        text: 'Connect BioMath Core signals and coordination flows.',
        items: ['BioMath Core integration', 'Smart recommendations', 'Telemetry ingestion', 'Device APIs', 'Caregiver coordination'],
      },
      {
        title: 'Phase 3',
        text: 'Add controlled physical execution.',
        items: ['Robotic integration', 'Physical task orchestration', 'Smart environments', 'Advanced verification', 'Escalation automation'],
      },
      {
        title: 'Phase 4',
        text: 'Move toward adaptive multi-location continuity.',
        items: ['Humanoid robot integration', 'Predictive support workflows', 'Adaptive environment coordination', 'Multi-location continuity'],
      },
    ],
  },
  {
    id: 'positioning',
    label: 'Positioning',
    eyebrow: 'Product Boundary',
    title: 'SAVEN is human support infrastructure, not a sci-fi robot product.',
    summary:
      'SAVEN must feel calm, premium, human-centered, operational, trustworthy, modern, and low-stress.',
    accent: 'Support infrastructure, not autonomous care.',
    visual: '/saven-brand-card.png',
    visualAlt: 'SAVEN premium brand card with support mark',
    visualNote: 'Positioning stays anchored in one calm SAVEN identity and clear product boundaries.',
    blocks: [
      {
        title: 'SAVEN Is',
        text: 'The product should be positioned as continuity infrastructure inside BioMath Core.',
        items: ['Human support infrastructure', 'Continuity platform', 'Execution and verification layer', 'Coordination system'],
      },
      {
        title: 'SAVEN Is Not',
        text: 'The product should never be framed as autonomous clinical replacement.',
        items: ['Not a medical diagnosis system', 'Not an autonomous treatment platform', 'Not a replacement for healthcare professionals', 'Not an emotional chatbot', 'Not a sci-fi robot system'],
      },
      {
        title: 'Main Product Statement',
        text: 'SAVEN connects BioMath Core’s digital understanding of a person with verified real-world support actions performed by people, devices, environments, and future robotic systems.',
        items: ['Continuous human support', 'Care coordination', 'Task execution', 'Verification', 'Safety', 'Accountability', 'Operational continuity'],
      },
    ],
  },
];

const publicMenuItems = [{ id: 'home' as const, label: 'SAVEN Home' }, ...sectionPages.map(({ id, label }) => ({ id, label }))];

const appNavItems: Array<{ id: AppPageId; label: string; icon: typeof Home }> = [
  { id: 'app-start', label: 'Start', icon: Activity },
  { id: 'app-life-setup', label: 'Life Setup', icon: UserRound },
  { id: 'app-today', label: 'Today', icon: HeartPulse },
  { id: 'app-modes', label: 'Modes', icon: Cpu },
  { id: 'app-command', label: 'Command Center', icon: MessageSquareText },
  { id: 'app-support', label: 'Support Flow', icon: Activity },
  { id: 'app-lifecycle', label: 'Task Lifecycle', icon: ClipboardCheck },
  { id: 'app-plan', label: 'Daily Plan', icon: CalendarCheck },
  { id: 'app-policies', label: 'Verify Rules', icon: ShieldCheck },
  { id: 'app-continuity', label: 'Continuity', icon: Waypoints },
  { id: 'app-timeline', label: 'Timeline', icon: Clock3 },
  { id: 'app-circle', label: 'Circle', icon: UsersRound },
  { id: 'app-devices', label: 'Devices', icon: Cpu },
  { id: 'app-robots', label: 'Robots', icon: Bot },
  { id: 'app-environments', label: 'Environments', icon: Waypoints },
  { id: 'app-recovery', label: 'Recovery', icon: Radar },
  { id: 'app-verification', label: 'Verification', icon: ShieldCheck },
  { id: 'app-settings', label: 'Settings', icon: LockKeyhole },
  { id: 'app-care-routes', label: 'Care Routes', icon: PhoneCall },
  { id: 'app-faq', label: 'FAQ for SAVEN', icon: AlertCircle },
  { id: 'app-learning', label: 'Learning Center', icon: BookOpen },
];

const defaultSetup: LifeSetupState = {
  relationship: 'Family member',
  firstName: 'Anna',
  preferredName: 'Anna',
  ageGroup: 'Senior',
  sex: 'Female',
  language: 'English',
  livingSituation: 'Home Recovery',
  supportMode: 'Post-surgery recovery',
  mobility: 'Walking support',
  rhythm: 'Structured recovery',
  supportCircle: ['Family available', 'Caregiver available'],
  technologyComfort: 'Comfortable with devices',
  communication: 'Gentle notifications',
  goals: ['Recover after surgery', 'Support mobility', 'Reduce missed actions'],
};

const supportTasks: SupportTask[] = [
  {
    title: 'Morning hydration check',
    reason: 'Recovery hydration routine from BioMath Core signal',
    category: 'Hydration',
    assignedTo: 'Maya Carter',
    executorType: 'Caregiver',
    dueTime: '08:30',
    status: 'completed',
    verificationMethod: 'Caregiver confirmed',
    priority: 'normal',
  },
  {
    title: 'Medication support confirmation',
    reason: 'Scheduled support action needs confirmation',
    category: 'Medication support',
    assignedTo: 'Maya Carter',
    executorType: 'Caregiver',
    dueTime: '09:00',
    status: 'pending_confirmation',
    verificationMethod: 'Caregiver confirmed',
    priority: 'high',
  },
  {
    title: 'Assisted walking session',
    reason: 'Mobility recovery support window',
    category: 'Mobility',
    assignedTo: 'Maya Carter',
    executorType: 'Caregiver',
    dueTime: '10:30',
    status: 'active',
    verificationMethod: 'Caregiver confirmed',
    priority: 'high',
  },
  {
    title: 'Breathing exercise',
    reason: 'Recovery routine with user confirmation',
    category: 'Rehabilitation',
    assignedTo: 'Anna Roberts',
    executorType: 'User',
    dueTime: '12:00',
    status: 'planned',
    verificationMethod: 'User confirmed',
    priority: 'normal',
  },
  {
    title: 'SAVEN Assist R1 readiness check',
    reason: 'Robot support availability for safe execution',
    category: 'Robot readiness',
    assignedTo: 'SAVEN Assist R1',
    executorType: 'Robot',
    dueTime: '13:30',
    status: 'completed',
    verificationMethod: 'Robot telemetry',
    priority: 'normal',
  },
  {
    title: 'Evening recovery review',
    reason: 'End-of-day continuity review',
    category: 'General support',
    assignedTo: 'Daniel Roberts',
    executorType: 'Family',
    dueTime: '19:00',
    status: 'planned',
    verificationMethod: 'Family confirmed',
    priority: 'normal',
  },
];

const verifiedActions: VerifiedAction[] = [
  { time: '08:42', action: 'Morning hydration completed', confirmedBy: 'Maya Carter', method: 'Caregiver confirmed', status: 'Verified' },
  { time: '10:58', action: 'Walking support session verified', confirmedBy: 'Maya Carter', method: 'Caregiver confirmed', status: 'Verified' },
  { time: '12:12', action: 'Medication support verified', confirmedBy: 'Daniel Roberts', method: 'Family confirmed', status: 'Verified' },
  { time: '13:30', action: 'Robot readiness telemetry received', confirmedBy: 'SAVEN Assist R1', method: 'Robot telemetry', status: 'Verified' },
  { time: '14:05', action: 'Breathing exercise confirmed', confirmedBy: 'Anna Roberts', method: 'User confirmed', status: 'Verified' },
];

const devices: DeviceItem[] = [
  {
    name: 'Smart hydration sensor',
    type: 'Sensor',
    status: 'online',
    environment: 'Home Recovery',
    capabilities: ['Hydration signal', 'Routine support'],
    telemetry: 'Hydration confirmation received at 08:42',
  },
  {
    name: 'Wearable recovery tracker',
    type: 'Wearable',
    status: 'online',
    environment: 'Home Recovery',
    capabilities: ['Activity signal', 'Mobility trend', 'Sleep signal'],
    telemetry: 'Activity trend stable',
  },
  {
    name: 'Bed presence sensor',
    type: 'Sensor',
    status: 'standby',
    environment: 'Home Recovery',
    capabilities: ['Sleep routine', 'Presence signal'],
    telemetry: 'Standing by for evening routine',
  },
  {
    name: 'Mobility support device',
    type: 'Mobility device',
    status: 'maintenance',
    environment: 'Home Recovery',
    capabilities: ['Mobility support', 'Stability telemetry'],
    telemetry: 'Maintenance review required',
  },
];

const robots: RobotItem[] = [
  {
    name: 'SAVEN Assist R1',
    model: 'Robotic assistant',
    readiness: 'ready',
    capability: 'Environment support, caregiver check-in, device readiness',
    assignment: 'No active physical task',
    limits: ['No physical contact', 'Human approval required', 'Home Recovery only'],
  },
  {
    name: 'SAVEN Mobility R2',
    model: 'Mobility robot',
    readiness: 'limited',
    capability: 'Walking readiness telemetry and mobility sequence support',
    assignment: 'Evening mobility check',
    limits: ['Caregiver supervision required', 'No stair support', 'Low-speed support only'],
  },
];

const attentionItems = [
  'Medication support is waiting for caregiver confirmation',
  'Mobility support device needs maintenance review',
  'Evening recovery review is not assigned to a caregiver yet',
];

const autonomousSupportTemplates = [
  {
    name: 'Senior Support',
    workflow: 'Daily stability, meals, hydration, movement, evening safety',
    tasks: ['Morning check-in', 'Hydration check', 'Mobility check', 'Meal confirmation', 'Evening safety check'],
    verification: ['Family confirmed', 'Caregiver confirmed', 'Sensor confirmation'],
  },
  {
    name: 'Post Surgery Recovery',
    workflow: 'Recovery windows, assisted mobility, rest, confirmation, escalation',
    tasks: ['Breathing exercise', 'Assisted walking', 'Medication support reminder', 'Rest period check', 'Evening recovery review'],
    verification: ['Caregiver confirmed', 'User confirmed', 'Wearable telemetry'],
  },
  {
    name: 'Rehabilitation',
    workflow: 'Guided sessions, fatigue checks, caregiver confirmation, pacing',
    tasks: ['Exercise session', 'Mobility progress check', 'Fatigue note', 'Rest period', 'Caregiver confirmation'],
    verification: ['Caregiver confirmed', 'Device telemetry', 'User confirmed'],
  },
  {
    name: 'Family Monitoring',
    workflow: 'Low-stress visibility for family support and continuity',
    tasks: ['Daily routine check', 'Family update', 'Missed action review', 'Evening check-in'],
    verification: ['Family confirmed', 'User confirmed', 'System inferred'],
  },
];

const continuityFactors = [
  { label: 'Completed actions', value: 'Stable', tone: 'green' },
  { label: 'Delayed actions', value: '1 open', tone: 'amber' },
  { label: 'Verification stability', value: 'Strong', tone: 'green' },
  { label: 'Caregiver responsiveness', value: 'Active', tone: 'green' },
  { label: 'Device uptime', value: '92%', tone: 'blue' },
  { label: 'Robot readiness', value: 'Ready', tone: 'blue' },
];

const demoScenarios = [
  'Senior living support',
  'Post-surgery recovery',
  'Rehabilitation support',
  'Family support monitoring',
  'Robot-assisted environment',
];

const getInitialSavenPage = (): SavenPageId => {
  if (typeof window === 'undefined') {
    return 'home';
  }

  const path = window.location.pathname;
  if (path === '/app/saven/start/life-setup') return 'app-life-setup';
  if (path === '/app/saven/start') return 'app-start';
  if (path === '/app/saven/profile') return 'app-profile';
  if (path === '/app/saven/today' || path === '/app/saven') return 'app-today';
  if (path === '/app/saven/modes') return 'app-modes';
  if (path === '/app/saven/command') return 'app-command';
  if (path === '/app/saven/support') return 'app-support';
  if (path === '/app/saven/lifecycle') return 'app-lifecycle';
  if (path === '/app/saven/daily-plan') return 'app-plan';
  if (path === '/app/saven/verification-policy') return 'app-policies';
  if (path === '/app/saven/continuity') return 'app-continuity';
  if (path === '/app/saven/timeline') return 'app-timeline';
  if (path === '/app/saven/circle') return 'app-circle';
  if (path === '/app/saven/devices') return 'app-devices';
  if (path === '/app/saven/robots') return 'app-robots';
  if (path === '/app/saven/environments') return 'app-environments';
  if (path === '/app/saven/recovery') return 'app-recovery';
  if (path === '/app/saven/verification') return 'app-verification';
  if (path === '/app/saven/settings') return 'app-settings';
  if (path === '/app/saven/care-routes') return 'app-care-routes';
  if (path === '/app/saven/faq') return 'app-faq';
  if (path === '/app/saven/learning') return 'app-learning';
  if (path === '/saven/about') return 'architecture';
  if (path === '/saven/how-it-works') return 'dashboard';
  if (path === '/saven/robotics') return 'registry';
  if (path === '/saven/partners') return 'positioning';
  return 'home';
};

const savenPagePaths: Partial<Record<SavenPageId, string>> = {
  home: '/saven',
  architecture: '/saven/about',
  dashboard: '/saven/how-it-works',
  registry: '/saven/robotics',
  positioning: '/saven/partners',
  'app-start': '/app/saven/start',
  'app-life-setup': '/app/saven/start/life-setup',
  'app-today': '/app/saven/today',
  'app-profile': '/app/saven/profile',
  'app-modes': '/app/saven/modes',
  'app-command': '/app/saven/command',
  'app-support': '/app/saven/support',
  'app-lifecycle': '/app/saven/lifecycle',
  'app-plan': '/app/saven/daily-plan',
  'app-policies': '/app/saven/verification-policy',
  'app-continuity': '/app/saven/continuity',
  'app-timeline': '/app/saven/timeline',
  'app-circle': '/app/saven/circle',
  'app-devices': '/app/saven/devices',
  'app-robots': '/app/saven/robots',
  'app-environments': '/app/saven/environments',
  'app-recovery': '/app/saven/recovery',
  'app-verification': '/app/saven/verification',
  'app-settings': '/app/saven/settings',
  'app-care-routes': '/app/saven/care-routes',
  'app-faq': '/app/saven/faq',
  'app-learning': '/app/saven/learning',
};

export default function Saven({ onNavigate }: SavenProps) {
  const [activePage, setActivePage] = useState<SavenPageId>(getInitialSavenPage);
  const [setup, setSetup] = useState(defaultSetup);
  const [profileCreated, setProfileCreated] = useState(false);
  const currentPage = sectionPages.find((page) => page.id === activePage);
  const inApp = activePage.startsWith('app-');

  useEffect(() => {
    const syncPageFromPath = () => setActivePage(getInitialSavenPage());
    syncPageFromPath();
    window.addEventListener('popstate', syncPageFromPath);
    return () => window.removeEventListener('popstate', syncPageFromPath);
  }, []);

  const openPage = (pageId: SavenPageId) => {
    setActivePage(pageId);
    const nextPath = savenPagePaths[pageId];
    if (nextPath && window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={
        inApp
          ? 'min-h-screen bg-[#f7f5f1] text-slate-950'
          : 'min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.1),transparent_30%),#f8fafc] dark:bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.14),transparent_32%),#020617]'
      }
    >
      <SEO
        title="SAVEN - Continuous Care Execution Layer"
        description="SAVEN is the BioMath Core execution and verification layer connecting personal health intelligence, care environments, physical devices, caregivers, and future robotic assistants."
        keywords={[
          'SAVEN',
          'continuous care',
          'care coordination',
          'care execution',
          'verified support actions',
          'robotic care coordination',
          'home care infrastructure',
        ]}
        image="/saven-cover.png"
        url="/saven"
      />

      {inApp ? (
        <SavenAppShell activePage={activePage} openPage={openPage} onNavigate={onNavigate}>
          {activePage === 'app-start' && <SavenSystemStart openPage={openPage} profileCreated={profileCreated} />}
          {activePage === 'app-life-setup' && (
            <LifeSetup
              setup={setup}
              setSetup={setSetup}
              onCreate={() => {
                setProfileCreated(true);
                openPage('app-today');
              }}
            />
          )}
          {activePage === 'app-today' && <TodaySupport setup={setup} openPage={openPage} profileCreated={profileCreated} />}
          {activePage === 'app-profile' && <SupportProfile setup={setup} openPage={openPage} />}
          {activePage === 'app-modes' && <DualModeArchitecture />}
          {activePage === 'app-command' && <SavenCommandCenter />}
          {activePage === 'app-support' && <SupportFlowPage />}
          {activePage === 'app-lifecycle' && <TaskLifecycleService />}
          {activePage === 'app-plan' && <DailySupportPlanBuilder />}
          {activePage === 'app-policies' && <VerificationPolicyBuilder />}
          {activePage === 'app-continuity' && <ContinuityOperations />}
          {activePage === 'app-timeline' && <HumanSupportTimeline />}
          {activePage === 'app-circle' && <SupportCircle />}
          {activePage === 'app-devices' && <DeviceReadiness />}
          {activePage === 'app-robots' && <RobotReadiness />}
          {activePage === 'app-environments' && <EnvironmentSystem />}
          {activePage === 'app-recovery' && <RecoveryMode />}
          {activePage === 'app-verification' && <VerificationCenter />}
          {activePage === 'app-settings' && <SavenSettings />}
          {activePage === 'app-care-routes' && <SavenCareRoutes />}
          {activePage === 'app-faq' && <SavenFAQ />}
          {activePage === 'app-learning' && <SavenLearningCenter />}
        </SavenAppShell>
      ) : (
        <div className="mx-auto grid max-w-[1500px] gap-0 lg:grid-cols-[300px_1fr]">
          <PublicSavenSidebar activePage={activePage as PublicPageId} openPage={openPage} onNavigate={onNavigate} />
          <main className="min-h-screen pb-16">
            {activePage === 'home' ? (
              <SavenHome openPage={openPage} />
            ) : currentPage ? (
              <SavenSubPage page={currentPage} openPage={openPage} />
            ) : (
              <SavenHome openPage={openPage} />
            )}
          </main>
        </div>
      )}
    </div>
  );
}

function PublicSavenSidebar({
  activePage,
  openPage,
  onNavigate,
}: {
  activePage: PublicPageId;
  openPage: (pageId: SavenPageId) => void;
  onNavigate: (page: string) => void;
}) {
  return (
    <aside className="flex border-r border-slate-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95 lg:sticky lg:top-0 lg:h-screen lg:flex-col lg:overflow-y-auto">
      <div className="border-b border-slate-200 p-5 dark:border-gray-800">
        <BackButton onNavigate={onNavigate} label="Back to BioMath Core" />
        <button onClick={() => openPage('home')} className="mt-4 flex items-center gap-3 text-left">
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden bg-slate-950 shadow-sm">
            <img src="/saven-mark.png" alt="SAVEN logo" className="h-full w-full object-cover" />
          </span>
          <span>
            <span className="block text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">SAVEN</span>
            <span className="mt-1 block text-sm leading-6 text-gray-500 dark:text-gray-400">Public product website</span>
          </span>
        </button>
        <button
          onClick={() => openPage('app-start')}
          className="mt-5 flex w-full items-center justify-between bg-slate-950 px-4 py-3 text-left text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
        >
          Enter SAVEN System
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <nav className="p-4 lg:flex-1">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.22em] text-gray-500 dark:text-gray-500">Public Site</p>
        <div className="grid gap-1">
          {publicMenuItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => openPage(item.id)}
                className={`group flex w-full items-center justify-between border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                  isActive
                    ? 'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-200'
                    : 'border-transparent text-gray-600 hover:border-slate-200 hover:bg-slate-50 hover:text-gray-900 dark:text-gray-300 dark:hover:border-gray-800 dark:hover:bg-gray-900 dark:hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                <span className={`${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                  {item.id === 'home' ? '•' : '→'}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="m-4 border border-blue-200 bg-blue-50 p-4 shadow-sm dark:border-blue-400/20 dark:bg-blue-950/35">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">Clear separation</p>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          This side is the public SAVEN website. The real support system begins through Enter SAVEN System.
        </p>
      </div>
    </aside>
  );
}

function SavenHome({ openPage }: { openPage: (pageId: SavenPageId) => void }) {
  return (
    <div>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <img src="/saven-cover.png" alt="SAVEN infrastructure of continuous care execution" className="absolute inset-0 h-full w-full object-cover opacity-48" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(37,99,235,0.2),transparent_34%),linear-gradient(90deg,#020617_0%,rgba(2,6,23,0.96)_42%,rgba(2,6,23,0.74)_70%,rgba(2,6,23,0.48)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
        <div className="relative px-6 pb-20 pt-20 sm:px-8 lg:px-12 lg:pb-24 lg:pt-28">
          <div className="max-w-4xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-orange-100">Public SAVEN Website</p>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">Execution, verification, and human support infrastructure</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
              SAVEN connects BioMath Core's digital understanding of a person with verified real-world support actions performed by people, caregivers, devices, sensors, smart environments, and future robotic systems.
            </p>
            <div className="mt-12 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="max-w-2xl border border-white/15 border-l-orange-400 bg-slate-950/72 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-md">
                <p className="text-sm leading-7 text-slate-100 md:text-base">
                  This public site explains SAVEN. The real system starts when a person creates a support profile and activates daily support.
                </p>
              </div>
              <button
                onClick={() => openPage('app-start')}
                className="inline-flex items-center justify-center gap-2 bg-white px-6 py-4 text-sm font-semibold text-slate-950 shadow-xl shadow-black/20 transition-colors hover:bg-orange-50"
              >
                Enter SAVEN System
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-orange-600 dark:text-orange-300">Public Website vs Real System</p>
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white md:text-4xl">
              SAVEN now has a visible entry into the real support operating system.
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
              The public website explains the concept. The real system handles Life Setup, Today's Support, verified actions, support circle, devices, robots, recovery mode, and verification.
            </p>
          </div>
          <div className="border border-emerald-200 bg-emerald-50 p-6 shadow-sm dark:border-emerald-400/20 dark:bg-emerald-950/30">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Real system entry</p>
            <h3 className="mt-3 text-2xl font-semibold text-gray-950 dark:text-white">Start SAVEN</h3>
            <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
              Set up real-life support for a person through Person, Support Circle, Daily Support, and Verified Actions.
            </p>
            <button
              onClick={() => openPage('app-start')}
              className="mt-5 inline-flex items-center gap-2 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Open system entry
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sectionPages.map((page) => (
            <button
              key={page.id}
              onClick={() => openPage(page.id)}
              className="group min-h-[164px] border border-slate-200/80 bg-white/92 p-4 text-left shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-950/5 dark:border-white/10 dark:bg-slate-950/76 dark:shadow-black/20 dark:hover:border-orange-300/50 dark:hover:bg-slate-900/82"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-slate-950 shadow-sm dark:border-white/15">
                  <img src="/saven-mark.png" alt="SAVEN logo" className="h-full w-full object-cover" />
                </div>
                <span className="flex h-9 w-9 items-center justify-center border border-slate-200 text-orange-600 transition-colors group-hover:border-orange-300 group-hover:bg-orange-50 dark:border-white/10 dark:text-orange-200 dark:group-hover:border-orange-300/40 dark:group-hover:bg-orange-400/10">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-300">{page.eyebrow}</p>
              <h3 className="mt-2 text-xl font-semibold text-gray-950 dark:text-white">{page.label}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{page.summary}</p>
              <div className="mt-5 h-px bg-gradient-to-r from-blue-400/0 via-blue-400/45 to-orange-300/0 opacity-70" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function SavenSubPage({ page, openPage }: { page: SectionPage; openPage: (pageId: SavenPageId) => void }) {
  return (
    <div>
      <section className="border-b border-slate-200 bg-white/92 backdrop-blur dark:border-gray-800 dark:bg-gray-950/92">
        <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1fr_380px] lg:px-12 lg:py-12">
          <div>
            <button
              onClick={() => openPage('home')}
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to SAVEN public site
            </button>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-orange-600 dark:text-orange-300">{page.eyebrow}</p>
            <h1 className="max-w-5xl text-4xl font-semibold tracking-tight text-gray-900 dark:text-white md:text-6xl">{page.title}</h1>
            <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-600 dark:text-gray-300">{page.summary}</p>
          </div>
          <div className="relative min-h-[260px] overflow-hidden border border-slate-200 bg-slate-950 shadow-sm dark:border-gray-800">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(37,99,235,0.52),transparent_34%),radial-gradient(circle_at_75%_70%,rgba(249,115,22,0.48),transparent_32%),linear-gradient(135deg,#020617,#0f172a_55%,#111827)]" />
            <div className="absolute left-8 right-8 top-1/2 h-px bg-gradient-to-r from-blue-300/0 via-blue-300/80 to-orange-300/0" />
            <div className="absolute left-8 top-8 h-16 w-16 overflow-hidden border border-white/20 bg-slate-950/80">
              <img src="/saven-mark.png" alt="SAVEN logo" className="h-full w-full object-cover" />
            </div>
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-100">SAVEN</p>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{page.accent}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 sm:px-8 lg:px-12">
        {page.visual && (
          <div className="mb-8 overflow-hidden border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/85">
            <div className="bg-slate-950">
              <img src={page.visual} alt={page.visualAlt || page.label} className="mx-auto max-h-[420px] w-full object-contain" />
            </div>
            {page.visualNote && <p className="px-2 pt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{page.visualNote}</p>}
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-2">
          {page.blocks.map((block) => (
            <article key={block.title} className="border border-slate-200 bg-white/92 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/86">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{block.title}</h2>
              <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-300">{block.text}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {block.items.map((item) => (
                  <span key={item} className="border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function SavenAppShell({
  activePage,
  openPage,
  onNavigate,
  children,
}: {
  activePage: SavenPageId;
  openPage: (pageId: SavenPageId) => void;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f5f1] text-slate-950 dark:bg-[#07111f] dark:text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(91,143,201,0.24),transparent_30%),radial-gradient(circle_at_90%_0%,rgba(198,155,72,0.2),transparent_26%),radial-gradient(circle_at_70%_95%,rgba(4,120,87,0.13),transparent_30%),linear-gradient(180deg,#fbfaf7,#f2efe8)] dark:bg-[radial-gradient(circle_at_12%_8%,rgba(91,143,201,0.25),transparent_32%),radial-gradient(circle_at_88%_4%,rgba(198,155,72,0.16),transparent_28%),radial-gradient(circle_at_70%_92%,rgba(16,185,129,0.1),transparent_30%),linear-gradient(180deg,#07111f,#0f172a_48%,#111827)]" />
      <div className="relative grid min-h-screen lg:grid-cols-[292px_1fr]">
        <aside className="hidden border-r border-white/70 bg-white/78 px-4 py-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#081422]/84 lg:block">
          <BackButton onNavigate={onNavigate} label="Back to BioMath Core" />
          <button onClick={() => openPage('app-start')} className="group mt-5 flex w-full items-center gap-3 rounded-3xl px-2 py-2 text-left transition-all hover:bg-white/70 dark:hover:bg-white/[0.07]">
            <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-slate-950 shadow-sm ring-1 ring-white/50 transition-transform group-hover:scale-105 dark:ring-white/10">
              <img src="/saven-mark.png" alt="SAVEN" className="h-full w-full object-cover" />
            </span>
            <span>
              <span className="block text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">SAVEN</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">Real support system</span>
            </span>
          </button>
          <div className="mt-6 overflow-hidden rounded-3xl border border-blue-200/70 bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_88%_20%,rgba(249,115,22,0.16),transparent_28%),linear-gradient(135deg,#ffffff,#eff6ff_46%,#fff7ed)] p-4 shadow-lg shadow-blue-950/5 dark:border-blue-300/20 dark:bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.24),transparent_30%),radial-gradient(circle_at_92%_12%,rgba(249,115,22,0.18),transparent_30%),linear-gradient(135deg,#06101f,#0b1728_58%,#21170b)] dark:ring-1 dark:ring-blue-300/15">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 dark:text-blue-100">Support active</p>
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
            </div>
            <p className="mt-3 text-lg font-semibold tracking-tight text-slate-950 dark:text-white">Anna Roberts</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-500/12 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-400/15 dark:text-blue-100">Home Recovery</span>
              <span className="rounded-full bg-orange-500/12 px-3 py-1 text-xs font-semibold text-orange-800 dark:bg-orange-400/15 dark:text-orange-100">Live circle</span>
            </div>
          </div>
          <nav className="mt-6 space-y-1">
            {appNavItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const navTones = [
                'from-blue-500 to-cyan-400',
                'from-orange-500 to-amber-300',
                'from-emerald-500 to-cyan-300',
                'from-indigo-500 to-blue-400',
                'from-sky-500 to-blue-600',
                'from-amber-500 to-orange-500',
                'from-emerald-500 to-teal-400',
                'from-blue-600 to-indigo-500',
                'from-orange-500 to-red-500',
                'from-cyan-500 to-emerald-400',
                'from-emerald-500 to-blue-500',
                'from-slate-700 to-blue-500',
              ];
              const navTone = navTones[index % navTones.length];
              return (
                <button
                  key={item.id}
                  onClick={() => openPage(item.id)}
                  className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                    isActive ? 'bg-slate-950 text-white shadow-sm shadow-slate-950/10 dark:bg-slate-900 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25' : 'text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-900/80 dark:hover:text-white'
                  }`}
                >
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ring-1 transition-all group-hover:scale-105 ${isActive ? 'bg-gradient-to-br ' + navTone + ' text-white shadow-lg shadow-blue-950/20 ring-white/20' : 'bg-slate-100 text-slate-500 ring-slate-200/70 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm dark:bg-slate-950/65 dark:text-slate-300 dark:ring-white/10 dark:group-hover:bg-slate-900'}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>
          <button
            onClick={() => openPage('home')}
            className="mt-6 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-left text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white"
          >
            Public website
            <ArrowRight className="h-4 w-4" />
          </button>
        </aside>
        <div className="min-w-0 pb-20 lg:pb-0">
          <header className="sticky top-0 z-20 border-b border-white/70 bg-[#f7f5f1]/88 px-5 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#07111f]/88 sm:px-8 lg:px-10">
            <div className="mx-auto flex max-w-[1480px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">BioMath Core SAVEN</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">Daily human support operations</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <StatusPill tone="blue" label="Anna Roberts" />
                <StatusPill tone="gold" label="Home Recovery" />
                <StatusPill tone="green" label="Support active" />
                <StatusPill tone="blue" label="Next window 15:00" />
                <SavenVoiceLogoControl activePage={activePage} openPage={openPage} />
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-[1480px] px-5 py-6 sm:px-8 lg:px-10">{children}</main>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/70 bg-white/92 px-2 py-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#07111f]/94 lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {appNavItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => openPage(item.id)}
                className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-semibold ${
                  isActive ? 'bg-slate-950 text-white dark:bg-slate-900 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon className="mb-1 h-3.5 w-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SavenVoiceLogoControl({ activePage, openPage }: { activePage: SavenPageId; openPage: (pageId: SavenPageId) => void }) {
  const [openMenu, setOpenMenu] = useState(false);
  const pageLabel = appNavItems.find((item) => item.id === activePage)?.label || 'SAVEN';
  const pageCommand = 'Hey SAVEN, help me with ' + pageLabel.toLowerCase() + '.';

  return (
    <div className="relative">
      <button
        onClick={() => setOpenMenu((value) => !value)}
        className="group relative grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-slate-950 shadow-lg shadow-blue-950/15 ring-1 ring-blue-200/30 transition-all hover:-translate-y-0.5 hover:shadow-xl dark:bg-slate-950 dark:ring-blue-300/30"
        aria-label="SAVEN voice commands"
      >
        <span className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_58%_38%,rgba(96,165,250,0.48),transparent_34%),radial-gradient(circle_at_68%_72%,rgba(249,115,22,0.42),transparent_34%)] opacity-80" />
        <span className="absolute inset-1 rounded-[1rem] border border-white/10" />
        <img src="/saven-mark.png" alt="" className="relative h-full w-full scale-110 object-cover transition-transform duration-500 group-hover:scale-125" />
        <span className="absolute bottom-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.95)]" />
      </button>

      {openMenu && (
        <div className="absolute right-0 top-14 z-50 w-[340px] overflow-hidden rounded-3xl border border-white/70 bg-white/96 p-4 text-slate-950 shadow-2xl shadow-slate-950/18 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/96 dark:text-white dark:ring-1 dark:ring-white/10">
          <div className="flex items-center gap-3">
            <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-slate-950 ring-1 ring-blue-300/30">
              <span className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_35%_35%,rgba(59,130,246,0.5),transparent_38%),radial-gradient(circle_at_70%_70%,rgba(249,115,22,0.46),transparent_35%)]" />
              <img src="/saven-mark.png" alt="" className="relative h-full w-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">SAVEN voice</p>
              <p className="mt-1 truncate text-base font-semibold">Commands for {pageLabel}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3 dark:border-blue-300/20 dark:bg-blue-500/10">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-800 dark:text-blue-100">
                <Mic className="h-4 w-4" />
                Voice command
              </div>
              <p className="mt-2 break-words text-sm leading-6 text-slate-700 dark:text-slate-200">{pageCommand}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-300/20 dark:bg-emerald-500/10">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-100">
                <MessageSquareText className="h-4 w-4" />
                Text fallback
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">Use text commands when voice is muted, not recognized, or not appropriate.</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => { openPage('app-settings'); setOpenMenu(false); }} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition-all hover:-translate-y-0.5 hover:bg-blue-500">
              Open voice controls
            </button>
            <button onClick={() => setOpenMenu(false)} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition-all hover:-translate-y-0.5 hover:bg-white dark:bg-slate-900 dark:text-slate-200 dark:ring-white/10">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SavenSystemStart({ openPage, profileCreated }: { openPage: (pageId: SavenPageId) => void; profileCreated: boolean }) {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/82 p-8 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
        <div className="grid gap-8 xl:grid-cols-[1fr_420px] xl:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Real SAVEN begins here</p>
            <h2 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-6xl">Start SAVEN</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Set up real-life support for a person. This is where SAVEN stops being a website and becomes a daily support operating system.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => openPage(profileCreated ? 'app-today' : 'app-life-setup')} className="group inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/10 transition-all hover:-translate-y-0.5 hover:shadow-xl dark:from-blue-500/85 dark:to-slate-800">
                {profileCreated ? "Open Today's Support" : 'Begin Life Setup'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button onClick={() => openPage('home')} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 dark:text-slate-200">
                View public site
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-4 text-white shadow-2xl ring-1 ring-white/10">
            <img src="/saven-mark.png" alt="SAVEN system identity" className="h-72 w-full rounded-[1.5rem] object-cover" />
            <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/10 bg-slate-950/72 px-4 py-3 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">SAVEN command layer</p>
              <p className="mt-1 text-sm text-slate-200">Voice and text commands are available across the operating system.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <SystemEntryCard title="Set Up a Person" text="Create a support profile for yourself, a family member, or someone under care." onClick={() => openPage('app-life-setup')} />
        <SystemEntryCard title="Connect Support Circle" text="Add family, caregivers, professionals, devices, and future robots." onClick={() => openPage('app-circle')} />
        <SystemEntryCard title="Activate Daily Support" text="Create the first daily support plan and begin verified actions." onClick={() => openPage('app-today')} />
      </div>

      <SupportFlowGraphic current="Support Task Created" />
    </div>
  );
}

function SystemEntryCard({ title, text, onClick }: { title: string; text: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group rounded-[2rem] border border-white/70 bg-white/82 p-6 text-left shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 dark:hover:border-blue-300/30 dark:hover:bg-slate-900/80">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h3>
        <span className="grid h-11 w-11 place-items-center rounded-full bg-slate-950 text-white shadow-sm ring-1 ring-slate-900/10 transition-all group-hover:scale-105 group-hover:bg-blue-600 dark:bg-slate-950/75 dark:text-blue-100 dark:ring-blue-300/20 dark:group-hover:bg-blue-950/80">
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{text}</p>
    </button>
  );
}

function LifeSetup({
  setup,
  setSetup,
  onCreate,
}: {
  setup: LifeSetupState;
  setSetup: (value: LifeSetupState) => void;
  onCreate: () => void;
}) {
  const toggleSupportCircle = (option: string) => {
    const exists = setup.supportCircle.includes(option);
    setSetup({
      ...setup,
      supportCircle: exists ? setup.supportCircle.filter((item) => item !== option) : [...setup.supportCircle, option],
    });
  };

  const toggleGoal = (option: string) => {
    const exists = setup.goals.includes(option);
    setSetup({
      ...setup,
      goals: exists ? setup.goals.filter((item) => item !== option) : [...setup.goals, option],
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(236,246,255,0.82),rgba(255,248,232,0.74))] p-7 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(10,21,35,0.96),rgba(22,38,58,0.86),rgba(45,35,21,0.66))]">
          <div className="absolute -right-8 top-0 hidden h-52 w-52 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-400/12 md:block" />
          <div className="absolute bottom-0 left-10 hidden h-28 w-72 rounded-full bg-amber-200/24 blur-3xl dark:bg-amber-300/10 md:block" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Life Setup</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Build a real-life support profile in a few clear steps.
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              This is not a medical form. SAVEN learns the person's life situation, support circle, rhythm, comfort, and goals so daily support can start calmly.
            </p>
            <div className="mt-7 grid gap-3 md:grid-cols-4">
              {['Person', 'Life context', 'Support circle', 'Daily plan'].map((item, index) => (
                <div key={item} className="group rounded-3xl border border-white/70 bg-white/72 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-md dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 dark:hover:bg-slate-900/80">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Part {index + 1}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{item}</p>
                  <div className="mt-3 h-1 rounded-full bg-gradient-to-r from-blue-300 via-amber-300 to-emerald-300 opacity-60 transition-opacity group-hover:opacity-100" />
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 lg:grid-cols-3">
              <InfoNote tone="blue" title="Easy first pass" text="Start with the closest answers. SAVEN can adapt later." />
              <InfoNote tone="gold" title="No diagnosis" text="This setup describes life context, rhythm, comfort, and support needs." />
              <InfoNote tone="green" title="Ready for action" text="The profile creates a daily plan with visible responsibility and confirmation." />
            </div>
          </div>
        </section>

        <LifeSetupSection
          step="01"
          tone="blue"
          title="Person foundation"
          subtitle="Start with who this support system is for. Keep it simple and human."
        >
          <OptionGroup
            title="Who is this for?"
            description="This sets the relationship and the language SAVEN uses."
            options={['Myself', 'Family member', 'Person under care', 'Client / resident']}
            selected={setup.relationship}
            onSelect={(value) => setSetup({ ...setup, relationship: value })}
          />
          <InfoNote tone="blue" title="Basic information" text="These fields help SAVEN address the person naturally and place support in the right environment." className="mt-6" />
          <div className="mt-4 grid gap-4 rounded-[1.5rem] border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-950/55 md:grid-cols-2">
            <Field label="First name" value={setup.firstName} onChange={(value) => setSetup({ ...setup, firstName: value })} />
            <Field label="Preferred name" value={setup.preferredName} onChange={(value) => setSetup({ ...setup, preferredName: value })} />
            <SelectLike label="Age group" value={setup.ageGroup} options={['Child', 'Teen', 'Adult', 'Senior', 'Advanced senior']} onChange={(value) => setSetup({ ...setup, ageGroup: value })} />
            <SelectLike label="Sex" value={setup.sex} options={['Female', 'Male', 'Prefer not to say']} onChange={(value) => setSetup({ ...setup, sex: value })} />
            <Field label="Primary language" value={setup.language} onChange={(value) => setSetup({ ...setup, language: value })} />
            <SelectLike label="Living situation" value={setup.livingSituation} options={['Independent home', 'With family', 'Assisted living', 'Rehabilitation center', 'Senior care', 'Hospital recovery', 'Home Recovery']} onChange={(value) => setSetup({ ...setup, livingSituation: value })} />
          </div>
        </LifeSetupSection>

        <LifeSetupSection
          step="02"
          tone="gold"
          title="Life context"
          subtitle="Choose the current support situation and daily rhythm. This helps SAVEN create the first support day."
        >
          <OptionGroup
            title="Current support situation"
            description="Pick the closest current mode. This can change later."
            options={['Independent living', 'Home recovery', 'Post-surgery recovery', 'Rehabilitation', 'Senior support', 'Child support', 'Wellness monitoring']}
            selected={setup.supportMode}
            onSelect={(value) => setSetup({ ...setup, supportMode: value })}
          />
          <div className="mt-6 grid gap-6">
            <OptionGroup
              title="Mobility level"
              description="This changes how many actions appear at once and who should verify them."
              options={['Fully independent', 'Light assistance', 'Walking support', 'Limited mobility', 'Wheelchair support', 'Bed recovery']}
              selected={setup.mobility}
              onSelect={(value) => setSetup({ ...setup, mobility: value })}
            />
            <OptionGroup
              title="Daily rhythm"
              description="SAVEN uses rhythm to place support windows without overwhelming the day."
              options={['Early morning', 'Balanced day', 'Low activity', 'Evening active', 'Structured recovery']}
              selected={setup.rhythm}
              onSelect={(value) => setSetup({ ...setup, rhythm: value })}
            />
          </div>
        </LifeSetupSection>

        <LifeSetupSection
          step="03"
          tone="green"
          title="Support circle"
          subtitle="Show who is available around the person. SAVEN will use this to make responsibility visible."
        >
          <MultiOptionGroup
            title="Who is available?"
            description="Select everyone who may participate in support."
            options={['Family available', 'Caregiver available', 'Clinic connected', 'Rehabilitation provider', 'No support connected yet']}
            selected={setup.supportCircle}
            onToggle={toggleSupportCircle}
          />
        </LifeSetupSection>

        <LifeSetupSection
          step="04"
          tone="blue"
          title="Comfort and communication"
          subtitle="Set how support should feel. This controls reminders, devices, and robot readiness language."
        >
          <div className="grid gap-6">
            <OptionGroup
              title="Comfort with technology and robotics"
              description="SAVEN can stay human-first or prepare for device and robot support."
              options={['Prefers human support', 'Comfortable with devices', 'Cautious about robots', 'Open to robotic support', 'High automation acceptance']}
              selected={setup.technologyComfort}
              onSelect={(value) => setSetup({ ...setup, technologyComfort: value })}
            />
            <OptionGroup
              title="Communication preference"
              description="Choose how reminders should arrive in daily life."
              options={['Gentle notifications', 'Voice prompts', 'Text reminders', 'Visual prompts', 'Caregiver first', 'Minimal notifications']}
              selected={setup.communication}
              onSelect={(value) => setSetup({ ...setup, communication: value })}
            />
          </div>
        </LifeSetupSection>

        <LifeSetupSection
          step="05"
          tone="gold"
          title="Main support goals"
          subtitle="Select the goals that make SAVEN useful from day one."
        >
          <MultiOptionGroup
            title="Starting goals"
            description="These goals shape the first support plan after setup."
            options={['Maintain independence', 'Recover after surgery', 'Improve daily routine', 'Support mobility', 'Reduce missed actions', 'Coordinate family and caregivers', 'Prepare for device or robot support']}
            selected={setup.goals}
            onToggle={toggleGoal}
          />
        </LifeSetupSection>
      </div>

      <aside className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start">
        <SupportProfileSummary setup={setup} />
        <button onClick={onCreate} className="group flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-950/10 transition-all hover:-translate-y-0.5 hover:shadow-xl dark:from-blue-500/90 dark:to-slate-800">
          Create Support Profile
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </aside>
    </div>
  );
}

function SupportProfileSummary({ setup }: { setup: LifeSetupState }) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1726]/86">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-200/20 blur-3xl dark:bg-slate-950/70 dark:ring-1 dark:ring-blue-300/15" />
      <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Live Review</p>
      <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{setup.preferredName || setup.firstName} Support Profile</h3>
      <div className="mt-5 rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white shadow-sm ring-1 ring-slate-900/10 dark:bg-slate-950/75 dark:text-blue-100 dark:ring-blue-300/20">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-950 dark:text-white">{setup.preferredName || setup.firstName}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{setup.supportMode}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 rounded-3xl border border-slate-100 bg-white/60 px-4 py-2 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-950/65 dark:text-slate-300 dark:ring-1 dark:ring-white/10">
        <SummaryLine label="For" value={setup.relationship} />
        <SummaryLine label="Situation" value={setup.supportMode} />
        <SummaryLine label="Mobility" value={setup.mobility} />
        <SummaryLine label="Environment" value={setup.livingSituation} />
        <SummaryLine label="Daily rhythm" value={setup.rhythm} />
        <SummaryLine label="Communication" value={setup.communication} />
      </div>
      <InfoNote tone="green" title="After creation" text="SAVEN will generate the first daily support plan after profile creation." className="mt-5" />
    </section>
  );
}

function InfoNote({ tone, title, text, className = '' }: { tone: 'blue' | 'gold' | 'green' | 'amber'; title: string; text: string; className?: string }) {
  const toneClass =
    tone === 'green'
      ? 'border-emerald-200 bg-emerald-50/82 text-emerald-900 dark:border-emerald-300/25 dark:bg-slate-950/75 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/20'
      : tone === 'gold'
        ? 'border-amber-200 bg-amber-50/82 text-amber-900 dark:border-amber-300/25 dark:bg-slate-950/75 dark:text-amber-100 dark:ring-1 dark:ring-amber-300/20'
        : tone === 'amber'
          ? 'border-orange-200 bg-orange-50/82 text-orange-900 dark:border-orange-300/25 dark:bg-slate-950/75 dark:text-orange-100 dark:ring-1 dark:ring-orange-300/20'
          : 'border-blue-200 bg-blue-50/82 text-blue-900 dark:border-blue-300/25 dark:bg-slate-950/75 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/20';

  return (
    <div className={`rounded-3xl border p-4 shadow-sm ${toneClass} ${className}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-6 opacity-80">{text}</p>
    </div>
  );
}

function LifeSetupSection({
  step,
  tone,
  title,
  subtitle,
  children,
}: {
  step: string;
  tone: 'blue' | 'gold' | 'green';
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const toneClass =
    tone === 'green'
      ? 'from-emerald-50/95 via-white/86 to-white/70 dark:from-emerald-950/30 dark:via-slate-900/80 dark:to-slate-950/60'
      : tone === 'gold'
        ? 'from-amber-50/95 via-white/86 to-white/70 dark:from-amber-950/25 dark:via-slate-900/80 dark:to-slate-950/60'
        : 'from-blue-50/95 via-white/86 to-white/70 dark:from-blue-950/30 dark:via-slate-900/80 dark:to-slate-950/60';

  const dotClass =
    tone === 'green'
      ? 'bg-emerald-500 shadow-emerald-500/25'
      : tone === 'gold'
        ? 'bg-amber-500 shadow-amber-500/25'
        : 'bg-blue-500 shadow-blue-500/25';

  return (
    <section className={`overflow-hidden rounded-[2rem] border border-white/75 bg-gradient-to-br ${toneClass} p-5 shadow-sm backdrop-blur-xl dark:border-white/10 sm:p-6`}>
      <div className="rounded-[1.65rem] border border-white/70 bg-white/42 p-5 shadow-sm dark:border-white/10 dark:bg-slate-950/55">
        <div className="flex flex-col gap-4 border-b border-slate-200/70 pb-5 dark:border-white/10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
            <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-sm font-semibold text-white shadow-lg ${dotClass}`}>{step}</div>
            <div className="min-w-0">
              <h3 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p>
            </div>
          </div>
          <div className="hidden h-12 min-w-28 rounded-full border border-white/70 bg-white/70 shadow-inner dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 lg:block" />
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}

function OptionGroup({
  title,
  description,
  options,
  selected,
  onSelect,
}: {
  title: string;
  description: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/78 shadow-sm dark:border-white/10 dark:bg-[#0b1726]/72">
      <div className="border-b border-slate-200/70 bg-[linear-gradient(135deg,rgba(239,246,255,0.92),rgba(255,255,255,0.74))] px-5 py-4 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(37,99,235,0.14),rgba(15,23,42,0.62))]">
        <div className="grid gap-3 sm:grid-cols-[92px_minmax(0,1fr)] sm:items-start">
          <span className="inline-flex w-fit items-center justify-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-slate-950/70 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25">Single</span>
          <div>
            <h4 className="text-lg font-semibold leading-6 text-slate-950 dark:text-white">{title}</h4>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-px bg-slate-200/70 p-px dark:bg-slate-950/70">
        {options.map((option) => (
          <LifeSetupOptionCard key={option} label={option} selected={selected === option} onClick={() => onSelect(option)} />
        ))}
      </div>
    </div>
  );
}

function MultiOptionGroup({
  title,
  description,
  options,
  selected,
  onToggle,
}: {
  title: string;
  description: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/78 shadow-sm dark:border-white/10 dark:bg-[#0b1726]/72">
      <div className="border-b border-slate-200/70 bg-[linear-gradient(135deg,rgba(236,253,245,0.92),rgba(255,255,255,0.74))] px-5 py-4 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(15,23,42,0.62))]">
        <div className="grid gap-3 sm:grid-cols-[92px_minmax(0,1fr)] sm:items-start">
          <span className="inline-flex w-fit items-center justify-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-slate-950/70 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/25">{selected.length} selected</span>
          <div>
            <h4 className="text-lg font-semibold leading-6 text-slate-950 dark:text-white">{title}</h4>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-px bg-slate-200/70 p-px dark:bg-slate-950/70">
        {options.map((option) => (
          <LifeSetupOptionCard key={option} label={option} selected={selected.includes(option)} onClick={() => onToggle(option)} />
        ))}
      </div>
    </div>
  );
}

function LifeSetupOptionCard({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group relative min-h-[56px] w-full overflow-hidden border-0 px-4 py-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-300/70 ${
        selected
          ? 'bg-[linear-gradient(135deg,#172554,#1d4ed8)] text-white dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,64,175,0.72))] dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25'
          : 'bg-white text-slate-700 hover:bg-blue-50/90 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:bg-blue-400/10'
      }`}
    >
      <span className={`absolute inset-y-0 left-0 w-1.5 transition-colors ${selected ? 'bg-emerald-300' : 'bg-slate-200 group-hover:bg-blue-300 dark:bg-slate-800 dark:group-hover:bg-blue-300/60'}`} />
      <div className="grid grid-cols-[minmax(0,1fr)_22px] items-center gap-4 pl-3">
        <span className="min-w-0 whitespace-normal break-words text-sm font-semibold leading-5">{label}</span>
        <span className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border transition-all ${selected ? 'border-white/20 bg-emerald-600 text-white dark:bg-emerald-300 dark:text-slate-950' : 'border-slate-300 bg-white/80 text-transparent dark:border-white/20 dark:bg-slate-950/70'}`}>
          <Check className="h-2.5 w-2.5" />
        </span>
      </div>
    </button>
  );
}

function TodaySupport({ setup, openPage, profileCreated }: { setup: LifeSetupState; openPage: (pageId: SavenPageId) => void; profileCreated: boolean }) {
  const stats = useMemo(
    () => [
      { label: 'Active', value: supportTasks.filter((task) => task.status === 'active' || task.status === 'planned').length, tone: 'blue' },
      { label: 'Completed', value: supportTasks.filter((task) => task.status === 'completed').length, tone: 'green' },
      { label: 'Needs attention', value: supportTasks.filter((task) => task.status === 'needs_attention' || task.status === 'pending_confirmation').length, tone: 'amber' },
      { label: 'Delayed', value: supportTasks.filter((task) => task.status === 'delayed').length, tone: 'amber' },
      { label: 'Pending confirmation', value: supportTasks.filter((task) => task.status === 'pending_confirmation').length, tone: 'blue' },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {!profileCreated && <InfoNote tone="amber" title="Demo profile is active" text="Complete Life Setup to personalize SAVEN and generate a support plan for this person." />}
      <HumanSupportHeader setup={setup} />
      <CareContactNetwork compact />
      <SavenEndToEndScenario openPage={openPage} />
      <SavenDeveloperReadinessStack />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <MetricCard key={stat.label} label={stat.label} value={stat.value} tone={stat.tone} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Today’s Support Stream</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Live support actions</h2>
            </div>
            <button onClick={() => openPage('app-support')} className="group inline-flex items-center gap-2 rounded-full border border-white/70 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 hover:shadow-md dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 dark:text-slate-200 dark:hover:border-blue-300/30 dark:hover:text-blue-100">
              View support flow
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
          {supportTasks.map((task) => (
            <SupportActionCard key={task.title} task={task} />
          ))}
        </section>
        <NeedsAttentionPanel />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <VerifiedTimelineCompact />
        <NextSupportWindow />
      </div>
    </div>
  );
}


function SavenEndToEndScenario({ openPage }: { openPage: (pageId: SavenPageId) => void }) {
  const scenarioSteps: Array<{
    label: string;
    title: string;
    detail: string;
    command: string;
    result: string;
    page: AppPageId;
    tone: 'blue' | 'green' | 'gold' | 'red';
  }> = [
    {
      label: 'Need',
      title: 'Mobility support need detected',
      detail: 'BioMath Core or SAVEN profile identifies that Anna needs a guided walking support window.',
      command: 'Hey SAVEN, show the next recovery need.',
      result: 'Need is visible and converted into a support task.',
      page: 'app-support',
      tone: 'blue',
    },
    {
      label: 'Task',
      title: 'Support task created',
      detail: 'SAVEN creates the assisted walking session with priority, due time, owner, and verification policy.',
      command: 'Create walking support task for 10:30.',
      result: 'Task exists in the daily plan.',
      page: 'app-plan',
      tone: 'green',
    },
    {
      label: 'Assign',
      title: 'Maya Carter assigned',
      detail: 'Circle permissions route the action to the caregiver first and keep robot action locked.',
      command: 'Assign walking support to Maya.',
      result: 'Maya becomes responsible; family remains fallback.',
      page: 'app-circle',
      tone: 'gold',
    },
    {
      label: 'Command',
      title: 'Voice or text command sent',
      detail: 'The same action can be started by voice or typed command without turning SAVEN into a generic chat.',
      command: 'Hey SAVEN, start assisted walking support.',
      result: 'Command is interpreted as a task action.',
      page: 'app-command',
      tone: 'blue',
    },
    {
      label: 'Care',
      title: 'Care network remains ready',
      detail: 'If the action becomes a care concern, SAVEN routes to nurse, doctor, family, or emergency path.',
      command: 'If Maya cannot confirm, notify Daniel and prepare nurse follow-up.',
      result: 'Escalation path is visible, but no real external service is called.',
      page: 'app-environments',
      tone: 'red',
    },
    {
      label: 'Verify',
      title: 'Reality confirmed',
      detail: 'SAVEN waits for caregiver confirmation and supportive device telemetry before updating continuity.',
      command: 'Confirm walking session completed.',
      result: 'Verification received and timeline event created.',
      page: 'app-verification',
      tone: 'green',
    },
    {
      label: 'Continue',
      title: 'Continuity updated',
      detail: 'The support day becomes stable again: one action done, next window clear, family digest ready.',
      command: 'Update continuity and show next support window.',
      result: 'Continuity state becomes Strong.',
      page: 'app-continuity',
      tone: 'gold',
    },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const active = scenarioSteps[activeStep];
  const progress = ((activeStep + 1) / scenarioSteps.length) * 100;

  const toneClass =
    active.tone === 'red'
      ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-300/25 dark:bg-red-500/10 dark:text-red-100'
      : active.tone === 'green'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100'
        : active.tone === 'gold'
          ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100'
          : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_14%_16%,rgba(59,130,246,0.22),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(249,115,22,0.14),transparent_28%),radial-gradient(circle_at_78%_88%,rgba(16,185,129,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(239,246,255,0.78),rgba(255,247,237,0.72))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_14%_16%,rgba(59,130,246,0.28),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(249,115,22,0.12),transparent_28%),radial-gradient(circle_at_78%_88%,rgba(16,185,129,0.12),transparent_28%),linear-gradient(135deg,rgba(4,10,20,0.98),rgba(10,22,40,0.9),rgba(33,22,10,0.66))] dark:ring-1 dark:ring-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">End-to-end scenario</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">One support event from need to continuity.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">This is the product spine for SAVEN: every page supports one shared operational story instead of disconnected demo panels.</p>
        </div>
        <StatusPill tone="green" label={'Step ' + (activeStep + 1) + ' of ' + scenarioSteps.length} />
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/70 shadow-inner dark:bg-slate-950/70">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-emerald-400 to-orange-400 transition-all duration-500" style={{ width: progress + '%' }} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="grid gap-3 md:grid-cols-7">
          {scenarioSteps.map((step, index) => {
            const selected = index === activeStep;
            const done = index < activeStep;
            return (
              <button
                key={step.label}
                onClick={() => setActiveStep(index)}
                className={(selected ? 'border-blue-300 bg-slate-950 text-white shadow-xl dark:border-blue-300/50 dark:bg-blue-950/60' : done ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100' : 'border-white/70 bg-white/78 text-slate-700 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-200') + ' group min-h-[116px] rounded-3xl border p-3 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl'}
              >
                <span className={(selected ? 'bg-blue-500 text-white' : done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-300') + ' grid h-9 w-9 place-items-center rounded-2xl text-xs font-semibold transition-transform group-hover:scale-105'}>
                  {done ? <Check className="h-4 w-4" /> : index + 1}
                </span>
                <p className="mt-3 text-sm font-semibold">{step.label}</p>
                <p className="mt-1 text-xs leading-5 opacity-75">{step.title}</p>
              </button>
            );
          })}
        </div>

        <aside className={'rounded-[2rem] border p-5 shadow-sm transition-all ' + toneClass}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-65">{active.label}</p>
          <h4 className="mt-2 text-2xl font-semibold tracking-tight">{active.title}</h4>
          <p className="mt-3 text-sm leading-6 opacity-85">{active.detail}</p>
          <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-sm font-semibold leading-6 text-white shadow-inner ring-1 ring-white/10">{active.command}</div>
          <p className="mt-4 rounded-2xl bg-white/78 p-3 text-sm font-semibold leading-6 shadow-sm dark:bg-slate-950/70">{active.result}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => setActiveStep((value) => Math.min(scenarioSteps.length - 1, value + 1))} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-500">
              Next step
            </button>
            <button onClick={() => setActiveStep(0)} className="rounded-full bg-white/82 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-white/70 transition-all hover:-translate-y-0.5 hover:bg-white dark:bg-slate-950/70 dark:text-slate-200 dark:ring-white/10">
              Reset
            </button>
            <button onClick={() => openPage(active.page)} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-100">
              Open related page
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}


function HumanSupportHeader({ setup }: { setup: LifeSetupState }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(239,246,255,0.72),rgba(250,244,232,0.88))] p-7 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.82),rgba(44,33,17,0.56))]">
      <div className="grid gap-7 xl:grid-cols-[1fr_420px] xl:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Person status</p>
          <h2 className="mt-3 text-5xl font-semibold tracking-tight text-slate-950 dark:text-white">{setup.preferredName || setup.firstName} Roberts</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {setup.supportMode}, {setup.mobility.toLowerCase()}, {setup.rhythm.toLowerCase()}.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoTile label="Environment" value={setup.livingSituation} />
          <InfoTile label="Continuity" value="Steady support" />
          <InfoTile label="Coverage" value="Family and caregiver connected" />
          <InfoTile label="Comfort" value="Gentle reminders" />
        </div>
      </div>
    </section>
  );
}

function SupportActionCard({ task }: { task: SupportTask }) {
  return (
    <article className="group rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 dark:hover:border-blue-300/30 dark:hover:bg-slate-900/80">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-950/65 dark:text-slate-200 dark:ring-1 dark:ring-white/10">{task.category}</span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{task.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">{task.reason}</p>
        </div>
        <div className="rounded-3xl bg-[#f7f5f1] p-4 text-sm text-slate-600 dark:bg-slate-950/50 dark:text-slate-300 lg:min-w-[260px]">
          <SummaryLine label="Responsible" value={task.assignedTo} />
          <SummaryLine label="Executor" value={task.executorType} />
          <SummaryLine label="Due" value={task.dueTime} />
          <SummaryLine label="Verification" value={task.verificationMethod} />
        </div>
      </div>
    </article>
  );
}

function NeedsAttentionPanel() {
  return (
    <aside className="rounded-[2rem] border border-amber-200 bg-amber-50/80 p-5 shadow-sm backdrop-blur-xl dark:border-amber-300/25 dark:bg-slate-950/72 dark:ring-1 dark:ring-amber-300/15">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-slate-950/80 dark:text-amber-100 dark:ring-1 dark:ring-amber-300/25">
          <AlertCircle className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-200">Needs Attention</p>
          <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">3 open items</h3>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {attentionItems.map((item) => (
          <div key={item} className="border-l-4 border-amber-300 rounded-3xl bg-white/86 p-4 text-sm leading-6 text-slate-700 shadow-sm dark:border-amber-300/45 dark:bg-slate-950/65 dark:text-slate-200 dark:ring-1 dark:ring-amber-300/15">
            {item}
          </div>
        ))}
      </div>
    </aside>
  );
}

function VerifiedTimelineCompact() {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl transition-all hover:border-blue-200 dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 dark:hover:border-blue-300/30">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Verified Human Support Timeline</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">What already happened</h2>
      <div className="mt-6 space-y-3">
        {verifiedActions.slice(0, 4).map((event) => (
          <VerifiedActionCard key={`${event.time}-${event.action}`} event={event} />
        ))}
      </div>
    </section>
  );
}

function VerifiedActionCard({ event }: { event: VerifiedAction }) {
  return (
    <div className="grid gap-3 rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/60 sm:grid-cols-[70px_1fr_auto] sm:items-center">
      <span className="rounded-full bg-white px-3 py-1 text-center text-sm font-semibold text-slate-500 shadow-sm dark:bg-slate-950/75 dark:text-slate-200 dark:ring-1 dark:ring-white/10">{event.time}</span>
      <div>
        <p className="font-semibold text-slate-950 dark:text-white">{event.action}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Confirmed by {event.confirmedBy} through {event.method.toLowerCase()}.
        </p>
      </div>
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-slate-950/70 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/25">{event.status}</span>
    </div>
  );
}

function NextSupportWindow() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-sm dark:border-white/10">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute -bottom-12 left-8 h-28 w-40 rounded-full bg-amber-300/16 blur-3xl" />
      <div className="relative">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">Next support window</p>
      <h3 className="mt-4 text-3xl font-semibold tracking-tight">Rest period check</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">15:00, Daniel Roberts, family confirmed.</p>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-blue-300 to-amber-300" />
      </div>
      <p className="mt-4 text-sm text-slate-300">Support continuity is steady. Confirmation will update the timeline.</p>
      </div>
    </section>
  );
}

function DualModeArchitecture() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Dual Operational Architecture"
        title="SAVEN works with BioMath Core or independently."
        text="Connected Mode uses BioMath Core for deeper human understanding. Autonomous Mode keeps SAVEN functional with built-in support logic, workflows, environment rules, verification, and robotics-ready execution."
      />

      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1726]/88">
        <div className="grid gap-5 xl:grid-cols-[1fr_300px_1fr] xl:items-stretch">
          <ModePanel
            title="BioMath Connected SAVEN"
            eyebrow="Connected Mode"
            text="BioMath Core provides physiological patterns, behavior context, recovery patterns, adaptive thresholds, and personalized support recommendations."
            status="BioMath signal active"
            items={['Biological trends', 'Recovery context', 'Adaptive routines', 'Escalation indicators', 'Continuity intelligence']}
            tone="blue"
          />
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-xl dark:border-white/10">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-400/24 blur-3xl" />
            <div className="absolute -bottom-12 left-8 h-32 w-32 rounded-full bg-amber-300/18 blur-3xl" />
            <div className="relative flex h-full flex-col justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">Shared Core</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight">SAVEN Execution System</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">One operational core supports both modes.</p>
              </div>
              <div className="space-y-2">
                {['Execution engine', 'Verification engine', 'Timeline', 'Access system', 'Device layer', 'Robot layer'].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-semibold text-slate-100">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ModePanel
            title="Autonomous SAVEN"
            eyebrow="Standalone Mode"
            text="SAVEN generates support tasks from profile, environment, rhythm, availability, predefined workflows, and verification requirements without BioMath Core."
            status="Standalone support ready"
            items={['Support templates', 'Environment rules', 'Recovery workflows', 'Caregiver coordination', 'Robot orchestration']}
            tone="gold"
          />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Human to Reality Flow</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Insight becomes verified support.</h3>
            </div>
            <StatusPill tone="green" label="Operational continuity" />
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-5">
            {['Human Understanding', 'Support Coordination', 'Real World Execution', 'Verification', 'Continuity State'].map((step, index) => (
              <div key={step} className="group min-h-[145px] rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-lg dark:border-white/10 dark:bg-slate-950/60 dark:hover:border-blue-300/30 dark:hover:bg-slate-900/80">
                <div className="flex items-center justify-between gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-950 text-xs font-semibold text-white ring-1 ring-slate-900/10 dark:bg-slate-950/75 dark:text-blue-100 dark:ring-blue-300/20">{index + 1}</span>
                  <span className="h-1.5 w-10 rounded-full bg-gradient-to-r from-blue-300 to-amber-300 opacity-70" />
                </div>
                <p className="mt-4 text-sm font-semibold leading-5 text-slate-950 dark:text-slate-100 group-[.is-active]:dark:text-white">{step}</p>
              </div>
            ))}
          </div>
        </div>
        <ContinuityEnginePanel />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <ArchitectureSeparationPanel />
        <AutonomousSupportEnginePanel />
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Built-in Support Templates</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Autonomous support profiles are ready without BioMath Core.</h3>
          </div>
          <StatusPill tone="gold" label="Autonomous engine" />
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-4">
          {autonomousSupportTemplates.map((template) => (
            <article key={template.name} className="rounded-3xl border border-slate-100 bg-[#f7f5f1] p-5 transition-all hover:-translate-y-0.5 hover:border-amber-200 hover:bg-white hover:shadow-lg dark:border-white/10 dark:bg-slate-950/50 dark:hover:border-amber-300/25 dark:hover:bg-slate-900/80">
              <h4 className="text-xl font-semibold text-slate-950 dark:text-white">{template.name}</h4>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{template.workflow}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {template.tasks.slice(0, 3).map((task) => (
                  <span key={task} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-950/65 dark:text-slate-200 dark:ring-1 dark:ring-white/10">{task}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <LayeredPanel title="Robot orchestration" text="Robots are physical executors and telemetry providers, not the intelligence center." items={['Safety check', 'Capability match', 'Environment permission', 'Telemetry verification']} />
        <LayeredPanel title="Environment orchestration" text="Rules define what support can happen in home, recovery, senior care, assisted living, and clinic environments." items={['Permissions', 'Connected devices', 'Escalation chain', 'Restricted actions']} />
        <LayeredPanel title="Demo mode" text="Investor and partner demos show a complete operational support environment." items={demoScenarios} />
      </section>

      <SupportFlowGraphic current="Verification Received" />
    </div>
  );
}

function ModePanel({
  eyebrow,
  title,
  text,
  status,
  items,
  tone,
}: {
  eyebrow: string;
  title: string;
  text: string;
  status: string;
  items: string[];
  tone: 'blue' | 'gold';
}) {
  const toneClass =
    tone === 'gold'
      ? 'from-amber-50 via-white to-white text-amber-800 dark:from-slate-950/90 dark:via-amber-950/40 dark:to-slate-950/70 dark:text-amber-100'
      : 'from-blue-50 via-white to-white text-blue-800 dark:from-slate-950/90 dark:via-blue-950/42 dark:to-slate-950/70 dark:text-blue-100';

  return (
    <article className={`rounded-[2rem] border border-white/70 bg-gradient-to-br ${toneClass} p-6 shadow-sm dark:border-white/10`}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-75">{eyebrow}</p>
      <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{text}</p>
      <div className="mt-5 rounded-3xl bg-white/68 p-4 text-sm font-semibold text-slate-800 shadow-sm dark:bg-slate-950/70 dark:text-slate-100 dark:ring-1 dark:ring-white/10">{status}</div>
      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-white/78 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm dark:bg-slate-950/65 dark:text-slate-200 dark:ring-1 dark:ring-white/10">
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}

function ContinuityEnginePanel() {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Continuity Engine</p>
      <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Operational stability, not medical scoring.</h3>
      <div className="mt-5 space-y-3">
        {continuityFactors.map((factor) => (
          <div key={factor.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-3xl border border-slate-100 bg-[#f7f5f1] px-4 py-3 dark:border-white/10 dark:bg-slate-950/50">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{factor.label}</span>
            <StatusPill tone={factor.tone as 'blue' | 'gold' | 'green'} label={factor.value} />
          </div>
        ))}
      </div>
    </section>
  );
}

function ArchitectureSeparationPanel() {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Intelligence Separation</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-blue-50 p-5 dark:bg-slate-950/70 dark:ring-1 dark:ring-blue-300/15">
          <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">BioMath Core</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Biological understanding, predictive modeling, physiological analysis, dynamic interpretation.</p>
        </div>
        <div className="rounded-3xl bg-amber-50 p-5 dark:bg-slate-950/70 dark:ring-1 dark:ring-amber-300/15">
          <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">SAVEN</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Operational coordination, task execution, verification, environments, access, devices, robotics orchestration.</p>
        </div>
      </div>
    </section>
  );
}

function AutonomousSupportEnginePanel() {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Autonomous Support Engine</p>
      <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Task generation from real-life context.</h3>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {['Age group', 'Support mode', 'Mobility level', 'Environment', 'Recovery type', 'Support goals', 'Daily rhythm', 'Caregiver availability', 'Device availability', 'Robot availability'].map((item) => (
          <div key={item} className="rounded-2xl border border-slate-100 bg-[#f7f5f1] px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-200">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

function SupportFlowPage() {
  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Support Flow" title="Support is actively happening." text="SAVEN visualizes the path from detected need to verified continuity. The same execution flow works in Connected Mode and Autonomous Mode." />
      <div className="grid gap-5 lg:grid-cols-2">
        <LayeredPanel title="Connected source" text="BioMath Core sends insight, recommendation, support need, priority, and adaptive threshold context." items={['BioMath signal', 'Human model context', 'Recovery pattern', 'Personal threshold']} />
        <LayeredPanel title="Autonomous source" text="SAVEN creates support tasks from profile, workflow templates, environment rules, availability, and verification requirements." items={['Support profile', 'Built-in workflow', 'Environment rule', 'Continuity state']} />
      </div>
      <SupportFlowGraphic current="Assigned to Person / Device / Robot" />
      <div className="grid gap-5 lg:grid-cols-3">
        <LayeredPanel title="Need detected" text="BioMath Core sends a structured support signal." items={['Hydration', 'Mobility', 'Recovery', 'Safety']} />
        <LayeredPanel title="Responsibility assigned" text="SAVEN selects a person, device, robot, or environment system." items={['Caregiver first', 'Family fallback', 'Device readiness', 'Robot safety']} />
        <LayeredPanel title="Reality verified" text="The result is confirmed before continuity updates." items={['Human confirmation', 'Sensor signal', 'Robot telemetry', 'Timeline event']} />
      </div>
    </div>
  );
}

function SupportFlowGraphic({ current }: { current: string }) {
  const steps = ['Need Detected', 'Support Task Created', 'Assigned to Person / Device / Robot', 'Action Performed', 'Verification Received', 'Continuity Updated'];
  const currentIndex = steps.indexOf(current);

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1726]/88">
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {steps.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <div
              key={step}
              className={`group min-h-[130px] rounded-3xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg ${active ? 'is-active' : ''} ${
                active ? 'border-blue-300 bg-blue-50 ring-1 ring-blue-200 dark:border-blue-300/50 dark:bg-slate-950 dark:text-blue-50 dark:ring-blue-300/35 dark:shadow-lg dark:shadow-blue-950/30' : done ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-300/25 dark:bg-slate-950/65 dark:ring-1 dark:ring-emerald-300/15' : 'border-slate-100 bg-[#f7f5f1] dark:border-white/10 dark:bg-slate-950/60'
              }`}
            >
              <div
                className={`grid h-8 w-8 place-items-center rounded-xl shadow-sm transition-transform group-hover:scale-105 ${
                  active ? 'bg-blue-600 text-white shadow-blue-500/30 dark:bg-blue-600 dark:text-white dark:ring-1 dark:ring-blue-200/40' : done ? 'bg-emerald-600 text-white shadow-emerald-500/30 dark:bg-slate-950/80 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/25' : 'bg-slate-200 text-slate-500 dark:bg-slate-950/65 dark:text-slate-300 dark:ring-1 dark:ring-white/10'
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : active ? <Activity className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
              </div>
              <p className="mt-4 text-sm font-semibold leading-5 text-slate-950 dark:text-slate-100 group-[.is-active]:dark:text-white">{step}</p>
              {active && <p className="mt-3 inline-flex w-fit rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800 ring-1 ring-blue-200 dark:bg-slate-900 dark:text-blue-100 dark:ring-blue-300/35">Active now</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}


function CareContactNetwork({ compact = false }: { compact?: boolean }) {
  const contacts = [
    {
      role: 'Doctor',
      name: 'Dr. Elena Morris',
      availability: 'Clinic hours',
      trigger: 'Recovery plan change, medication concern, high-risk verification',
      action: 'Send clinical summary',
      tone: 'blue',
      icon: ShieldCheck,
    },
    {
      role: 'Nurse',
      name: 'Nurse Olivia Grant',
      availability: 'Daily check-in',
      trigger: 'Routine recovery question, wound care note, mobility concern',
      action: 'Request nurse follow-up',
      tone: 'green',
      icon: HeartPulse,
    },
    {
      role: 'Emergency',
      name: 'Emergency services',
      availability: 'Urgent only',
      trigger: 'Fall risk, acute distress, unresolved safety event',
      action: 'Escalate emergency path',
      tone: 'red',
      icon: AlertCircle,
    },
    {
      role: 'Family',
      name: 'Daniel Roberts',
      availability: 'Family fallback',
      trigger: 'Missed confirmation, evening digest, caregiver unavailable',
      action: 'Send family update',
      tone: 'gold',
      icon: UsersRound,
    },
  ];

  const escalationSteps = [
    { label: 'Routine', target: 'Family or nurse', time: 'Same day' },
    { label: 'Care concern', target: 'Nurse then doctor', time: 'Priority window' },
    { label: 'Clinical review', target: 'Doctor', time: 'Before plan change' },
    { label: 'Emergency', target: 'Emergency services', time: 'Immediate' },
  ];

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.22),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_74%_86%,rgba(249,115,22,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(239,246,255,0.78),rgba(255,247,237,0.72))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.28),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(16,185,129,0.13),transparent_28%),radial-gradient(circle_at_74%_86%,rgba(249,115,22,0.12),transparent_28%),linear-gradient(135deg,rgba(4,10,20,0.98),rgba(10,22,40,0.9),rgba(33,22,10,0.68))] dark:ring-1 dark:ring-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Care connection network</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Doctor, nurse, emergency, and family are connected by clear escalation rules.</h3>
          {!compact && <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">SAVEN should never blur normal support with emergency response. This layer shows who gets contacted, when, and what information is sent.</p>}
        </div>
        <StatusPill tone="green" label="Care contacts ready" />
      </div>

      <div className={'mt-6 grid gap-4 ' + (compact ? 'lg:grid-cols-4' : 'xl:grid-cols-[minmax(0,1fr)_360px]')}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {contacts.map((contact) => {
            const Icon = contact.icon;
            const tone = contact.tone === 'red'
              ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-300/25 dark:bg-red-500/10 dark:text-red-100'
              : contact.tone === 'green'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100'
                : contact.tone === 'gold'
                  ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100'
                  : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
            return (
              <article key={contact.role} className={'group rounded-3xl border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ' + tone}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-65">{contact.role}</p>
                    <h4 className="mt-2 text-xl font-semibold">{contact.name}</h4>
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/82 shadow-sm ring-1 ring-white/70 transition-transform group-hover:scale-105 dark:bg-slate-950/70 dark:ring-white/10">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <p className="mt-4 rounded-full bg-white/82 px-3 py-1 text-xs font-semibold shadow-sm dark:bg-slate-950/70">{contact.availability}</p>
                {!compact && <p className="mt-4 text-sm leading-6 opacity-85">{contact.trigger}</p>}
                <button className="mt-4 w-full rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-100">
                  {contact.action}
                </button>
              </article>
            );
          })}
        </div>

        {!compact && (
          <aside className="rounded-[2rem] border border-white/10 bg-slate-950 p-5 text-white shadow-xl shadow-slate-950/20">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">Escalation ladder</p>
            <div className="mt-5 space-y-3">
              {escalationSteps.map((step, index) => (
                <div key={step.label} className="grid grid-cols-[38px_minmax(0,1fr)] gap-3 rounded-3xl border border-white/10 bg-white/[0.06] p-3">
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-orange-400 text-sm font-semibold text-white">{index + 1}</span>
                  <div>
                    <p className="font-semibold text-white">{step.label}</p>
                    <p className="mt-1 text-sm text-slate-300">{step.target}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-3xl bg-red-500/10 p-4 text-sm leading-6 text-red-100 ring-1 ring-red-300/20">
              Emergency path is visual only in this development version. No real emergency service, phone, SMS, or medical system is connected.
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}


function SupportProfile({ setup, openPage }: { setup: LifeSetupState; openPage: (pageId: SavenPageId) => void }) {
  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Human Support Profile" title={`${setup.preferredName || setup.firstName} Roberts`} text="A life-support profile that describes the daily support context without becoming a medical chart." />
      <div className="grid gap-5 lg:grid-cols-3">
        <LayeredPanel title="Support mode" text={setup.supportMode} items={['Daily rhythm: ' + setup.rhythm, 'Mobility support: ' + setup.mobility, 'Environment: ' + setup.livingSituation]} />
        <LayeredPanel title="Family connection" text="Support circle is connected and ready." items={['Daniel Roberts', 'Maya Carter', 'Home Recovery']} />
        <LayeredPanel title="Technology comfort" text={setup.technologyComfort} items={['Device comfort visible', 'Robot comfort cautious', 'Preferred reminders: ' + setup.communication]} />
      </div>
      <button onClick={() => openPage('app-today')} className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">
        Open Today's Support
      </button>
    </div>
  );
}

function HumanSupportTimeline() {
  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Support Timeline" title="Real history of support and care continuity." text="This timeline is not an audit log. It shows verified actions in plain human language." />
      <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
        <div className="space-y-4">
          {verifiedActions.map((event) => (
            <VerifiedActionCard key={`${event.time}-${event.action}`} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}

function SupportCircle() {
  const systemNodes = [
    { label: 'Anna Roberts', type: 'Supported person', icon: UserRound, tone: 'blue', pos: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', active: true },
    { label: 'SAVEN', type: 'Coordinator', icon: Activity, tone: 'saven', pos: 'left-1/2 top-[10%] -translate-x-1/2', active: true },
    { label: 'Daniel Roberts', type: 'Family', icon: UsersRound, tone: 'blue', pos: 'left-[7%] top-[22%]' },
    { label: 'Maya Carter', type: 'Caregiver', icon: HeartPulse, tone: 'green', pos: 'right-[7%] top-[23%]' },
    { label: 'Recovery Clinic', type: 'Provider', icon: Building2, tone: 'gold', pos: 'left-[9%] bottom-[18%]' },
    { label: 'Wearable', type: 'Device', icon: Watch, tone: 'blue', pos: 'right-[10%] bottom-[20%]' },
    { label: 'Home', type: 'Environment', icon: Home, tone: 'green', pos: 'left-1/2 bottom-[8%] -translate-x-1/2' },
    { label: 'Robot R1', type: 'Robot', icon: Bot, tone: 'gold', pos: 'right-[32%] top-[67%]' },
    { label: 'Verification', type: 'Reality check', icon: ShieldCheck, tone: 'green', pos: 'left-[32%] top-[66%]' },
  ];

  const processSteps = [
    { label: 'Need', text: 'Support need appears', tone: 'blue' },
    { label: 'Assign', text: 'Person, device, or robot receives task', tone: 'gold' },
    { label: 'Act', text: 'Support action happens', tone: 'green' },
    { label: 'Verify', text: 'Reality is confirmed', tone: 'blue' },
    { label: 'Continue', text: 'Timeline updates', tone: 'green' },
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Support Circle" title="Who is helping this person?" text="The relationship map shows people, devices, robots, environments, and verification moving around one supported person." />
      <section className="relative min-h-[700px] overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_24%_18%,rgba(59,130,246,0.24),transparent_28%),radial-gradient(circle_at_78%_22%,rgba(16,185,129,0.2),transparent_28%),radial-gradient(circle_at_50%_92%,rgba(245,158,11,0.28),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(235,245,255,0.82),rgba(255,247,226,0.78))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_24%_18%,rgba(59,130,246,0.32),transparent_30%),radial-gradient(circle_at_80%_24%,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_50%_92%,rgba(245,158,11,0.16),transparent_30%),linear-gradient(135deg,rgba(6,14,28,0.98),rgba(11,25,43,0.94),rgba(33,25,14,0.74))]">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(59,130,246,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.12)_1px,transparent_1px)] [background-size:48px_48px] dark:opacity-30" />

        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {[
            'M50 18 C34 22 24 30 17 40',
            'M50 18 C66 22 76 30 83 40',
            'M50 50 C33 48 22 56 15 72',
            'M50 50 C66 48 78 56 85 72',
            'M50 50 C48 62 48 76 50 88',
            'M50 50 C44 58 38 62 32 70',
            'M50 50 C58 58 64 62 68 70',
          ].map((path, index) => (
            <g key={path}>
              <path d={path} fill="none" stroke={index % 2 ? 'rgba(16,185,129,0.5)' : 'rgba(59,130,246,0.52)'} strokeWidth="0.38" strokeLinecap="round" strokeDasharray="1.4 1.1" className="animate-pulse" />
              <circle r="0.72" fill={index % 2 ? '#34d399' : '#60a5fa'} opacity="0.92">
                <animateMotion dur={(4.2 + index * 0.28) + 's'} repeatCount="indefinite" path={path} />
              </circle>
              <circle r="0.38" fill={index % 2 ? '#f59e0b' : '#f97316'} opacity="0.78">
                <animateMotion dur={(5.4 + index * 0.32) + 's'} repeatCount="indefinite" path={path} begin={(index * 0.25) + 's'} />
              </circle>
            </g>
          ))}
        </svg>

        <div className="absolute inset-12 rounded-full border border-blue-200/70 dark:border-blue-300/15" />
        <div className="absolute inset-24 rounded-full border border-emerald-200/70 dark:border-emerald-300/15" />
        <div className="absolute inset-36 animate-pulse rounded-full border border-amber-200/80 dark:border-amber-300/20" />

        {systemNodes.map((node, index) => {
          const Icon = node.icon;
          const toneClass =
            node.tone === 'saven'
              ? 'from-slate-950 via-blue-950 to-slate-950 text-white ring-blue-300/35 shadow-blue-950/30'
              : node.tone === 'green'
                ? 'from-emerald-50 to-white text-emerald-800 ring-emerald-200 dark:from-slate-950/95 dark:to-emerald-950/58 dark:text-emerald-100 dark:ring-emerald-300/25'
                : node.tone === 'gold'
                  ? 'from-amber-50 to-white text-amber-800 ring-amber-200 dark:from-slate-950/95 dark:to-amber-950/58 dark:text-amber-100 dark:ring-amber-300/25'
                  : 'from-blue-50 to-white text-blue-800 ring-blue-200 dark:from-slate-950/95 dark:to-blue-950/58 dark:text-blue-100 dark:ring-blue-300/25';

          return (
            <div key={node.label} className={'group absolute z-10 ' + node.pos} style={{ animationDelay: index * 120 + 'ms' }}>
              <div className={'relative min-w-[170px] rounded-3xl border border-white/80 bg-gradient-to-br p-4 shadow-lg ring-1 transition-all hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 ' + toneClass}>
                {node.active && <span className="absolute -right-1 -top-1 h-4 w-4 animate-ping rounded-full bg-emerald-400/70" />}
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/78 shadow-sm ring-1 ring-white/80 transition-transform group-hover:scale-110 dark:bg-slate-950/80 dark:ring-white/20">
                    {node.tone === 'saven' ? <img src="/saven-mark.png" alt="" className="h-full w-full rounded-2xl object-cover" /> : <Icon className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-100">{node.label}</p>
                    <p className="mt-1 truncate text-xs uppercase tracking-[0.16em] opacity-70">{node.type}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <CirclePermissionsMatrix />

      <section className="grid gap-3 md:grid-cols-5">
        {processSteps.map((step, index) => {
          const tone = step.tone === 'green' ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100' : step.tone === 'gold' ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100' : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
          return (
            <div key={step.label} className={'rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ' + tone}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{step.label}</p>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white/70 text-xs font-semibold dark:bg-slate-950/70">{index + 1}</span>
              </div>
              <p className="mt-3 text-sm leading-6 opacity-80">{step.text}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function DeviceReadiness() {
  const gatewaySignals = [
    { signal: 'Hydration confirmation', source: 'Smart hydration sensor', task: 'Morning hydration check', confidence: 'Strong', tone: 'green' },
    { signal: 'Mobility trend', source: 'Wearable recovery tracker', task: 'Assisted walking session', confidence: 'Supportive', tone: 'blue' },
    { signal: 'Rest window presence', source: 'Bed presence sensor', task: 'Rest period check', confidence: 'Standby', tone: 'gold' },
    { signal: 'Stability telemetry', source: 'Mobility support device', task: 'Walking support fallback', confidence: 'Needs maintenance', tone: 'gold' },
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Device Readiness" title="Devices are the verification gateway for real-world support." text="Devices do not make care decisions. They confirm signals, support continuity, and give SAVEN enough reality context to keep people, robots, and environments aligned." />
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-5 lg:grid-cols-2">
          {devices.map((device) => (
            <ReadinessCard key={device.name} title={device.name} subtitle={device.type} status={device.status} lines={[device.environment, device.telemetry]} items={device.capabilities} />
          ))}
        </div>
        <div className="rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 dark:border-white/10 dark:ring-1 dark:ring-blue-300/20">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">Device Gateway</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight">Signals become proof, not noise.</h3>
          <div className="mt-6 space-y-3">
            <SummaryLine label="Device role" value="Verification support" />
            <SummaryLine label="Decision authority" value="Human + policy" />
            <SummaryLine label="Robot bridge" value="Telemetry only" />
            <SummaryLine label="Continuity update" value="After verification" />
          </div>
        </div>
      </section>
      <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Live signal routing</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Which device signal supports which task?</h3>
          </div>
          <StatusPill tone="green" label="Gateway active" />
        </div>
        <div className="mt-6 grid gap-3">
          {gatewaySignals.map((signal) => {
            const tone = signal.tone === 'green' ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100' : signal.tone === 'gold' ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100' : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
            return (
              <div key={signal.signal} className={'grid gap-3 rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg md:grid-cols-[1fr_1fr_1fr_150px] md:items-center ' + tone}>
                <p className="font-semibold">{signal.signal}</p>
                <p className="text-sm opacity-80">{signal.source}</p>
                <p className="text-sm font-semibold">{signal.task}</p>
                <span className="rounded-full bg-white/82 px-3 py-1 text-center text-xs font-semibold shadow-sm dark:bg-slate-950/70">{signal.confidence}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function RobotReadiness() {
  const robotServices = [
    { label: 'Mobility transfer', detail: 'Assistive robot plus caregiver approval', tone: 'blue', icon: Bot },
    { label: 'Telemetry bridge', detail: 'Robot data, wearable state, room sensor context', tone: 'green', icon: Radar },
    { label: 'Environment rules', detail: 'Doors, lights, bed, lift, charging zone', tone: 'gold', icon: Home },
    { label: 'Verification loop', detail: 'Human confirmation plus robot/device telemetry', tone: 'blue', icon: ShieldCheck },
  ];

  const connectionLayers = [
    { from: 'SAVEN', to: 'Humanoid Robot', mode: 'Task command', state: 'Human approved', color: 'blue' },
    { from: 'Humanoid Robot', to: 'Wearable', mode: 'Telemetry sync', state: 'Live', color: 'green' },
    { from: 'Mobility Base', to: 'Smart Bed', mode: 'Physical support', state: 'Ready', color: 'gold' },
    { from: 'Room Sensors', to: 'Verification', mode: 'Reality check', state: 'Strong', color: 'blue' },
    { from: 'Caregiver', to: 'Robot R1', mode: 'Override and pause', state: 'Required', color: 'green' },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-[radial-gradient(circle_at_18%_22%,rgba(59,130,246,0.35),transparent_28%),radial-gradient(circle_at_72%_18%,rgba(249,115,22,0.26),transparent_30%),radial-gradient(circle_at_82%_88%,rgba(16,185,129,0.22),transparent_30%),linear-gradient(135deg,#f8fbff,#eaf3ff_42%,#fff4e8)] p-6 shadow-xl shadow-blue-950/8 dark:border-white/10 dark:bg-[radial-gradient(circle_at_18%_22%,rgba(59,130,246,0.36),transparent_30%),radial-gradient(circle_at_72%_18%,rgba(249,115,22,0.22),transparent_32%),radial-gradient(circle_at_82%_88%,rgba(16,185,129,0.18),transparent_30%),linear-gradient(135deg,#020817,#08182d_52%,#201205)]">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(59,130,246,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.14)_1px,transparent_1px)] [background-size:38px_38px] dark:opacity-35" />
        <div className="relative grid gap-7 xl:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] xl:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700 dark:text-blue-200">Robotic Execution Layer</p>
            <h2 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-6xl">Robots become safe physical endpoints for SAVEN.</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-300">Humanoid robots, mobility systems, room devices, wearables, and verification services are connected by one support command layer. SAVEN keeps every physical action permissioned, visible, and verified.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {['Human approval', 'Device sync', 'Verified action'].map((item, index) => (
                <div key={item} className="rounded-3xl border border-white/70 bg-white/76 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/60 dark:ring-1 dark:ring-white/10">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Layer {index + 1}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950 dark:text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_18%,rgba(59,130,246,0.34),transparent_30%),radial-gradient(circle_at_72%_68%,rgba(249,115,22,0.32),transparent_32%),linear-gradient(135deg,#020617,#0f172a_55%,#111827)]" />
            <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(96,165,250,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {['M50 14 C30 24 22 45 30 66', 'M50 14 C70 24 78 45 70 66', 'M30 66 C42 78 58 78 70 66', 'M50 28 C50 46 50 64 50 82'].map((path, index) => (
                <g key={path}>
                  <path d={path} fill="none" stroke={index % 2 ? 'rgba(249,115,22,0.54)' : 'rgba(96,165,250,0.58)'} strokeWidth="0.42" strokeDasharray="1.4 1.2" />
                  <circle r="0.8" fill={index % 2 ? '#fb923c' : '#60a5fa'}>
                    <animateMotion dur={(3.8 + index * 0.35) + 's'} repeatCount="indefinite" path={path} />
                  </circle>
                </g>
              ))}
            </svg>
            <div className="relative mx-auto mt-4 flex h-[360px] max-w-[360px] items-center justify-center">
              <div className="absolute h-72 w-72 animate-pulse rounded-full border border-blue-300/20" />
              <div className="absolute h-52 w-52 rounded-full border border-orange-300/20" />
              <div className="relative grid h-52 w-40 place-items-center rounded-[3rem] border border-blue-300/30 bg-gradient-to-br from-slate-800 via-slate-950 to-blue-950 shadow-2xl shadow-blue-950/40">
                <div className="absolute -top-12 h-24 w-24 rounded-[2rem] border border-blue-300/30 bg-gradient-to-br from-slate-700 to-slate-950 shadow-xl">
                  <div className="mx-auto mt-8 h-2 w-12 rounded-full bg-blue-300 shadow-[0_0_18px_rgba(96,165,250,0.9)]" />
                </div>
                <div className="absolute -left-14 top-16 h-32 w-8 rotate-12 rounded-full bg-gradient-to-b from-blue-400 to-slate-900 shadow-lg shadow-blue-950/40" />
                <div className="absolute -right-14 top-16 h-32 w-8 -rotate-12 rounded-full bg-gradient-to-b from-orange-400 to-slate-900 shadow-lg shadow-orange-950/40" />
                <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-blue-500 via-slate-950 to-orange-500 ring-1 ring-white/10">
                  <img src="/saven-mark.png" alt="" className="h-20 w-20 rounded-full object-cover" />
                </div>
                <div className="absolute -bottom-14 flex gap-5">
                  <span className="h-20 w-9 rounded-full bg-gradient-to-b from-slate-700 to-blue-950" />
                  <span className="h-20 w-9 rounded-full bg-gradient-to-b from-slate-700 to-orange-950" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {robotServices.map((service) => {
          const Icon = service.icon;
          const tone = service.tone === 'green' ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100' : service.tone === 'gold' ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100' : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
          return (
            <article key={service.label} className={'rounded-3xl border p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl ' + tone}>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/78 shadow-sm dark:bg-slate-950/70">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="text-lg font-semibold">{service.label}</h3>
              </div>
              <p className="mt-4 text-sm leading-6 opacity-80">{service.detail}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Robot connection services</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Every robot is connected to devices, people, environment, and verification.</h3>
          <div className="mt-6 space-y-3">
            {connectionLayers.map((layer) => {
              const dot = layer.color === 'green' ? 'bg-emerald-500' : layer.color === 'gold' ? 'bg-amber-500' : 'bg-blue-500';
              return (
                <div key={layer.from + layer.to} className="grid gap-3 rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-white/10 dark:bg-slate-900 md:grid-cols-[1fr_auto_1fr_120px] md:items-center">
                  <p className="font-semibold text-slate-950 dark:text-white">{layer.from}</p>
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400"><span className={'h-2 w-2 rounded-full ' + dot} />{layer.mode}</span>
                  <p className="font-semibold text-slate-950 dark:text-white">{layer.to}</p>
                  <span className="rounded-full bg-white px-3 py-1 text-center text-xs font-semibold text-slate-700 ring-1 ring-slate-100 dark:bg-slate-950 dark:text-slate-200 dark:ring-white/10">{layer.state}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 dark:border-white/10 dark:ring-1 dark:ring-blue-300/20">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">Physical orchestration</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight">SAVEN never lets robots become independent care decision makers.</h3>
          <div className="mt-6 grid gap-3">
            <SummaryLine label="Command source" value="SAVEN task layer" />
            <SummaryLine label="Physical action" value="Human approval required" />
            <SummaryLine label="Telemetry" value="Robot + device + room" />
            <SummaryLine label="Continuity" value="Verified before update" />
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        {robots.map((robot) => (
          <article key={robot.name} className="group rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 dark:hover:border-blue-300/30 dark:hover:bg-slate-900/80">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{robot.model}</p>
                <h3 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{robot.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{robot.capability}</p>
              </div>
              <RobotBadge status={robot.readiness} />
            </div>
            <div className="mt-5 rounded-3xl bg-[#f7f5f1] p-4 text-sm text-slate-600 dark:bg-slate-950/50 dark:text-slate-300">
              <SummaryLine label="Current assignment" value={robot.assignment} />
              <SummaryLine label="Safe execution" value="Human approval required" />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {robot.limits.map((limit) => (
                <span key={limit} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-slate-950/70 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25">{limit}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function EnvironmentSystem() {
  const environmentRules = [
    { zone: 'Bedroom', allowed: 'Rest checks, bed sensor, quiet voice', restricted: 'Robot physical action at night', tone: 'blue' },
    { zone: 'Hallway', allowed: 'Walking support, wearable confirmation', restricted: 'No robot assist without caregiver', tone: 'green' },
    { zone: 'Kitchen', allowed: 'Hydration prompt, family check', restricted: 'No medication assumption', tone: 'gold' },
    { zone: 'Clinic handoff', allowed: 'Provider note, recovery plan sync', restricted: 'No family digest without privacy rule', tone: 'blue' },
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Care Environment" title="Home Recovery has one support logic." text="People, devices, robots, rules, and escalation chain are managed together without becoming a hospital dashboard." />
      <CareContactNetwork />
      <section className="grid gap-5 lg:grid-cols-3">
        <LayeredPanel title="Connected people" text="Family and caregiver coverage is active." items={['Anna Roberts', 'Daniel Roberts', 'Maya Carter']} />
        <LayeredPanel title="Connected systems" text="Devices and robots are scoped to Home Recovery." items={['Smart hydration sensor', 'Wearable tracker', 'SAVEN Assist R1']} />
        <LayeredPanel title="Escalation chain" text="Unresolved items move through calm responsibility levels." items={['Assigned helper', 'Family', 'Support provider', 'Environment admin']} />
      </section>
      <section className="rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_15%_18%,rgba(59,130,246,0.2),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(16,185,129,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(239,246,255,0.78),rgba(255,247,237,0.72))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_15%_18%,rgba(59,130,246,0.24),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(16,185,129,0.12),transparent_28%),linear-gradient(135deg,rgba(4,10,20,0.98),rgba(10,22,40,0.9),rgba(33,22,10,0.7))] dark:ring-1 dark:ring-white/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Environment permissions</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Rules change by room, risk, and available helper.</h3>
          </div>
          <StatusPill tone="blue" label="Home Recovery" />
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-4">
          {environmentRules.map((rule) => {
            const tone = rule.tone === 'green' ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100' : rule.tone === 'gold' ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100' : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
            return (
              <article key={rule.zone} className={'rounded-3xl border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ' + tone}>
                <h4 className="text-xl font-semibold">{rule.zone}</h4>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] opacity-65">Allowed</p>
                <p className="mt-2 text-sm leading-6 opacity-85">{rule.allowed}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] opacity-65">Restricted</p>
                <p className="mt-2 text-sm leading-6 opacity-85">{rule.restricted}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function RecoveryMode() {
  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Recovery Mode" title="Simplified support for recovery." text="Recovery mode reduces cognitive load, prioritizes the next action, and tracks verified progression." />
      <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Current recovery action</p>
            <h3 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">Assisted walking session</h3>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">Maya Carter is responsible. Confirmation is required before continuity updates.</p>
          </div>
          <div className="rounded-3xl bg-emerald-50 p-5 text-emerald-800 dark:bg-slate-950/70 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/20">
            <p className="text-sm font-semibold">Verified progression</p>
            <p className="mt-4 text-5xl font-semibold">4</p>
            <p className="mt-2 text-sm">confirmed recovery actions today</p>
          </div>
        </div>
      </section>
      <SupportFlowGraphic current="Action Performed" />
      <EmergencyEscalationCenter compact />
    </div>
  );
}

function VerificationCenter() {
  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Verification Center" title="Reality confirmed, not assumed." text="SAVEN shows what was verified, by whom, how, when, confidence, and what still needs review." />
      <EmergencyEscalationCenter />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          {verifiedActions.map((event) => (
            <VerifiedActionCard key={`${event.time}-${event.action}`} event={event} />
          ))}
        </section>
        <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl transition-all hover:border-amber-200 dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 dark:hover:border-amber-300/30">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Unresolved actions</p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">1 needs review</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Medication support confirmation is waiting for caregiver confirmation.</p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-950/70">
            <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-blue-400 to-emerald-500" />
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Confirmation confidence: strong once caregiver responds.</p>
        </section>
      </div>
    </div>
  );
}





function CirclePermissionsMatrix() {
  const permissions = [
    { actor: 'Anna Roberts', role: 'Supported person', can: ['Ask for support', 'Confirm low-risk routines'], cannot: ['Approve robot physical action'], tone: 'blue' },
    { actor: 'Maya Carter', role: 'Caregiver', can: ['Perform recovery tasks', 'Verify mobility support', 'Pause robot handoff'], cannot: ['Change privacy rules alone'], tone: 'green' },
    { actor: 'Daniel Roberts', role: 'Family', can: ['Receive digest', 'Confirm family tasks', 'Escalate unresolved item'], cannot: ['View restricted biometrics'], tone: 'gold' },
    { actor: 'SAVEN Assist R1', role: 'Robot endpoint', can: ['Report readiness', 'Send telemetry', 'Wait for command'], cannot: ['Choose care action independently'], tone: 'blue' },
  ];

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Support Circle permissions</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Who can do what around Anna?</h3>
        </div>
        <StatusPill tone="green" label="Permissions visible" />
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-4">
        {permissions.map((permission) => {
          const tone = permission.tone === 'green' ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100' : permission.tone === 'gold' ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100' : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
          return (
            <article key={permission.actor} className={'rounded-3xl border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ' + tone}>
              <h4 className="text-xl font-semibold">{permission.actor}</h4>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] opacity-65">{permission.role}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] opacity-65">Can</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {permission.can.map((item) => <span key={item} className="rounded-full bg-white/82 px-3 py-1 text-xs font-semibold shadow-sm dark:bg-slate-950/70">{item}</span>)}
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] opacity-65">Cannot</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {permission.cannot.map((item) => <span key={item} className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white shadow-sm dark:bg-white dark:text-slate-950">{item}</span>)}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}


function SavenCommandCenter() {
  const commandChannels = [
    { label: 'Voice', command: 'Hey SAVEN, show today support status.', response: 'SAVEN opens the active day, highlights one open verification, and keeps the voice layer calm.', tone: 'blue', icon: Mic },
    { label: 'Text', command: 'Assign walking support to Maya and request confirmation.', response: 'The task is routed to Maya Carter with caregiver confirmation required before continuity updates.', tone: 'green', icon: MessageSquareText },
    { label: 'Robot-safe', command: 'Can R1 help with mobility support?', response: 'R1 readiness is checked, but physical action stays locked until human approval.', tone: 'gold', icon: Bot },
    { label: 'Family', command: 'Send Daniel the evening recovery summary.', response: 'A calm family digest is prepared with only support status and no sensitive biometric details.', tone: 'blue', icon: UsersRound },
  ];

  const serviceCards = [
    { title: 'Global command layer', text: 'Every SAVEN page gets a voice and text path, but the page workflow remains primary.', items: ['Voice', 'Text fallback', 'Page-aware command', 'Command log'] },
    { title: 'Permission aware', text: 'Commands cannot skip profile rules, caregiver override, robot gates, or verification policy.', items: ['Role scope', 'Human approval', 'Safe actions', 'Privacy'] },
    { title: 'Operational response', text: 'SAVEN answers as an operating system: what changed, who owns it, and what waits for confirmation.', items: ['Owner', 'Status', 'Next step', 'Verification'] },
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="SAVEN Command Center" title="One command layer across every support service." text="Voice and text commands control daily support, caregiver handoff, device checks, robot readiness, verification, and continuity without turning SAVEN into a generic chat assistant." />
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.22),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(249,115,22,0.18),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(239,246,255,0.78))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.28),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(249,115,22,0.16),transparent_28%),linear-gradient(135deg,rgba(4,10,20,0.98),rgba(10,22,40,0.9))] dark:ring-1 dark:ring-white/10">
          <div className="grid gap-4 md:grid-cols-2">
            {commandChannels.map((channel) => {
              const Icon = channel.icon;
              const tone = channel.tone === 'green' ? 'border-emerald-200 bg-emerald-50/86 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100' : channel.tone === 'gold' ? 'border-amber-200 bg-amber-50/86 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100' : 'border-blue-200 bg-blue-50/86 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
              return (
                <article key={channel.label} className={'group rounded-3xl border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ' + tone}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/82 shadow-sm ring-1 ring-white/70 transition-transform group-hover:scale-105 dark:bg-slate-950/70 dark:ring-white/10">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-xl font-semibold">{channel.label} command</h3>
                  </div>
                  <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-sm font-semibold leading-6 text-white shadow-inner ring-1 ring-white/10">{channel.command}</div>
                  <p className="mt-4 text-sm leading-6 opacity-85">{channel.response}</p>
                </article>
              );
            })}
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 dark:border-white/10 dark:ring-1 dark:ring-blue-300/20">
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-blue-300/30">
              <img src="/saven-mark.png" alt="" className="h-full w-full object-cover" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Live command state</p>
              <h3 className="mt-1 text-2xl font-semibold">Ready for Anna</h3>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <SummaryLine label="Voice" value="Available in Settings" />
            <SummaryLine label="Text" value="Always available" />
            <SummaryLine label="Robot commands" value="Approval gated" />
            <SummaryLine label="Verification" value="Required before update" />
          </div>
          <div className="mt-6 rounded-3xl bg-white/7 p-4 text-sm leading-6 text-slate-300 ring-1 ring-white/10">
            Practical next backend step: persist commands as events, not chat messages. Each command should create or update a task, policy, assignment, or verification record.
          </div>
        </div>
      </section>
      <section className="grid gap-5 lg:grid-cols-3">
        {serviceCards.map((card) => <LayeredPanel key={card.title} title={card.title} text={card.text} items={card.items} />)}
      </section>
    </div>
  );
}

function TaskLifecycleService() {
  const lifecycle = [
    { step: '01', title: 'Need Detected', owner: 'BioMath Core or SAVEN profile', state: 'Signal received', tone: 'blue', detail: 'Hydration, mobility, recovery, reminder, safety, environment, or caregiver coverage need.' },
    { step: '02', title: 'Support Task Created', owner: 'SAVEN task service', state: 'Structured', tone: 'green', detail: 'Need becomes a task with due time, category, priority, permission, and verification requirement.' },
    { step: '03', title: 'Assigned', owner: 'Circle permission service', state: 'Maya Carter', tone: 'gold', detail: 'SAVEN chooses person, device, robot, or family fallback based on policy and availability.' },
    { step: '04', title: 'Action Performed', owner: 'Human or endpoint', state: 'In reality', tone: 'blue', detail: 'The support action happens outside the website: walking, hydration, handoff, recovery routine.' },
    { step: '05', title: 'Verified', owner: 'Verification policy', state: 'Confirmed', tone: 'green', detail: 'Confirmation arrives through caregiver, family, user, device telemetry, robot telemetry, or environment signal.' },
    { step: '06', title: 'Continuity Updated', owner: 'Timeline engine', state: 'Stable', tone: 'gold', detail: 'The event updates timeline, daily summary, support confidence, and next recommended action.' },
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Task Lifecycle Service" title="Every support need moves through one visible lifecycle." text="This is the practical service SAVEN needs most: one canonical path from need to verified continuity, shared across Today, Circle, Robots, Verification, Timeline, and Settings." />
      <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
        <div className="grid gap-4 xl:grid-cols-6">
          {lifecycle.map((item, index) => {
            const color = item.tone === 'green' ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100' : item.tone === 'gold' ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100' : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
            return (
              <article key={item.title} className={'relative min-h-[260px] rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ' + color}>
                {index < lifecycle.length - 1 && <span className="pointer-events-none absolute -right-3 top-1/2 hidden h-1 w-6 rounded-full bg-gradient-to-r from-blue-400 to-orange-400 xl:block" />}
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/82 text-sm font-semibold shadow-sm dark:bg-slate-950/70">{item.step}</span>
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] opacity-65">{item.owner}</p>
                <p className="mt-4 text-sm leading-6 opacity-85">{item.detail}</p>
                <span className="mt-4 inline-flex rounded-full bg-white/82 px-3 py-1 text-xs font-semibold shadow-sm dark:bg-slate-950/70">{item.state}</span>
              </article>
            );
          })}
        </div>
      </section>
      <section className="grid gap-5 lg:grid-cols-3">
        <LayeredPanel title="Service contract" text="Every page should read and write the same lifecycle event, not independent demo states." items={['taskId', 'ownerId', 'status', 'verificationPolicy', 'timelineEvent']} />
        <LayeredPanel title="What this prevents" text="No disconnected widgets, no repeated status logic, no unclear responsibility." items={['One status model', 'One owner', 'One proof path', 'One continuity update']} />
        <LayeredPanel title="Ready for backend" text="This can become the first SAVEN data model without real external integrations." items={['Local seed data', 'Mock API', 'Event store', 'UI state']} />
      </section>
    </div>
  );
}

function DailySupportPlanBuilder() {
  const planRows = [
    { time: '08:30', action: 'Hydration check', owner: 'Maya Carter', command: 'Hey SAVEN, start hydration check.', verify: 'Caregiver + sensor' },
    { time: '10:30', action: 'Assisted walking session', owner: 'Maya Carter', command: 'Assign walking support and request confirmation.', verify: 'Caregiver confirmation' },
    { time: '13:30', action: 'Robot readiness review', owner: 'SAVEN Assist R1', command: 'Check robot readiness only.', verify: 'Robot telemetry' },
    { time: '19:00', action: 'Family recovery summary', owner: 'Daniel Roberts', command: 'Send calm family digest.', verify: 'Family acknowledgement' },
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Daily Support Plan" title="A simple daily plan that becomes real support work." text="SAVEN should not only show tasks. It should let operators build a day: time windows, owners, commands, verification, fallback, and continuity effect." />
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
          <div className="space-y-3">
            {planRows.map((row) => (
              <div key={row.time} className="grid gap-3 rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-white/10 dark:bg-slate-900 md:grid-cols-[86px_minmax(0,1fr)_180px] md:items-center">
                <span className="rounded-full bg-white px-3 py-1 text-center text-sm font-semibold text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-200 dark:ring-1 dark:ring-white/10">{row.time}</span>
                <div>
                  <p className="font-semibold text-slate-950 dark:text-white">{row.action}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{row.command}</p>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{row.owner}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{row.verify}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,#0f172a,#1e3a8a_56%,#7c2d12)] p-6 text-white shadow-xl shadow-blue-950/20 dark:border-white/10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">Plan quality</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight">Keep the day useful, not overloaded.</h3>
          <div className="mt-6 grid gap-3">
            <SummaryLine label="Open tasks" value="1" />
            <SummaryLine label="Human-owned" value="3" />
            <SummaryLine label="Robot physical action" value="Locked" />
            <SummaryLine label="Continuity confidence" value="Strong" />
          </div>
        </div>
      </section>
      <SupportTemplateLibrary />
      <section className="grid gap-5 lg:grid-cols-3">
        <LayeredPanel title="Builder controls" text="The next UI should add and reorder plan blocks without turning Settings into a dashboard." items={['Add task', 'Time window', 'Owner', 'Fallback', 'Verification']} />
        <LayeredPanel title="Command support" text="Every plan row should be runnable by voice or text command." items={['Start', 'Pause', 'Assign', 'Confirm', 'Escalate']} />
        <LayeredPanel title="Guardrails" text="Limit the number of active actions so support feels calm." items={['No clutter', 'One next action', 'Quiet hours', 'Family digest']} />
      </section>
    </div>
  );
}

function VerificationPolicyBuilder() {
  const policies = [
    { label: 'Low risk routine', proof: 'User or caregiver confirmation', examples: ['Breathing exercise', 'Drink water', 'Daily note'], tone: 'blue' },
    { label: 'Recovery support', proof: 'Caregiver confirmation required', examples: ['Walking support', 'Medication support', 'Transfer assistance'], tone: 'gold' },
    { label: 'Device-assisted', proof: 'Human confirmation plus telemetry', examples: ['Wearable activity', 'Bed sensor', 'Hydration signal'], tone: 'green' },
    { label: 'Robot-related', proof: 'Human approval before action, telemetry after action', examples: ['Robot readiness', 'Mobility endpoint', 'Room assist'], tone: 'blue' },
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Verification Policy Builder" title="SAVEN needs clear proof rules before continuity changes." text="The verification page should become a policy builder: what kind of action is allowed, who confirms it, which device signal counts, and when escalation starts." />
      <section className="grid gap-4 lg:grid-cols-2">
        {policies.map((policy) => {
          const tone = policy.tone === 'green' ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100' : policy.tone === 'gold' ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100' : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
          return (
            <article key={policy.label} className={'rounded-[2rem] border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ' + tone}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold">{policy.label}</h3>
                  <p className="mt-3 text-sm leading-6 opacity-85">{policy.proof}</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/82 shadow-sm dark:bg-slate-950/70"><ShieldCheck className="h-5 w-5" /></span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {policy.examples.map((item) => <span key={item} className="rounded-full bg-white/82 px-3 py-1 text-xs font-semibold shadow-sm dark:bg-slate-950/70">{item}</span>)}
              </div>
            </article>
          );
        })}
      </section>
      <section className="grid gap-5 lg:grid-cols-3">
        <LayeredPanel title="Required fields" text="Each policy should be structured enough for backend persistence later." items={['riskLevel', 'requiredProof', 'allowedVerifier', 'timeout', 'fallback']} />
        <LayeredPanel title="Human trust" text="The UI should explain why proof is required in plain language." items={['No assumptions', 'Clear responsibility', 'Calm escalation', 'Review path']} />
        <LayeredPanel title="Robot safety" text="Robots never verify themselves for high-impact physical support." items={['Approval first', 'Telemetry second', 'Human override', 'Stop command']} />
      </section>
    </div>
  );
}

function ContinuityOperations() {
  const continuityRows = [
    { label: 'Today support continuity', value: 'Strong', detail: '4 verified actions, 1 waiting for review', tone: 'green' },
    { label: 'Caregiver coverage', value: 'Active', detail: 'Maya owns recovery actions until 15:00', tone: 'blue' },
    { label: 'Robot readiness', value: 'Standby', detail: 'R1 available for readiness only', tone: 'gold' },
    { label: 'Family awareness', value: 'Digest ready', detail: 'Daniel gets evening summary', tone: 'green' },
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Continuity Operations" title="Continuity is the final SAVEN product outcome." text="The user should not feel they are managing pages. SAVEN should show whether real support continuity is stable, interrupted, waiting, or escalating." />
      <section className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 dark:border-white/10 dark:ring-1 dark:ring-blue-300/20">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">Continuity score</p>
          <div className="mt-5 flex items-end gap-4">
            <p className="text-7xl font-semibold tracking-tight">86</p>
            <p className="pb-3 text-sm font-semibold text-emerald-200">Stable</p>
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-900">
            <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-300" />
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-300">This is an operational confidence view, not a medical score. It summarizes task completion, unresolved items, coverage, and verification strength.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {continuityRows.map((row) => {
            const tone = row.tone === 'green' ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100' : row.tone === 'gold' ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100' : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
            return (
              <article key={row.label} className={'rounded-[2rem] border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ' + tone}>
                <p className="text-sm font-semibold opacity-75">{row.label}</p>
                <h3 className="mt-3 text-3xl font-semibold">{row.value}</h3>
                <p className="mt-3 text-sm leading-6 opacity-85">{row.detail}</p>
              </article>
            );
          })}
        </div>
      </section>
      <section className="grid gap-5 lg:grid-cols-3">
        <LayeredPanel title="Continuity should answer" text="Can the person continue the day safely and calmly?" items={['What is done', 'What is open', 'Who owns it', 'What happens next']} />
        <LayeredPanel title="Keep it light" text="Do not show every raw signal. Show the few signals that change action." items={['Open verification', 'Coverage gap', 'Escalation', 'Blocked robot action']} />
        <LayeredPanel title="Best next build" text="Make all pages feed this final state." items={['Today', 'Tasks', 'Circle', 'Robots', 'Verification']} />
      </section>
    </div>
  );
}



function SupportTemplateLibrary() {
  const templates = [
    {
      name: 'Home recovery morning',
      purpose: 'Start the day calmly after surgery or rehabilitation.',
      steps: ['Hydration check', 'Medication support confirmation', 'Mobility readiness', 'Family digest'],
      owner: 'Caregiver first',
      verify: 'Caregiver + device',
      tone: 'blue',
    },
    {
      name: 'Mobility support',
      purpose: 'Coordinate walking or transfer support without unsafe automation.',
      steps: ['Check environment', 'Assign helper', 'Lock robot physical action', 'Verify completion'],
      owner: 'Maya Carter',
      verify: 'Human confirmation',
      tone: 'green',
    },
    {
      name: 'Quiet night mode',
      purpose: 'Reduce interruptions while keeping urgent escalation visible.',
      steps: ['Emergency only voice', 'Bed sensor standby', 'Family fallback', 'Morning summary'],
      owner: 'SAVEN rules',
      verify: 'Environment signal',
      tone: 'gold',
    },
    {
      name: 'Care concern review',
      purpose: 'Route a concern to nurse or doctor without creating panic.',
      steps: ['Collect support note', 'Attach verification', 'Request nurse review', 'Escalate doctor if needed'],
      owner: 'Nurse path',
      verify: 'Professional review',
      tone: 'red',
    },
  ];

  return (
    <section className="rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_16%_20%,rgba(59,130,246,0.2),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(249,115,22,0.14),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(239,246,255,0.76),rgba(255,247,237,0.72))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_16%_20%,rgba(59,130,246,0.26),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(249,115,22,0.12),transparent_28%),linear-gradient(135deg,rgba(4,10,20,0.98),rgba(10,22,40,0.9),rgba(33,22,10,0.66))] dark:ring-1 dark:ring-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Support templates</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Ready scenarios without loading the user with setup.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">Templates should create a daily plan, required permissions, command examples, verification policy, and escalation path in one move.</p>
        </div>
        <StatusPill tone="blue" label="Template library" />
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-4">
        {templates.map((template) => {
          const tone = template.tone === 'red'
            ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-300/25 dark:bg-red-500/10 dark:text-red-100'
            : template.tone === 'green'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100'
              : template.tone === 'gold'
                ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100'
                : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
          return (
            <article key={template.name} className={'group rounded-3xl border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ' + tone}>
              <h4 className="text-xl font-semibold">{template.name}</h4>
              <p className="mt-3 text-sm leading-6 opacity-85">{template.purpose}</p>
              <div className="mt-4 space-y-2">
                {template.steps.map((step, index) => (
                  <div key={step} className="grid grid-cols-[28px_minmax(0,1fr)] items-center gap-2 rounded-2xl bg-white/72 px-3 py-2 text-sm font-semibold shadow-sm dark:bg-slate-950/70">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-950 text-[11px] text-white dark:bg-white dark:text-slate-950">{index + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-white/72 p-3 text-xs font-semibold leading-5 shadow-sm dark:bg-slate-950/70">
                Owner: {template.owner}<br />Verification: {template.verify}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function EmergencyEscalationCenter({ compact = false }: { compact?: boolean }) {
  const escalationRows = [
    { level: 'Normal support', route: 'Family or caregiver', trigger: 'Missed low-risk task, routine reminder, family digest', response: 'Create follow-up and wait calmly', tone: 'blue' },
    { level: 'Care concern', route: 'Nurse path', trigger: 'Repeated missed confirmation, recovery discomfort, wound care question', response: 'Request nurse review with timeline context', tone: 'green' },
    { level: 'Clinical review', route: 'Doctor path', trigger: 'Medication concern, recovery plan change, high-risk unresolved event', response: 'Send concise clinical summary for review', tone: 'gold' },
    { level: 'Emergency', route: 'Emergency path', trigger: 'Fall risk, acute distress, immediate safety concern', response: 'Show emergency escalation state only in dev mock', tone: 'red' },
  ];

  return (
    <section className="rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.2),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(239,68,68,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(239,246,255,0.76),rgba(255,241,242,0.7))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.24),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(239,68,68,0.14),transparent_28%),linear-gradient(135deg,rgba(4,10,20,0.98),rgba(10,22,40,0.9),rgba(45,16,16,0.58))] dark:ring-1 dark:ring-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Escalation center</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">SAVEN separates normal support from urgent escalation.</h3>
          {!compact && <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">The goal is to reduce panic: clear levels, clear route, clear next action. Real emergency calling is intentionally not connected in this development version.</p>}
        </div>
        <StatusPill tone="gold" label="Escalation rules" />
      </div>
      <div className={'mt-6 grid gap-4 ' + (compact ? 'lg:grid-cols-2 xl:grid-cols-4' : 'xl:grid-cols-4')}>
        {escalationRows.map((row, index) => {
          const tone = row.tone === 'red'
            ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-300/25 dark:bg-red-500/10 dark:text-red-100'
            : row.tone === 'green'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100'
              : row.tone === 'gold'
                ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100'
                : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
          return (
            <article key={row.level} className={'rounded-3xl border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ' + tone}>
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/82 text-sm font-semibold shadow-sm dark:bg-slate-950/70">{index + 1}</span>
                {row.tone === 'red' && <span className="h-3 w-3 animate-pulse rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.8)]" />}
              </div>
              <h4 className="mt-4 text-xl font-semibold">{row.level}</h4>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] opacity-65">{row.route}</p>
              {!compact && <p className="mt-4 text-sm leading-6 opacity-85">{row.trigger}</p>}
              <p className="mt-4 rounded-2xl bg-white/72 p-3 text-sm font-semibold leading-6 shadow-sm dark:bg-slate-950/70">{row.response}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}


function SavenCareRoutes() {
  const [selectedContactId, setSelectedContactId] = useState(savenCareContacts[0]?.id ?? '');
  const [routeReason, setRouteReason] = useState('Maya missed the confirmation window for assisted walking support.');
  const [routeSummary, setRouteSummary] = useState('Prepare context for Anna Roberts, active recovery task, latest device state, and verification requirement.');
  const [confirmationMode, setConfirmationMode] = useState<'prepare' | 'confirm'>('prepare');
  const routeTemplates = [
    {
      label: 'Missed medication',
      contactId: 'doctor-morris',
      reason: 'Medication support was not verified inside the expected window.',
      summary: 'Prepare clinical review context with medication task, caregiver status, family fallback, and latest verification log.',
    },
    {
      label: 'Care concern',
      contactId: 'nurse-grant',
      reason: 'Recovery action was delayed and needs a same-day care review.',
      summary: 'Attach active support task, open verification, mobility context, and caregiver availability.',
    },
    {
      label: 'Family handoff',
      contactId: 'family-daniel',
      reason: 'Caregiver window is ending and family fallback should be prepared.',
      summary: 'Send family-safe summary with current task, next action, and confirmation requirement.',
    },
    {
      label: 'Active caregiver',
      contactId: 'caregiver-maya',
      reason: 'Anna needs direct support for the current recovery task.',
      summary: 'Prepare caregiver route with task steps, device state, environment rules, and verification prompt.',
    },
    {
      label: 'Emergency ready',
      contactId: 'emergency-services',
      reason: 'Potential serious safety concern requires an emergency route to be prepared.',
      summary: 'Prepare emergency context only. Do not dispatch. Require explicit human confirmation.',
    },
  ];
  const auditTrail = [
    { label: 'Command composed', detail: 'Text route is ready for SAVEN command processing.', tone: 'blue' },
    { label: 'Context attached', detail: 'Person, task, environment, route reason, and verification state are visible.', tone: 'green' },
    { label: 'Safety checked', detail: selectedContactId === 'emergency-services' ? 'Emergency route is locked for human confirmation.' : 'Route can be prepared locally without real external dispatch.', tone: selectedContactId === 'emergency-services' ? 'red' : 'gold' },
  ];
  const selectedContact = savenCareContacts.find((contact) => contact.id === selectedContactId) ?? savenCareContacts[0];
  const selectedRouteCommand = selectedContact
    ? 'Hey SAVEN, prepare ' + selectedContact.role + ' route for Anna Roberts. Reason: ' + routeReason + ' Summary: ' + routeSummary
    : '';
  const structuredRequest = selectedContact
    ? {
        contactId: selectedContact.id,
        urgency: selectedContact.role === 'emergency' ? 'emergency' : selectedContact.role === 'doctor' ? 'clinical_review' : selectedContact.role === 'nurse' ? 'care_concern' : 'routine',
        reason: routeReason,
        summary: routeSummary,
        confirmation: selectedContact.role === 'emergency' ? 'human_required' : confirmationMode,
      }
    : null;

  const routeStyles = {
    caregiver: {
      icon: HeartPulse,
      label: 'Caregiver',
      action: 'Ask for direct support',
      className: 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-300/25 dark:bg-emerald-500/10 dark:text-emerald-100',
    },
    family: {
      icon: Users,
      label: 'Family',
      action: 'Notify family fallback',
      className: 'border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-300/25 dark:bg-blue-500/10 dark:text-blue-100',
    },
    nurse: {
      icon: BellRing,
      label: 'Nurse',
      action: 'Prepare care concern',
      className: 'border-cyan-200 bg-cyan-50 text-cyan-950 dark:border-cyan-300/25 dark:bg-cyan-500/10 dark:text-cyan-100',
    },
    doctor: {
      icon: Stethoscope,
      label: 'Doctor',
      action: 'Prepare clinical review',
      className: 'border-violet-200 bg-violet-50 text-violet-950 dark:border-violet-300/25 dark:bg-violet-500/10 dark:text-violet-100',
    },
    emergency: {
      icon: Siren,
      label: 'Emergency',
      action: 'Human confirmation required',
      className: 'border-red-200 bg-red-50 text-red-950 dark:border-red-300/25 dark:bg-red-500/10 dark:text-red-100',
    },
  } as const;

  const routeSteps = [
    { label: 'Reason', detail: 'SAVEN captures why help is needed and what changed.' },
    { label: 'Context', detail: 'Profile, task, environment, devices, and verification state are attached.' },
    { label: 'Route', detail: 'The right person or care path is prepared.' },
    { label: 'Confirm', detail: 'Sensitive routes wait for human confirmation before action.' },
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Care Routes" title="Reach the right person without losing context." text="SAVEN prepares caregiver, family, nurse, doctor, and emergency routes from the same support state. This is still a local development version: no real calls or messages are sent." />

      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_16%_16%,rgba(0,180,255,0.18),transparent_30%),radial-gradient(circle_at_86%_14%,rgba(255,178,54,0.18),transparent_28%),radial-gradient(circle_at_72%_88%,rgba(16,185,129,0.15),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(240,249,255,0.8),rgba(255,247,237,0.76))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_16%_16%,rgba(0,180,255,0.24),transparent_30%),radial-gradient(circle_at_86%_14%,rgba(255,178,54,0.15),transparent_28%),radial-gradient(circle_at_72%_88%,rgba(16,185,129,0.12),transparent_30%),linear-gradient(135deg,rgba(3,7,18,0.98),rgba(7,20,39,0.9),rgba(35,19,7,0.68))] dark:ring-1 dark:ring-white/10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Contact router</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">One route panel for daily support and urgent escalation.</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">The interface shows what SAVEN will prepare: who receives the route, which context is attached, and whether confirmation is required.</p>
          </div>
          <StatusPill tone="gold" label="Local only" />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {routeTemplates.map((template) => (
            <button
              key={template.label}
              type="button"
              onClick={() => {
                setSelectedContactId(template.contactId);
                setRouteReason(template.reason);
                setRouteSummary(template.summary);
                setConfirmationMode(template.contactId === 'emergency-services' ? 'prepare' : 'confirm');
              }}
              className="rounded-full border border-white/70 bg-white/78 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-900 hover:shadow-lg dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:border-blue-300/25 dark:hover:bg-blue-500/10 dark:hover:text-blue-100"
            >
              {template.label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-5">
          {savenCareContacts.map((contact) => {
            const style = routeStyles[contact.role];
            const Icon = style.icon;
            const isSelected = contact.id === selectedContactId;

            return (
              <button
                key={contact.id}
                type="button"
                onClick={() => setSelectedContactId(contact.id)}
                className={(isSelected ? 'scale-[1.02] shadow-xl ring-2 ring-current/25 ' : 'shadow-sm hover:-translate-y-1 hover:shadow-xl ') + style.className + ' rounded-3xl border p-4 text-left transition-all'}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/82 shadow-sm ring-1 ring-current/10 dark:bg-slate-950/70">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-semibold shadow-sm ring-1 ring-current/10 dark:bg-slate-950/65">{style.label}</span>
                </div>
                <h4 className="mt-4 text-lg font-semibold">{contact.name}</h4>
                <p className="mt-2 text-sm leading-6 opacity-80">{style.action}</p>
              </button>
            );
          })}
        </div>
      </section>

      {selectedContact && (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Prepared route</p>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{selectedContact.name}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{selectedContact.route}</p>
              </div>
              <StatusPill tone={selectedContact.role === 'emergency' ? 'gold' : 'green'} label={selectedContact.role === 'emergency' ? 'Needs confirmation' : 'Ready to prepare'} />
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <LayeredPanel title="Availability" text={selectedContact.availability} items={['Current route state', selectedContact.responseTarget, 'No real external message sent']} />
              <LayeredPanel title="Allowed reasons" text="SAVEN limits each contact to a practical reason list." items={selectedContact.allowedReasons} />
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="rounded-3xl bg-slate-950 p-4 text-white shadow-inner ring-1 ring-white/10">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">Prepared text command</p>
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-100 ring-1 ring-blue-300/20">Live command</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-200">{selectedRouteCommand}</p>
              </div>

              <div className="rounded-3xl border border-white/70 bg-[#f7f5f1] p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/70">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Confirmation mode</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(['prepare', 'confirm'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setConfirmationMode(mode)}
                      disabled={selectedContact.role === 'emergency'}
                      className={(confirmationMode === mode ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/20' : 'bg-white text-slate-700 ring-1 ring-slate-100 hover:bg-blue-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-slate-800') + ' rounded-full px-4 py-2 text-sm font-semibold capitalize transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50'}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{selectedContact.role === 'emergency' ? 'Emergency remains human-confirmed only.' : 'Prepare saves the route; confirm simulates human approval in local mode.'}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="block rounded-3xl border border-white/70 bg-white/78 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Reason</span>
                <textarea
                  value={routeReason}
                  onChange={(event) => setRouteReason(event.target.value)}
                  className="mt-3 min-h-[104px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-300/10"
                />
              </label>
              <label className="block rounded-3xl border border-white/70 bg-white/78 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Summary attached to route</span>
                <textarea
                  value={routeSummary}
                  onChange={(event) => setRouteSummary(event.target.value)}
                  className="mt-3 min-h-[104px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-300 dark:focus:ring-emerald-300/10"
                />
              </label>
            </div>

            {structuredRequest && (
              <div className="mt-4 rounded-3xl bg-slate-950 p-4 text-white shadow-inner ring-1 ring-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">Structured backend request</p>
                <pre className="mt-3 overflow-x-auto text-xs leading-6 text-slate-200">{JSON.stringify(structuredRequest, null, 2)}</pre>
              </div>
            )}
          </div>

          <aside className="rounded-[2rem] border border-white/70 bg-[#f7f5f1] p-6 shadow-sm dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Safety state</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">Human-confirmed by design.</h3>
            <div className="mt-5 space-y-3">
              {routeSteps.map((step, index) => (
                <div key={step.label} className="flex gap-3 rounded-3xl bg-white/80 p-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900/70 dark:ring-white/10">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-950/20">{index + 1}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">{step.label}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              {auditTrail.map((item) => {
                const tone =
                  item.tone === 'green'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-300/25 dark:bg-emerald-500/10 dark:text-emerald-100'
                    : item.tone === 'red'
                      ? 'border-red-200 bg-red-50 text-red-950 dark:border-red-300/25 dark:bg-red-500/10 dark:text-red-100'
                      : item.tone === 'gold'
                        ? 'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-300/25 dark:bg-amber-500/10 dark:text-amber-100'
                        : 'border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-300/25 dark:bg-blue-500/10 dark:text-blue-100';

                return (
                  <div key={item.label} className={'rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ' + tone}>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 opacity-80">{item.detail}</p>
                  </div>
                );
              })}
            </div>

            {selectedContact.role === 'emergency' && (
              <div className="mt-4 rounded-3xl border border-red-200 bg-red-50 p-4 text-red-950 dark:border-red-300/25 dark:bg-red-500/10 dark:text-red-100">
                <p className="text-sm font-semibold">Emergency is not dispatched in this version.</p>
                <p className="mt-2 text-sm leading-6 opacity-80">The screen can prepare the route and show the required context, but a real emergency service connection must remain a separate confirmed backend integration.</p>
              </div>
            )}
          </aside>
        </section>
      )}
    </div>
  );
}

function SavenFAQ() {
  const [openFaq, setOpenFaq] = useState(0);
  const faqGroups = [
    {
      title: 'System basics',
      tone: 'blue',
      questions: [
        {
          question: 'What is SAVEN?',
          answer: 'SAVEN is the daily support operating layer for a person. It turns needs into visible support tasks, assigns responsibility, connects people and machines, and waits for verification before continuity updates.',
          points: ['Daily support operating system', 'Task coordination', 'People, devices, robots, environments', 'Verification before continuity'],
        },
        {
          question: 'Is SAVEN a medical diagnosis system?',
          answer: 'No. SAVEN is not a diagnosis engine and does not replace clinical decisions. It coordinates support actions, reminders, responsibility, escalation, and verification in plain operational language.',
          points: ['No diagnosis', 'No treatment automation', 'Support coordination only', 'Human decision layer stays visible'],
        },
      ],
    },
    {
      title: 'Operating modes',
      tone: 'gold',
      questions: [
        {
          question: 'What is Connected Mode?',
          answer: 'Connected Mode uses BioMath Core context to understand the person more deeply, then SAVEN converts that context into support tasks, workflows, and verified action history.',
          points: ['BioMath Core context', 'Human model signals', 'Adaptive thresholds', 'Structured support tasks'],
        },
        {
          question: 'What is Autonomous Mode?',
          answer: 'Autonomous Mode lets SAVEN operate from its own profile rules, environment settings, templates, support circle, and verification requirements even when BioMath Core context is not connected.',
          points: ['Profile rules', 'Workflow templates', 'Environment permissions', 'Verification requirements'],
        },
      ],
    },
    {
      title: 'Voice and text commands',
      tone: 'green',
      questions: [
        {
          question: 'What can voice commands do?',
          answer: 'Voice commands can start daily support, ask for current status, hand off tasks to caregivers, check devices, review robot readiness, and trigger verification requests. Text commands work as the dependable fallback.',
          points: ['Start support', 'Ask status', 'Check devices', 'Review robots', 'Verify actions'],
        },
        {
          question: 'Why keep text commands if voice exists?',
          answer: 'Text commands are important when the mic is muted, the browser cannot recognize speech, the room is noisy, or the person prefers quiet interaction. SAVEN should always remain usable.',
          points: ['Quiet mode', 'Noisy rooms', 'Accessibility', 'Reliable fallback'],
        },
      ],
    },
    {
      title: 'Robots and physical devices',
      tone: 'blue',
      questions: [
        {
          question: 'How are robots connected to SAVEN?',
          answer: 'Robots connect as permissioned endpoints. SAVEN tracks model, capabilities, safe zones, approval rules, device telemetry, environment restrictions, and verification after action.',
          points: ['Robot registry', 'Capability match', 'Safe zones', 'Human approval', 'Telemetry verification'],
        },
        {
          question: 'Can robots act independently?',
          answer: 'No. In this SAVEN design, robots are physical executors and telemetry providers, not independent care decision makers. Physical action requires approval and must be verified.',
          points: ['Readiness first', 'Approval gate', 'Override allowed', 'Verified result'],
        },
      ],
    },
    {
      title: 'Support Circle and verification',
      tone: 'gold',
      questions: [
        {
          question: 'What is the Support Circle?',
          answer: 'The Support Circle is the visible map of everyone and everything helping the person: family, caregivers, providers, home environment, devices, robots, and verification services.',
          points: ['Family', 'Caregiver', 'Provider', 'Home environment', 'Devices and robots'],
        },
        {
          question: 'What does verification mean?',
          answer: 'Verification means SAVEN does not assume support happened. It waits for confirmation from a person, device, robot telemetry, or environment signal before the timeline and continuity state update.',
          points: ['Reality confirmed', 'Action history', 'Accountability', 'Continuity state'],
        },
      ],
    },
  ];

  const flattenedFaqs = faqGroups.flatMap((group) => group.questions.map((question) => ({ ...question, group: group.title, tone: group.tone })));
  const activeFaq = flattenedFaqs[openFaq] || flattenedFaqs[0];
  const toneClass = activeFaq.tone === 'green' ? 'from-emerald-500 to-cyan-400' : activeFaq.tone === 'gold' ? 'from-orange-500 to-amber-300' : 'from-blue-600 to-cyan-400';

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="FAQ for SAVEN" title="Clear answers for operating SAVEN." text="A practical guide to SAVEN as a daily support operating system: people, robots, voice commands, verification, environments, and safety rules." />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]">
        <aside className="overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 dark:border-white/10 dark:ring-1 dark:ring-blue-300/20">
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-blue-300/30">
              <img src="/saven-mark.png" alt="" className="h-full w-full object-cover" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">SAVEN knowledge base</p>
              <h3 className="mt-1 text-2xl font-semibold">Traditional FAQ</h3>
            </div>
          </div>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Selected topic</p>
            <h4 className="mt-3 text-3xl font-semibold tracking-tight">{activeFaq.question}</h4>
            <p className="mt-4 text-sm leading-7 text-slate-300">{activeFaq.answer}</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-900">
              <div className={'h-full rounded-full bg-gradient-to-r ' + toneClass} style={{ width: ((openFaq + 1) / flattenedFaqs.length) * 100 + '%' }} />
            </div>
          </div>
        </aside>

        <div className="space-y-3">
          {flattenedFaqs.map((faq, index) => {
            const isOpen = openFaq === index;
            const tone = faq.tone === 'green' ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-300/20 dark:bg-emerald-500/10' : faq.tone === 'gold' ? 'border-amber-200 bg-amber-50 dark:border-amber-300/20 dark:bg-amber-500/10' : 'border-blue-200 bg-blue-50 dark:border-blue-300/20 dark:bg-blue-500/10';
            return (
              <article key={faq.question} className={(isOpen ? tone + ' shadow-lg' : 'border-white/70 bg-white/82 dark:border-white/10 dark:bg-slate-950/65') + ' rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl'}>
                <button onClick={() => setOpenFaq(isOpen ? -1 : index)} className="flex w-full items-center justify-between gap-4 text-left">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{faq.group}</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{faq.question}</h3>
                  </div>
                  <span className={(isOpen ? 'rotate-90 bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-300') + ' grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all'}>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
                {isOpen && (
                  <div className="mt-4 border-t border-white/70 pt-4 dark:border-white/10">
                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{faq.answer}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {faq.points.map((point) => (
                        <span key={point} className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-white/70 dark:bg-slate-950/70 dark:text-slate-200 dark:ring-white/10">{point}</span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SavenLearningCenter() {
  const modules = [
    {
      step: '01',
      title: 'Understand the person',
      text: 'Create the life profile: relationship, language, environment, support mode, rhythm, mobility, communication preference, and goals.',
      practice: 'Open Life Setup and complete a basic profile for Anna.',
      items: ['Person profile', 'Daily rhythm', 'Mobility support', 'Communication style'],
      tone: 'blue',
    },
    {
      step: '02',
      title: 'Build the Support Circle',
      text: 'Connect the family, caregiver, provider, device, home environment, robot readiness, and verification layer.',
      practice: 'Go to Circle and identify who confirms reality.',
      items: ['Family', 'Caregiver', 'Device', 'Robot', 'Verification'],
      tone: 'gold',
    },
    {
      step: '03',
      title: 'Run daily support',
      text: 'Use Today and Support Flow to see need detection, support task creation, assignment, action, verification, and continuity update.',
      practice: 'Follow one task from need to verified continuity.',
      items: ['Need', 'Assign', 'Act', 'Verify', 'Continue'],
      tone: 'green',
    },
    {
      step: '04',
      title: 'Use voice and text commands',
      text: 'Use the SAVEN voice layer for commands and text fallback. Watch how the response and command log make support actions visible.',
      practice: 'Open Settings and test one command through text and one through voice.',
      items: ['Mic', 'Text fallback', 'SAVEN response', 'Command log'],
      tone: 'blue',
    },
    {
      step: '05',
      title: 'Connect robots safely',
      text: 'Use robot settings to register readiness, map permissions, bind telemetry, require human approval, and verify physical action.',
      practice: 'Review Robot Connection Center and confirm physical action remains gated.',
      items: ['Register', 'Permissions', 'Telemetry', 'Approval', 'Verification'],
      tone: 'gold',
    },
    {
      step: '06',
      title: 'Tune the operating rules',
      text: 'Use Settings to tune cognitive load, reminder intensity, privacy, devices, caregiver overrides, night mode, robot policy, and escalation.',
      practice: 'Adjust one slider and one permission; read the generated rules.',
      items: ['Regulators', 'Permissions', 'Privacy', 'Escalation', 'Night mode'],
      tone: 'green',
    },
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="SAVEN Learning Center" title="Learn SAVEN step by step." text="A guided, practical training center for operating SAVEN clearly: profile, circle, daily support, voice commands, robots, verification, and settings." />

      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(249,115,22,0.18),transparent_30%),radial-gradient(circle_at_70%_86%,rgba(16,185,129,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(239,246,255,0.78),rgba(255,247,237,0.74))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.28),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(249,115,22,0.16),transparent_30%),radial-gradient(circle_at_70%_86%,rgba(16,185,129,0.14),transparent_30%),linear-gradient(135deg,rgba(4,10,20,0.98),rgba(8,22,42,0.9),rgba(33,22,10,0.7))] dark:ring-1 dark:ring-white/10">
        <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/20 ring-1 ring-white/10">
            <div className="flex items-center gap-3">
              <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-blue-300/30">
                <img src="/saven-mark.png" alt="" className="h-full w-full object-cover" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Training path</p>
                <h3 className="mt-1 text-2xl font-semibold">6 core lessons</h3>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {['Profile', 'Circle', 'Daily support', 'Voice', 'Robots', 'Settings'].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-orange-500 text-xs font-semibold text-white">{index + 1}</span>
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </aside>

          <div className="grid gap-4 md:grid-cols-2">
            {modules.map((module) => {
              const tone = module.tone === 'green' ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-300/20 dark:bg-emerald-500/10' : module.tone === 'gold' ? 'border-amber-200 bg-amber-50 dark:border-amber-300/20 dark:bg-amber-500/10' : 'border-blue-200 bg-blue-50 dark:border-blue-300/20 dark:bg-blue-500/10';
              return (
                <article key={module.step} className={'group rounded-[2rem] border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ' + tone}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/80 text-sm font-semibold text-slate-950 shadow-sm ring-1 ring-white/70 dark:bg-slate-950/70 dark:text-white dark:ring-white/10">{module.step}</span>
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{module.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{module.text}</p>
                  <div className="mt-4 rounded-2xl bg-white/76 p-3 text-sm font-semibold leading-6 text-slate-700 ring-1 ring-white/70 dark:bg-slate-950/65 dark:text-slate-200 dark:ring-white/10">
                    Practice: {module.practice}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {module.items.map((item) => (
                      <span key={item} className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-white/70 dark:bg-slate-950/70 dark:text-slate-200 dark:ring-white/10">{item}</span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <LayeredPanel title="Beginner goal" text="Understand what SAVEN is doing before changing settings." items={['Read FAQ', 'Open Start', 'Create profile', 'Review Today']} />
        <LayeredPanel title="Operator goal" text="Run support tasks and verify actions without losing accountability." items={['Support Flow', 'Timeline', 'Verification', 'Circle']} />
        <LayeredPanel title="Advanced goal" text="Connect robots, devices, environments, and command layers safely." items={['Robots', 'Devices', 'Settings', 'Voice commands']} />
      </section>
    </div>
  );
}

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEventLike = {
  resultIndex?: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructorLike = new () => SpeechRecognitionLike;

type VoiceCommandLog = {
  time: string;
  source: string;
  command: string;
  status: string;
  response: string;
};

function SavenSettings() {
  const [settings, setSettings] = useState({
    supportMode: 'Recovery support',
    reminderTone: 'Calm and direct',
    confirmationMode: 'Caregiver + device',
    escalationMode: 'Family first',
    primaryLanguage: 'English',
    activeEnvironment: 'Home Recovery',
    cognitiveLoad: 34,
    reminderIntensity: 42,
    robotComfort: 24,
    deviceAutomation: 68,
    privacyLevel: 82,
    recoveryFocus: 76,
    voiceVolume: 62,
    voiceSpeed: 50,
    voiceSensitivity: 66,
    voiceControl: true,
    wakePhrase: 'Hey SAVEN',
    voicePersona: 'Warm neutral',
    voiceConfirmations: true,
    voiceReminders: true,
    voiceNightMode: true,
    voiceCaregiverOverride: true,
    caregiverFirst: true,
    quietHours: true,
    largeText: true,
    reducedMotion: true,
    familyDigest: true,
    deviceTelemetry: true,
    robotReadiness: true,
    robotPhysicalAction: false,
    autoEscalation: true,
    biometricSharing: false,
    exportTimeline: true,
    emergencyOnlyNight: true,
  });
  const [microphoneOpen, setMicrophoneOpen] = useState(false);
  const [voiceSpeaking, setVoiceSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioPeak, setAudioPeak] = useState(0);
  const [activeVoiceCommand, setActiveVoiceCommand] = useState('morning');
  const [typedVoiceCommand, setTypedVoiceCommand] = useState('');
  const [typedVoiceResponse, setTypedVoiceResponse] = useState('');
  const [micError, setMicError] = useState('');
  const [manualCommand, setManualCommand] = useState('Hey SAVEN, start morning support.');
  const [interimSpeech, setInterimSpeech] = useState('');
  const [commandLog, setCommandLog] = useState<VoiceCommandLog[]>([
    {
      time: 'Ready',
      source: 'System',
      command: 'Voice and text command layer is armed.',
      status: 'Standing by',
      response: 'Choose a service, send a text command, or open the microphone.',
    },
  ]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const responseTimerRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  function updateSetting<K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  const voiceCommands = [
    { id: 'morning', service: 'Daily support', label: 'Morning support', command: 'Hey SAVEN, start morning support.', response: 'Good morning Anna. I will guide the first recovery step, keep reminders gentle, and ask Maya to confirm the mobility check.' },
    { id: 'hydration', service: 'Health routine', label: 'Hydration check', command: 'Hey SAVEN, check hydration and remind me softly.', response: 'Hydration check is active. I will use a calm prompt first, then ask the wearable for confirmation.' },
    { id: 'caregiver', service: 'Caregiver flow', label: 'Caregiver handoff', command: 'Hey SAVEN, send this task to the caregiver.', response: 'I will assign the task to Maya, keep the family digest calm, and wait for verified confirmation.' },
    { id: 'verification', service: 'Verification', label: 'Confirm action', command: 'Hey SAVEN, confirm that the walking session is complete.', response: 'I will mark the walking session as performed and wait for caregiver verification before updating continuity.' },
    { id: 'robot', service: 'Robotics', label: 'Robot readiness', command: 'Hey SAVEN, can the robot help with this action?', response: 'Robot readiness is visible, but physical action remains locked until human approval is given.' },
    { id: 'device', service: 'Devices', label: 'Device status', command: 'Hey SAVEN, check the wearable and home sensors.', response: 'The wearable is online. I will use device telemetry only for confirmation, not independent care decisions.' },
    { id: 'privacy', service: 'Privacy', label: 'Privacy mode', command: 'Hey SAVEN, restrict biometric sharing.', response: 'Biometric context is restricted. Family will receive support status without sensitive body data.' },
    { id: 'night', service: 'Night support', label: 'Night mode', command: 'Hey SAVEN, switch to night emergency-only mode.', response: 'Night voice mode is active. I will stay quiet unless the action is urgent or safety-related.' },
  ];

  const activeVoice = voiceCommands.find((item) => item.id === activeVoiceCommand) || voiceCommands[0];

  const typeSavenResponse = (response: string) => {
    if (responseTimerRef.current) window.clearInterval(responseTimerRef.current);
    setTypedVoiceResponse('');
    let index = 0;
    responseTimerRef.current = window.setInterval(() => {
      index += 1;
      setTypedVoiceResponse(response.slice(0, index));
      if (index >= response.length && responseTimerRef.current) {
        window.clearInterval(responseTimerRef.current);
        responseTimerRef.current = null;
      }
    }, 18);
  };

  useEffect(() => {
    setTypedVoiceCommand('');
    setManualCommand(activeVoice.command);
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTypedVoiceCommand(activeVoice.command.slice(0, index));
      if (index >= activeVoice.command.length) window.clearInterval(timer);
    }, 26);
    return () => window.clearInterval(timer);
  }, [activeVoice.command]);

  useEffect(() => {
    typeSavenResponse(activeVoice.response);
    return () => {
      if (responseTimerRef.current) window.clearInterval(responseTimerRef.current);
    };
  }, [activeVoice.response]);

  const addCommandLog = (command: string, source: string, response = activeVoice.response, status = 'Understood') => {
    const cleanCommand = command.trim();
    if (!cleanCommand) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCommandLog((current) => [
      { time, source, command: cleanCommand, status, response },
      ...current,
    ].slice(0, 6));
  };

  const runTextCommand = () => {
    addCommandLog(manualCommand, 'Text command', activeVoice.response, 'Queued');
    typeSavenResponse(activeVoice.response);
  };

  const stopSpeechRecognition = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setInterimSpeech('');
  };

  const startSpeechRecognition = () => {
    const SpeechRecognitionClass = (window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructorLike;
      webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
    }).SpeechRecognition || (window as unknown as {
      webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
    }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      addCommandLog('Mic is on. Speech-to-text is not available in this browser.', 'Mic', 'The sound bar is live. Use the text command input for command capture.', 'Mic live');
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = settings.primaryLanguage === 'Russian' ? 'ru-RU' : 'en-US';
    recognition.onresult = (event) => {
      let finalText = '';
      let interimText = '';
      const startIndex = event.resultIndex ?? 0;
      for (let index = startIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result[0]?.transcript || '';
        if (result.isFinal) finalText += transcript;
        else interimText += transcript;
      }
      setInterimSpeech(interimText.trim());
      if (finalText.trim()) {
        setManualCommand(finalText.trim());
        addCommandLog(finalText.trim(), 'Microphone', activeVoice.response, 'Recognized');
        typeSavenResponse(activeVoice.response);
      }
    };
    recognition.onerror = (event) => {
      setMicError(event.error ? 'Speech recognition: ' + event.error : 'Speech recognition stopped.');
    };
    recognition.onend = () => {
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopMicrophone = () => {
    if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    stopSpeechRecognition();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    audioContextRef.current?.close().catch(() => undefined);
    audioContextRef.current = null;
    analyserRef.current = null;
    setMicrophoneOpen(false);
    setAudioLevel(0);
  };

  useEffect(() => () => stopMicrophone(), []);

  const startMicrophone = async () => {
    setMicError('');
    if (microphoneOpen) {
      stopMicrophone();
      return;
    }
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setMicError('Microphone is not available in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) {
        setMicError('Audio engine is not available in this browser.');
        return;
      }
      const context = new AudioContextClass();
      const sourceNode = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.72;
      sourceNode.connect(analyser);
      streamRef.current = stream;
      audioContextRef.current = context;
      analyserRef.current = analyser;
      setMicrophoneOpen(true);
      addCommandLog('Mic is on for SAVEN command input.', 'Mic', 'Speak a command or use the text command field.', 'Listening');
      startSpeechRecognition();

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const voiceBand = data.slice(4, 84);
        const average = voiceBand.reduce((sum, value) => sum + value, 0) / voiceBand.length;
        const peak = Math.max(...voiceBand);
        const weighted = Math.round(((average * 0.72 + peak * 0.28) / 170) * 100 * (settings.voiceSensitivity / 66));
        const normalized = Math.max(0, Math.min(100, weighted));
        setAudioLevel(normalized);
        setAudioPeak((current) => Math.max(normalized, Math.round(current * 0.91)));
        animationRef.current = window.requestAnimationFrame(tick);
      };
      tick();
    } catch (error) {
      setMicError(error instanceof Error ? error.message : 'Microphone permission was not granted.');
      stopMicrophone();
    }
  };

  const speakVoicePreview = (text = activeVoice.response) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    addCommandLog(activeVoice.command, 'Voice test', text, 'Speaking');
    typeSavenResponse(text);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = Math.max(0.05, settings.voiceVolume / 100);
    utterance.rate = Math.max(0.82, Math.min(1.16, 0.9 + (settings.voiceSpeed - 50) / 220));
    utterance.pitch = settings.voicePersona === 'Very gentle' ? 0.94 : settings.voicePersona === 'Short and direct' ? 1.03 : 1;
    utterance.onstart = () => setVoiceSpeaking(true);
    utterance.onend = () => setVoiceSpeaking(false);
    utterance.onerror = () => setVoiceSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopVoicePreview = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setVoiceSpeaking(false);
  };

  const regulatorRows = [
    { key: 'cognitiveLoad', label: 'Cognitive load', low: 'Simple', high: 'Detailed', tone: 'blue' },
    { key: 'reminderIntensity', label: 'Reminder intensity', low: 'Gentle', high: 'Persistent', tone: 'gold' },
    { key: 'robotComfort', label: 'Robot comfort', low: 'Cautious', high: 'Open', tone: 'green' },
    { key: 'deviceAutomation', label: 'Device automation', low: 'Manual', high: 'Automatic', tone: 'blue' },
    { key: 'privacyLevel', label: 'Privacy protection', low: 'Open', high: 'Strict', tone: 'green' },
    { key: 'recoveryFocus', label: 'Recovery emphasis', low: 'Light', high: 'Focused', tone: 'gold' },
  ] as const;

  const toggleRows = [
    { key: 'caregiverFirst', label: 'Caregiver-first execution', text: 'Assign human helpers before devices or robots.', icon: UsersRound },
    { key: 'quietHours', label: 'Quiet hours protection', text: 'Suppress non-critical prompts during rest windows.', icon: Clock3 },
    { key: 'largeText', label: 'Large interface mode', text: 'Increase readability for recovery and senior use.', icon: Activity },
    { key: 'reducedMotion', label: 'Reduced motion', text: 'Keep transitions calm and avoid unnecessary animation.', icon: ShieldCheck },
    { key: 'familyDigest', label: 'Family daily digest', text: 'Send one calm summary instead of constant updates.', icon: UsersRound },
    { key: 'deviceTelemetry', label: 'Device telemetry', text: 'Allow wearable and home sensor confirmation signals.', icon: Watch },
    { key: 'robotReadiness', label: 'Robot readiness visible', text: 'Show robots as readiness and capability only.', icon: Bot },
    { key: 'robotPhysicalAction', label: 'Robot physical action', text: 'Permit physical robot execution after approval.', icon: Bot },
    { key: 'autoEscalation', label: 'Automatic escalation', text: 'Escalate unresolved support tasks through the chain.', icon: Waypoints },
    { key: 'biometricSharing', label: 'Biometric sharing', text: 'Share biometric context outside the primary circle.', icon: LockKeyhole },
    { key: 'exportTimeline', label: 'Timeline export', text: 'Allow verified action history export for review.', icon: ShieldCheck },
    { key: 'emergencyOnlyNight', label: 'Night emergency-only mode', text: 'At night, only urgent tasks can interrupt.', icon: Clock3 },
  ] as const;

  const systemRules = [
    { label: 'Active profile', value: settings.supportMode },
    { label: 'Primary environment', value: settings.activeEnvironment },
    { label: 'Confirmation logic', value: settings.confirmationMode },
    { label: 'Escalation chain', value: settings.escalationMode },
    { label: 'Night behavior', value: settings.emergencyOnlyNight ? 'Emergency only' : 'Standard reminders' },
    { label: 'Robot execution', value: settings.robotPhysicalAction ? 'Approval enabled' : 'Readiness only' },
    { label: 'Voice control', value: settings.voiceControl ? settings.wakePhrase : 'Disabled' },
    { label: 'Voice behavior', value: settings.voiceNightMode ? 'Quiet at night' : 'Standard voice' },
  ];

  const scheduleRows = [
    { time: '07:30', action: 'Morning orientation', owner: 'SAVEN voice', mode: settings.voiceReminders ? settings.voicePersona : settings.reminderTone },
    { time: '10:00', action: 'Hydration and mobility check', owner: 'Wearable tracker', mode: settings.deviceTelemetry ? 'Telemetry assisted' : 'Manual confirmation' },
    { time: '14:30', action: 'Recovery pacing review', owner: 'Caregiver', mode: settings.caregiverFirst ? 'Human first' : 'System first' },
    { time: '21:00', action: 'Evening continuity summary', owner: 'Family digest', mode: settings.quietHours ? 'Quiet delivery' : 'Normal delivery' },
  ];

  const voiceServices = [
    { label: 'Daily support', value: settings.voiceReminders ? 'Voice prompts active' : 'Visual only', active: settings.voiceReminders },
    { label: 'Verification', value: settings.voiceConfirmations ? 'Voice confirmation allowed' : 'Manual confirmation', active: settings.voiceConfirmations },
    { label: 'Caregiver flow', value: settings.voiceCaregiverOverride ? 'Remote pause allowed' : 'Local control only', active: settings.voiceCaregiverOverride },
    { label: 'Robotics', value: settings.robotPhysicalAction ? 'Approval voice check' : 'Readiness narration only', active: settings.robotReadiness },
    { label: 'Night support', value: settings.voiceNightMode ? 'Emergency-only voice' : 'Standard voice', active: settings.voiceNightMode },
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Settings" title="Adapt SAVEN to the person." text="Control how SAVEN behaves around one person: reminders, cognitive load, escalation, devices, robots, privacy, recovery emphasis, and verified execution rules." />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <div className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950 dark:ring-1 dark:ring-white/10">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Person Operating Profile</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Daily support behavior</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">These settings define how SAVEN should act before it creates tasks, assigns responsibility, or asks people to confirm reality.</p>
            </div>
            <StatusPill tone="green" label="System ready" />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <SelectLike label="Support mode" value={settings.supportMode} options={['Daily support', 'Recovery support', 'Senior recovery', 'Rehabilitation', 'Family monitoring']} onChange={(value) => updateSetting('supportMode', value)} />
            <SelectLike label="Reminder tone" value={settings.reminderTone} options={['Gentle', 'Calm and direct', 'Minimal', 'Voice-first', 'Caregiver-first']} onChange={(value) => updateSetting('reminderTone', value)} />
            <SelectLike label="Confirmation mode" value={settings.confirmationMode} options={['User only', 'Caregiver only', 'Caregiver + device', 'Device telemetry', 'Robot telemetry + human']} onChange={(value) => updateSetting('confirmationMode', value)} />
            <SelectLike label="Escalation mode" value={settings.escalationMode} options={['No escalation', 'Family first', 'Caregiver first', 'Environment admin', 'Clinical support']} onChange={(value) => updateSetting('escalationMode', value)} />
            <SelectLike label="Primary language" value={settings.primaryLanguage} options={['English', 'Russian', 'Spanish', 'Ukrainian', 'German']} onChange={(value) => updateSetting('primaryLanguage', value)} />
            <SelectLike label="Active environment" value={settings.activeEnvironment} options={['Home Recovery', 'Senior Living', 'Rehab Center', 'Hospital Discharge', 'Family Home']} onChange={(value) => updateSetting('activeEnvironment', value)} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950 dark:ring-1 dark:ring-white/10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">System Output</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Generated rules</h3>
          <div className="mt-5 space-y-2">
            {systemRules.map((rule) => (
              <div key={rule.label} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-2xl border border-slate-100 bg-[#f7f5f1] px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-900">
                <span className="text-slate-500 dark:text-slate-400">{rule.label}</span>
                <span className="text-right font-semibold text-slate-900 dark:text-white">{rule.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-sm backdrop-blur-xl transition-all hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/10 dark:border-white/10 dark:bg-slate-950 dark:ring-1 dark:ring-white/10 dark:hover:border-blue-300/30">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Voice Control</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Speak with SAVEN</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">Voice and text commands for support, verification, caregiver flow, devices, and robotics. The sound bar below reacts to the real microphone.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <StatusPill tone={settings.voiceControl ? 'green' : 'gold'} label={settings.voiceControl ? 'Voice active' : 'Voice paused'} />
            <button onClick={startMicrophone} className={(microphoneOpen ? 'bg-red-600 text-white shadow-lg shadow-red-950/35 ring-red-300/35' : 'bg-slate-950 text-white ring-slate-300/20 hover:bg-slate-800 dark:bg-white dark:text-slate-950') + ' rounded-full px-5 py-2.5 text-sm font-semibold ring-1 transition-all hover:-translate-y-0.5'}>
              <span className={(microphoneOpen ? 'bg-white animate-pulse dark:bg-white' : 'bg-slate-400') + ' mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle'} />
              {microphoneOpen ? 'Mic on' : 'Mic'}
            </button>
          </div>
        </div>

        <div className="mt-4 max-w-3xl">
          <MicLevelBar level={audioLevel} active={microphoneOpen} error={micError} onToggle={startMicrophone} />
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 dark:border-white/10 dark:bg-slate-900">
              <div className="flex flex-wrap gap-2">
                {voiceCommands.map((item) => (
                  <button key={item.id} onClick={() => setActiveVoiceCommand(item.id)} className={(item.id === activeVoiceCommand ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/25 ring-blue-300/30' : 'bg-white text-slate-700 ring-slate-200 hover:bg-blue-50 dark:bg-slate-950 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-slate-800') + ' max-w-full rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-all hover:-translate-y-0.5'}>
                    <span className="block max-w-[180px] truncate">{item.label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-950 dark:ring-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Command</p>
                <p className="mt-3 min-h-[56px] overflow-hidden break-words text-base font-semibold leading-7 text-slate-950 dark:text-blue-100">
                  {typedVoiceCommand}<span className="animate-pulse text-blue-500 dark:text-blue-300">|</span>
                </p>
              </div>
            </div>

            <label className="block rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 dark:border-white/10 dark:bg-slate-900">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Text command</span>
              <textarea value={manualCommand} onChange={(event) => setManualCommand(event.target.value)} rows={3} className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition-all placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-400/20 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-300/60" />
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={runTextCommand} className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-950/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-400">
                  Send
                </button>
                <button type="button" onClick={() => speakVoicePreview()} disabled={!settings.voiceControl} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition-all hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50">
                  Hear response
                </button>
                <button type="button" onClick={stopVoicePreview} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition-all hover:-translate-y-0.5 hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-slate-800">
                  Stop
                </button>
              </div>
            </label>
          </div>

          <div className="space-y-4">
            <div className={(voiceSpeaking ? 'ring-blue-300/40 shadow-blue-950/20' : 'ring-slate-100 dark:ring-white/10') + ' min-h-[236px] rounded-3xl border border-slate-100 bg-white p-4 shadow-sm ring-1 transition-all dark:border-white/10 dark:bg-slate-900'}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">SAVEN Response</p>
                <span className={(voiceSpeaking ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-200' : 'bg-slate-100 text-slate-500 dark:bg-slate-950 dark:text-slate-400') + ' rounded-full px-3 py-1 text-xs font-semibold'}>{voiceSpeaking ? 'Speaking' : 'Ready'}</span>
              </div>
              <p className="mt-4 max-h-[144px] overflow-y-auto break-words text-base font-semibold leading-7 text-slate-950 dark:text-white">
                {typedVoiceResponse}<span className="animate-pulse text-blue-500 dark:text-blue-300">|</span>
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 dark:border-white/10 dark:bg-slate-900">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Command log</p>
                <span className={(interimSpeech ? 'text-amber-600 dark:text-amber-300' : 'text-slate-500 dark:text-slate-400') + ' text-xs font-semibold'}>{interimSpeech ? 'Listening...' : 'Recent'}</span>
              </div>
              {interimSpeech && (
                <div className="mb-3 rounded-2xl border border-amber-300/30 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-400/10 dark:text-amber-100">
                  {interimSpeech}<span className="animate-pulse text-amber-500 dark:text-amber-200">|</span>
                </div>
              )}
              <div className="space-y-2">
                {commandLog.slice(0, 3).map((entry, index) => (
                  <div key={entry.time + '-' + entry.command + '-' + index} className="rounded-2xl border border-slate-100 bg-white px-4 py-3 transition-all hover:border-blue-200 hover:shadow-sm dark:border-white/10 dark:bg-slate-950 dark:hover:border-blue-300/40">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700 dark:bg-blue-500/15 dark:text-blue-100">{entry.source}</span>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-100">{entry.status}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 break-words text-sm font-semibold text-slate-950 dark:text-white">{entry.command}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <SelectLike label="Wake phrase" value={settings.wakePhrase} options={['Hey SAVEN', 'SAVEN help', 'Support please', 'Anna support', 'No wake phrase']} onChange={(value) => updateSetting('wakePhrase', value)} />
          <SelectLike label="Voice style" value={settings.voicePersona} options={['Warm neutral', 'Very gentle', 'Short and direct', 'Caregiver tone', 'Clinical calm']} onChange={(value) => updateSetting('voicePersona', value)} />
          <SettingSlider label="Mic sensitivity" low="Strict" high="Sensitive" value={settings.voiceSensitivity} tone="green" onChange={(value) => updateSetting('voiceSensitivity', value)} />
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950 dark:ring-1 dark:ring-white/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Voice coverage</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Voice and text commands for every SAVEN service</h3>
          </div>
          <StatusPill tone="blue" label="Command layer" />
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {voiceCommands.map((item) => (
            <button key={item.id} onClick={() => setActiveVoiceCommand(item.id)} className="rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-white/10 dark:bg-slate-900 dark:hover:border-blue-300/30">
              <span className="mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-slate-950 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25">{item.service}</span>
              <p className="font-semibold text-slate-950 dark:text-white">{item.label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.command}</p>
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {voiceServices.map((service) => (
            <div key={service.label} className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm dark:border-white/10 dark:bg-slate-900 dark:hover:border-blue-300/30">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="min-w-0 truncate font-semibold text-slate-950 dark:text-white">{service.label}</p>
                <span className={(service.active ? 'bg-emerald-500' : 'bg-slate-500') + ' h-2.5 w-2.5 shrink-0 rounded-full'} />
              </div>
              <p className="line-clamp-2 break-words text-sm leading-6 text-slate-500 dark:text-slate-400">{service.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950 dark:ring-1 dark:ring-white/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Regulators</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Tune the support engine</h3>
          </div>
          <StatusPill tone="blue" label="Live configuration" />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {regulatorRows.map((row) => (
            <SettingSlider key={row.key} label={row.label} low={row.low} high={row.high} value={settings[row.key]} tone={row.tone} onChange={(value) => updateSetting(row.key, value)} />
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950 dark:ring-1 dark:ring-white/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Permissions and switches</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Control what SAVEN is allowed to do</h3>
          </div>
          <StatusPill tone="gold" label="Human approval layer" />
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {toggleRows.map((row) => (
            <SettingToggle key={row.key} label={row.label} text={row.text} icon={row.icon} enabled={settings[row.key]} onToggle={() => updateSetting(row.key, !settings[row.key])} />
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.2),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(249,115,22,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(239,246,255,0.76),rgba(255,247,237,0.74))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.26),transparent_32%),radial-gradient(circle_at_88%_18%,rgba(249,115,22,0.18),transparent_30%),linear-gradient(135deg,rgba(6,14,28,0.96),rgba(15,23,42,0.86),rgba(35,24,10,0.66))] dark:ring-1 dark:ring-white/10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Robot Connection Center</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Connect robots as permissioned SAVEN endpoints.</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">Robots connect through readiness, capability, environment rules, device telemetry, human approval, and verification. SAVEN keeps physical action visible and controlled.</p>
          </div>
          <StatusPill tone={settings.robotReadiness ? 'green' : 'gold'} label={settings.robotReadiness ? 'Robot layer visible' : 'Robot layer paused'} />
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { label: 'Humanoid assistant', status: settings.robotReadiness ? 'Readiness visible' : 'Hidden', detail: 'Can receive approved support tasks and return telemetry.', icon: Bot, tone: 'blue' },
              { label: 'Mobility robot', status: settings.robotPhysicalAction ? 'Approval enabled' : 'Readiness only', detail: 'Physical support remains locked until approval is explicit.', icon: Bot, tone: 'gold' },
              { label: 'Wearable bridge', status: settings.deviceTelemetry ? 'Telemetry connected' : 'Manual only', detail: 'Wearable signals can support confirmation but cannot act alone.', icon: Watch, tone: 'green' },
              { label: 'Home environment', status: settings.activeEnvironment, detail: 'Room rules define where robots can move, wait, charge, and assist.', icon: Home, tone: 'blue' },
            ].map((item) => {
              const Icon = item.icon;
              const tone = item.tone === 'green' ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-300/20 dark:bg-emerald-500/10' : item.tone === 'gold' ? 'border-amber-200 bg-amber-50 dark:border-amber-300/20 dark:bg-amber-500/10' : 'border-blue-200 bg-blue-50 dark:border-blue-300/20 dark:bg-blue-500/10';
              return (
                <article key={item.label} className={'rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ' + tone}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/78 shadow-sm ring-1 ring-white/70 dark:bg-slate-950/70 dark:ring-white/10">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-semibold text-slate-950 dark:text-white">{item.label}</p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{item.status}</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.detail}</p>
                </article>
              );
            })}
          </div>

          <div className="rounded-3xl border border-white/70 bg-slate-950 p-5 text-white shadow-xl shadow-slate-950/20 dark:border-white/10 dark:ring-1 dark:ring-blue-300/20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Connection pipeline</p>
            <div className="mt-5 space-y-3">
              {[
                ['Register robot', 'Model, location, owner, capabilities'],
                ['Map permissions', 'Allowed rooms, allowed task types, human override'],
                ['Bind devices', 'Wearable, room sensors, bed, charging station'],
                ['Approval gate', 'Human confirms before physical action'],
                ['Verify result', 'Telemetry and person/caregiver confirmation'],
              ].map(([label, text], index) => (
                <div key={label} className="grid grid-cols-[34px_minmax(0,1fr)] gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-orange-500 text-xs font-semibold text-white">{index + 1}</span>
                  <div>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-300">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SettingToggle label="Robot readiness visible" text="Show robots as available support endpoints." icon={Bot} enabled={settings.robotReadiness} onToggle={() => updateSetting('robotReadiness', !settings.robotReadiness)} />
          <SettingToggle label="Robot physical action" text="Permit physical execution only after approval." icon={Bot} enabled={settings.robotPhysicalAction} onToggle={() => updateSetting('robotPhysicalAction', !settings.robotPhysicalAction)} />
          <SettingToggle label="Device telemetry bridge" text="Use devices to verify robot-supported actions." icon={Watch} enabled={settings.deviceTelemetry} onToggle={() => updateSetting('deviceTelemetry', !settings.deviceTelemetry)} />
          <SettingToggle label="Caregiver override" text="Allow caregiver pause, stop, and reassignment." icon={ShieldCheck} enabled={settings.voiceCaregiverOverride} onToggle={() => updateSetting('voiceCaregiverOverride', !settings.voiceCaregiverOverride)} />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950 dark:ring-1 dark:ring-white/10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Daily rule schedule</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">How the settings become actions</h3>
          <div className="mt-6 space-y-3">
            {scheduleRows.map((row) => (
              <div key={row.time} className="grid gap-3 rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 dark:border-white/10 dark:bg-slate-900 md:grid-cols-[80px_minmax(0,1fr)_180px] md:items-center">
                <span className="rounded-full bg-white px-3 py-1 text-center text-sm font-semibold text-slate-600 shadow-sm dark:bg-slate-950 dark:text-slate-200 dark:ring-1 dark:ring-white/10">{row.time}</span>
                <div>
                  <p className="font-semibold text-slate-950 dark:text-white">{row.action}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Owner: {row.owner}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-center text-xs font-semibold text-blue-700 dark:bg-slate-950 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25">{row.mode}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-sm dark:border-white/10 dark:ring-1 dark:ring-blue-300/20">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">Configuration Summary</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight">SAVEN will act calmly, visibly, and with permission.</h3>
          <div className="mt-6 grid gap-3">
            <SummaryLine label="Automation" value={settings.deviceAutomation > 60 ? 'Device-assisted' : 'Mostly manual'} />
            <SummaryLine label="Robot policy" value={settings.robotPhysicalAction ? 'Approval required' : 'Readiness only'} />
            <SummaryLine label="Cognitive load" value={settings.cognitiveLoad < 45 ? 'Reduced' : 'Detailed'} />
            <SummaryLine label="Escalation" value={settings.autoEscalation ? settings.escalationMode : 'Manual only'} />
          </div>
          <div className="mt-6 rounded-3xl bg-slate-900 p-4 text-sm leading-6 text-slate-300 ring-1 ring-white/10">
            Current settings are local UI state for development. The next backend phase can persist them as SAVEN profile rules, environment permissions, and verification policies.
          </div>
        </div>
      </section>
    </div>
  );
}

function meterColor(index: number, total = 28) {
  const ratio = index / Math.max(1, total - 1);
  if (ratio < 0.6) return '#22c55e';
  if (ratio < 0.82) return '#f59e0b';
  return '#ef4444';
}

function MicLevelBar({ level, active, error, onToggle }: { level: number; active: boolean; error: string; onToggle: () => void }) {
  const bars = Array.from({ length: 28 });
  const activeBars = Math.max(active ? 2 : 0, Math.round((level / 100) * bars.length));
  const clip = level > 84;

  return (
    <div className={(active ? 'border-red-200 bg-red-50/75 dark:border-red-300/30 dark:bg-red-950/20' : 'border-slate-100 bg-[#f7f5f1] dark:border-white/10 dark:bg-slate-900') + ' rounded-2xl border px-3 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:ring-1 dark:ring-white/10'}>
      <div className="grid gap-3 sm:grid-cols-[92px_minmax(0,1fr)_72px] sm:items-center">
        <button onClick={onToggle} className={(active ? 'bg-red-600 text-white shadow-md shadow-red-950/25 ring-red-300/35' : 'bg-slate-950 text-slate-100 ring-white/10 hover:bg-slate-800') + ' inline-flex h-9 items-center justify-center rounded-full px-3 text-xs font-semibold ring-1 transition-all hover:-translate-y-0.5'}>
          <span className={(active ? 'bg-white animate-pulse' : 'bg-slate-500') + ' mr-2 inline-block h-2 w-2 rounded-full'} />
          {active ? 'On' : 'Mic'}
        </button>

        <div className="min-w-0">
          <div className="relative overflow-hidden rounded-xl bg-slate-950 p-1.5 shadow-inner ring-1 ring-slate-900/10 dark:ring-white/10">
            <div className="flex h-5 items-center gap-1">
              {bars.map((_, index) => {
                const lit = index < activeBars;
                const color = meterColor(index, bars.length);
                return (
                  <span
                    key={index}
                    className="h-full min-w-0 flex-1 rounded-[3px] transition-all duration-75"
                    style={{
                      backgroundColor: lit ? color : 'rgba(51,65,85,0.72)',
                      opacity: lit ? 1 : 0.42,
                      transform: lit ? 'scaleY(1)' : 'scaleY(0.5)',
                      boxShadow: lit ? '0 0 8px ' + color + '55' : 'none',
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 sm:block sm:text-right">
          <span className={(active ? 'text-red-600 dark:text-red-300' : 'text-slate-500 dark:text-slate-400') + ' text-[11px] font-semibold uppercase tracking-[0.14em]'}>
            {active ? 'Live' : 'Muted'}
          </span>
          <span className={(clip ? 'bg-red-600 text-white' : 'bg-white text-slate-700 dark:bg-slate-950 dark:text-slate-200') + ' mt-0 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-slate-200 dark:ring-white/10 sm:mt-1'}>
            {clip ? 'High' : level + '%'}
          </span>
        </div>
      </div>
      {error && <p className="mt-2 truncate text-[11px] font-semibold text-red-500">{error}</p>}
    </div>
  );
}

function SettingSlider({ label, low, high, value, tone, onChange }: { label: string; low: string; high: string; value: number; tone: 'blue' | 'gold' | 'green'; onChange: (value: number) => void }) {
  const color = tone === 'green' ? 'accent-emerald-500 dark:accent-emerald-300' : tone === 'gold' ? 'accent-amber-500 dark:accent-amber-300' : 'accent-blue-500 dark:accent-blue-300';
  const barColor = tone === 'green' ? 'bg-emerald-500' : tone === 'gold' ? 'bg-amber-500' : 'bg-blue-500';
  return (
    <div className="rounded-3xl border border-slate-100 bg-[#f7f5f1] p-5 dark:border-white/10 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-white">{label}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{low} to {high}</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-100 dark:ring-1 dark:ring-white/10">{value}%</span>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-950">
        <div className={'h-full rounded-full transition-all duration-500 ' + barColor} style={{ width: value + '%' }} />
      </div>
      <input aria-label={label} type="range" min="0" max="100" value={value} onChange={(event) => onChange(Number(event.target.value))} className={'mt-4 w-full cursor-pointer ' + color} />
    </div>
  );
}

function SettingToggle({ label, text, icon: Icon, enabled, onToggle }: { label: string; text: string; icon: typeof Activity; enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={
      'group flex min-h-[128px] gap-4 rounded-3xl border p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 ' +
      (enabled
        ? 'border-emerald-200 bg-emerald-50 text-emerald-900 hover:border-emerald-300 dark:border-emerald-300/25 dark:bg-slate-900 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/15'
        : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300 dark:ring-1 dark:ring-white/10')
    }>
      <span className={
        'grid h-11 w-11 shrink-0 place-items-center rounded-2xl ring-1 transition-transform group-hover:scale-105 ' +
        (enabled
          ? 'bg-emerald-600 text-white ring-emerald-500/20 dark:bg-emerald-500 dark:text-white dark:ring-emerald-300/30'
          : 'bg-slate-100 text-slate-500 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-white/10')
      }>
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-3">
          <span className="text-base font-semibold text-slate-950 dark:text-white">{label}</span>
          <span className={
            'relative h-6 w-11 shrink-0 rounded-full transition-colors ' +
            (enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700')
          }>
            <span className={
              'absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ' +
              (enabled ? 'translate-x-6' : 'translate-x-1')
            } />
          </span>
        </span>
        <span className="mt-2 block text-sm leading-6 opacity-80">{text}</span>
      </span>
    </button>
  );
}

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/82 p-7 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-200/20 blur-3xl dark:bg-slate-950/70 dark:ring-1 dark:ring-blue-300/15" />
      <div className="relative">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
      <h2 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">{title}</h2>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">{text}</p>
      </div>
    </section>
  );
}

function LayeredPanel({ title, text, items }: { title: string; text: string; items: string[] }) {
  return (
    <article className="group rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 dark:hover:border-blue-300/30 dark:hover:bg-slate-900/80">
      <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-[#f7f5f1] px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-950/65 dark:text-slate-200 dark:ring-1 dark:ring-white/10">{item}</span>
        ))}
      </div>
    </article>
  );
}

function ReadinessCard({ title, subtitle, status, lines, items }: { title: string; subtitle: string; status: string; lines: string[]; items: string[] }) {
  return (
    <article className="group rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 dark:hover:border-blue-300/30 dark:hover:bg-slate-900/80">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{subtitle}</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{title}</h3>
        </div>
        <RobotBadge status={status} />
      </div>
      <div className="mt-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        {lines.map((line) => <p key={line}>{line}</p>)}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((item) => <span key={item} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-slate-950/70 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25">{item}</span>)}
      </div>
    </article>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/92 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-300 dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-300/50"
      />
    </label>
  );
}

function SelectLike({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/92 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-300 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:focus:border-blue-300/50"
      >
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function SummaryLine({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-2 last:border-b-0 dark:border-white/10">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-right font-semibold text-slate-800 dark:text-white">{value || 'Not set'}</span>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white/80 p-4 shadow-sm dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-white">{value}</p>
    </div>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  const color =
    tone === 'green'
      ? 'border-emerald-100 bg-gradient-to-br from-emerald-50 to-white text-emerald-700 dark:border-emerald-300/25 dark:from-slate-950/90 dark:to-emerald-950/45 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/15'
      : tone === 'amber'
        ? 'border-amber-100 bg-gradient-to-br from-amber-50 to-white text-amber-700 dark:border-amber-300/25 dark:from-slate-950/90 dark:to-amber-950/45 dark:text-amber-100 dark:ring-1 dark:ring-amber-300/15'
        : 'border-blue-100 bg-gradient-to-br from-blue-50 to-white text-blue-700 dark:border-blue-300/25 dark:from-slate-950/90 dark:to-blue-950/45 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/15';
  return (
    <div className={`rounded-[2rem] border p-5 shadow-sm ${color}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-3 text-5xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function StatusPill({ label, tone }: { label: string; tone: 'blue' | 'gold' | 'green' }) {
  const color =
    tone === 'green'
      ? 'border border-emerald-200 bg-emerald-100 text-emerald-900 dark:border-emerald-300/30 dark:bg-slate-950/75 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/25'
      : tone === 'gold'
        ? 'border border-amber-200 bg-amber-100 text-amber-900 dark:border-amber-300/30 dark:bg-slate-950/75 dark:text-amber-100 dark:ring-1 dark:ring-amber-300/25'
        : 'border border-blue-200 bg-blue-100 text-blue-900 dark:border-blue-300/30 dark:bg-slate-950/75 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25';
  return <span className={`rounded-full px-4 py-2 font-semibold shadow-sm ${color}`}>{label}</span>;
}

function StatusBadge({ status }: { status: SupportTask['status'] }) {
  const color =
    status === 'completed'
      ? 'bg-emerald-50 text-emerald-700 dark:bg-slate-950/70 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/25'
      : status === 'pending_confirmation' || status === 'needs_attention' || status === 'delayed'
        ? 'bg-amber-50 text-amber-700 dark:bg-slate-950/70 dark:text-amber-100 dark:ring-1 dark:ring-amber-300/25'
        : status === 'active'
          ? 'bg-blue-50 text-blue-700 dark:bg-slate-950/70 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25'
          : 'bg-slate-100 text-slate-600 dark:bg-slate-950/65 dark:text-slate-200 dark:ring-1 dark:ring-white/10';
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-black/0 dark:ring-white/10 ${color}`}>{status.replace(/_/g, ' ')}</span>;
}

function PriorityBadge({ priority }: { priority: SupportTask['priority'] }) {
  const color =
    priority === 'high'
      ? 'bg-amber-50 text-amber-700 dark:bg-slate-950/70 dark:text-amber-100 dark:ring-1 dark:ring-amber-300/25'
      : priority === 'low'
        ? 'bg-slate-100 text-slate-600 dark:bg-slate-950/65 dark:text-slate-200 dark:ring-1 dark:ring-white/10'
        : 'bg-blue-50 text-blue-700 dark:bg-slate-950/70 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25';
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-black/0 dark:ring-white/10 ${color}`}>{priority}</span>;
}

function RobotBadge({ status }: { status: string }) {
  const color =
    status === 'ready' || status === 'online'
      ? 'bg-emerald-50 text-emerald-700 dark:bg-slate-950/70 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/25'
      : status === 'limited' || status === 'maintenance'
        ? 'bg-amber-50 text-amber-700 dark:bg-slate-950/70 dark:text-amber-100 dark:ring-1 dark:ring-amber-300/25'
        : status === 'standby'
          ? 'bg-blue-50 text-blue-700 dark:bg-slate-950/70 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25'
          : 'bg-slate-100 text-slate-600 dark:bg-slate-950/65 dark:text-slate-200 dark:ring-1 dark:ring-white/10';
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-black/0 dark:ring-white/10 ${color}`}>{status}</span>;
}
