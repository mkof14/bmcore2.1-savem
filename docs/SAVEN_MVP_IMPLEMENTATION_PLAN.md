# SAVEN MVP Implementation Plan

Project: SAVEN  
Environment: BioMath Core  
MVP target: Human support task execution, verification, timeline, access control, environment management, and future device or robot readiness  
Stack: Next.js, TypeScript, PostgreSQL, Prisma, Tailwind, REST API, WebSocket events  

## Product Boundary

SAVEN is an execution and verification layer inside BioMath Core.

It coordinates support tasks, assigns helpers, records verified actions, manages environments, prepares for device and robot execution, and keeps a clear human support timeline.

SAVEN must not become a generic healthcare CRM, chatbot, medical diagnosis system, treatment product, or autonomous care product.

## MVP Outcomes

The first working SAVEN module must allow a support team to:

- See current support status.
- Create and assign support tasks.
- Track active, delayed, completed, failed, canceled, and escalated tasks.
- Verify task completion through human confirmation.
- Store a chronological human support timeline.
- Manage access roles and permissions.
- Register future devices and robots.
- Manage environments and escalation settings.
- Preserve operational accountability.

## 1. Folder Structure

This structure assumes a new Next.js implementation path. If SAVEN is built inside the existing app first, mirror the same module boundaries under the current source tree.

```text
app/
  saven/
    layout.tsx
    page.tsx
    tasks/
      page.tsx
      [taskId]/
        page.tsx
    timeline/
      page.tsx
    devices/
      page.tsx
      [deviceId]/
        page.tsx
    environments/
      page.tsx
      [environmentId]/
        page.tsx
    access/
      page.tsx
    settings/
      page.tsx
  api/
    saven/
      tasks/
        route.ts
        [taskId]/
          route.ts
          assign/
            route.ts
          verify/
            route.ts
      timeline/
        route.ts
      events/
        route.ts
      devices/
        route.ts
        [deviceId]/
          route.ts
          status/
            route.ts
      environments/
        route.ts
        [environmentId]/
          route.ts
      access/
        route.ts
        [accessRoleId]/
          route.ts
      telemetry/
        route.ts
components/
  saven/
    SavenShell.tsx
    SavenSidebar.tsx
    SavenTopBar.tsx
    SavenDashboard.tsx
    SupportStatusPanel.tsx
    TaskColumn.tsx
    TaskCard.tsx
    TaskCreateDialog.tsx
    TaskDetailDrawer.tsx
    TimelineList.tsx
    TimelineEventCard.tsx
    VerificationPanel.tsx
    DeviceRegistryTable.tsx
    DeviceStatusCard.tsx
    EnvironmentCard.tsx
    EnvironmentRulesPanel.tsx
    AccessRoleTable.tsx
    EscalationSettingsPanel.tsx
    EmptySupportState.tsx
    StatusBadge.tsx
    PriorityBadge.tsx
    ExecutorBadge.tsx
lib/
  saven/
    access-policy.ts
    dashboard-query.ts
    escalation-rules.ts
    event-bus.ts
    permissions.ts
    task-status.ts
    verification-engine.ts
    websocket-events.ts
    validators.ts
server/
  saven/
    access.service.ts
    care-task.service.ts
    device-registry.service.ts
    environment.service.ts
    execution-event.service.ts
    escalation.service.ts
    timeline.service.ts
    telemetry.service.ts
    verification.service.ts
prisma/
  schema.prisma
  seed-saven.ts
types/
  saven.ts
```

## 2. Prisma Schema

