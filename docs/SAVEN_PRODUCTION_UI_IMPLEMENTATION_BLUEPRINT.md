# SAVEN Production UI Implementation Blueprint

Project: SAVEN  
Environment: BioMath Core  
Layer: Production user interface implementation for the real SAVEN operating system  
Primary routes: `/app/saven/today`, `/app/saven/support`, `/app/saven/timeline`, `/app/saven/circle`, `/app/saven/devices`, `/app/saven/robots`, `/app/saven/environments`, `/app/saven/recovery`, `/app/saven/verification`, `/app/saven/settings`

## Product Intent

SAVEN is not an app, dashboard, chatbot, CRM, or medical portal. It is a real-life support coordination system that makes daily human support manageable.

The UI must answer instantly:

```text
Who needs support?
What needs to happen today?
What already happened?
What requires attention?
Who or what is responsible?
```

## 1. Complete SAVEN Visual Architecture

### Real System Surface

```text
SAVENAppShell
  Warm operating background
  Left context rail on desktop
  Human Support Header at top
  Live support stream in center
  Needs Attention rail on right
  Verified Human Support Timeline at bottom
  Bottom tab bar on mobile
```

### Experience Zones

```text
Human context
  Person name
  Support mode
  Environment
  Continuity state
  Support coverage
  Emotional comfort state
  Mobility state

Operational flow
  Active support actions
  Next support window
  Responsibility
  Verification requirement

Reality record
  Verified actions
  Support timeline
  Continuity updates
  Confirmation source

Readiness layer
  Support circle
  Device readiness
  Robot readiness
  Environment restrictions
```

## 2. Full Route Hierarchy

```text
app/app/saven/today/page.tsx
app/app/saven/support/page.tsx
app/app/saven/timeline/page.tsx
app/app/saven/circle/page.tsx
app/app/saven/devices/page.tsx
app/app/saven/robots/page.tsx
app/app/saven/environments/page.tsx
app/app/saven/recovery/page.tsx
app/app/saven/verification/page.tsx
app/app/saven/settings/page.tsx
```

## 3. Real Production-Level Layout System

File: `components/saven/system/SAVENAppShell.tsx`

```tsx
import type { ReactNode } from 'react';
import { SAVENContextRail } from './SAVENContextRail';
import { SAVENTopStatus } from './SAVENTopStatus';
import { SAVENMobileTabBar } from './SAVENMobileTabBar';

type SAVENAppShellProps = {
  activeRoute: string;
  children: ReactNode;
  attention?: ReactNode;
  timeline?: ReactNode;
};

export function SAVENAppShell({ activeRoute, children, attention, timeline }: SAVENAppShellProps) {
  return (
    <div className="min-h-screen bg-saven-background text-saven-text-primary">
      <div className="fixed inset-0 -z-10 bg-saven-atmosphere" />
      <div className="grid min-h-screen xl:grid-cols-[296px_minmax(0,1fr)]">
        <SAVENContextRail activeRoute={activeRoute} />
        <div className="min-w-0 pb-20 xl:pb-0">
          <SAVENTopStatus />
          <main className="mx-auto grid max-w-[1520px] gap-6 px-4 py-5 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="min-w-0 space-y-6">{children}</section>
            <aside className="hidden xl:block">{attention}</aside>
            {timeline && <section className="xl:col-span-2">{timeline}</section>}
          </main>
        </div>
      </div>
      <SAVENMobileTabBar activeRoute={activeRoute} />
    </div>
  );
}
```

File: `components/saven/system/SAVENTopStatus.tsx`

```tsx
import { ContinuityBadge } from '../shared/ContinuityBadge';
import { EmotionalComfortBadge } from '../shared/EmotionalComfortBadge';
import { MobilityStateBadge } from '../shared/MobilityStateBadge';
import { SupportPulse } from './SupportPulse';

export function SAVENTopStatus() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-saven-background/86 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1520px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-saven-text-muted">BioMath Core SAVEN</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-saven-text-primary">Daily human support operations</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ContinuityBadge state="active_support" />
          <EmotionalComfortBadge state="steady" />
          <MobilityStateBadge state="walking_support" />
          <SupportPulse state="monitoring" />
        </div>
      </div>
    </header>
  );
}
```

## 4. Advanced Component Hierarchy

