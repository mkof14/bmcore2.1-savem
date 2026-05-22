# SAVEN Execution Engine

Project: SAVEN  
Environment: BioMath Core  
Layer: Signal ingestion, support task execution, verification, escalation, and Body Layer readiness  
Primary goal: Turn BioMath Core signals into verified support tasks and return verified execution results to the personal model

## Core Flow

```text
BioMath Core signal
  -> signal validation
  -> signal normalization
  -> related task lookup
  -> support task create or update
  -> executor assignment
  -> execution tracking
  -> verification
  -> timeline event
  -> BioMath Core result update
```

SAVEN must not act as a diagnosis engine, treatment engine, chatbot, or generic task manager. The engine exists to coordinate and verify real-world support execution.

## 1. TypeScript Domain Types

```ts
export type BioMathSignalSourceCategory =
  | 'hydration'
  | 'mobility'
  | 'rehabilitation'
  | 'medication_support'
  | 'sleep'
  | 'nutrition'
  | 'recovery'
  | 'safety'
  | 'emotional_support'
  | 'caregiver_support';

export type BioMathSignalType =
  | 'action_needed'
  | 'routine_due'
  | 'missed_pattern'
  | 'risk_increase'
  | 'recovery_task_due'
  | 'check_in_needed'
  | 'environment_check_needed';

export type SignalSeverity = 'low' | 'moderate' | 'high' | 'urgent';

export type BioMathSignal = {
  id: string;
  userId: string;
  sourceCategory: BioMathSignalSourceCategory;
  signalType: BioMathSignalType;
  severity: SignalSeverity;
  confidence: number;
  detectedAt: string;
  recommendedAction: string;
  timeWindow?: {
    start?: string;
    end?: string;
  };
  metadata?: Record<string, unknown>;
};

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

export type ExecutorType =
  | 'caregiver'
  | 'family'
  | 'support_provider'
  | 'device'
  | 'robot'
  | 'environment_system'
  | 'system';

export type VerificationMethod =
  | 'user_confirmed'
  | 'caregiver_confirmed'
  | 'family_confirmed'
  | 'device_telemetry'
  | 'robot_telemetry'
  | 'sensor_detected'
  | 'system_inferred'
  | 'not_verified';

export type VerificationResult =
  | 'verified'
  | 'partially_verified'
  | 'failed'
  | 'delayed'
  | 'not_confirmed';

export type ExecutionEventType =
  | 'signal_received'
  | 'task_created'
  | 'task_assigned'
  | 'task_started'
  | 'task_completed'
  | 'task_failed'
  | 'task_delayed'
  | 'task_escalated'
  | 'verification_received'
  | 'verification_failed'
  | 'device_status_changed'
  | 'robot_status_changed'
  | 'environment_rule_applied';

export type ExecutionEventSeverity = 'info' | 'attention' | 'warning' | 'critical';

export type SupportTask = {
  id: string;
  userId: string;
  sourceSignalId?: string;
  category: TaskCategory;
  title: string;
  priority: TaskPriority;
  assignedExecutorId?: string;
  assignedExecutorName?: string;
  executorType?: ExecutorType;
  environmentId?: string;
  scheduledTime?: string;
  dueAt?: string;
  status: TaskStatus;
  verificationRequired: boolean;
  verificationMethod: VerificationMethod;
  escalationRules: EscalationRuleConfig[];
  safetyLevel: 'low' | 'medium' | 'high';
  metadata?: Record<string, unknown>;
};

export type VerificationPayload = {
  taskId: string;
  method: VerificationMethod;
  source: {
    id: string;
    type: ExecutorType | 'user' | 'sensor' | 'system';
    name?: string;
  };
  confidence: number;
  timestamp: string;
  telemetryPayload?: Record<string, unknown>;
  notes?: string;
  result: VerificationResult;
};

export type ExecutionEvent = {
  id: string;
  userId: string;
  taskId?: string;
  executorId?: string;
  deviceId?: string;
  eventType: ExecutionEventType;
  severity: ExecutionEventSeverity;
  timestamp: string;
  payload: Record<string, unknown>;
};

export type ExecutorCandidate = {
  id: string;
  name: string;
  type: ExecutorType;
  role?: string;
  environmentId?: string;
  available: boolean;
  permissions: string[];
  capabilities: string[];
  safetyLimits?: Record<string, unknown>;
  onlineStatus?: 'online' | 'offline' | 'standby' | 'maintenance';
};

export type AssignmentDecision = {
  assigned: boolean;
  executor?: ExecutorCandidate;
  reason?: string;
  fallbackRequired: boolean;
  escalationRequired: boolean;
};

export type EscalationLevel =
  | 'assigned_executor'
  | 'family'
  | 'caregiver'
  | 'support_provider'
  | 'environment_admin'
  | 'emergency_placeholder';

export type EscalationRuleConfig = {
  level: EscalationLevel;
  delayMinutes: number;
  notifyRole: string;
  enabled: boolean;
};

export type SafetyCheckResult = {
  allowed: boolean;
  reason?: string;
  fallbackToHuman: boolean;
  escalationRequired: boolean;
};

export type BioMathWritebackResult = {
  signalId: string;
  userId: string;
  taskId: string;
  status: TaskStatus;
  verificationResult?: VerificationResult;
  verifiedAt?: string;
  metadata?: Record<string, unknown>;
};
```

