# SAVEN Frontend Implementation Plan

Project: SAVEN  
Environment: BioMath Core  
Layer: User interface for execution, verification, device readiness, robot readiness, environments, access, audit, and support continuity  
Stack: Next.js App Router, TypeScript, Tailwind, shadcn/ui, lucide-react, React Server Components

## Product Direction

SAVEN UI is a calm operational layer for human support continuity. It must show who needs support, what needs to happen, who or what is responsible, whether the action was verified, what needs attention, which devices or robots are available, and what happened over time.

The interface must not feel like a hospital system, CRM, chatbot, project management tool, or sci-fi control panel.

## 1. Frontend Folder Structure

```text
app/
  saven/
    layout.tsx
    page.tsx
    tasks/
      page.tsx
    timeline/
      page.tsx
    devices/
      page.tsx
    robots/
      page.tsx
    environments/
      page.tsx
    access/
      page.tsx
    audit/
      page.tsx
    settings/
      page.tsx
components/
  saven/
    layout/
      SAVENLayout.tsx
      SAVENHeader.tsx
      SAVENSidebar.tsx
      UserSelector.tsx
      EnvironmentSelector.tsx
      CurrentTime.tsx
    badges/
      SupportStatusBadge.tsx
      TaskStatusBadge.tsx
      VerificationBadge.tsx
      PriorityBadge.tsx
      EnvironmentBadge.tsx
      DeviceStatusBadge.tsx
      RobotReadinessBadge.tsx
    overview/
      HumanSupportHeader.tsx
      TodaySupportCards.tsx
      PriorityActionCard.tsx
      PriorityActionsList.tsx
      ContinuityPanel.tsx
      TimelinePreview.tsx
      ReadinessOverview.tsx
    tasks/
      TaskBoard.tsx
      TaskViewTabs.tsx
      TaskCard.tsx
      TaskActionBar.tsx
      TaskDetailSheet.tsx
      TaskCreateDialog.tsx
    timeline/
      TimelineFilters.tsx
      TimelineList.tsx
      TimelineEventCard.tsx
    devices/
      DeviceGrid.tsx
      DeviceCard.tsx
      DeviceTelemetrySheet.tsx
      RegisterDeviceDialog.tsx
    robots/
      RobotGrid.tsx
      RobotCard.tsx
      RobotTelemetrySheet.tsx
      SafetyStatePanel.tsx
    environments/
      EnvironmentGrid.tsx
      EnvironmentCard.tsx
      EnvironmentRulesPanel.tsx
      EscalationChainPanel.tsx
    access/
      AccessRoleGrid.tsx
      AccessRoleCard.tsx
      InvitePersonDialog.tsx
    audit/
      AuditFilters.tsx
      AuditEventList.tsx
      AuditEventRow.tsx
    shared/
      EmptyState.tsx
      LoadingState.tsx
      SectionHeader.tsx
      MetricCard.tsx
      SoftPanel.tsx
lib/
  saven/
    api-client.ts
    mock-data.ts
    navigation.ts
    ui-types.ts
    formatters.ts
    status-styles.ts
```

## 2. TypeScript UI Types

File: `lib/saven/ui-types.ts`