```text
components/saven/system/
  SAVENAppShell.tsx
  SAVENContextRail.tsx
  SAVENTopStatus.tsx
  SAVENMobileTabBar.tsx
  SupportPulse.tsx

components/saven/today/
  HumanSupportHeader.tsx
  TodaySupportStream.tsx
  SupportActionCard.tsx
  NeedsAttentionPanel.tsx
  VerifiedHumanSupportTimeline.tsx
  NextSupportWindow.tsx

components/saven/support/
  SupportFlowVisualization.tsx
  SupportFlowStep.tsx
  SupportResponsibilityPanel.tsx
  ActiveSupportSequence.tsx

components/saven/circle/
  SupportCircleMap.tsx
  CircleNode.tsx
  RelationshipArc.tsx
  ResponsibilityDetail.tsx

components/saven/robots/
  RobotReadinessCard.tsx
  RobotSafetyState.tsx
  RobotCapabilityList.tsx
  RobotActionLimits.tsx

components/saven/recovery/
  RecoveryModeShell.tsx
  RecoveryFocusHeader.tsx
  RecoverySequence.tsx
  RecoveryProgressRibbon.tsx

components/saven/verification/
  VerificationCenter.tsx
  VerificationQueue.tsx
  VerificationEvidenceCard.tsx
  VerificationConfidenceMeter.tsx

components/saven/shared/
  SoftPanel.tsx
  LayeredSurface.tsx
  CalmButton.tsx
  ContinuityBadge.tsx
  ExecutorBadge.tsx
  SafeExecutionBadge.tsx
  AttentionState.tsx
```

## 5. Human-Centered UX Flows

### Today Flow

```text
Person context appears
  -> Continuity state appears
  -> Needs Attention is visible if unresolved
  -> Active support stream shows what is happening
  -> Next support window shows what comes next
  -> Verified timeline confirms what already happened
```

### Support Action Flow

```text
Need is detected
  -> Support action is created
  -> Responsible helper is visible
  -> Verification requirement is visible
  -> Action changes state
  -> Confirmation creates timeline entry
```

### Family Flow

```text
Open Today
  -> See support active
  -> See verified actions
  -> See no unresolved attention
  -> See next support window
  -> Feel reassured
```

### Caregiver Flow

```text
Open Support
  -> See assigned support actions
  -> Understand why each exists
  -> Perform action
  -> Confirm result
  -> See continuity update
```

## 6. Dynamic Operational Support Flow

File: `components/saven/support/SupportFlowVisualization.tsx`

```tsx
import type { SupportFlowStepState } from '@/lib/saven/production-types';
import { SupportFlowStep } from './SupportFlowStep';

const steps = [
  { id: 'need_detected', label: 'Need detected' },
  { id: 'task_created', label: 'Support task created' },
  { id: 'assigned', label: 'Assigned' },
  { id: 'action_performed', label: 'Action performed' },
  { id: 'verification_received', label: 'Verification received' },
  { id: 'continuity_updated', label: 'Continuity updated' }
] as const;

export function SupportFlowVisualization({ currentStep }: { currentStep: SupportFlowStepState }) {
  return (
    <section className="rounded-saven-xl border border-saven-border-soft bg-saven-surface-panel p-5 shadow-saven-panel">
      <div className="grid gap-3 lg:grid-cols-6">
        {steps.map((step) => (
          <SupportFlowStep key={step.id} id={step.id} label={step.label} currentStep={currentStep} />
        ))}
      </div>
    </section>
  );
}
```

File: `components/saven/support/SupportFlowStep.tsx`

```tsx
import type { SupportFlowStepState } from '@/lib/saven/production-types';

const order: SupportFlowStepState[] = ['need_detected', 'task_created', 'assigned', 'action_performed', 'verification_received', 'continuity_updated'];

export function SupportFlowStep({ id, label, currentStep }: { id: SupportFlowStepState; label: string; currentStep: SupportFlowStepState }) {
  const complete = order.indexOf(id) < order.indexOf(currentStep);
  const active = id === currentStep;

  return (
    <div className={`rounded-3xl p-4 transition-all duration-300 ${active ? 'bg-saven-accent-blueSoft ring-1 ring-saven-accent-blue' : complete ? 'bg-saven-state-completedSoft' : 'bg-white/70'}`}>
      <div className={`h-2 w-2 rounded-full ${active ? 'bg-saven-accent-blue' : complete ? 'bg-saven-state-completed' : 'bg-saven-text-muted'}`} />
      <p className="mt-4 text-sm font-semibold text-saven-text-primary">{label}</p>
    </div>
  );
}
```

## 7. Support Continuity Visualization

File: `components/saven/today/ContinuityStatePanel.tsx`