## 2. Prisma Models

These models extend the MVP schema with signal, event, safety, and writeback records.

```prisma
enum BioMathSignalSourceCategory {
  hydration
  mobility
  rehabilitation
  medication_support
  sleep
  nutrition
  recovery
  safety
  emotional_support
  caregiver_support
}

enum BioMathSignalType {
  action_needed
  routine_due
  missed_pattern
  risk_increase
  recovery_task_due
  check_in_needed
  environment_check_needed
}

enum SignalSeverity {
  low
  moderate
  high
  urgent
}

enum ExecutionEventType {
  signal_received
  task_created
  task_assigned
  task_started
  task_completed
  task_failed
  task_delayed
  task_escalated
  verification_received
  verification_failed
  device_status_changed
  robot_status_changed
  environment_rule_applied
}

enum ExecutionEventSeverity {
  info
  attention
  warning
  critical
}

model BioMathSignalRecord {
  id                String                    @id
  userId            String
  sourceCategory    BioMathSignalSourceCategory
  signalType        BioMathSignalType
  severity          SignalSeverity
  confidence        Int
  detectedAt        DateTime
  recommendedAction String
  timeWindow        Json?
  metadata          Json?
  normalizedPayload Json
  createdTaskId     String?
  processingStatus  String                    @default("received")
  createdAt         DateTime                  @default(now())
  updatedAt         DateTime                  @updatedAt

  @@index([userId, detectedAt])
  @@index([sourceCategory, signalType])
  @@index([processingStatus])
}

model ExecutionEngineEvent {
  id         String                 @id @default(cuid())
  userId     String
  taskId     String?
  executorId String?
  deviceId   String?
  eventType  ExecutionEventType
  severity   ExecutionEventSeverity
  timestamp  DateTime               @default(now())
  payload    Json

  @@index([userId, timestamp])
  @@index([taskId, timestamp])
  @@index([eventType, timestamp])
}

model SafetyEvaluation {
  id                  String   @id @default(cuid())
  taskId              String
  executorId          String?
  executorType        String
  environmentId       String?
  allowed             Boolean
  reason              String?
  fallbackToHuman     Boolean
  escalationRequired  Boolean
  evaluatedAt         DateTime @default(now())
  payload             Json?

  @@index([taskId, evaluatedAt])
  @@index([executorId])
}

model BioMathWriteback {
  id                 String   @id @default(cuid())
  signalId           String
  userId             String
  taskId             String
  status             String
  verificationResult String?
  verifiedAt         DateTime?
  metadata           Json?
  sentAt             DateTime @default(now())
  acknowledgedAt     DateTime?

  @@index([signalId])
  @@index([userId, sentAt])
}
```

## 3. Execution Engine Service

File: `server/saven/execution-engine.service.ts`

```ts
import { assignExecutor } from './task-assignment.service';
import { createExecutionEvent } from './event.service';
import { createSupportTaskFromSignal, findRelatedOpenTask, updateTaskFromSignal } from './support-task.service';
import { normalizeBioMathSignal, validateBioMathSignal } from './signal-ingestion.service';

export async function ingestBioMathSignal(signal: BioMathSignal) {
  validateBioMathSignal(signal);

  const normalizedSignal = normalizeBioMathSignal(signal);

  await createExecutionEvent({
    id: crypto.randomUUID(),
    userId: normalizedSignal.userId,
    eventType: 'signal_received',
    severity: mapSignalSeverityToEventSeverity(normalizedSignal.severity),
    timestamp: new Date().toISOString(),
    payload: {
      signalId: normalizedSignal.id,
      sourceCategory: normalizedSignal.sourceCategory,
      signalType: normalizedSignal.signalType,
      confidence: normalizedSignal.confidence
    }
  });

  const relatedTask = await findRelatedOpenTask(normalizedSignal);
  const task = relatedTask
    ? await updateTaskFromSignal(relatedTask.id, normalizedSignal)
    : await createSupportTaskFromSignal(normalizedSignal);

  const assignment = await assignExecutor(task);

  if (assignment.assigned && assignment.executor) {
    await createExecutionEvent({
      id: crypto.randomUUID(),
      userId: task.userId,
      taskId: task.id,
      executorId: assignment.executor.id,
      eventType: 'task_assigned',
      severity: 'info',
      timestamp: new Date().toISOString(),
      payload: {
        executorType: assignment.executor.type,
        executorName: assignment.executor.name
      }
    });
  }

  if (assignment.escalationRequired) {
    await createExecutionEvent({
      id: crypto.randomUUID(),
      userId: task.userId,
      taskId: task.id,
      eventType: 'task_escalated',
      severity: 'warning',
      timestamp: new Date().toISOString(),
      payload: {
        reason: assignment.reason
      }
    });
  }

  return {
    signal: normalizedSignal,
    task,
    assignment
  };
}

export function mapSignalSeverityToEventSeverity(severity: SignalSeverity): ExecutionEventSeverity {
  if (severity === 'urgent') return 'critical';
  if (severity === 'high') return 'warning';
  if (severity === 'moderate') return 'attention';
  return 'info';
}
```

## 4. Signal Ingestion Service