```ts
export type SupportStatus = 'active' | 'needs_attention' | 'handoff' | 'paused';

export type TaskStatus =
  | 'planned'
  | 'assigned'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'delayed'
  | 'escalated'
  | 'canceled';

export type TaskCategory =
  | 'hydration'
  | 'medication_support'
  | 'walking_mobility'
  | 'rehabilitation_exercise'
  | 'nutrition_support'
  | 'sleep_routine'
  | 'caregiver_check_in'
  | 'device_check'
  | 'emergency_escalation'
  | 'general_support';

export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';

export type ExecutorType =
  | 'user'
  | 'family'
  | 'caregiver'
  | 'clinician'
  | 'support_provider'
  | 'device'
  | 'robot'
  | 'environment_system';

export type VerificationMethod =
  | 'user_confirmed'
  | 'caregiver_confirmed'
  | 'family_confirmed'
  | 'device_telemetry'
  | 'robot_telemetry'
  | 'sensor_detected'
  | 'system_inferred'
  | 'not_verified';

export type DeviceType =
  | 'wearable'
  | 'sensor'
  | 'smart_home'
  | 'rehabilitation_device'
  | 'mobility_device'
  | 'medical_device';

export type RobotType =
  | 'robotic_assistant'
  | 'mobility_robot'
  | 'rehabilitation_robot'
  | 'humanoid_robot'
  | 'service_robot';

export type EnvironmentType =
  | 'home'
  | 'clinic'
  | 'rehabilitation_center'
  | 'assisted_living'
  | 'senior_care'
  | 'hospital_recovery';

export type SavenRole =
  | 'user'
  | 'family'
  | 'caregiver'
  | 'clinician'
  | 'support_provider'
  | 'robot_operator'
  | 'environment_admin'
  | 'system_admin';

export type SavenPerson = {
  id: string;
  name: string;
  age: number;
  environment: string;
  supportContext: string;
  supportStatus: SupportStatus;
};

export type SavenTask = {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  scheduledTime: string;
  dueTime: string;
  assignedExecutor: string;
  executorType: ExecutorType;
  status: TaskStatus;
  verificationRequired: boolean;
  verificationMethod: VerificationMethod;
  environment: string;
};

export type TimelineEvent = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  executorType: ExecutorType;
  verificationSource: VerificationMethod;
  relatedTask: string;
  environment: string;
  status: TaskStatus;
};

export type DeviceProfile = {
  id: string;
  name: string;
  type: DeviceType;
  manufacturer: string;
  onlineStatus: 'online' | 'offline' | 'standby' | 'maintenance';
  environment: string;
  capabilities: string[];
  lastTelemetry: string;
  safetyLimits: string[];
};

export type RobotProfile = {
  id: string;
  name: string;
  type: RobotType;
  model: string;
  manufacturer: string;
  capabilities: string[];
  onlineStatus: 'online' | 'offline' | 'standby' | 'maintenance';
  environment: string;
  safetyState: 'ready' | 'limited' | 'maintenance' | 'disabled';
  currentTask?: string;
  lastTelemetry: string;
  actionLimits: string[];
};

export type CareEnvironment = {
  id: string;
  name: string;
  type: EnvironmentType;
  connectedPeople: string[];
  caregivers: string[];
  devices: string[];
  robots: string[];
  rules: string[];
  escalationChain: string[];
  physicalExecutionAllowed: boolean;
  restrictedActionTypes: string[];
};

export type AccessRole = {
  id: string;
  person: string;
  role: SavenRole;
  environmentScope: string;
  permissions: string[];
  expiration: string;
  active: boolean;
};

export type AuditEvent = {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  environment: string;
  result: string;
  eventType: string;
};
```

## 3. Mock Data

File: `lib/saven/mock-data.ts`