```prisma
enum SavenRole {
  user
  family
  caregiver
  clinician
  support_provider
  robot_operator
  environment_admin
  system_admin
}

enum TaskCategory {
  hydration
  medication_support
  walking_mobility
  rehabilitation_exercise
  nutrition_support
  sleep_routine
  caregiver_check_in
  device_check
  emergency_escalation
  general_support
}

enum TaskPriority {
  low
  normal
  high
  urgent
}

enum ExecutorType {
  user
  family
  caregiver
  clinician
  support_provider
  device
  robot
  system
}

enum CareTaskStatus {
  planned
  assigned
  accepted
  in_progress
  completed
  failed
  delayed
  escalated
  canceled
}

enum VerificationMethod {
  manual
  caregiver
  user
  device
  telemetry
  robot_telemetry
}

enum VerificationStatus {
  pending
  verified
  partial
  failed
  delayed
  escalated
  exception
}

enum DeviceType {
  wearable
  sensor
  smart_home
  rehabilitation_device
  mobility_device
  robot
  humanoid_robot
  medical_device
}

enum ApiStatus {
  not_connected
  connected
  degraded
  unavailable
}

enum OnlineStatus {
  online
  offline
  standby
  maintenance
}

enum EnvironmentType {
  home
  clinic
  rehabilitation_center
  assisted_living
  senior_care
  hospital_recovery
}

model UserProfile {
  id                   String       @id @default(cuid())
  displayName          String
  age                  Int?
  linkedBiomathModelId String       @unique
  primaryEnvironmentId String?
  createdAt            DateTime     @default(now())
  updatedAt            DateTime     @updatedAt

  savenProfile       SAVENProfile?
  primaryEnvironment Environment?  @relation(fields: [primaryEnvironmentId], references: [id])
  tasks              CareTask[]
  events             ExecutionEvent[]
  accessRoles        AccessRole[]
}

model SAVENProfile {
  id                  String   @id @default(cuid())
  userProfileId       String   @unique
  supportStatus       String   @default("support_active")
  supportSummary      String?
  mobilityStatus      String?
  primarySupportNeed  String?
  continuityScore     Int      @default(0)
  lastVerifiedActionAt DateTime?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  userProfile UserProfile @relation(fields: [userProfileId], references: [id])
}

model CareTask {
  id                   String              @id @default(cuid())
  userProfileId        String
  environmentId        String?
  title                String
  category             TaskCategory
  priority             TaskPriority        @default(normal)
  assignedExecutorId   String?
  assignedExecutorName String?
  executorType         ExecutorType
  scheduledTime        DateTime?
  dueAt                DateTime?
  status               CareTaskStatus      @default(planned)
  verificationRequired Boolean             @default(true)
  verificationMethod   VerificationMethod?
  escalationRules      Json?
  notes                String?
  createdAt            DateTime            @default(now())
  updatedAt            DateTime            @updatedAt

  userProfile         UserProfile          @relation(fields: [userProfileId], references: [id])
  environment         Environment?         @relation(fields: [environmentId], references: [id])
  executionEvents     ExecutionEvent[]
  verificationRecords VerificationRecord[]

  @@index([userProfileId, status])
  @@index([environmentId])
  @@index([scheduledTime])
  @@index([dueAt])
}

model ExecutionEvent {
  id                 String             @id @default(cuid())
  taskId             String
  userProfileId      String
  executorId         String?
  executorName       String?
  executorType       ExecutorType
  eventType          String
  status             CareTaskStatus
  verificationMethod VerificationMethod?
  verificationStatus VerificationStatus?
  telemetryPayload   Json?
  notes              String?
  timestamp          DateTime           @default(now())

  task        CareTask    @relation(fields: [taskId], references: [id])
  userProfile UserProfile @relation(fields: [userProfileId], references: [id])

  @@index([taskId, timestamp])
  @@index([userProfileId, timestamp])
}

model VerificationRecord {
  id                 String             @id @default(cuid())
  taskId             String
  method             VerificationMethod
  status             VerificationStatus
  verifiedById       String?
  verifiedByName     String?
  sourceType         String
  confidence         Int                @default(100)
  telemetryPayload   Json?
  notes              String?
  verifiedAt         DateTime           @default(now())

  task CareTask @relation(fields: [taskId], references: [id])

  @@index([taskId, verifiedAt])
  @@index([method, status])
}

model DeviceProfile {
  id                 String       @id @default(cuid())
  environmentId      String?
  name               String
  type               DeviceType
  manufacturer       String?
  capabilities       Json
  apiStatus          ApiStatus    @default(not_connected)
  onlineStatus       OnlineStatus @default(offline)
  safetyLimits       Json?
  lastTelemetryEvent Json?
  lastSeenAt         DateTime?
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt

  environment Environment? @relation(fields: [environmentId], references: [id])

  @@index([environmentId])
  @@index([type, onlineStatus])
}

model RobotProfile {
  id                 String       @id @default(cuid())
  environmentId      String?
  name               String
  model              String
  manufacturer       String?
  capabilities       Json
  apiStatus          ApiStatus    @default(not_connected)
  onlineStatus       OnlineStatus @default(offline)
  safetyLimits       Json?
  lastTelemetryEvent Json?
  lastSeenAt         DateTime?
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt

  environment Environment? @relation(fields: [environmentId], references: [id])

  @@index([environmentId])
  @@index([onlineStatus])
}

model Environment {
  id                 String          @id @default(cuid())
  name               String
  type               EnvironmentType
  rules              Json?
  escalationSettings Json?
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt

  users        UserProfile[]
  tasks        CareTask[]
  devices      DeviceProfile[]
  robots       RobotProfile[]
  accessRoles  AccessRole[]
  escalationRules EscalationRule[]
}

model AccessRole {
  id            String    @id @default(cuid())
  userProfileId String
  environmentId String?
  actorId       String
  actorName     String
  role          SavenRole
  permissions   Json
  expiresAt     DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  userProfile UserProfile @relation(fields: [userProfileId], references: [id])
  environment Environment? @relation(fields: [environmentId], references: [id])

  @@index([actorId, role])
  @@index([userProfileId])
  @@index([environmentId])
}

model EscalationRule {
  id             String        @id @default(cuid())
  environmentId  String?
  category       TaskCategory?
  priority       TaskPriority?
  delayMinutes   Int
  level          Int
  notifyRoles    Json
  actionLabel    String
  enabled        Boolean       @default(true)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  environment Environment? @relation(fields: [environmentId], references: [id])

  @@index([environmentId])
  @@index([category, priority])
}
```