File: `server/saven/signal-ingestion.service.ts`

```ts
export function validateBioMathSignal(signal: BioMathSignal) {
  if (!signal.id) throw new Error('Signal id is required');
  if (!signal.userId) throw new Error('Signal userId is required');
  if (!signal.sourceCategory) throw new Error('Signal sourceCategory is required');
  if (!signal.signalType) throw new Error('Signal signalType is required');
  if (signal.confidence < 0 || signal.confidence > 100) throw new Error('Signal confidence must be between 0 and 100');
  if (!signal.detectedAt) throw new Error('Signal detectedAt is required');
  if (!signal.recommendedAction) throw new Error('Signal recommendedAction is required');
}

export function normalizeBioMathSignal(signal: BioMathSignal): BioMathSignal {
  return {
    ...signal,
    recommendedAction: signal.recommendedAction.trim(),
    detectedAt: new Date(signal.detectedAt).toISOString(),
    timeWindow: signal.timeWindow
      ? {
          start: signal.timeWindow.start ? new Date(signal.timeWindow.start).toISOString() : undefined,
          end: signal.timeWindow.end ? new Date(signal.timeWindow.end).toISOString() : undefined
        }
      : undefined,
    metadata: signal.metadata ?? {}
  };
}
```

## 5. Support Task Service

File: `server/saven/support-task.service.ts`

```ts
export async function createSupportTaskFromSignal(signal: BioMathSignal): Promise<SupportTask> {
  const category = mapSignalCategoryToTaskCategory(signal.sourceCategory);
  const priority = mapSignalSeverityToPriority(signal.severity);
  const verificationMethod = selectVerificationMethod(signal);

  const task: SupportTask = {
    id: crypto.randomUUID(),
    userId: signal.userId,
    sourceSignalId: signal.id,
    category,
    title: signal.recommendedAction,
    priority,
    scheduledTime: signal.timeWindow?.start,
    dueAt: signal.timeWindow?.end,
    status: 'planned',
    verificationRequired: true,
    verificationMethod,
    escalationRules: createDefaultEscalationRules(priority),
    safetyLevel: mapTaskSafetyLevel(category, priority),
    metadata: {
      signalType: signal.signalType,
      confidence: signal.confidence,
      sourceCategory: signal.sourceCategory
    }
  };

  await persistSupportTask(task);

  await createExecutionEvent({
    id: crypto.randomUUID(),
    userId: task.userId,
    taskId: task.id,
    eventType: 'task_created',
    severity: priority === 'urgent' ? 'critical' : 'info',
    timestamp: new Date().toISOString(),
    payload: {
      sourceSignalId: signal.id,
      category,
      priority
    }
  });

  return task;
}

export async function findRelatedOpenTask(signal: BioMathSignal): Promise<SupportTask | null> {
  return findOpenTaskByUserCategoryAndWindow({
    userId: signal.userId,
    category: mapSignalCategoryToTaskCategory(signal.sourceCategory),
    start: signal.timeWindow?.start,
    end: signal.timeWindow?.end
  });
}

export async function updateTaskFromSignal(taskId: string, signal: BioMathSignal): Promise<SupportTask> {
  const existingTask = await findSupportTaskById(taskId);
  const priority = highestPriority(existingTask.priority, mapSignalSeverityToPriority(signal.severity));

  const updatedTask = {
    ...existingTask,
    priority,
    metadata: {
      ...existingTask.metadata,
      latestSignalId: signal.id,
      latestConfidence: signal.confidence,
      latestSignalType: signal.signalType
    }
  };

  await persistSupportTask(updatedTask);

  return updatedTask;
}

export function mapSignalCategoryToTaskCategory(category: BioMathSignalSourceCategory): TaskCategory {
  const map: Record<BioMathSignalSourceCategory, TaskCategory> = {
    hydration: 'hydration',
    mobility: 'walking_mobility',
    rehabilitation: 'rehabilitation_exercise',
    medication_support: 'medication_support',
    sleep: 'sleep_routine',
    nutrition: 'nutrition_support',
    recovery: 'general_support',
    safety: 'emergency_escalation',
    emotional_support: 'caregiver_check_in',
    caregiver_support: 'caregiver_check_in'
  };

  return map[category];
}

export function mapSignalSeverityToPriority(severity: SignalSeverity): TaskPriority {
  if (severity === 'urgent') return 'urgent';
  if (severity === 'high') return 'high';
  if (severity === 'moderate') return 'normal';
  return 'low';
}

export function selectVerificationMethod(signal: BioMathSignal): VerificationMethod {
  if (signal.sourceCategory === 'mobility') return 'caregiver_confirmed';
  if (signal.sourceCategory === 'rehabilitation') return 'caregiver_confirmed';
  if (signal.sourceCategory === 'safety') return 'caregiver_confirmed';
  if (signal.signalType === 'environment_check_needed') return 'sensor_detected';
  return 'user_confirmed';
}

export function createDefaultEscalationRules(priority: TaskPriority): EscalationRuleConfig[] {
  if (priority === 'urgent') {
    return [
      { level: 'assigned_executor', delayMinutes: 5, notifyRole: 'caregiver', enabled: true },
      { level: 'family', delayMinutes: 10, notifyRole: 'family', enabled: true },
      { level: 'environment_admin', delayMinutes: 15, notifyRole: 'environment_admin', enabled: true },
      { level: 'emergency_placeholder', delayMinutes: 20, notifyRole: 'system_admin', enabled: true }
    ];
  }

  if (priority === 'high') {
    return [
      { level: 'assigned_executor', delayMinutes: 15, notifyRole: 'caregiver', enabled: true },
      { level: 'family', delayMinutes: 30, notifyRole: 'family', enabled: true },
      { level: 'support_provider', delayMinutes: 45, notifyRole: 'support_provider', enabled: true }
    ];
  }

  return [
    { level: 'assigned_executor', delayMinutes: 30, notifyRole: 'caregiver', enabled: true },
    { level: 'family', delayMinutes: 60, notifyRole: 'family', enabled: true }
  ];
}

export function mapTaskSafetyLevel(category: TaskCategory, priority: TaskPriority): 'low' | 'medium' | 'high' {
  if (category === 'emergency_escalation') return 'high';
  if (category === 'walking_mobility') return 'medium';
  if (category === 'rehabilitation_exercise') return 'medium';
  if (priority === 'urgent') return 'high';
  return 'low';
}
```