```ts
import type {
  AccessRole,
  AuditEvent,
  CareEnvironment,
  DeviceProfile,
  RobotProfile,
  SavenPerson,
  SavenTask,
  TimelineEvent
} from './ui-types';

export const currentPerson: SavenPerson = {
  id: 'person_anna_roberts',
  name: 'Anna Roberts',
  age: 74,
  environment: 'Home Recovery',
  supportContext: 'Post-surgery recovery and mobility support',
  supportStatus: 'active'
};

export const tasks: SavenTask[] = [
  {
    id: 'task_hydration',
    title: 'Morning hydration check',
    category: 'hydration',
    priority: 'normal',
    scheduledTime: '08:30',
    dueTime: '09:00',
    assignedExecutor: 'Maya Carter',
    executorType: 'caregiver',
    status: 'completed',
    verificationRequired: true,
    verificationMethod: 'caregiver_confirmed',
    environment: 'Home Recovery'
  },
  {
    id: 'task_walking',
    title: 'Assisted walking session',
    category: 'walking_mobility',
    priority: 'high',
    scheduledTime: '10:30',
    dueTime: '11:00',
    assignedExecutor: 'Maya Carter',
    executorType: 'caregiver',
    status: 'in_progress',
    verificationRequired: true,
    verificationMethod: 'caregiver_confirmed',
    environment: 'Home Recovery'
  },
  {
    id: 'task_medication',
    title: 'Medication support confirmation',
    category: 'medication_support',
    priority: 'high',
    scheduledTime: '12:00',
    dueTime: '12:15',
    assignedExecutor: 'Daniel Roberts',
    executorType: 'family',
    status: 'planned',
    verificationRequired: true,
    verificationMethod: 'family_confirmed',
    environment: 'Home Recovery'
  },
  {
    id: 'task_breathing',
    title: 'Breathing exercise',
    category: 'rehabilitation_exercise',
    priority: 'normal',
    scheduledTime: '14:00',
    dueTime: '14:20',
    assignedExecutor: 'Anna Roberts',
    executorType: 'user',
    status: 'assigned',
    verificationRequired: true,
    verificationMethod: 'user_confirmed',
    environment: 'Home Recovery'
  },
  {
    id: 'task_evening_mobility',
    title: 'Evening mobility check',
    category: 'walking_mobility',
    priority: 'normal',
    scheduledTime: '18:30',
    dueTime: '19:00',
    assignedExecutor: 'SAVEN Mobility R2',
    executorType: 'robot',
    status: 'planned',
    verificationRequired: true,
    verificationMethod: 'robot_telemetry',
    environment: 'Home Recovery'
  },
  {
    id: 'task_sleep',
    title: 'Sleep preparation routine',
    category: 'sleep_routine',
    priority: 'low',
    scheduledTime: '21:00',
    dueTime: '21:30',
    assignedExecutor: 'Home environment system',
    executorType: 'environment_system',
    status: 'planned',
    verificationRequired: true,
    verificationMethod: 'sensor_detected',
    environment: 'Home Recovery'
  }
];

export const devices: DeviceProfile[] = [
  {
    id: 'device_hydration',
    name: 'Smart hydration sensor',
    type: 'sensor',
    manufacturer: 'SAVEN Lab',
    onlineStatus: 'online',
    environment: 'Home Recovery',
    capabilities: ['hydration signal', 'routine support'],
    lastTelemetry: 'Hydration confirmed at 08:42',
    safetyLimits: ['Telemetry only', 'No physical action']
  },
  {
    id: 'device_wearable',
    name: 'Wearable recovery tracker',
    type: 'wearable',
    manufacturer: 'SAVEN Lab',
    onlineStatus: 'online',
    environment: 'Home Recovery',
    capabilities: ['activity signal', 'sleep signal', 'mobility trend'],
    lastTelemetry: 'Activity signal received at 10:48',
    safetyLimits: ['Telemetry only']
  },
  {
    id: 'device_bed',
    name: 'Bed presence sensor',
    type: 'sensor',
    manufacturer: 'SAVEN Lab',
    onlineStatus: 'standby',
    environment: 'Home Recovery',
    capabilities: ['sleep routine', 'presence signal'],
    lastTelemetry: 'Standby',
    safetyLimits: ['No identity inference']
  },
  {
    id: 'device_mobility',
    name: 'Mobility support device',
    type: 'mobility_device',
    manufacturer: 'SAVEN Lab',
    onlineStatus: 'maintenance',
    environment: 'Home Recovery',
    capabilities: ['mobility support', 'stability telemetry'],
    lastTelemetry: 'Maintenance required',
    safetyLimits: ['Human supervision required']
  }
];

export const robots: RobotProfile[] = [
  {
    id: 'robot_assist_r1',
    name: 'SAVEN Assist R1',
    type: 'robotic_assistant',
    model: 'Assist R1',
    manufacturer: 'SAVEN Robotics',
    capabilities: ['caregiver check-in', 'device check', 'environment support'],
    onlineStatus: 'online',
    environment: 'Home Recovery',
    safetyState: 'ready',
    currentTask: 'No active task',
    lastTelemetry: 'Ready at 10:51',
    actionLimits: ['No physical contact', 'Human approval for support actions']
  },
  {
    id: 'robot_mobility_r2',
    name: 'SAVEN Mobility R2',
    type: 'mobility_robot',
    model: 'Mobility R2',
    manufacturer: 'SAVEN Robotics',
    capabilities: ['mobility readiness', 'walking support telemetry'],
    onlineStatus: 'standby',
    environment: 'Home Recovery',
    safetyState: 'limited',
    currentTask: 'Evening mobility check',
    lastTelemetry: 'Standby at 10:44',
    actionLimits: ['Caregiver supervision required', 'No stair support']
  }
];

export const timelineEvents: TimelineEvent[] = [
  {
    id: 'event_hydration_confirmed',
    title: 'Hydration confirmed',
    description: 'Morning hydration support was completed and verified by caregiver confirmation.',
    timestamp: '08:42',
    actor: 'Maya Carter',
    executorType: 'caregiver',
    verificationSource: 'caregiver_confirmed',
    relatedTask: 'Morning hydration check',
    environment: 'Home Recovery',
    status: 'completed'
  },
  {
    id: 'event_walking_completed',
    title: 'Walking session completed',
    description: 'Assisted walking session was completed with caregiver support.',
    timestamp: '10:58',
    actor: 'Maya Carter',
    executorType: 'caregiver',
    verificationSource: 'caregiver_confirmed',
    relatedTask: 'Assisted walking session',
    environment: 'Home Recovery',
    status: 'completed'
  },
  {
    id: 'event_medication_verified',
    title: 'Medication support verified',
    description: 'Medication support confirmation was verified by family representative.',
    timestamp: '12:08',
    actor: 'Daniel Roberts',
    executorType: 'family',
    verificationSource: 'family_confirmed',
    relatedTask: 'Medication support confirmation',
    environment: 'Home Recovery',
    status: 'completed'
  },
  {
    id: 'event_robot_telemetry',
    title: 'Robot telemetry received',
    description: 'SAVEN Assist R1 reported readiness and safe execution state.',
    timestamp: '12:20',
    actor: 'SAVEN Assist R1',
    executorType: 'robot',
    verificationSource: 'robot_telemetry',
    relatedTask: 'Device readiness check',
    environment: 'Home Recovery',
    status: 'completed'
  },
  {
    id: 'event_caregiver_confirmation',
    title: 'Caregiver confirmation received',
    description: 'Caregiver confirmed current support coverage for the afternoon routine.',
    timestamp: '13:10',
    actor: 'Maya Carter',
    executorType: 'caregiver',
    verificationSource: 'caregiver_confirmed',
    relatedTask: 'Caregiver check-in',
    environment: 'Home Recovery',
    status: 'completed'
  }
];

export const environments: CareEnvironment[] = [
  {
    id: 'environment_home_recovery',
    name: 'Home Recovery',
    type: 'home',
    connectedPeople: ['Anna Roberts', 'Daniel Roberts', 'Maya Carter'],
    caregivers: ['Maya Carter'],
    devices: ['Smart hydration sensor', 'Wearable recovery tracker', 'Bed presence sensor', 'Mobility support device'],
    robots: ['SAVEN Assist R1', 'SAVEN Mobility R2'],
    rules: ['Human confirmation required for mobility support', 'Robot execution requires safe readiness state'],
    escalationChain: ['Assigned helper', 'Family representative', 'Support provider', 'Environment admin'],
    physicalExecutionAllowed: true,
    restrictedActionTypes: ['Unsupervised mobility support', 'High safety physical action']
  }
];

export const accessRoles: AccessRole[] = [
  {
    id: 'access_user',
    person: 'Anna Roberts',
    role: 'user',
    environmentScope: 'Home Recovery',
    permissions: ['View support tasks', 'Confirm own actions', 'View timeline'],
    expiration: 'No expiration',
    active: true
  },
  {
    id: 'access_family',
    person: 'Daniel Roberts',
    role: 'family',
    environmentScope: 'Home Recovery',
    permissions: ['View dashboard', 'Create support task', 'Confirm family support'],
    expiration: 'No expiration',
    active: true
  },
  {
    id: 'access_caregiver',
    person: 'Maya Carter',
    role: 'caregiver',
    environmentScope: 'Home Recovery',
    permissions: ['Update tasks', 'Verify actions', 'View timeline'],
    expiration: '2026-08-19',
    active: true
  }
];

export const auditEvents: AuditEvent[] = [
  {
    id: 'audit_task_verified',
    action: 'Verified action',
    actor: 'Maya Carter',
    target: 'Morning hydration check',
    timestamp: '08:42',
    environment: 'Home Recovery',
    result: 'Completed',
    eventType: 'verification_received'
  },
  {
    id: 'audit_robot_status',
    action: 'Robot status updated',
    actor: 'SAVEN Assist R1',
    target: 'Readiness state',
    timestamp: '12:20',
    environment: 'Home Recovery',
    result: 'Ready',
    eventType: 'robot_telemetry_received'
  }
];
```