```tsx
import type { OperationalState } from '@/lib/saven/production-types';
import { ContinuityBadge } from '../shared/ContinuityBadge';

export function ContinuityStatePanel({ state }: { state: OperationalState }) {
  return (
    <section className="rounded-saven-xl border border-saven-border-soft bg-saven-surface-panel p-6 shadow-saven-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-saven-text-muted">Support continuity</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-saven-text-primary">Support is actively happening</h2>
          <p className="mt-3 text-sm leading-6 text-saven-text-secondary">Verified actions, next support window, and support coverage are connected in one calm operational view.</p>
        </div>
        <ContinuityBadge state={state} />
      </div>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-saven-accent-blueSoft">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-saven-accent-blue to-saven-accent-gold" />
      </div>
    </section>
  );
}
```

## 8. Live State Interaction System

File: `lib/saven/production-state.ts`

```ts
import type { OperationalEvent, OperationalState, SupportPulseState } from './production-types';

export function resolveOperationalState(events: OperationalEvent[]): OperationalState {
  const latest = events.at(-1);
  if (!latest) return 'steady';
  if (latest.name === 'support.escalated') return 'escalated';
  if (latest.name === 'support.delayed') return 'needs_attention';
  if (latest.name === 'support.assigned') return 'active_support';
  if (latest.name === 'verification.received') return 'steady';
  if (latest.name === 'circle.coverage_changed') return 'handoff';
  return 'steady';
}

export function resolveSupportPulseState(state: OperationalState): SupportPulseState {
  if (state === 'active_support') return 'action_active';
  if (state === 'needs_attention') return 'attention';
  if (state === 'escalated') return 'attention';
  if (state === 'handoff') return 'verification_waiting';
  return 'monitoring';
}
```

## 9. Recovery Mode UX

File: `app/app/saven/recovery/page.tsx`

```tsx
import { SAVENAppShell } from '@/components/saven/system/SAVENAppShell';
import { RecoveryFocusHeader } from '@/components/saven/recovery/RecoveryFocusHeader';
import { RecoveryProgressRibbon } from '@/components/saven/recovery/RecoveryProgressRibbon';
import { RecoverySequence } from '@/components/saven/recovery/RecoverySequence';
import { RecoveryContinuityPanel } from '@/components/saven/recovery/RecoveryContinuityPanel';

export default function SAVENRecoveryPage() {
  return (
    <SAVENAppShell activeRoute="recovery">
      <RecoveryFocusHeader />
      <RecoveryProgressRibbon />
      <RecoverySequence />
      <RecoveryContinuityPanel />
    </SAVENAppShell>
  );
}
```

Recovery Mode must reduce cognitive load:

```text
One current recovery action
One next support window
Clear rest period
Visible confirmation state
Larger typography
Fewer simultaneous choices
Reduced motion density
```

## 10. Robot Interaction UX

File: `components/saven/robots/RobotReadinessCard.tsx`

```tsx
import type { RobotReadiness } from '@/lib/saven/production-types';
import { RobotSafetyState } from './RobotSafetyState';
import { RobotActionLimits } from './RobotActionLimits';

export function RobotReadinessCard({ robot }: { robot: RobotReadiness }) {
  return (
    <article className="rounded-saven-xl border border-saven-border-soft bg-saven-surface-panel p-6 shadow-saven-panel">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-saven-text-muted">Robot readiness</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-saven-text-primary">{robot.name}</h3>
          <p className="mt-2 text-sm leading-6 text-saven-text-secondary">{robot.supportCapability}</p>
        </div>
        <RobotSafetyState state={robot.safetyState} />
      </div>
      <div className="mt-5 grid gap-3 text-sm text-saven-text-secondary sm:grid-cols-2">
        <span>Current readiness: {robot.readiness}</span>
        <span>Current assignment: {robot.currentAssignment}</span>
        <span>Environment: {robot.environment}</span>
        <span>Task availability: {robot.taskAvailability}</span>
      </div>
      <RobotActionLimits limits={robot.physicalLimitations} />
    </article>
  );
}
```

Robot language:

```text
Robot readiness
Support capability
Safe execution
Task availability
Physical action limits
Environment restrictions
Human approval required
```

## 11. Verification UX

File: `components/saven/verification/VerificationCenter.tsx`