## 3. TypeScript Types

```ts
export type SavenRole =
  | 'user'
  | 'family'
  | 'caregiver'
  | 'clinician'
  | 'support_provider'
  | 'robot_operator'
  | 'environment_admin'
  | 'system_admin';

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

export type CareTaskStatus =
  | 'planned'
  | 'assigned'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'delayed'
  | 'escalated'
  | 'canceled';

export type VerificationMethod =
  | 'manual'
  | 'caregiver'
  | 'user'
  | 'device'
  | 'telemetry'
  | 'robot_telemetry';

export type VerificationStatus =
  | 'pending'
  | 'verified'
  | 'partial'
  | 'failed'
  | 'delayed'
  | 'escalated'
  | 'exception';

export type ExecutorType =
  | 'user'
  | 'family'
  | 'caregiver'
  | 'clinician'
  | 'support_provider'
  | 'device'
  | 'robot'
  | 'system';

export type CareTaskDto = {
  id: string;
  userProfileId: string;
  environmentId?: string;
  title: string;
  category: TaskCategory;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignedExecutorId?: string;
  assignedExecutorName?: string;
  executorType: ExecutorType;
  scheduledTime?: string;
  dueAt?: string;
  status: CareTaskStatus;
  verificationRequired: boolean;
  verificationMethod?: VerificationMethod;
  escalationRules?: Record<string, unknown>;
  notes?: string;
};

export type TimelineEventDto = {
  id: string;
  taskId: string;
  taskTitle: string;
  executorName?: string;
  executorType: ExecutorType;
  verificationMethod?: VerificationMethod;
  verificationStatus?: VerificationStatus;
  status: CareTaskStatus;
  timestamp: string;
  notes?: string;
};

export type DashboardSummaryDto = {
  supportStatus: string;
  activeTasks: number;
  delayedTasks: number;
  completedTasks: number;
  escalatedTasks: number;
  connectedCaregivers: number;
  connectedDevices: number;
  verifiedActionsToday: number;
  needsAttention: CareTaskDto[];
  recentTimeline: TimelineEventDto[];
};

export type DeviceProfileDto = {
  id: string;
  name: string;
  type:
    | 'wearable'
    | 'sensor'
    | 'smart_home'
    | 'rehabilitation_device'
    | 'mobility_device'
    | 'robot'
    | 'humanoid_robot'
    | 'medical_device';
  manufacturer?: string;
  capabilities: string[];
  apiStatus: 'not_connected' | 'connected' | 'degraded' | 'unavailable';
  onlineStatus: 'online' | 'offline' | 'standby' | 'maintenance';
  environmentId?: string;
  safetyLimits?: Record<string, unknown>;
  lastTelemetryEvent?: Record<string, unknown>;
};

export type EnvironmentDto = {
  id: string;
  name: string;
  type:
    | 'home'
    | 'clinic'
    | 'rehabilitation_center'
    | 'assisted_living'
    | 'senior_care'
    | 'hospital_recovery';
  rules?: Record<string, unknown>;
  escalationSettings?: Record<string, unknown>;
  connectedDevices: DeviceProfileDto[];
  assignedCaregivers: Array<{ id: string; name: string; role: SavenRole }>;
};
```