## 6. Task Assignment Service

File: `server/saven/task-assignment.service.ts`

```ts
export async function assignExecutor(task: SupportTask): Promise<AssignmentDecision> {
  const candidates = await getExecutorCandidates(task.userId, task.environmentId);
  const orderedCandidates = orderExecutorCandidates(candidates);

  for (const candidate of orderedCandidates) {
    if (!candidate.available) continue;
    if (!hasTaskPermission(candidate, task)) continue;
    if (!matchesEnvironment(candidate, task)) continue;
    if (!matchesCapability(candidate, task)) continue;

    if (candidate.type === 'device' || candidate.type === 'robot' || candidate.type === 'environment_system') {
      const safety = await checkDeviceOrRobotSafety(task, candidate);

      await createExecutionEvent({
        id: crypto.randomUUID(),
        userId: task.userId,
        taskId: task.id,
        executorId: candidate.id,
        deviceId: candidate.type === 'device' || candidate.type === 'robot' ? candidate.id : undefined,
        eventType: 'environment_rule_applied',
        severity: safety.allowed ? 'info' : 'warning',
        timestamp: new Date().toISOString(),
        payload: safety
      });

      if (!safety.allowed) continue;
    }

    await updateTaskAssignment(task.id, candidate);

    return {
      assigned: true,
      executor: candidate,
      fallbackRequired: false,
      escalationRequired: false
    };
  }

  const humanFallback = orderedCandidates.find((candidate) => {
    return candidate.available && ['caregiver', 'family', 'support_provider'].includes(candidate.type);
  });

  if (humanFallback) {
    await updateTaskAssignment(task.id, humanFallback);

    return {
      assigned: true,
      executor: humanFallback,
      reason: 'Assigned to human fallback',
      fallbackRequired: true,
      escalationRequired: false
    };
  }

  return {
    assigned: false,
    reason: 'No available executor',
    fallbackRequired: true,
    escalationRequired: true
  };
}

export function orderExecutorCandidates(candidates: ExecutorCandidate[]) {
  const priority: Record<ExecutorType, number> = {
    caregiver: 1,
    family: 2,
    support_provider: 3,
    device: 4,
    robot: 5,
    environment_system: 6,
    system: 7
  };

  return [...candidates].sort((a, b) => priority[a.type] - priority[b.type]);
}

export function hasTaskPermission(candidate: ExecutorCandidate, task: SupportTask) {
  if (candidate.permissions.includes('task:execute')) return true;
  if (candidate.type === 'caregiver' && candidate.permissions.includes('task:verify')) return true;
  if (candidate.type === 'family' && task.safetyLevel === 'low') return true;
  if (candidate.type === 'device' && candidate.permissions.includes('device:execute')) return true;
  if (candidate.type === 'robot' && candidate.permissions.includes('robot:execute')) return true;
  return false;
}

export function matchesEnvironment(candidate: ExecutorCandidate, task: SupportTask) {
  if (!task.environmentId) return true;
  if (!candidate.environmentId) return candidate.type === 'family' || candidate.type === 'support_provider';
  return candidate.environmentId === task.environmentId;
}

export function matchesCapability(candidate: ExecutorCandidate, task: SupportTask) {
  if (candidate.type === 'caregiver') return true;
  if (candidate.type === 'family' && task.safetyLevel === 'low') return true;
  if (candidate.type === 'support_provider') return true;
  return candidate.capabilities.includes(task.category);
}
```

## 7. Safety Rules

File: `server/saven/safety-rule.service.ts`