## 4. API Client Functions

File: `lib/saven/api-client.ts`

```ts
import type { AccessRole, AuditEvent, CareEnvironment, DeviceProfile, RobotProfile, SavenTask, TimelineEvent } from './ui-types';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers
    }
  });

  if (!response.ok) {
    throw new Error('SAVEN request failed');
  }

  return response.json();
}

export function getSavenDashboard() {
  return request('/api/saven/dashboard');
}

export function listSavenTasks(): Promise<{ tasks: SavenTask[] }> {
  return request('/api/saven/tasks');
}

export function updateSavenTask(taskId: string, payload: Partial<SavenTask>) {
  return request(`/api/saven/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export function verifySavenTask(taskId: string, payload: Record<string, unknown>) {
  return request(`/api/saven/tasks/${taskId}/verify`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function listTimelineEvents(): Promise<{ events: TimelineEvent[] }> {
  return request('/api/saven/timeline');
}

export function listDevices(): Promise<{ devices: DeviceProfile[] }> {
  return request('/api/saven/devices');
}

export function listRobots(): Promise<{ robots: RobotProfile[] }> {
  return request('/api/saven/robots');
}

export function listEnvironments(): Promise<{ environments: CareEnvironment[] }> {
  return request('/api/saven/environments');
}

export function listAccessRoles(): Promise<{ roles: AccessRole[] }> {
  return request('/api/saven/access');
}

export function listAuditEvents(): Promise<{ events: AuditEvent[] }> {
  return request('/api/saven/audit');
}
```

## 5. Shared Layout

File: `components/saven/layout/SAVENLayout.tsx`

```tsx
import { ReactNode } from 'react';
import { SAVENHeader } from './SAVENHeader';
import { SAVENSidebar } from './SAVENSidebar';

type SAVENLayoutProps = {
  activePage: string;
  children: ReactNode;
};

export function SAVENLayout({ activePage, children }: SAVENLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f7f5f1] text-slate-950">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(80,130,190,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(200,150,70,0.16),transparent_34%)]" />
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <SAVENSidebar activePage={activePage} />
        <div className="min-w-0">
          <SAVENHeader />
          <main className="mx-auto max-w-7xl px-5 pb-12 pt-6 sm:px-8 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
```

File: `components/saven/layout/SAVENSidebar.tsx`

```tsx
import { Activity, ClipboardCheck, Clock3, Cpu, Home, LockKeyhole, Settings, ShieldCheck, Waypoints, Bot } from 'lucide-react';
import Link from 'next/link';

const navigation = [
  { label: 'Overview', href: '/saven', icon: Home },
  { label: 'Tasks', href: '/saven/tasks', icon: ClipboardCheck },
  { label: 'Timeline', href: '/saven/timeline', icon: Clock3 },
  { label: 'Devices', href: '/saven/devices', icon: Cpu },
  { label: 'Robots', href: '/saven/robots', icon: Bot },
  { label: 'Environments', href: '/saven/environments', icon: Waypoints },
  { label: 'Access', href: '/saven/access', icon: LockKeyhole },
  { label: 'Audit', href: '/saven/audit', icon: ShieldCheck },
  { label: 'Settings', href: '/saven/settings', icon: Settings }
];

export function SAVENSidebar({ activePage }: { activePage: string }) {
  return (
    <aside className="border-r border-white/70 bg-white/72 px-4 py-5 shadow-sm backdrop-blur-xl">
      <Link href="/saven" className="flex items-center gap-3 px-2">
        <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl bg-slate-950">
          <img src="/saven-mark.png" alt="SAVEN" className="h-full w-full object-cover" />
        </span>
        <span>
          <span className="block text-xl font-semibold tracking-tight">SAVEN</span>
          <span className="block text-xs text-slate-500">Support execution layer</span>
        </span>
      </Link>
      <nav className="mt-8 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const selected = activePage === item.label.toLowerCase();
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                selected ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-600 hover:bg-white hover:text-slate-950'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

File: `components/saven/layout/SAVENHeader.tsx`

```tsx
import { EnvironmentSelector } from './EnvironmentSelector';
import { UserSelector } from './UserSelector';
import { CurrentTime } from './CurrentTime';
import { SupportStatusBadge } from '../badges/SupportStatusBadge';

export function SAVENHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-[#f7f5f1]/82 px-5 py-4 backdrop-blur-xl sm:px-8 lg:px-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">BioMath Core</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">SAVEN Support Operations</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <UserSelector />
          <EnvironmentSelector />
          <CurrentTime />
          <SupportStatusBadge status="active" />
        </div>
      </div>
    </header>
  );
}
```

## 6. Reusable Component Library

### Badges

File: `components/saven/badges/TaskStatusBadge.tsx`

```tsx
import type { TaskStatus } from '@/lib/saven/ui-types';

const styles: Record<TaskStatus, string> = {
  planned: 'bg-slate-100 text-slate-700',
  assigned: 'bg-blue-50 text-blue-700',
  accepted: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-amber-50 text-amber-700',
  completed: 'bg-emerald-50 text-emerald-700',
  failed: 'bg-rose-50 text-rose-700',
  delayed: 'bg-amber-100 text-amber-800',
  escalated: 'bg-red-50 text-red-700',
  canceled: 'bg-slate-200 text-slate-600'
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>{status.replaceAll('_', ' ')}</span>;
}
```

File: `components/saven/badges/VerificationBadge.tsx`

```tsx
import type { VerificationMethod } from '@/lib/saven/ui-types';

export function VerificationBadge({ method }: { method: VerificationMethod }) {
  return (
    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
      {method.replaceAll('_', ' ')}
    </span>
  );
}
```

### Shared Cards

File: `components/saven/shared/SoftPanel.tsx`

```tsx
import { ReactNode } from 'react';

export function SoftPanel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-white/70 bg-white/78 p-5 shadow-sm backdrop-blur-xl ${className}`}>{children}</section>;
}
```

File: `components/saven/shared/MetricCard.tsx`

```tsx
export function MetricCard({ label, value, tone }: { label: string; value: string | number; tone?: string }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-3 text-4xl font-semibold tracking-tight ${tone ?? 'text-slate-950'}`}>{value}</p>
    </div>
  );
}
```

## 7. Dashboard Composition

File: `app/saven/page.tsx`

```tsx
import { SAVENLayout } from '@/components/saven/layout/SAVENLayout';
import { HumanSupportHeader } from '@/components/saven/overview/HumanSupportHeader';
import { TodaySupportCards } from '@/components/saven/overview/TodaySupportCards';
import { PriorityActionsList } from '@/components/saven/overview/PriorityActionsList';
import { ContinuityPanel } from '@/components/saven/overview/ContinuityPanel';
import { TimelinePreview } from '@/components/saven/overview/TimelinePreview';
import { ReadinessOverview } from '@/components/saven/overview/ReadinessOverview';

export default function SavenOverviewPage() {
  return (
    <SAVENLayout activePage="overview">
      <div className="space-y-6">
        <HumanSupportHeader />
        <TodaySupportCards />
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <PriorityActionsList />
          <ContinuityPanel />
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <TimelinePreview />
          <ReadinessOverview />
        </div>
      </div>
    </SAVENLayout>
  );
}
```

File: `components/saven/overview/HumanSupportHeader.tsx`

```tsx
import { currentPerson, devices, robots } from '@/lib/saven/mock-data';
import { SoftPanel } from '../shared/SoftPanel';
import { SupportStatusBadge } from '../badges/SupportStatusBadge';

export function HumanSupportHeader() {
  return (
    <SoftPanel className="bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(239,246,255,0.72),rgba(250,244,232,0.8))]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Current support</p>
          <h2 className="mt-3 text-5xl font-semibold tracking-tight text-slate-950">{currentPerson.name}</h2>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">{currentPerson.supportContext}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[420px]">
          <SupportStatusBadge status={currentPerson.supportStatus} />
          <div className="rounded-2xl bg-white/80 p-4 text-sm text-slate-600">Environment: {currentPerson.environment}</div>
          <div className="rounded-2xl bg-white/80 p-4 text-sm text-slate-600">Connected devices: {devices.length}</div>
          <div className="rounded-2xl bg-white/80 p-4 text-sm text-slate-600">Connected robots: {robots.length}</div>
        </div>
      </div>
    </SoftPanel>
  );
}
```

File: `components/saven/overview/TodaySupportCards.tsx`

```tsx
import { tasks } from '@/lib/saven/mock-data';
import { MetricCard } from '../shared/MetricCard';

export function TodaySupportCards() {
  const active = tasks.filter((task) => ['planned', 'assigned', 'accepted', 'in_progress'].includes(task.status)).length;
  const completed = tasks.filter((task) => task.status === 'completed').length;
  const delayed = tasks.filter((task) => task.status === 'delayed').length;
  const escalated = tasks.filter((task) => task.status === 'escalated').length;
  const pending = tasks.filter((task) => task.verificationRequired && task.status !== 'completed').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <MetricCard label="Active tasks" value={active} />
      <MetricCard label="Completed today" value={completed} tone="text-emerald-700" />
      <MetricCard label="Delayed" value={delayed} tone="text-amber-700" />
      <MetricCard label="Escalated" value={escalated} tone="text-red-700" />
      <MetricCard label="Pending verification" value={pending} tone="text-blue-700" />
    </div>
  );
}
```

## 8. Task Page Composition

File: `app/saven/tasks/page.tsx`

```tsx
import { SAVENLayout } from '@/components/saven/layout/SAVENLayout';
import { TaskBoard } from '@/components/saven/tasks/TaskBoard';
import { TaskViewTabs } from '@/components/saven/tasks/TaskViewTabs';

export default function SavenTasksPage() {
  return (
    <SAVENLayout activePage="tasks">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Support tasks</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">Execution work for today</h2>
        </div>
        <TaskViewTabs />
        <TaskBoard />
      </div>
    </SAVENLayout>
  );
}
```

File: `components/saven/tasks/TaskCard.tsx`

```tsx
import type { SavenTask } from '@/lib/saven/ui-types';
import { PriorityBadge } from '../badges/PriorityBadge';
import { TaskStatusBadge } from '../badges/TaskStatusBadge';
import { VerificationBadge } from '../badges/VerificationBadge';

export function TaskCard({ task }: { task: SavenTask }) {
  return (
    <article className="rounded-3xl border border-white/70 bg-white/82 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">{task.title}</h3>
          <p className="mt-2 text-sm text-slate-500">{task.category.replaceAll('_', ' ')}</p>
        </div>
        <PriorityBadge priority={task.priority} />
      </div>
      <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <span>Scheduled: {task.scheduledTime}</span>
        <span>Due: {task.dueTime}</span>
        <span>Assigned helper: {task.assignedExecutor}</span>
        <span>Executor type: {task.executorType.replaceAll('_', ' ')}</span>
        <span>Environment: {task.environment}</span>
        <span>Confirmation required: {task.verificationRequired ? 'Yes' : 'No'}</span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <TaskStatusBadge status={task.status} />
        <VerificationBadge method={task.verificationMethod} />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {['Assign', 'Start', 'Mark complete', 'Verify', 'Delay', 'Escalate', 'Cancel'].map((action) => (
          <button key={action} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300">
            {action}
          </button>
        ))}
      </div>
    </article>
  );
}
```

## 9. Timeline Page Composition

File: `app/saven/timeline/page.tsx`

```tsx
import { SAVENLayout } from '@/components/saven/layout/SAVENLayout';
import { TimelineFilters } from '@/components/saven/timeline/TimelineFilters';
import { TimelineList } from '@/components/saven/timeline/TimelineList';

export default function SavenTimelinePage() {
  return (
    <SAVENLayout activePage="timeline">
      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <TimelineFilters />
        <TimelineList />
      </div>
    </SAVENLayout>
  );
}
```

File: `components/saven/timeline/TimelineEventCard.tsx`

```tsx
import type { TimelineEvent } from '@/lib/saven/ui-types';
import { TaskStatusBadge } from '../badges/TaskStatusBadge';
import { VerificationBadge } from '../badges/VerificationBadge';

export function TimelineEventCard({ event }: { event: TimelineEvent }) {
  return (
    <article className="rounded-3xl border border-white/70 bg-white/82 p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">{event.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{event.description}</p>
          <div className="mt-4 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
            <span>Actor: {event.actor}</span>
            <span>Related task: {event.relatedTask}</span>
            <span>Environment: {event.environment}</span>
            <span>Time: {event.timestamp}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <TaskStatusBadge status={event.status} />
          <VerificationBadge method={event.verificationSource} />
        </div>
      </div>
    </article>
  );
}
```

## 10. Device And Robot Pages

File: `app/saven/devices/page.tsx`

```tsx
import { SAVENLayout } from '@/components/saven/layout/SAVENLayout';
import { DeviceGrid } from '@/components/saven/devices/DeviceGrid';

export default function SavenDevicesPage() {
  return (
    <SAVENLayout activePage="devices">
      <DeviceGrid />
    </SAVENLayout>
  );
}
```

File: `app/saven/robots/page.tsx`

```tsx
import { SAVENLayout } from '@/components/saven/layout/SAVENLayout';
import { RobotGrid } from '@/components/saven/robots/RobotGrid';

export default function SavenRobotsPage() {
  return (
    <SAVENLayout activePage="robots">
      <RobotGrid />
    </SAVENLayout>
  );
}
```

File: `components/saven/robots/RobotCard.tsx`

```tsx
import type { RobotProfile } from '@/lib/saven/ui-types';
import { RobotReadinessBadge } from '../badges/RobotReadinessBadge';
import { SafetyStatePanel } from './SafetyStatePanel';

export function RobotCard({ robot }: { robot: RobotProfile }) {
  return (
    <article className="rounded-3xl border border-white/70 bg-white/82 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{robot.type.replaceAll('_', ' ')}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{robot.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{robot.model} by {robot.manufacturer}</p>
        </div>
        <RobotReadinessBadge state={robot.safetyState} />
      </div>
      <div className="mt-5 grid gap-3 text-sm text-slate-600">
        <span>Environment: {robot.environment}</span>
        <span>Current task: {robot.currentTask ?? 'No active task'}</span>
        <span>Last telemetry: {robot.lastTelemetry}</span>
      </div>
      <SafetyStatePanel limits={robot.actionLimits} />
      <div className="mt-5 flex flex-wrap gap-2">
        {['View profile', 'Send test task', 'View telemetry', 'Assign environment', 'Disable execution', 'Mark maintenance'].map((action) => (
          <button key={action} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300">
            {action}
          </button>
        ))}
      </div>
    </article>
  );
}
```

## 11. Environment And Access Pages

File: `app/saven/environments/page.tsx`

```tsx
import { SAVENLayout } from '@/components/saven/layout/SAVENLayout';
import { EnvironmentGrid } from '@/components/saven/environments/EnvironmentGrid';

export default function SavenEnvironmentsPage() {
  return (
    <SAVENLayout activePage="environments">
      <EnvironmentGrid />
    </SAVENLayout>
  );
}
```

File: `app/saven/access/page.tsx`

```tsx
import { SAVENLayout } from '@/components/saven/layout/SAVENLayout';
import { AccessRoleGrid } from '@/components/saven/access/AccessRoleGrid';

export default function SavenAccessPage() {
  return (
    <SAVENLayout activePage="access">
      <AccessRoleGrid />
    </SAVENLayout>
  );
}
```

## 12. Audit Page

File: `app/saven/audit/page.tsx`

```tsx
import { SAVENLayout } from '@/components/saven/layout/SAVENLayout';
import { AuditEventList } from '@/components/saven/audit/AuditEventList';
import { AuditFilters } from '@/components/saven/audit/AuditFilters';

export default function SavenAuditPage() {
  return (
    <SAVENLayout activePage="audit">
      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <AuditFilters />
        <AuditEventList />
      </div>
    </SAVENLayout>
  );
}
```

File: `components/saven/audit/AuditEventRow.tsx`

```tsx
import type { AuditEvent } from '@/lib/saven/ui-types';

export function AuditEventRow({ event }: { event: AuditEvent }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-white/70 bg-white/78 p-4 text-sm text-slate-600 shadow-sm md:grid-cols-[1.2fr_1fr_1fr_0.8fr]">
      <span className="font-semibold text-slate-950">{event.action}</span>
      <span>{event.actor}</span>
      <span>{event.target}</span>
      <span>{event.result}</span>
    </div>
  );
}
```

## 13. Settings Page

File: `app/saven/settings/page.tsx`

```tsx
import { SAVENLayout } from '@/components/saven/layout/SAVENLayout';
import { EmptyState } from '@/components/saven/shared/EmptyState';

export default function SavenSettingsPage() {
  return (
    <SAVENLayout activePage="settings">
      <EmptyState
        title="SAVEN settings"
        description="Configure support language, environment defaults, escalation behavior, and device readiness preferences."
      />
    </SAVENLayout>
  );
}
```

## 14. Responsive Behavior

```text
Desktop
  Fixed left navigation
  Sticky header
  Two and three column operational grids
  Timeline filters on the left
  Detail sheets for task, device, robot, access, and audit records

Tablet
  Collapsible sidebar
  Two column cards
  Header selectors wrap into second row
  Timeline filters collapse into a top panel

Mobile
  Top navigation sheet
  Single column cards
  Large tap targets
  Priority actions shown before metrics
  Device and robot actions grouped under More actions
```

## 15. UX Language Rules

Use:

```text
Support task
Verified action
Needs attention
Assigned helper
Physical support
Care environment
Support timeline
Device readiness
Robot readiness
Safe execution
Confirmation required
Completed
Delayed
Escalated
Waiting for verification
```

Avoid:

```text
Patient management
Clinical decision
Diagnosis
Treatment
AI doctor
Autonomous medical action
CRM
Ticket
Case management
```

## 16. Visual System

```text
Base background
  #f7f5f1

Panel background
  rgba(255, 255, 255, 0.78)

Primary text
  #0f172a

Secondary text
  #64748b

Subtle blue
  #dbeafe

Muted gold
  #c89b3c

Completed
  #047857

Attention
  #b45309

Escalated
  #b91c1c
```

Use rounded panels, soft borders, generous spacing, and restrained gradients. Red is reserved for escalation only.

## 17. Implementation Order

```text
1. Add SAVEN UI types.
2. Add SAVEN mock data.
3. Add API client functions.
4. Build SAVENLayout, header, sidebar, user selector, environment selector, and current time.
5. Build badge components.
6. Build shared panel, metric, empty, and loading components.
7. Build overview page.
8. Build task page and task cards.
9. Build timeline page and filters.
10. Build device registry page.
11. Build robot readiness page.
12. Build environment management page.
13. Build access management page.
14. Build audit page.
15. Build settings page.
16. Connect pages to REST API.
17. Add loading and empty states.
18. Add responsive navigation.
19. Add WebSocket updates for task, timeline, device, and robot events.
20. Run visual QA across desktop, tablet, and mobile.
```

## 18. MVP Acceptance Criteria

- `/saven` shows current person, environment, support status, active caregivers, devices, robots, today's support cards, priority actions, continuity, timeline preview, and readiness.
- `/saven/tasks` supports Today, Upcoming, Delayed, Escalated, and Completed views.
- Task cards show title, category, priority, scheduled time, assigned helper, executor type, status, verification requirement, verification method, and environment.
- `/saven/timeline` shows verified support history with filters.
- `/saven/devices` shows device readiness without dense table-first design.
- `/saven/robots` shows calm robot readiness, support capability, safe execution, task availability, and physical action limits.
- `/saven/environments` shows people, caregivers, devices, robots, rules, escalation chain, physical execution status, and restricted actions.
- `/saven/access` shows role, environment scope, permissions, expiration, and status.
- `/saven/audit` is operational and calm.
- UI copy avoids diagnosis, treatment, patient management, clinical decision, autonomous medical action, AI doctor, CRM, and chatbot language.