## 4. API Route Structure

### Task Routes

```text
GET    /api/saven/tasks
POST   /api/saven/tasks
GET    /api/saven/tasks/:taskId
PATCH  /api/saven/tasks/:taskId
POST   /api/saven/tasks/:taskId/assign
POST   /api/saven/tasks/:taskId/verify
```

### Timeline Routes

```text
GET    /api/saven/timeline?userProfileId=:userProfileId
POST   /api/saven/events
```

### Device Routes

```text
GET    /api/saven/devices
POST   /api/saven/devices
GET    /api/saven/devices/:deviceId
PATCH  /api/saven/devices/:deviceId
POST   /api/saven/devices/:deviceId/status
POST   /api/saven/telemetry
```

### Environment Routes

```text
GET    /api/saven/environments
POST   /api/saven/environments
GET    /api/saven/environments/:environmentId
PATCH  /api/saven/environments/:environmentId
```

### Access Routes

```text
GET    /api/saven/access?userProfileId=:userProfileId
POST   /api/saven/access
PATCH  /api/saven/access/:accessRoleId
DELETE /api/saven/access/:accessRoleId
```

### Dashboard Route

```text
GET /api/saven/dashboard?userProfileId=:userProfileId
```

## 5. Backend Services

```text
care-task.service.ts
  createCareTask
  listCareTasks
  updateCareTask
  assignCareTask
  changeCareTaskStatus
  findTasksNeedingAttention

verification.service.ts
  verifyCareTask
  resolveTaskStatusFromVerification
  createManualVerification
  createCaregiverVerification
  createUserVerification
  createDeviceVerificationPlaceholder
  createRobotTelemetryPlaceholder

execution-event.service.ts
  createExecutionEvent
  listExecutionEvents
  listTimelineEvents

timeline.service.ts
  getHumanSupportTimeline
  getTodayVerifiedActions
  getTimelineFilters

access.service.ts
  listAccessRoles
  createAccessRole
  updateAccessRole
  removeAccessRole
  assertSavenPermission

device-registry.service.ts
  registerDevice
  updateDeviceProfile
  updateDeviceStatus
  listDevices
  getDeviceReadinessSummary

environment.service.ts
  createEnvironment
  updateEnvironment
  listEnvironments
  getEnvironmentReadiness
  updateEnvironmentRules
  updateEscalationSettings

escalation.service.ts
  findDelayedTasks
  applyEscalationRules
  escalateTask
  listEscalatedTasks

dashboard-query.ts
  getDashboardSummary
  getCurrentSupportStatus
  getSupportCounters
```

## 6. API Handler Shape

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createCareTask, listCareTasks } from '@/server/saven/care-task.service';
import { createCareTaskSchema } from '@/lib/saven/validators';