```tsx
import { VerificationQueue } from './VerificationQueue';
import { VerificationEvidenceCard } from './VerificationEvidenceCard';

export function VerificationCenter() {
  return (
    <div className="space-y-6">
      <section className="rounded-saven-xl border border-saven-border-soft bg-saven-surface-panel p-6 shadow-saven-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-saven-text-muted">Verification</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-saven-text-primary">Reality confirmed, not assumed</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-saven-text-secondary">See what was verified, by whom, how, when, confidence level, and what still needs review.</p>
      </section>
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <VerificationQueue />
        <VerificationEvidenceCard />
      </div>
    </div>
  );
}
```

Verification language:

```text
User confirmed
Caregiver confirmed
Family confirmed
Wearable telemetry
Robot telemetry
Sensor confirmation
System inference
Confirmation confidence
Needs review
```

## 12. Support Circle UX

File: `components/saven/circle/SupportCircleMap.tsx`

```tsx
import type { SupportCircleNode } from '@/lib/saven/production-types';
import { CircleNode } from './CircleNode';

export function SupportCircleMap({ nodes }: { nodes: SupportCircleNode[] }) {
  return (
    <section className="relative min-h-[620px] overflow-hidden rounded-saven-xl border border-saven-border-soft bg-saven-surface-panel p-6 shadow-saven-panel">
      <div className="absolute inset-10 rounded-full border border-saven-border-line" />
      <div className="absolute inset-24 rounded-full border border-saven-border-line" />
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <CircleNode label="Anna Roberts" type="person" active />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {nodes.map((node) => (
          <CircleNode key={node.id} label={node.label} type={node.type} />
        ))}
      </div>
    </section>
  );
}
```

Circle questions:

```text
Who is helping?
Who can verify actions?
Who is responsible now?
Who receives escalation?
Which devices or robots support this environment?
```

## 13. Real-Time Operational State Logic

File: `lib/saven/production-types.ts`

```ts
export type OperationalState =
  | 'steady'
  | 'active_support'
  | 'verification_waiting'
  | 'needs_attention'
  | 'handoff'
  | 'interrupted'
  | 'escalated';

export type SupportPulseState =
  | 'idle'
  | 'monitoring'
  | 'action_active'
  | 'verification_waiting'
  | 'continuity_updated'
  | 'attention';

export type SupportFlowStepState =
  | 'need_detected'
  | 'task_created'
  | 'assigned'
  | 'action_performed'
  | 'verification_received'
  | 'continuity_updated';

export type OperationalEvent = {
  id: string;
  name:
    | 'support.need_detected'
    | 'support.task_created'
    | 'support.assigned'
    | 'support.started'
    | 'support.performed'
    | 'support.verified'
    | 'support.delayed'
    | 'support.escalated'
    | 'support.continuity_updated'
    | 'circle.coverage_changed'
    | 'device.readiness_changed'
    | 'robot.readiness_changed'
    | 'verification.received'
    | 'recovery.sequence_updated';
  timestamp: string;
  payload: Record<string, unknown>;
};

export type RobotReadiness = {
  id: string;
  name: string;
  supportCapability: string;
  readiness: 'ready' | 'standby' | 'limited' | 'maintenance' | 'offline' | 'disabled';
  safetyState: 'safe' | 'limited' | 'needs_review' | 'disabled';
  currentAssignment: string;
  taskAvailability: string;
  environment: string;
  physicalLimitations: string[];
};

export type SupportCircleNode = {
  id: string;
  label: string;
  type: 'person' | 'family' | 'caregiver' | 'clinician' | 'provider' | 'device' | 'robot' | 'environment';
};
```

## 14. Responsive Desktop Tablet Mobile Behavior

```text
Desktop
  Context rail remains visible
  Today uses main stream plus Needs Attention rail
  Timeline preview remains visible under stream
  Support flow is horizontal

Tablet
  Context rail collapses into top navigation
  Needs Attention becomes a collapsible panel
  Support flow uses two rows
  Cards use two-column grids

Mobile
  Bottom tab bar controls primary routes
  Needs Attention appears first
  Next support window appears above stream
  Support flow becomes vertical
  Robot and device details use progressive disclosure
```

## 15. Animation And Motion Principles

```text
State transition
  160ms to 260ms

Continuity update
  320ms to 480ms

Support verified
  Soft green glow
  Timeline reveal
  Support pulse update

Needs attention
  Amber edge appears
  No shaking
  No aggressive alert

Escalation
  Restrained red
  Clear responsible party
  Calm next action

Reduced motion mode
  Disable pulse animation
  Keep status updates visible
  Use opacity and color instead of movement
```

## 16. Design Token System

File: `lib/saven/design-tokens.ts`

