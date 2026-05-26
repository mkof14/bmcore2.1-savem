import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  CalendarCheck,
  ClipboardCheck,
  Clock3,
  Cpu,
  HeartPulse,
  Home,
  LockKeyhole,
  MessageSquareText,
  Mic,
  PhoneCall,
  Radar,
  ShieldCheck,
  UserRound,
  UsersRound,
  Waypoints,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import BackButton from '../components/BackButton';
import SEO from '../components/SEO';
import { SavenCareRoutes } from '../features/saven/pages/SavenCareRoutesPage';
import { SavenSettings } from '../features/saven/pages/SavenSettingsPage';
import { SavenFAQ } from '../features/saven/pages/SavenFAQPage';
import { SavenLearningCenter } from '../features/saven/pages/SavenLearningCenterPage';
import { ContinuityOperations, DailySupportPlanBuilder, SavenCommandCenter, TaskLifecycleService, VerificationPolicyBuilder } from '../features/saven/pages/SavenOperationalPages';
import { HumanSupportTimeline, RecoveryMode, SupportCircle } from '../features/saven/pages/SavenHumanCircleRecoveryPages';
import { TodaySupport } from '../features/saven/pages/SavenTodayPage';
import { DualModeArchitecture, SupportFlowGraphic, SupportFlowPage } from '../features/saven/pages/SavenModesFlowPages';
import { LifeSetup, SupportProfile } from '../features/saven/pages/SavenLifeSetupPage';
import { VerificationCenter } from '../features/saven/pages/SavenVerificationPage';
import { EnvironmentSystem } from '../features/saven/pages/SavenEnvironmentsPage';
import { RobotReadiness } from '../features/saven/pages/SavenRobotsPage';
import { DeviceReadiness } from '../features/saven/pages/SavenDevicesPage';
import { createSavenCommandExecutionPlan } from '../features/saven/services/savenCommandExecutionService';
import { createSavenCommandPermissionReview } from '../features/saven/services/savenCommandPermissionService';
import { savenMockState } from '../features/saven/mock/savenMockState';

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
  | 'app-commands'
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
  { id: 'app-commands', label: 'Commands', icon: Mic },
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
  if (path === '/app/saven/commands') return 'app-commands';
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
  'app-commands': '/app/saven/commands',
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
          {activePage === 'app-today' && <TodaySupport setup={setup} openPage={(pageId) => openPage(pageId)} profileCreated={profileCreated} />}
          {activePage === 'app-profile' && <SupportProfile setup={setup} openPage={(pageId) => openPage(pageId)} />}
          {activePage === 'app-modes' && <DualModeArchitecture />}
          {activePage === 'app-command' && <SavenCommandCenter />}
          {activePage === 'app-commands' && <SavenCommandsPage openPage={openPage} />}
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
        <p className="mb-3 px-3 text-sm font-semibold tracking-[0.06em] text-gray-500 dark:text-gray-500">Public Site</p>
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
        <p className="mt-2 text-base leading-6 text-gray-600 dark:text-gray-300">
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
            <p className="mb-5 text-sm font-semibold tracking-[0.06em] text-orange-100">Public SAVEN Website</p>
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
            <p className="mb-3 text-sm font-semibold tracking-[0.08em] text-orange-600 dark:text-orange-300">Public Website vs Real System</p>
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white md:text-4xl">
              SAVEN now has a visible entry into the real support operating system.
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
              The public website explains the concept. The real system handles Life Setup, Today's Support, verified actions, support circle, devices, robots, recovery mode, and verification.
            </p>
          </div>
          <div className="border border-emerald-200 bg-emerald-50 p-6 shadow-sm dark:border-emerald-400/20 dark:bg-emerald-950/30">
            <p className="text-sm font-semibold tracking-[0.08em] text-emerald-700 dark:text-emerald-300">Real system entry</p>
            <h3 className="mt-3 text-2xl font-semibold text-gray-950 dark:text-white">Start SAVEN</h3>
            <p className="mt-2 text-base leading-6 text-gray-700 dark:text-gray-300">
              Create a profile, connect people, and start verified daily help.
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
              <p className="mt-5 text-sm font-semibold tracking-[0.06em] text-orange-600 dark:text-orange-300">{page.eyebrow}</p>
              <h3 className="mt-2 text-xl font-semibold text-gray-950 dark:text-white">{page.label}</h3>
              <p className="mt-2 text-base leading-6 text-gray-600 dark:text-gray-300">{page.summary}</p>
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
            <p className="mb-4 text-sm font-semibold tracking-[0.06em] text-orange-600 dark:text-orange-300">{page.eyebrow}</p>
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
              <p className="text-sm font-semibold tracking-[0.06em] text-orange-100">SAVEN</p>
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
            {page.visualNote && <p className="px-2 pt-3 text-base leading-6 text-gray-600 dark:text-gray-300">{page.visualNote}</p>}
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
    <div className="saven-calm-density relative min-h-screen overflow-hidden bg-[#f7f5f1] text-slate-950 dark:bg-[#07111f] dark:text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(91,143,201,0.24),transparent_30%),radial-gradient(circle_at_90%_0%,rgba(198,155,72,0.2),transparent_26%),radial-gradient(circle_at_70%_95%,rgba(4,120,87,0.13),transparent_30%),linear-gradient(180deg,#fbfaf7,#f2efe8)] dark:bg-[radial-gradient(circle_at_12%_8%,rgba(91,143,201,0.25),transparent_32%),radial-gradient(circle_at_88%_4%,rgba(198,155,72,0.16),transparent_28%),radial-gradient(circle_at_70%_92%,rgba(16,185,129,0.1),transparent_30%),linear-gradient(180deg,#07111f,#0f172a_48%,#111827)]" />
      <div className="relative grid min-h-screen lg:grid-cols-[258px_1fr]">
        <aside className="hidden border-r border-white/60 bg-white/72 px-3 py-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#081422]/80 lg:block">
          <BackButton onNavigate={onNavigate} label="Back to BioMath Core" />
          <button onClick={() => openPage('app-start')} className="group mt-4 flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition-all hover:bg-white/70 dark:hover:bg-white/[0.07]">
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-slate-950 shadow-sm ring-1 ring-white/50 transition-transform group-hover:scale-105 dark:ring-white/10">
              <img src="/saven-mark.png" alt="SAVEN" className="h-full w-full object-cover" />
            </span>
            <span>
              <span className="block text-xl font-semibold tracking-tight text-slate-950 dark:text-white">SAVEN</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">Daily support</span>
            </span>
          </button>
          <div className="mt-4 overflow-hidden rounded-2xl border border-blue-200/60 bg-[linear-gradient(135deg,#ffffff,#eff6ff_52%,#fff7ed)] p-3 shadow-sm shadow-blue-950/5 dark:border-blue-300/15 dark:bg-[linear-gradient(135deg,#06101f,#0b1728_58%,#21170b)] dark:ring-1 dark:ring-blue-300/10">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold tracking-[0.06em] text-blue-700 dark:text-blue-100">Support active</p>
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.85)]" />
            </div>
            <p className="mt-2 text-base font-semibold tracking-tight text-slate-950 dark:text-white">Anna Roberts</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-blue-500/12 px-2.5 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-400/15 dark:text-blue-100">Home Recovery</span>
              <span className="rounded-full bg-orange-500/12 px-2.5 py-1 text-xs font-semibold text-orange-800 dark:bg-orange-400/15 dark:text-orange-100">Live circle</span>
            </div>
          </div>
          <nav className="mt-4 space-y-0.5">
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
                  className={`group relative flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm font-semibold transition-all ${
                    isActive ? 'bg-white text-slate-950 shadow-sm shadow-slate-950/8 ring-1 ring-blue-200/70 dark:bg-slate-900 dark:text-blue-100 dark:ring-blue-300/25' : 'text-slate-600 hover:bg-white/80 hover:text-slate-950 hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-900/80 dark:hover:text-white'
                  }`}
                >
                  {isActive && <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-full bg-gradient-to-b ${navTone}`} />}
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ring-1 transition-all group-hover:scale-105 ${isActive ? 'bg-gradient-to-br ' + navTone + ' text-white shadow-md shadow-blue-950/15 ring-white/20' : 'bg-slate-100 text-slate-500 ring-slate-200/70 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm dark:bg-slate-950/65 dark:text-slate-300 dark:ring-white/10 dark:group-hover:bg-slate-900'}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>
          <button
            onClick={() => openPage('home')}
            className="mt-4 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white/60 px-3 py-2.5 text-left text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white"
          >
            BioMath site
            <ArrowRight className="h-4 w-4" />
          </button>
        </aside>
        <div className="min-w-0 pb-20 lg:pb-0">
          <header className="relative z-10 border-b border-white/70 bg-[#f7f5f1]/88 px-5 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#07111f]/88 sm:px-8 lg:px-10">
            <div className="mx-auto flex max-w-[1480px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.06em] text-slate-500 dark:text-slate-400">BioMath Core SAVEN</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">SAVEN support console</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <StatusPill tone="blue" label="Anna Roberts" />
                <StatusPill tone="gold" label="Home Recovery" />
                <StatusPill tone="green" label="Support active" />
                <StatusPill tone="blue" label="Next 15:00" />
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-[1480px] px-5 py-4 sm:px-8 lg:px-10">
            <SavenCommandStrip activePage={activePage} openPage={openPage} />
            <div className="mt-5">{children}</div>
          </main>
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
                className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-xs font-semibold ${
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





function SavenCommandsPage({ openPage }: { openPage: (pageId: SavenPageId) => void }) {
  const commandCatalog: Array<{
    id: string;
    group: string;
    label: string;
    target: string;
    command: string;
    page: SavenPageId;
    color: string;
    icon: typeof Mic;
    proof: string;
    route: string[];
  }> = [
    { id: 'caregiver', group: 'People', label: 'Caregiver', target: 'Maya Carter', command: 'Hey SAVEN, assign the next support task to Maya and require verification.', page: 'app-circle', color: 'blue', icon: UsersRound, proof: 'Task ready for Maya.', route: ['Assign', 'Notify', 'Verify'] },
    { id: 'nurse', group: 'Clinical', label: 'Nurse', target: 'Olivia Grant', command: 'Hey SAVEN, request nurse follow-up and send the recovery context.', page: 'app-care-routes', color: 'green', icon: PhoneCall, proof: 'Nurse follow-up prepared.', route: ['Context', 'Contact', 'Update'] },
    { id: 'doctor', group: 'Clinical', label: 'Doctor', target: 'Dr. Morris', command: 'Hey SAVEN, prepare a clinical summary for doctor review.', page: 'app-care-routes', color: 'blue', icon: ShieldCheck, proof: 'Doctor summary ready.', route: ['Collect', 'Summarize', 'Review'] },
    { id: 'family', group: 'People', label: 'Family', target: 'Daniel Roberts', command: 'Hey SAVEN, send the family a calm daily update.', page: 'app-care-routes', color: 'gold', icon: UsersRound, proof: 'Family update drafted.', route: ['Digest', 'Send', 'Quiet'] },
    { id: 'robot', group: 'Physical', label: 'Robot', target: 'Mobility robot', command: 'Hey SAVEN, check robot readiness and keep physical action approval locked.', page: 'app-robots', color: 'gold', icon: Bot, proof: 'Robot stays permissioned.', route: ['Ready', 'Lock', 'Approve'] },
    { id: 'device', group: 'Physical', label: 'Device', target: 'Wearable sensors', command: 'Hey SAVEN, check device telemetry for verification.', page: 'app-devices', color: 'green', icon: Cpu, proof: 'Telemetry supports proof.', route: ['Signal', 'Verify', 'Record'] },
    { id: 'environment', group: 'Rules', label: 'Room', target: 'Home Recovery', command: 'Hey SAVEN, show environment permissions before support action.', page: 'app-environments', color: 'blue', icon: Waypoints, proof: 'Room rules checked.', route: ['Room', 'Rule', 'Allow'] },
    { id: 'emergency', group: 'Escalation', label: 'Emergency', target: 'Emergency path', command: 'Hey SAVEN, show emergency escalation rules.', page: 'app-care-routes', color: 'red', icon: AlertCircle, proof: 'Escalation path visible.', route: ['Urgent', 'Call', 'Log'] },
  ];
  const [activeId, setActiveId] = useState('nurse');
  const active = commandCatalog.find((item) => item.id === activeId) || commandCatalog[0];
  const [draftCommand, setDraftCommand] = useState(active.command);

  useEffect(() => {
    setDraftCommand(active.command);
  }, [active.command]);

  const commandPlan = createSavenCommandExecutionPlan({
    source: draftCommand.toLowerCase().startsWith('hey saven') ? 'voice' : 'text',
    text: draftCommand,
    targetTaskId: 'task-mobility-1030',
  });

  const permissionReview = createSavenCommandPermissionReview(savenMockState, commandPlan.input);

  const colorMap: Record<string, string> = {
    blue: 'border-blue-200 bg-blue-50 text-slate-950 ring-1 ring-blue-200/70 dark:border-blue-300/25 dark:bg-[#07111f] dark:text-white dark:ring-blue-300/12',
    green: 'border-emerald-200 bg-emerald-50 text-slate-950 ring-1 ring-emerald-200/70 dark:border-emerald-300/25 dark:bg-[#061a17] dark:text-white dark:ring-emerald-300/12',
    gold: 'border-amber-200 bg-amber-50 text-slate-950 ring-1 ring-amber-200/70 dark:border-amber-300/25 dark:bg-[#1f1608] dark:text-white dark:ring-amber-300/12',
    red: 'border-red-200 bg-red-50 text-slate-950 ring-1 ring-red-200/70 dark:border-red-300/25 dark:bg-[#210d12] dark:text-white dark:ring-red-300/12',
  };
  const accentMap: Record<string, string> = {
    blue: 'from-blue-500 to-cyan-400',
    green: 'from-emerald-500 to-teal-300',
    gold: 'from-amber-400 to-orange-400',
    red: 'from-red-500 to-orange-400',
  };
  const operatingChain: Array<{
    label: string;
    title: string;
    detail: string;
    page: SavenPageId;
    tone: string;
  }> = [
    { label: 'Command', title: 'Speak or type once', detail: 'SAVEN turns intent into route, owner, proof, and next move.', page: 'app-commands', tone: 'from-blue-500 to-cyan-300' },
    { label: 'Human', title: 'Assign responsibility', detail: 'Caregiver, family, nurse, doctor, or emergency path becomes visible.', page: 'app-care-routes', tone: 'from-emerald-500 to-teal-300' },
    { label: 'Physical', title: 'Check endpoints', detail: 'Robots and devices report readiness while action stays gated.', page: 'app-robots', tone: 'from-amber-400 to-orange-400' },
    { label: 'Room', title: 'Permission gate', detail: 'SAVEN checks environment rules before physical support moves.', page: 'app-environments', tone: 'from-indigo-500 to-blue-400' },
    { label: 'Proof', title: 'Confirm reality', detail: 'Human confirmation and scoped signals update continuity.', page: 'app-verification', tone: 'from-emerald-400 to-blue-400' },
    { label: 'Continue', title: 'Next support window', detail: 'The day settles into the next calm action.', page: 'app-continuity', tone: 'from-orange-400 to-red-400' },
  ];

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_10%_12%,rgba(59,130,246,0.22),transparent_28%),radial-gradient(circle_at_92%_18%,rgba(249,115,22,0.15),transparent_26%),linear-gradient(135deg,rgba(3,9,20,0.98),rgba(8,20,38,0.94),rgba(30,19,12,0.72))] p-6 text-white shadow-xl shadow-slate-950/20 ring-1 ring-white/10">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px] xl:items-stretch">
          <div>
            <p className="text-sm font-semibold tracking-[0.08em] text-blue-100">SAVEN Dispatch</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">Voice becomes assigned support.</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-200">Speak once. SAVEN turns it into owner, route, proof, and next move.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Voice path', 'Typed path', 'Humans', 'Robots', 'Urgent'].map((item, index) => (
                <span key={item} className={(index === 0 ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-100 ring-1 ring-white/15 dark:bg-slate-950/60 dark:text-slate-200 dark:ring-white/10') + ' rounded-full px-4 py-2 text-sm font-semibold shadow-sm'}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-blue-300/20 bg-[#07111f]/95 p-4 text-white shadow-xl shadow-slate-950/20 ring-1 ring-white/10">
            <div className="flex items-center gap-3">
              <span className={'grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-sm ' + accentMap[active.color]}>
                <MessageSquareText className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold tracking-[0.06em] text-blue-100/75">Command pad</p>
                <h3 className="mt-1 text-xl font-semibold text-white">{active.label}</h3>
              </div>
            </div>
            <textarea
              value={draftCommand}
              onChange={(event) => setDraftCommand(event.target.value)}
              data-saven-command-pad-input="true"
              spellCheck={false}
              style={{ backgroundColor: '#07111f', color: '#f8fafc', caretColor: '#60a5fa', WebkitTextFillColor: '#f8fafc' }}
              className="mt-4 min-h-[84px] w-full resize-none rounded-3xl border border-blue-200/20 px-4 py-3 text-sm font-semibold leading-6 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-500/20"
            />
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button onClick={() => openPage(active.page)} className="rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-500">
                Open route
              </button>
              <button onClick={() => openPage('app-settings')} className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-50">
                Mic settings
              </button>
            </div>
            <div className="mt-3 rounded-3xl border border-white/10 bg-white/[0.06] p-3" data-saven-command-execution-loop="true">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-100 ring-1 ring-blue-300/20">{commandPlan.intent.replace(/_/g, ' ')}</span>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-300/20">{Math.round(commandPlan.confidence * 100)}%</span>
                <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-100 ring-1 ring-amber-300/20">{commandPlan.safetyGate.replace(/_/g, ' ')}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-300">{commandPlan.nextAction}</p>
            </div>
            <div className="mt-3 rounded-3xl border border-emerald-300/15 bg-emerald-500/[0.07] p-3" data-saven-command-permission-review="true">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-300/20">{permissionReview.decision.replace(/_/g, ' ')}</span>
                <span className="rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-slate-200 ring-1 ring-white/10">{permissionReview.requiredPermission}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-300">{permissionReview.handoff}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-blue-300/18 bg-[#07111f] p-5 text-white shadow-xl shadow-slate-950/18 ring-1 ring-white/10" data-saven-operating-chain="true">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.06em] text-blue-100/70">SAVEN operating chain</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">One command travels through the whole support system.</h3>
          </div>
          <button onClick={() => openPage('app-today')} className="w-fit rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-50">
            Open Today
          </button>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-3 2xl:grid-cols-6">
          {operatingChain.map((step, index) => (
            <button
              key={step.label}
              onClick={() => openPage(step.page)}
              className="group min-h-[164px] rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-4 text-left shadow-sm ring-1 ring-white/5 transition-all hover:-translate-y-0.5 hover:border-blue-300/35 hover:bg-white/[0.1] hover:shadow-xl hover:shadow-blue-950/20"
            >
              <span className={'block h-1.5 w-16 rounded-full bg-gradient-to-r ' + step.tone} />
              <div className="mt-4 flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs font-semibold text-white ring-1 ring-white/10">{index + 1}</span>
                <p className="text-sm font-semibold tracking-[0.06em] text-slate-300">{step.label}</p>
              </div>
              <h4 className="mt-3 text-lg font-semibold leading-6 text-white">{step.title}</h4>
              <p className="mt-2 line-clamp-2 text-base leading-6 text-slate-300">{step.detail}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
          {commandCatalog.map((item) => {
            const Icon = item.icon;
            const activeCard = item.id === activeId;
            return (
              <button
                key={item.id}
                onClick={() => setActiveId(item.id)}
                className={(activeCard ? 'scale-[1.01] border-blue-300 shadow-xl shadow-blue-950/10 ring-4 ring-blue-500/10 dark:border-blue-300/40' : 'shadow-sm hover:-translate-y-0.5 hover:shadow-lg') + ' relative overflow-hidden rounded-[1.5rem] border p-3 text-left transition-all ' + colorMap[item.color]}
              >
                <span className={'absolute left-0 top-0 h-1 w-full bg-gradient-to-r ' + accentMap[item.color]} />
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold tracking-[0.06em] text-slate-500 dark:text-slate-300/70">{item.group}</p>
                    <h3 className="mt-2 text-xl font-semibold">{item.label}</h3>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-600 dark:text-slate-300">{item.target}</p>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-slate-700 shadow-inner ring-1 ring-slate-200 dark:bg-slate-950/58 dark:text-white dark:ring-white/10">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-base font-semibold leading-6 text-slate-700 dark:text-slate-200">{item.command}</p>
              </button>
            );
          })}
        </div>

        <aside className="rounded-[2rem] border border-blue-300/18 bg-[#07111f] p-5 text-white shadow-xl shadow-slate-950/20 ring-1 ring-white/10">
          <p className="text-sm font-semibold tracking-[0.06em] text-blue-100/70">Execution route</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{active.target}</h3>
          <p className="mt-2 text-sm font-semibold text-blue-100">{active.proof}</p>
          <div className="mt-5 grid gap-2">
            {active.route.map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <span className={'grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br text-sm font-semibold text-white shadow-sm ' + accentMap[active.color]}>{index + 1}</span>
                <div className="min-w-0 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 ring-1 ring-white/10">
                  {step}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-3xl bg-black/35 p-4 text-white shadow-inner ring-1 ring-white/10">
            <p className="text-sm font-semibold tracking-[0.06em] opacity-65">Prepared command</p>
            <p className="mt-2 line-clamp-3 text-sm font-semibold leading-6">{draftCommand}</p>
          </div>
          <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.06] p-4">
            <p className="text-sm font-semibold tracking-[0.06em] text-blue-100/70">Intent route</p>
            <div className="mt-3 grid gap-2">
              {commandPlan.route.map((step) => (
                <span key={step} className="rounded-2xl bg-slate-950/75 px-3 py-2 text-xs font-semibold text-slate-200 ring-1 ring-white/10">{step}</span>
              ))}
            </div>
          </div>
          <div className="mt-4 rounded-3xl border border-emerald-300/15 bg-emerald-500/[0.07] p-4">
            <p className="text-sm font-semibold tracking-[0.06em] text-emerald-100/70">Permission review</p>
            <p className="mt-2 text-sm font-semibold text-white">{permissionReview.decision.replace(/_/g, ' ')}</p>
            <p className="mt-2 text-xs leading-5 text-slate-300">{permissionReview.reason}</p>
          </div>
        </aside>
      </section>
    </div>
  );
}



function SavenCommandStrip({ activePage, openPage }: { activePage: SavenPageId; openPage: (pageId: SavenPageId) => void }) {
  const [activeCommand, setActiveCommand] = useState('nurse');
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState('');
  const [levels, setLevels] = useState<number[]>(Array.from({ length: 12 }, () => 6));
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);
  const pageLabel = appNavItems.find((item) => item.id === activePage)?.label || 'SAVEN';
  const commands: Array<{ id: string; label: string; target: string; command: string; page: SavenPageId }> = [
    { id: 'caregiver', label: 'Caregiver', target: 'Maya Carter', command: 'Assign support task to Maya and require verification.', page: 'app-circle' },
    { id: 'nurse', label: 'Nurse', target: 'Nurse Olivia Grant', command: 'Request nurse follow-up and send recovery context.', page: 'app-care-routes' },
    { id: 'doctor', label: 'Doctor', target: 'Dr. Elena Morris', command: 'Prepare clinical summary for doctor review.', page: 'app-care-routes' },
    { id: 'robot', label: 'Robot', target: 'Mobility robot', command: 'Check robot readiness and keep physical approval locked.', page: 'app-robots' },
    { id: 'device', label: 'Device', target: 'Wearable + home sensors', command: 'Check device telemetry and use it for verification.', page: 'app-devices' },
    { id: 'emergency', label: 'Emergency', target: 'Emergency path', command: 'Show escalation rules and first contact.', page: 'app-care-routes' },
  ];
  const selected = commands.find((item) => item.id === activeCommand) || commands[0];

  const stopMic = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    setMicActive(false);
    setLevels(Array.from({ length: 12 }, () => 6));
  };

  useEffect(() => stopMic, []);

  const toggleMic = async () => {
    if (micActive) {
      stopMic();
      return;
    }
    setMicError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) throw new Error('AudioContext is not available in this browser.');
      const audioContext = new AudioContextCtor();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.72;
      audioContext.createMediaStreamSource(stream).connect(analyser);
      mediaStreamRef.current = stream;
      audioContextRef.current = audioContext;
      setMicActive(true);

      const data = new Uint8Array(analyser.frequencyBinCount);
      const update = () => {
        analyser.getByteFrequencyData(data);
        const barCount = 12;
        const bucketSize = Math.max(1, Math.floor(data.length / barCount));
        const next = Array.from({ length: barCount }, (_, index) => {
          let sum = 0;
          for (let offset = 0; offset < bucketSize; offset += 1) {
            sum += data[index * bucketSize + offset] || 0;
          }
          return Math.max(5, Math.round((sum / bucketSize / 255) * 100));
        });
        setLevels(next);
        animationRef.current = requestAnimationFrame(update);
      };
      update();
    } catch (error) {
      setMicError(error instanceof Error ? error.message : 'Microphone is not available.');
      stopMic();
    }
  };

  return (
    <section className="rounded-[1.35rem] border border-blue-200/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(239,246,255,0.78),rgba(255,247,237,0.62))] px-3 py-2.5 shadow-md shadow-blue-950/5 dark:border-blue-300/18 dark:bg-[linear-gradient(135deg,rgba(6,16,31,0.94),rgba(15,23,42,0.88),rgba(35,23,10,0.42))] dark:ring-1 dark:ring-blue-300/10">
      <div className="grid gap-2 xl:grid-cols-[168px_minmax(0,1fr)_260px] xl:items-center">
        <div className="flex min-w-0 items-center gap-2">
          <span className="relative grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-950 ring-1 ring-blue-300/30">
            <img src="/saven-mark.png" alt="" className="relative h-full w-full object-cover" />
            <span className={(micActive ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.85)]' : 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.85)]') + ' absolute bottom-0.5 right-0.5 h-1.5 w-1.5 rounded-full'} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[0.06em] text-blue-700 dark:text-blue-200">Voice rail</p>
            <p className="truncate text-xs font-semibold text-slate-950 dark:text-white">Ask SAVEN</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{pageLabel}</p>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1">
            {commands.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveCommand(item.id)}
                className={(item.id === activeCommand ? 'bg-blue-600 text-white shadow-sm shadow-blue-950/15 ring-blue-300/30' : 'bg-white/76 text-slate-700 ring-slate-200 hover:bg-white dark:bg-slate-950/62 dark:text-slate-200 dark:ring-white/10') + ' rounded-full px-2.5 py-1 text-xs font-semibold ring-1 transition-all hover:-translate-y-0.5'}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-1.5 min-w-0 rounded-2xl bg-white/64 px-3 py-1.5 text-slate-950 shadow-inner ring-1 ring-white/60 dark:bg-slate-950/48 dark:text-white dark:ring-white/10">
            <p className="truncate text-xs font-semibold">Hey SAVEN, {selected.command}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">Target: {selected.target}</p>
          </div>
        </div>

        <div className="grid gap-1.5 sm:grid-cols-[92px_1fr] sm:items-center">
          <button onClick={toggleMic} className={(micActive ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500') + ' rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5'}>
            {micActive ? 'Mic on' : 'Mic'}
          </button>
          <div className="min-w-0 rounded-2xl bg-slate-950 px-2.5 py-1.5 shadow-inner dark:bg-black/50">
            <div className="flex h-4 items-end gap-1">
              {levels.map((height, index) => (
                <span
                  key={index}
                  className={(height > 78 ? 'bg-red-400' : height > 52 ? 'bg-amber-300' : 'bg-emerald-400') + ' w-full rounded-full transition-[height,background-color] duration-75'}
                  style={{ height: height + '%' }}
                />
              ))}
            </div>
            <p className={(micError ? 'text-red-300' : 'text-slate-400') + ' mt-0.5 truncate text-sm font-semibold tracking-[0.06em]'}>
              {micError || (micActive ? 'Live level' : 'Mic level')}
            </p>
          </div>
          <button onClick={() => openPage(selected.page)} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-0.5 hover:bg-blue-50 dark:bg-slate-950 dark:text-slate-100 dark:ring-white/10">
            Service
          </button>
          <button onClick={() => openPage('app-commands')} className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-100">
            Commands
          </button>
        </div>
      </div>
    </section>
  );
}

function SavenVoiceLogoControl({ openPage }: { activePage: SavenPageId; openPage: (pageId: SavenPageId) => void }) {
  return (
    <button
      onClick={() => openPage('app-commands')}
      className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white/86 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:shadow-lg dark:border-blue-300/20 dark:bg-slate-950/75 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/15"
      aria-label="Open SAVEN voice and text commands"
    >
      <Mic className="h-4 w-4" />
      <span className="hidden sm:inline">Commands</span>
    </button>
  );
}

function SavenSystemStart({ openPage, profileCreated }: { openPage: (pageId: SavenPageId) => void; profileCreated: boolean }) {
  const dayNotes = [
    { label: 'Morning', text: 'Gentle check-in', tone: 'from-sky-400 to-blue-500' },
    { label: 'Midday', text: 'Real person assigned', tone: 'from-emerald-300 to-teal-500' },
    { label: 'Evening', text: 'Family updated calmly', tone: 'from-amber-300 to-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[radial-gradient(circle_at_12%_18%,rgba(56,189,248,0.24),transparent_30%),radial-gradient(circle_at_74%_12%,rgba(45,212,191,0.16),transparent_28%),radial-gradient(circle_at_84%_80%,rgba(251,146,60,0.2),transparent_30%),linear-gradient(135deg,#020817,#071426_52%,#21150e)] p-7 text-white shadow-2xl shadow-slate-950/24 ring-1 ring-white/10 md:p-8">
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent" />
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_430px] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-sm font-semibold text-cyan-100 shadow-sm ring-1 ring-white/10">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
              Real support system
            </div>
            <h2 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-white md:text-6xl">SAVEN turns a day into supported moments.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              A calm layer for family, caregivers, nurses, devices, and future robots. Ask once. SAVEN turns it into a person, a route, and proof.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => openPage(profileCreated ? 'app-today' : 'app-life-setup')} className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/20 transition-all hover:-translate-y-0.5 hover:bg-cyan-50 hover:shadow-xl">
                {profileCreated ? "Open today's support" : 'Begin setup'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button onClick={() => openPage('app-commands')} className="inline-flex items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-300/10 px-6 py-3 text-sm font-semibold text-cyan-100 shadow-sm ring-1 ring-white/10 transition-all hover:-translate-y-0.5 hover:bg-cyan-300/16">
                Try a voice command
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/62 p-5 shadow-2xl ring-1 ring-white/10">
            <div className="flex items-center gap-4">
              <img src="/saven-mark.png" alt="SAVEN" className="h-16 w-16 rounded-2xl object-cover shadow-lg ring-1 ring-white/15" />
              <div>
                <p className="text-sm font-semibold tracking-[0.08em] text-cyan-100/75">Today with SAVEN</p>
                <h3 className="mt-1 text-2xl font-semibold text-white">Anna is not alone.</h3>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {dayNotes.map((note) => (
                <div key={note.label} className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.07] p-3">
                  <span className={'h-2 rounded-full bg-gradient-to-r ' + note.tone} />
                  <div>
                    <p className="text-sm font-semibold text-white">{note.label}</p>
                    <p className="text-sm text-slate-300">{note.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-4">
              <p className="text-sm font-semibold text-emerald-100">Next calm action</p>
              <p className="mt-2 text-lg font-semibold leading-7 text-white">Request nurse follow-up and send recovery context.</p>
            </div>
          </div>
        </div>
      </section>

      <SavenOperatorShortcuts openPage={openPage} />

      <SavenStartPath openPage={openPage} />
    </div>
  );
}


function SavenOperatorShortcuts({ openPage }: { openPage: (pageId: SavenPageId) => void }) {
  const shortcuts: Array<{
    label: string;
    title: string;
    command: string;
    page: SavenPageId;
    tone: string;
    icon: typeof HeartPulse;
  }> = [
    {
      label: 'Start',
      title: 'Set up a person',
      command: 'Name, rhythm, comfort, circle.',
      page: 'app-life-setup',
      tone: 'from-blue-500 to-cyan-300',
      icon: UserRound,
    },
    {
      label: 'Today',
      title: 'See what matters now',
      command: 'Owner, next action, proof.',
      page: 'app-today',
      tone: 'from-emerald-500 to-teal-300',
      icon: HeartPulse,
    },
    {
      label: 'Voice',
      title: 'Speak a support command',
      command: 'Ask once. SAVEN routes it.',
      page: 'app-commands',
      tone: 'from-indigo-500 to-blue-400',
      icon: Mic,
    },
  ];

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#07111f] p-5 text-white shadow-xl shadow-slate-950/18 ring-1 ring-white/10" data-saven-start-shortcuts="true">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.06em] text-cyan-100/70">Choose a beginning</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">Start from life, not settings.</h3>
        </div>
        <button onClick={() => openPage('app-commands')} className="w-fit rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-cyan-50">
          Open commands
        </button>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {shortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => openPage(item.page)}
              className="group min-h-[150px] rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-4 text-left shadow-sm ring-1 ring-white/5 transition-all hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-white/[0.1] hover:shadow-xl hover:shadow-cyan-950/20"
            >
              <div className="flex items-center justify-between gap-3">
                <span className={'grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-sm ' + item.tone}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200 ring-1 ring-white/10">{item.label}</span>
              </div>
              <h4 className="mt-4 text-xl font-semibold leading-6 text-white">{item.title}</h4>
              <p className="mt-2 text-base leading-6 text-slate-300">{item.command}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}


function SavenStartPath({ openPage }: { openPage: (pageId: SavenPageId) => void }) {
  const pathItems: Array<{
    title: string;
    text: string;
    page: SavenPageId;
    tone: string;
  }> = [
    {
      title: 'Know the person',
      text: 'Comfort, language, home rhythm, support needs.',
      page: 'app-life-setup',
      tone: 'from-blue-400 to-cyan-300',
    },
    {
      title: 'Bring people close',
      text: 'Family, caregivers, nurse, doctor, escalation.',
      page: 'app-circle',
      tone: 'from-emerald-300 to-teal-400',
    },
    {
      title: 'Make help visible',
      text: 'Daily action, owner, proof, next support window.',
      page: 'app-today',
      tone: 'from-amber-300 to-orange-400',
    },
  ];

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#07111f] p-5 text-white shadow-xl shadow-slate-950/20 ring-1 ring-white/10">
      <div className="grid gap-4 lg:grid-cols-3">
        {pathItems.map((item, index) => (
          <button
            key={item.title}
            onClick={() => openPage(item.page)}
            className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#020817] p-5 text-left shadow-sm ring-1 ring-white/10 transition-all hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-[#07111f] hover:shadow-xl hover:shadow-cyan-950/20"
          >
            <span className={'absolute inset-x-0 top-0 h-1 bg-gradient-to-r ' + item.tone} />
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200 ring-1 ring-white/10">0{index + 1}</span>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">{item.title}</h3>
            <p className="mt-2 text-base leading-6 text-slate-300">{item.text}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">
              Open
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}


function SavenLaunchAssurance({ openPage }: { openPage: (pageId: SavenPageId) => void }) {
  const lanes: Array<{ label: string; title: string; detail: string; page: SavenPageId; tone: string }> = [
    {
      label: 'Signal',
      title: 'Who needs support?',
      detail: 'Profile, rhythm, comfort, and environment.',
      page: 'app-life-setup',
      tone: 'border-blue-300/25 bg-blue-500/10 text-blue-100',
    },
    {
      label: 'Dispatch',
      title: 'Who should act?',
      detail: 'Family, caregiver, nurse, device, or robot.',
      page: 'app-commands',
      tone: 'border-cyan-300/25 bg-cyan-500/10 text-cyan-100',
    },
    {
      label: 'Proof',
      title: 'What confirms it?',
      detail: 'Human check, device trend, photo, or environment rule.',
      page: 'app-verification',
      tone: 'border-emerald-300/25 bg-emerald-500/10 text-emerald-100',
    },
    {
      label: 'Continuity',
      title: 'What changes next?',
      detail: 'Timeline, next window, escalation, and recovery pattern.',
      page: 'app-continuity',
      tone: 'border-amber-300/25 bg-amber-500/10 text-amber-100',
    },
  ];

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#07111f] p-5 text-white shadow-xl shadow-slate-950/20 ring-1 ring-white/10" data-saven-launch-assurance="true">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.06em] text-blue-100/70">Launch assurance</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">SAVEN starts only when action, owner, and proof are visible.</h3>
        </div>
        <button onClick={() => openPage('app-today')} className="w-fit rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-50">
          Open live support
        </button>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
        {lanes.map((lane) => (
          <button
            key={lane.label}
            onClick={() => openPage(lane.page)}
            className={'min-h-[154px] rounded-[1.5rem] border p-4 text-left shadow-sm ring-1 ring-white/5 transition-all hover:-translate-y-0.5 hover:bg-white/[0.08] hover:shadow-xl hover:shadow-blue-950/20 ' + lane.tone}
          >
            <p className="text-sm font-semibold tracking-[0.06em] opacity-80">{lane.label}</p>
            <h4 className="mt-3 text-xl font-semibold leading-6 text-white">{lane.title}</h4>
            <p className="mt-2 text-base leading-6 text-slate-200">{lane.detail}</p>
          </button>
        ))}
      </div>
    </section>
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