```ts
export async function checkDeviceOrRobotSafety(task: SupportTask, executor: ExecutorCandidate): Promise<SafetyCheckResult> {
  if (executor.onlineStatus !== 'online') {
    return {
      allowed: false,
      reason: 'Executor is not online',
      fallbackToHuman: true,
      escalationRequired: false
    };
  }

  const environmentPermission = await hasEnvironmentPermission(task, executor);
  if (!environmentPermission) {
    return {
      allowed: false,
      reason: 'Environment permission is not available',
      fallbackToHuman: true,
      escalationRequired: false
    };
  }

  const userConsent = await hasUserConsentForExecutor(task.userId, executor);
  if (!userConsent) {
    return {
      allowed: false,
      reason: 'User consent is not available',
      fallbackToHuman: true,
      escalationRequired: false
    };
  }

  if (task.safetyLevel === 'high') {
    return {
      allowed: false,
      reason: 'High safety level tasks require human execution',
      fallbackToHuman: true,
      escalationRequired: true
    };
  }

  if (!executor.capabilities.includes(task.category)) {
    return {
      allowed: false,
      reason: 'Executor capability does not match task category',
      fallbackToHuman: true,
      escalationRequired: false
    };
  }

  const physicalLimitsPassed = checkPhysicalActionLimits(task, executor);
  if (!physicalLimitsPassed) {
    return {
      allowed: false,
      reason: 'Physical action limits do not allow this task',
      fallbackToHuman: true,
      escalationRequired: true
    };
  }

  return {
    allowed: true,
    fallbackToHuman: false,
    escalationRequired: false
  };
}

export function checkPhysicalActionLimits(task: SupportTask, executor: ExecutorCandidate) {
  if (!executor.safetyLimits) return true;
  if (executor.safetyLimits.telemetryOnly === true) return task.category === 'device_check';
  if (executor.safetyLimits.noPhysicalContact === true) return task.category !== 'walking_mobility';
  return true;
}
```

## 8. Verification Service

File: `server/saven/verification.service.ts`

```ts
export async function verifyTaskCompletion(taskId: string, verificationPayload: VerificationPayload) {
  const task = await findSupportTaskById(taskId);
  validateVerificationSource(task, verificationPayload);

  const nextStatus = mapVerificationResultToTaskStatus(verificationPayload.result);

  const verificationRecord = await createVerificationRecord({
    taskId,
    method: verificationPayload.method,
    source: verificationPayload.source,
    confidence: verificationPayload.confidence,
    timestamp: verificationPayload.timestamp,
    telemetryPayload: verificationPayload.telemetryPayload,
    notes: verificationPayload.notes,
    result: verificationPayload.result
  });

  const updatedTask = await updateTaskStatus(taskId, nextStatus);

  await createExecutionEvent({
    id: crypto.randomUUID(),
    userId: task.userId,
    taskId,
    executorId: verificationPayload.source.id,
    eventType: verificationPayload.result === 'verified' ? 'verification_received' : 'verification_failed',
    severity: verificationPayload.result === 'verified' ? 'info' : 'attention',
    timestamp: verificationPayload.timestamp,
    payload: {
      method: verificationPayload.method,
      source: verificationPayload.source,
      confidence: verificationPayload.confidence,
      result: verificationPayload.result,
      notes: verificationPayload.notes
    }
  });

  if (nextStatus === 'completed') {
    await createExecutionEvent({
      id: crypto.randomUUID(),
      userId: task.userId,
      taskId,
      executorId: verificationPayload.source.id,
      eventType: 'task_completed',
      severity: 'info',
      timestamp: verificationPayload.timestamp,
      payload: {
        verificationRecordId: verificationRecord.id
      }
    });
  }

  await writeResultBackToBioMathCore({
    signalId: task.sourceSignalId ?? '',
    userId: task.userId,
    taskId,
    status: updatedTask.status,
    verificationResult: verificationPayload.result,
    verifiedAt: verificationPayload.timestamp,
    metadata: {
      verificationMethod: verificationPayload.method,
      confidence: verificationPayload.confidence
    }
  });

  return {
    task: updatedTask,
    verification: verificationRecord
  };
}

export function validateVerificationSource(task: SupportTask, payload: VerificationPayload) {
  if (!payload.source.id) throw new Error('Verification source id is required');
  if (payload.confidence < 0 || payload.confidence > 100) throw new Error('Verification confidence must be between 0 and 100');
  if (payload.method === 'device_telemetry' && !payload.telemetryPayload) throw new Error('Device telemetry payload is required');
  if (payload.method === 'robot_telemetry' && !payload.telemetryPayload) throw new Error('Robot telemetry payload is required');
  if (task.verificationRequired && payload.method === 'not_verified') throw new Error('Task requires verification');
}

export function mapVerificationResultToTaskStatus(result: VerificationResult): TaskStatus {
  if (result === 'verified') return 'completed';
  if (result === 'partially_verified') return 'in_progress';
  if (result === 'failed') return 'failed';
  if (result === 'delayed') return 'delayed';
  return 'in_progress';
}
```

## 9. Escalation Service

File: `server/saven/escalation.service.ts`