```ts
export const savenTokens = {
  radius: {
    sm: '12px',
    md: '18px',
    lg: '24px',
    xl: '32px',
    full: '999px'
  },
  shadow: {
    soft: '0 18px 60px rgba(15, 23, 42, 0.08)',
    panel: '0 12px 36px rgba(15, 23, 42, 0.06)',
    lift: '0 24px 80px rgba(15, 23, 42, 0.12)'
  },
  motion: {
    fast: '160ms',
    base: '240ms',
    slow: '420ms'
  },
  layout: {
    railWidth: '296px',
    attentionWidth: '360px',
    maxContent: '1520px'
  }
};
```

## 17. Color System

```ts
export const savenColors = {
  background: {
    base: '#f7f5f1',
    warm: '#fbfaf7',
    panel: 'rgba(255, 255, 255, 0.82)',
    elevated: '#ffffff'
  },
  text: {
    primary: '#0f172a',
    secondary: '#64748b',
    muted: '#94a3b8',
    inverse: '#ffffff'
  },
  accent: {
    blue: '#5b8fc9',
    blueSoft: '#dbeafe',
    gold: '#c69b48',
    goldSoft: '#f4ead4'
  },
  state: {
    completed: '#047857',
    completedSoft: '#ecfdf5',
    attention: '#b45309',
    attentionSoft: '#fffbeb',
    escalated: '#b91c1c',
    escalatedSoft: '#fef2f2',
    steady: '#2563eb',
    steadySoft: '#eff6ff'
  },
  border: {
    soft: 'rgba(255, 255, 255, 0.72)',
    line: '#e7e5df',
    focus: '#93c5fd'
  }
};
```

## 18. Typography System

```text
Hero status
  48px to 64px
  weight 600
  line height 1.02

Page title
  36px to 48px
  weight 600
  line height 1.08

Section title
  22px to 28px
  weight 600
  line height 1.15

Card title
  18px to 22px
  weight 600
  line height 1.2

Body text
  15px to 17px
  line height 1.65

Metadata
  12px to 14px
  weight 500 to 600
```

## 19. Spacing And Layout Rules

```text
Page padding
  Desktop: 32px to 40px
  Tablet: 24px to 32px
  Mobile: 16px to 20px

Panel padding
  Desktop: 24px to 32px
  Mobile: 18px to 22px

Grid gap
  Support cards: 12px to 16px
  Main sections: 24px to 32px
  Page groups: 40px to 56px

Touch target
  Minimum 44px

Card rule
  One clear purpose per card
  No dense table-first sections
  No overloaded control clusters
```

## 20. Production UI Implementation Plan

```text
1. Add design tokens and Tailwind theme extension.
2. Add production SAVEN types.
3. Build SAVENAppShell.
4. Build context rail, top status, and mobile tab bar.
5. Build shared badges and surfaces.
6. Build Today route with HumanSupportHeader, TodaySupportStream, NeedsAttentionPanel, NextSupportWindow, and VerifiedHumanSupportTimeline.
7. Build Support route with SupportFlowVisualization and responsibility panels.
8. Build Timeline route as human support history.
9. Build Circle route with relationship visualization.
10. Build Devices route with readiness language.
11. Build Robots route with calm safe execution language and physical limitations.
12. Build Environments route with rules and escalation chains.
13. Build Recovery route with simplified recovery mode.
14. Build Verification route with evidence, method, confidence, and unresolved action views.
15. Build Settings route for adaptation preferences.
16. Add real-time operational reducer.
17. Add WebSocket event handling.
18. Add motion states and reduced motion behavior.
19. Test desktop, tablet, and mobile layouts.
20. Review UI copy against prohibited language and product philosophy.
```

## Production Acceptance Criteria

```text
Today immediately answers who needs support, what needs to happen, what happened, what needs attention, and who is responsible.
The main center feels like a live support stream, not a static dashboard.
Needs Attention contains only unresolved or risky situations.
Timeline feels like human support continuity, not an audit log.
Support Circle visually explains who is helping the person.
Robot experience feels safe, calm, human-compatible, and non-threatening.
Recovery Mode reduces cognitive load and prioritizes verified progression.
Verification Center shows what was verified, by whom, how, when, confidence, and unresolved actions.
The interface adapts to age group, mobility level, support mode, recovery state, emotional comfort, technology comfort, and robot comfort.
Animations are soft, purposeful, and reassuring.
All code, labels, file names, enums, routes, database fields, and UI strings remain in English.
```