export async function GET(request: NextRequest) {
  const userProfileId = request.nextUrl.searchParams.get('userProfileId');
  const tasks = await listCareTasks({ userProfileId });
  return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const input = createCareTaskSchema.parse(body);
  const task = await createCareTask(input);
  return NextResponse.json({ task }, { status: 201 });
}
```

## 7. React Page Structure

### `/saven`

Dashboard page focused on current support state.

```tsx
export default async function SavenDashboardPage() {
  return (
    <SavenShell activePage="dashboard">
      <SavenDashboard />
    </SavenShell>
  );
}
```

### `/saven/tasks`

Task command center for support task creation, assignment, status changes, and verification.

```tsx
export default function SavenTasksPage() {
  return (
    <SavenShell activePage="tasks">
      <TaskCreateDialog />
      <TaskColumn title="Needs attention" statusFilter={['delayed', 'failed', 'escalated']} />
      <TaskColumn title="Active support" statusFilter={['planned', 'assigned', 'accepted', 'in_progress']} />
      <TaskColumn title="Completed today" statusFilter={['completed']} />
    </SavenShell>
  );
}
```

### `/saven/timeline`

Chronological record of verified support actions.

```tsx
export default function SavenTimelinePage() {
  return (
    <SavenShell activePage="timeline">
      <TimelineList />
    </SavenShell>
  );
}
```

### `/saven/devices`

Device and robot registry.

```tsx
export default function SavenDevicesPage() {
  return (
    <SavenShell activePage="devices">
      <DeviceRegistryTable />
    </SavenShell>
  );
}
```

### `/saven/environments`

Environment management for home, clinic, rehabilitation center, assisted living, senior care, and hospital recovery.

```tsx
export default function SavenEnvironmentsPage() {
  return (
    <SavenShell activePage="environments">
      <EnvironmentCard />
      <EnvironmentRulesPanel />
      <EscalationSettingsPanel />
    </SavenShell>
  );
}
```

### `/saven/access`

Role and permission management.

```tsx
export default function SavenAccessPage() {
  return (
    <SavenShell activePage="access">
      <AccessRoleTable />
    </SavenShell>
  );
}
```

### `/saven/settings`

Settings page for SAVEN profile defaults, support language, task categories, and notification preferences.

```tsx
export default function SavenSettingsPage() {
  return (
    <SavenShell activePage="settings">
      <EscalationSettingsPanel />
      <EnvironmentRulesPanel />
    </SavenShell>
  );
}
```

## 8. Frontend UI System

Use Tailwind as the base styling system. If `shadcn/ui` is available in the Next.js implementation, use it for accessible primitives, then restyle the components to match SAVEN rather than the default library look.

### Preferred Primitives

```text
Button
Dialog
Drawer
Tabs
Badge
Card
Table
Select
Switch
Textarea
Toast
Command
Sheet
Tooltip
```

### SAVEN Styling Rules

- Keep page backgrounds light with soft blue, graphite, white, and warm gold gradients.
- Use calm status colors and reserve strong red for active escalation only.
- Use large readable typography for status and next action.
- Use spacious panels instead of dense administrative tables.
- Use clear verbs: assign, verify, complete, escalate, review.
- Keep device and robot views operational, not sci-fi themed.

## 9. Dashboard Layout

```text
SAVEN Dashboard
  Current support status
    Support active
    Needs attention
    Environment connected
  Support counters
    Active tasks
    Delayed tasks
    Completed tasks
    Escalated tasks
  Today
    Verified support actions
    Connected caregivers
    Connected devices
  Active support
    Task cards
  Needs attention
    Delayed or escalated tasks
  Care timeline preview
    Latest verified actions
  Device readiness
    Online devices
    Offline devices
    Robot readiness placeholder
```

### Dashboard UI Principles

- Use light background with soft blue, graphite, and warm gold accents.
- Use large readable status copy.
- Avoid dense tables on the dashboard.
- Keep actions clear: create task, assign helper, verify action, view timeline.
- Use calm labels: `Needs attention`, `Waiting for verification`, `Completed`, `Delayed`, `Escalated`.

## 10. Task Workflow Logic

### Status Transitions

```text
planned -> assigned -> accepted -> in_progress -> completed
planned -> canceled
assigned -> delayed
accepted -> delayed
in_progress -> failed
delayed -> escalated
delayed -> completed
failed -> escalated
escalated -> completed
```

### Task Creation Input

```ts
export type CreateCareTaskInput = {
  userProfileId: string;
  environmentId?: string;
  title: string;
  category: TaskCategory;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignedExecutorId?: string;
  assignedExecutorName?: string;
  executorType: ExecutorType;
  scheduledTime?: string;
  dueAt?: string;
  verificationRequired: boolean;
  verificationMethod?: VerificationMethod;
  escalationRules?: Record<string, unknown>;
  notes?: string;
};
```

### Task Service Functions

```ts
export async function createCareTask(input: CreateCareTaskInput) {
  const task = await prisma.careTask.create({
    data: {
      userProfileId: input.userProfileId,
      environmentId: input.environmentId,
      title: input.title,
      category: input.category,
      priority: input.priority,
      assignedExecutorId: input.assignedExecutorId,
      assignedExecutorName: input.assignedExecutorName,
      executorType: input.executorType,
      scheduledTime: input.scheduledTime ? new Date(input.scheduledTime) : undefined,
      dueAt: input.dueAt ? new Date(input.dueAt) : undefined,
      verificationRequired: input.verificationRequired,
      verificationMethod: input.verificationMethod,
      escalationRules: input.escalationRules,
      notes: input.notes,
      status: input.assignedExecutorId ? 'assigned' : 'planned'
    }
  });

  await createExecutionEvent({
    taskId: task.id,
    userProfileId: task.userProfileId,
    executorId: input.assignedExecutorId,
    executorName: input.assignedExecutorName,
    executorType: input.executorType,
    eventType: 'task_created',
    status: task.status,
    notes: input.notes
  });

  return task;
}