```ts
export async function checkDelayedTasks() {
  const overdueTasks = await findOverdueOpenTasks(new Date().toISOString());

  for (const task of overdueTasks) {
    await updateTaskStatus(task.id, 'delayed');

    await createExecutionEvent({
      id: crypto.randomUUID(),
      userId: task.userId,
      taskId: task.id,
      executorId: task.assignedExecutorId,
      eventType: 'task_delayed',
      severity: 'attention',
      timestamp: new Date().toISOString(),
      payload: {
        dueAt: task.dueAt,
        assignedExecutorId: task.assignedExecutorId
      }
    });

    const shouldEscalate = shouldEscalateDelayedTask(task);
    if (shouldEscalate) {
      await escalateTask(task);
    }
  }

  return overdueTasks.length;
}

export async function escalateTask(task: SupportTask) {
  const level = resolveEscalationLevel(task);
  const target = await resolveEscalationTarget(task, level);

  await updateTaskStatus(task.id, 'escalated');

  await createExecutionEvent({
    id: crypto.randomUUID(),
    userId: task.userId,
    taskId: task.id,
    executorId: target?.id,
    eventType: 'task_escalated',
    severity: level === 'emergency_placeholder' ? 'critical' : 'warning',
    timestamp: new Date().toISOString(),
    payload: {
      level,
      targetRole: target?.role,
      targetName: target?.name
    }
  });

  return {
    taskId: task.id,
    level,
    target
  };
}

export function resolveEscalationLevel(task: SupportTask): EscalationLevel {
  const rules = task.escalationRules.filter((rule) => rule.enabled);
  if (task.priority === 'urgent') return rules.at(-1)?.level ?? 'environment_admin';
  if (task.priority === 'high') return rules[1]?.level ?? 'family';
  return rules[0]?.level ?? 'assigned_executor';
}

export function shouldEscalateDelayedTask(task: SupportTask) {
  if (task.priority === 'urgent') return true;
  if (task.status === 'failed') return true;
  return task.escalationRules.some((rule) => rule.enabled);
}
```

## 10. Event Service

File: `server/saven/event.service.ts`

```ts
export async function createExecutionEvent(event: ExecutionEvent) {
  const persistedEvent = await persistExecutionEvent(event);
  await publishExecutionEvent(persistedEvent);
  return persistedEvent;
}

export async function publishExecutionEvent(event: ExecutionEvent) {
  await publishToEventBus({
    channel: `saven:user:${event.userId}`,
    event
  });

  if (event.taskId) {
    await publishToEventBus({
      channel: `saven:task:${event.taskId}`,
      event
    });
  }
}

export function createEventPayload(input: Record<string, unknown>) {
  return JSON.parse(JSON.stringify(input));
}
```

## 11. BioMath Core Writeback Service

File: `server/saven/biomath-writeback.service.ts`

```ts
export async function writeResultBackToBioMathCore(result: BioMathWritebackResult) {
  const payload = buildBioMathWritebackPayload(result);
  await persistBioMathWriteback(payload);
  await sendBioMathWriteback(payload);
  return payload;
}

export function buildBioMathWritebackPayload(result: BioMathWritebackResult) {
  return {
    signalId: result.signalId,
    userId: result.userId,
    taskId: result.taskId,
    status: result.status,
    verificationResult: result.verificationResult,
    verifiedAt: result.verifiedAt,
    metadata: result.metadata ?? {},
    sentAt: new Date().toISOString()
  };
}

export async function sendBioMathWriteback(payload: Record<string, unknown>) {
  return {
    accepted: true,
    payload
  };
}
```

## 12. Device Adapter Interfaces

File: `server/saven/adapters/device-adapter.ts`

```ts
export type AdapterStatus = {
  onlineStatus: 'online' | 'offline' | 'standby' | 'maintenance';
  apiStatus: 'not_connected' | 'connected' | 'degraded' | 'unavailable';
  lastSeenAt?: string;
  payload?: Record<string, unknown>;
};

export type AdapterSendResult = {
  accepted: boolean;
  reason?: string;
  externalTaskId?: string;
};

export interface DeviceAdapter {
  canExecute(task: SupportTask): Promise<boolean>;
  sendTask(task: SupportTask): Promise<AdapterSendResult>;
  getStatus(): Promise<AdapterStatus>;
  receiveTelemetry(payload: Record<string, unknown>): Promise<Record<string, unknown>>;
  verifyCompletion(task: SupportTask, telemetry: Record<string, unknown>): Promise<VerificationPayload>;
}
```

## 13. Robot Adapter Interface

File: `server/saven/adapters/robot-adapter.ts`

```ts
export interface RobotAdapter extends DeviceAdapter {
  getSafetyLimits(): Promise<Record<string, unknown>>;
  getCapabilities(): Promise<string[]>;
  pauseExecution(taskId: string): Promise<void>;
  cancelExecution(taskId: string): Promise<void>;
}
```

## 14. Sample Adapters

Files: `server/saven/adapters/*.adapter.ts`

```ts
export class WearableAdapter implements DeviceAdapter {
  async canExecute(task: SupportTask) {
    return task.category === 'device_check';
  }

  async sendTask() {
    return { accepted: true };
  }

  async getStatus() {
    return { onlineStatus: 'online', apiStatus: 'connected', lastSeenAt: new Date().toISOString() };
  }

  async receiveTelemetry(payload: Record<string, unknown>) {
    return payload;
  }

  async verifyCompletion(task: SupportTask, telemetry: Record<string, unknown>) {
    return createTelemetryVerification(task, 'device_telemetry', telemetry);
  }
}

export class SensorAdapter implements DeviceAdapter {
  async canExecute(task: SupportTask) {
    return task.category === 'device_check';
  }

  async sendTask() {
    return { accepted: true };
  }

  async getStatus() {
    return { onlineStatus: 'online', apiStatus: 'connected', lastSeenAt: new Date().toISOString() };
  }

  async receiveTelemetry(payload: Record<string, unknown>) {
    return payload;
  }

  async verifyCompletion(task: SupportTask, telemetry: Record<string, unknown>) {
    return createTelemetryVerification(task, 'sensor_detected', telemetry);
  }
}

export class SmartHomeAdapter implements DeviceAdapter {
  async canExecute(task: SupportTask) {
    return ['sleep_routine', 'device_check'].includes(task.category);
  }

  async sendTask() {
    return { accepted: true };
  }

  async getStatus() {
    return { onlineStatus: 'standby', apiStatus: 'connected', lastSeenAt: new Date().toISOString() };
  }

  async receiveTelemetry(payload: Record<string, unknown>) {
    return payload;
  }

  async verifyCompletion(task: SupportTask, telemetry: Record<string, unknown>) {
    return createTelemetryVerification(task, 'device_telemetry', telemetry);
  }
}

export class RehabilitationDeviceAdapter implements DeviceAdapter {
  async canExecute(task: SupportTask) {
    return task.category === 'rehabilitation_exercise';
  }

  async sendTask() {
    return { accepted: false, reason: 'Physical execution adapter is not connected' };
  }

  async getStatus() {
    return { onlineStatus: 'offline', apiStatus: 'not_connected' };
  }

  async receiveTelemetry(payload: Record<string, unknown>) {
    return payload;
  }

  async verifyCompletion(task: SupportTask, telemetry: Record<string, unknown>) {
    return createTelemetryVerification(task, 'device_telemetry', telemetry);
  }
}

export class RobotExecutionAdapter implements RobotAdapter {
  async canExecute(task: SupportTask) {
    return task.safetyLevel !== 'high';
  }

  async sendTask() {
    return { accepted: false, reason: 'Robot execution gateway is not active' };
  }

  async getStatus() {
    return { onlineStatus: 'offline', apiStatus: 'not_connected' };
  }

  async receiveTelemetry(payload: Record<string, unknown>) {
    return payload;
  }

  async verifyCompletion(task: SupportTask, telemetry: Record<string, unknown>) {
    return createTelemetryVerification(task, 'robot_telemetry', telemetry);
  }

  async getSafetyLimits() {
    return { noPhysicalContact: true, requiresHumanApproval: true };
  }

  async getCapabilities() {
    return ['device_check', 'general_support'];
  }

  async pauseExecution() {}

  async cancelExecution() {}
}

export class HumanoidRobotAdapter extends RobotExecutionAdapter {
  async getCapabilities() {
    return ['device_check', 'general_support', 'caregiver_check_in'];
  }
}

export function createTelemetryVerification(
  task: SupportTask,
  method: VerificationMethod,
  telemetry: Record<string, unknown>
): VerificationPayload {
  return {
    taskId: task.id,
    method,
    source: {
      id: String(telemetry.sourceId ?? 'unknown_source'),
      type: method === 'robot_telemetry' ? 'robot' : 'device'
    },
    confidence: Number(telemetry.confidence ?? 70),
    timestamp: new Date().toISOString(),
    telemetryPayload: telemetry,
    result: telemetry.completed === true ? 'verified' : 'not_confirmed'
  };
}
```

## 15. Example Test Data

```ts
export const exampleBioMathSignals: BioMathSignal[] = [
  {
    id: 'signal_hydration_001',
    userId: 'user_maya_001',
    sourceCategory: 'hydration',
    signalType: 'routine_due',
    severity: 'moderate',
    confidence: 88,
    detectedAt: '2026-05-19T14:00:00.000Z',
    recommendedAction: 'Offer hydration support',
    timeWindow: {
      start: '2026-05-19T14:05:00.000Z',
      end: '2026-05-19T14:30:00.000Z'
    },
    metadata: {
      routine: 'midday_hydration'
    }
  },
  {
    id: 'signal_mobility_001',
    userId: 'user_maya_001',
    sourceCategory: 'mobility',
    signalType: 'recovery_task_due',
    severity: 'high',
    confidence: 91,
    detectedAt: '2026-05-19T15:00:00.000Z',
    recommendedAction: 'Start assisted walking routine',
    timeWindow: {
      start: '2026-05-19T15:15:00.000Z',
      end: '2026-05-19T15:45:00.000Z'
    },
    metadata: {
      recoveryPlanId: 'recovery_plan_001'
    }
  },
  {
    id: 'signal_safety_001',
    userId: 'user_maya_001',
    sourceCategory: 'safety',
    signalType: 'environment_check_needed',
    severity: 'urgent',
    confidence: 94,
    detectedAt: '2026-05-19T16:00:00.000Z',
    recommendedAction: 'Confirm safe home environment',
    timeWindow: {
      start: '2026-05-19T16:00:00.000Z',
      end: '2026-05-19T16:10:00.000Z'
    },
    metadata: {
      environmentId: 'environment_home_001'
    }
  }
];

export const exampleExecutorCandidates: ExecutorCandidate[] = [
  {
    id: 'caregiver_001',
    name: 'Amelia Carter',
    type: 'caregiver',
    role: 'caregiver',
    environmentId: 'environment_home_001',
    available: true,
    permissions: ['task:execute', 'task:verify'],
    capabilities: ['hydration', 'walking_mobility', 'rehabilitation_exercise', 'caregiver_check_in']
  },
  {
    id: 'family_001',
    name: 'Daniel Reed',
    type: 'family',
    role: 'family',
    environmentId: 'environment_home_001',
    available: true,
    permissions: ['task:execute'],
    capabilities: ['hydration', 'nutrition_support', 'sleep_routine', 'general_support']
  },
  {
    id: 'wearable_001',
    name: 'Recovery Wearable',
    type: 'device',
    environmentId: 'environment_home_001',
    available: true,
    permissions: ['device:execute'],
    capabilities: ['device_check'],
    onlineStatus: 'online',
    safetyLimits: {
      telemetryOnly: true
    }
  },
  {
    id: 'robot_001',
    name: 'Home Support Robot',
    type: 'robot',
    environmentId: 'environment_home_001',
    available: false,
    permissions: ['robot:execute'],
    capabilities: ['device_check', 'general_support'],
    onlineStatus: 'offline',
    safetyLimits: {
      noPhysicalContact: true,
      requiresHumanApproval: true
    }
  }
];
```