export async function assignCareTask(taskId: string, input: AssignTaskInput) {
  const task = await prisma.careTask.update({
    where: { id: taskId },
    data: {
      assignedExecutorId: input.assignedExecutorId,
      assignedExecutorName: input.assignedExecutorName,
      executorType: input.executorType,
      status: 'assigned'
    }
  });

  await createExecutionEvent({
    taskId: task.id,
    userProfileId: task.userProfileId,
    executorId: input.assignedExecutorId,
    executorName: input.assignedExecutorName,
    executorType: input.executorType,
    eventType: 'task_assigned',
    status: 'assigned'
  });

  return task;
}
```

## 11. Verification Workflow Logic

### MVP Verification Rules

- Manual verification can complete standard support tasks.
- Caregiver verification can complete assigned caregiver tasks.
- User verification can confirm user-owned routines.
- Device verification is stored as a placeholder until real device adapters exist.
- Robot telemetry verification is stored as a placeholder until robot gateway integration exists.
- A task requiring verification cannot become completed without a verification record.
- Every verification creates an execution event.
- Every completed task appears in the Human Support Timeline.

### Verification Input

```ts
export type VerifyTaskInput = {
  taskId: string;
  method: VerificationMethod;
  status: VerificationStatus;
  verifiedById?: string;
  verifiedByName?: string;
  sourceType: 'human' | 'device' | 'robot' | 'telemetry' | 'system';
  confidence?: number;
  telemetryPayload?: Record<string, unknown>;
  notes?: string;
};
```

### Verification Service

```ts
export async function verifyCareTask(input: VerifyTaskInput) {
  const task = await prisma.careTask.findUniqueOrThrow({
    where: { id: input.taskId }
  });

  const verification = await prisma.verificationRecord.create({
    data: {
      taskId: input.taskId,
      method: input.method,
      status: input.status,
      verifiedById: input.verifiedById,
      verifiedByName: input.verifiedByName,
      sourceType: input.sourceType,
      confidence: input.confidence ?? 100,
      telemetryPayload: input.telemetryPayload,
      notes: input.notes
    }
  });

  const nextStatus = resolveTaskStatusFromVerification(input.status);

  const updatedTask = await prisma.careTask.update({
    where: { id: input.taskId },
    data: { status: nextStatus }
  });

  await createExecutionEvent({
    taskId: task.id,
    userProfileId: task.userProfileId,
    executorId: input.verifiedById,
    executorName: input.verifiedByName,
    executorType: mapVerificationSourceToExecutorType(input.sourceType),
    eventType: 'task_verified',
    status: nextStatus,
    verificationMethod: input.method,
    verificationStatus: input.status,
    telemetryPayload: input.telemetryPayload,
    notes: input.notes
  });

  return { task: updatedTask, verification };
}

export function resolveTaskStatusFromVerification(status: VerificationStatus): CareTaskStatus {
  if (status === 'verified') return 'completed';
  if (status === 'failed') return 'failed';
  if (status === 'delayed') return 'delayed';
  if (status === 'escalated') return 'escalated';
  if (status === 'partial') return 'in_progress';
  if (status === 'exception') return 'failed';
  return 'in_progress';
}
```

## 12. Access Control Model

### Permission Matrix

```ts
export const savenPermissionsByRole: Record<SavenRole, string[]> = {
  user: [
    'dashboard:read',
    'task:read',
    'task:verify_own',
    'timeline:read',
    'device:read'
  ],
  family: [
    'dashboard:read',
    'task:read',
    'task:create',
    'timeline:read',
    'device:read',
    'environment:read'
  ],
  caregiver: [
    'dashboard:read',
    'task:read',
    'task:update_status',
    'task:verify',
    'timeline:read',
    'event:create'
  ],
  clinician: [
    'dashboard:read',
    'task:read',
    'timeline:read',
    'event:read'
  ],
  support_provider: [
    'dashboard:read',
    'task:read',
    'task:create',
    'task:assign',
    'task:update_status',
    'task:verify',
    'timeline:read',
    'device:read',
    'environment:read'
  ],
  robot_operator: [
    'task:read',
    'device:read',
    'device:update_status',
    'robot:read',
    'robot:update_status',
    'telemetry:create'
  ],
  environment_admin: [
    'dashboard:read',
    'task:read',
    'task:create',
    'task:assign',
    'timeline:read',
    'device:manage',
    'environment:manage',
    'access:read'
  ],
  system_admin: [
    'dashboard:read',
    'task:manage',
    'timeline:read',
    'device:manage',
    'robot:manage',
    'environment:manage',
    'access:manage',
    'settings:manage'
  ]
};
```

### Access Check

```ts
export function canAccess(role: SavenRole, permission: string) {
  const permissions = savenPermissionsByRole[role] ?? [];
  return permissions.includes(permission) || permissions.includes(permission.split(':')[0] + ':manage');
}
```

## 13. Device and Robot Registry

### MVP Behavior

- Register devices and robots manually.
- Show online or offline status.
- Store capabilities as structured JSON.
- Store safety limits as structured JSON.
- Store the last telemetry event as a placeholder.
- Allow status updates through REST.
- Prepare adapter layer without implementing real hardware control.

### Device Registry UI

```text
Device Registry
  Summary cards
    Online
    Offline
    Needs attention
    Robot-ready
  Device table
    Device name
    Type
    Manufacturer
    Capabilities
    API status
    Online status
    Environment
    Last telemetry
  Detail drawer
    Safety limits
    Capabilities
    Telemetry placeholder
    Assigned environment