## 16. Example Execution Flow

```text
1. BioMath Core sends hydration routine_due signal.
2. ingestBioMathSignal validates and normalizes signal.
3. Engine emits signal_received.
4. Engine checks for an open hydration task in the same time window.
5. No related task exists.
6. createSupportTaskFromSignal creates a hydration support task.
7. Engine emits task_created.
8. assignExecutor evaluates caregiver, family, device, robot, and environment system candidates.
9. Caregiver is available, permitted, in the right environment, and capable.
10. Task is assigned to caregiver.
11. Engine emits task_assigned.
12. Caregiver completes the action and sends caregiver_confirmed verification.
13. verifyTaskCompletion validates source and creates VerificationRecord.
14. Task status becomes completed.
15. Engine emits verification_received and task_completed.
16. Result is written back to BioMath Core.
17. Human Support Timeline displays the verified action.
```

## 17. Unit Test Structure

```text
server/saven/__tests__/
  execution-engine.service.test.ts
  signal-ingestion.service.test.ts
  support-task.service.test.ts
  task-assignment.service.test.ts
  safety-rule.service.test.ts
  verification.service.test.ts
  escalation.service.test.ts
  event.service.test.ts
  adapters/
    wearable-adapter.test.ts
    sensor-adapter.test.ts
    smart-home-adapter.test.ts
    rehabilitation-device-adapter.test.ts
    robot-adapter.test.ts
    humanoid-robot-adapter.test.ts
```

### Required Unit Tests

```text
ingestBioMathSignal
  validates required signal fields
  normalizes time values
  emits signal_received
  creates a task when no related task exists
  updates a related open task when one exists
  assigns the best available executor
  escalates when no executor is available

createSupportTaskFromSignal
  maps sourceCategory to task category
  maps severity to priority
  sets verification method
  sets default escalation rules
  sets safety level

assignExecutor
  prioritizes caregiver before family
  falls back to family for low safety tasks
  checks device capability
  blocks offline device assignment
  blocks robot assignment when safety fails
  returns escalationRequired when no executor exists

verifyTaskCompletion
  validates verification source
  creates verification record
  updates task to completed when verified
  updates task to failed when verification fails
  emits verification_received
  emits verification_failed
  writes result back to BioMath Core

checkDelayedTasks
  finds overdue open tasks
  marks overdue tasks delayed
  emits task_delayed
  escalates urgent delayed tasks

DeviceAdapter
  reports status
  receives telemetry
  returns not_confirmed when telemetry is incomplete
  returns verified when telemetry confirms completion
```

### Example Unit Test

```ts
import { describe, expect, it } from 'vitest';
import { mapSignalCategoryToTaskCategory, mapSignalSeverityToPriority } from '../support-task.service';

describe('support task mapping', () => {
  it('maps BioMath hydration signals to hydration support tasks', () => {
    expect(mapSignalCategoryToTaskCategory('hydration')).toBe('hydration');
  });

  it('maps urgent severity to urgent priority', () => {
    expect(mapSignalSeverityToPriority('urgent')).toBe('urgent');
  });
});
```

## 18. Implementation Order

```text
1. Add domain types.
2. Add Prisma extension models.
3. Add signal ingestion service.
4. Add support task mapping service.
5. Add event service.
6. Add assignment service.
7. Add safety rule service.
8. Add verification service.
9. Add escalation service.
10. Add BioMath Core writeback service.
11. Add device and robot adapter interfaces.
12. Add placeholder adapters.
13. Add execution engine orchestration.
14. Add unit tests.
15. Add API route wrappers.
16. Connect Human Support Timeline to execution events.
17. Add BioMath Core writeback integration.
```

## 19. MVP Boundaries

Build now:

- BioMathSignal contract.
- Signal ingestion.
- Support task creation and update logic.
- Executor assignment rules.
- Manual and human verification.
- Device and robot verification placeholders.
- Delayed task checks.
- Escalation event creation.
- Execution event system.
- Adapter interfaces.
- Unit test structure.

Do not build now:

- Autonomous robot execution.
- Medical diagnosis logic.
- Treatment recommendations.
- Chatbot flows.
- Generic care CRM workflows.
- Complex UI before engine behavior is stable.