```

## 14. Environment Management

### MVP Behavior

- Create environment.
- Assign devices to environment.
- Assign caregivers through access roles.
- Store rules as JSON.
- Store escalation settings as JSON.
- Display support readiness by environment.

### Environment Settings Shape

```ts
export type EnvironmentRules = {
  allowedTaskCategories: TaskCategory[];
  defaultVerificationMethod: VerificationMethod;
  requiresHumanConfirmation: boolean;
  deviceExecutionAllowed: boolean;
  robotExecutionAllowed: boolean;
  quietHours?: {
    start: string;
    end: string;
  };
};

export type EscalationSettings = {
  graceMinutes: number;
  levelOneRoles: SavenRole[];
  levelTwoRoles: SavenRole[];
  urgentRoles: SavenRole[];
};
```

## 15. WebSocket Event Plan

MVP can start with REST and add WebSocket events once the task and timeline services are stable.

### Event Names

```text
saven.task.created
saven.task.assigned
saven.task.status_changed
saven.task.verified
saven.task.delayed
saven.task.escalated
saven.timeline.event_created
saven.device.status_changed
saven.telemetry.received
saven.environment.updated
saven.access.updated
```

### Event Payload

```ts
export type SavenRealtimeEvent<TPayload> = {
  id: string;
  name: string;
  userProfileId?: string;
  taskId?: string;
  environmentId?: string;
  timestamp: string;
  payload: TPayload;
};
```

## 16. Example Seed Data

```ts
export const savenSeed = {
  userProfile: {
    displayName: 'Maya Reed',
    age: 72,
    linkedBiomathModelId: 'bm_maya_reed_001'
  },
  environment: {
    name: 'Home Recovery',
    type: 'home',
    rules: {
      allowedTaskCategories: [
        'hydration',
        'walking_mobility',
        'nutrition_support',
        'sleep_routine',
        'caregiver_check_in',
        'device_check',
        'general_support'
      ],
      defaultVerificationMethod: 'caregiver',
      requiresHumanConfirmation: true,
      deviceExecutionAllowed: true,
      robotExecutionAllowed: false
    },
    escalationSettings: {
      graceMinutes: 15,
      levelOneRoles: ['caregiver'],
      levelTwoRoles: ['family', 'support_provider'],
      urgentRoles: ['environment_admin']
    }
  },
  accessRoles: [
    {
      actorId: 'actor_family_001',
      actorName: 'Daniel Reed',
      role: 'family'
    },
    {
      actorId: 'actor_caregiver_001',
      actorName: 'Amelia Carter',
      role: 'caregiver'
    }
  ],
  devices: [
    {
      name: 'Recovery Wearable',
      type: 'wearable',
      manufacturer: 'SAVEN Lab',
      capabilities: ['activity_signal', 'sleep_signal', 'support_confirmation'],
      apiStatus: 'connected',
      onlineStatus: 'online',
      safetyLimits: {
        executionAllowed: false,
        telemetryOnly: true
      }
    },
    {
      name: 'Home Motion Sensor',
      type: 'sensor',
      manufacturer: 'SAVEN Lab',
      capabilities: ['presence_signal', 'movement_signal'],
      apiStatus: 'connected',
      onlineStatus: 'online',
      safetyLimits: {
        telemetryOnly: true
      }
    }
  ],
  tasks: [
    {
      title: 'Morning hydration support',
      category: 'hydration',
      priority: 'normal',
      assignedExecutorName: 'Amelia Carter',
      executorType: 'caregiver',
      status: 'assigned',
      verificationRequired: true,
      verificationMethod: 'caregiver'
    },
    {
      title: 'Assisted walking routine',
      category: 'walking_mobility',
      priority: 'high',
      assignedExecutorName: 'Amelia Carter',
      executorType: 'caregiver',
      status: 'in_progress',
      verificationRequired: true,
      verificationMethod: 'caregiver'
    },
    {
      title: 'Evening sleep preparation',
      category: 'sleep_routine',
      priority: 'normal',
      assignedExecutorName: 'Daniel Reed',
      executorType: 'family',
      status: 'planned',
      verificationRequired: true,
      verificationMethod: 'manual'
    }
  ]
};
```

## 17. Implementation Order

### Step 1: Data Foundation

- Add Prisma schema.
- Add migrations.
- Add seed data.
- Add TypeScript domain types.
- Add Zod validators.

### Step 2: Core Services

- Build `care-task.service.ts`.
- Build `execution-event.service.ts`.
- Build `verification.service.ts`.
- Build `timeline.service.ts`.
- Build `access.service.ts`.

### Step 3: REST API

- Add task list, create, update, assign, and verify endpoints.
- Add timeline list endpoint.
- Add execution event creation endpoint.
- Add device register and status endpoints.
- Add environment create and update endpoints.
- Add access role endpoints.

### Step 4: SAVEN Shell

- Build Next.js SAVEN layout.
- Add sidebar navigation.
- Add top support context bar.
- Add consistent light theme, soft gradients, and large readable type.
- Add responsive behavior.

### Step 5: Dashboard MVP

- Add support status panel.
- Add task counters.
- Add active task cards.
- Add needs attention panel.
- Add today verified actions preview.
- Add connected caregivers and devices summary.

### Step 6: Care Tasks UI

- Add task creation dialog.
- Add task columns by status.
- Add assignment controls.
- Add status update controls.
- Add verification action.
- Add task detail drawer.

### Step 7: Human Support Timeline UI

- Add chronological event list.
- Add filters by status and verification method.
- Add event card with task title, executor, verification method, status, timestamp, and notes.
- Add visual distinction for completed, delayed, failed, escalated, human verified, device verified, and telemetry verified events.

### Step 8: Access Control UI

- Add role table.
- Add create role flow.
- Add permission preview.
- Add environment scope display.
- Enforce permissions in API handlers and UI actions.

### Step 9: Device and Robot Registry

- Add registry page.
- Add device creation flow.
- Add status update flow.
- Add last telemetry placeholder.
- Add robot readiness placeholders.

### Step 10: Environment Management

- Add environment list.
- Add environment detail.
- Add connected devices.
- Add assigned caregivers.
- Add rules editor.
- Add escalation settings editor.

### Step 11: Escalation Logic

- Add delayed task detection job.
- Apply escalation rules.
- Create execution events for delayed and escalated status.
- Surface escalated tasks in dashboard.

### Step 12: Real-Time Readiness

- Define event envelope.
- Add WebSocket channel plan.
- Broadcast task and verification events.
- Update dashboard and timeline in real time.

## 18. MVP Acceptance Criteria

- A support task can be created, assigned, updated, and verified.
- Verified actions appear in the Human Support Timeline.
- Dashboard shows active, delayed, completed, and escalated tasks.
- Access roles produce different permissions.
- Device and robot registry stores future execution systems.
- Environments store rules, caregivers, devices, and escalation settings.
- UI uses clear human language.
- No UI copy frames SAVEN as diagnosis, treatment, clinical decision-making, autonomous care, chatbot, or generic healthcare CRM.
- All code, labels, database fields, and UI strings are in English.

## 19. MVP Page Copy

Use:

- Support task
- Verified action
- Care timeline
- Assigned helper
- Device status
- Needs attention
- Completed
- Delayed
- Escalated
- Waiting for verification
- Support is active
- Environment connected

Avoid:

- Patient management
- Diagnosis
- Treatment
- Clinical decision
- Autonomous care
- AI doctor

## 20. First Build Recommendation

Start with a local mock-backed SAVEN module if the Next.js migration is not ready. Build the same domain structure behind the current site first:

- `src/pages/SavenDashboardMvp.tsx`
- `src/components/saven/*`
- `src/lib/saven/*`
- mock seed data in `src/data/savenSeed.ts`

Then move the same component and domain contracts into the Next.js implementation when the backend stack begins.
