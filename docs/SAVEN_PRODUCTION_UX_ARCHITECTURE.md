# SAVEN Production UX Architecture

Project: SAVEN  
Environment: BioMath Core  
Layer: Real human support operating system  
Primary experience: Continuous support coordination, verified reality, recovery continuity, device readiness, and future robot support

## Product Standard

SAVEN is not an app, dashboard, chatbot, medical portal, CRM, or startup-style productivity tool.

SAVEN is a real-life support coordination system inside BioMath Core. It turns digital understanding into real-world support actions, tracks responsibility, verifies completion, and keeps continuity visible for the person, family, caregivers, devices, and future robots.

The interface must answer five questions instantly:

```text
Who needs support?
What needs to happen today?
What already happened?
What requires attention?
Who or what is responsible?
```

The user should feel:

```text
This system understands daily human support and makes it manageable.
```

## 1. Complete SAVEN Visual Architecture

### Public Website Visual Layer

Purpose: product explanation, concept, use cases, robotics readiness, partner and investor communication.

Visual qualities:

```text
Dark premium
Cinematic
Architectural
High-level
Brand-forward
Partner-ready
Investor-ready
```

### Real System Visual Layer

Purpose: real-life daily support operations for a person.

Visual qualities:

```text
Light
Warm
Calm
Operational
Human-first
Large and readable
Emotionally safe
Technologically advanced
Low cognitive load
```

### Visual Separation Rule

The public site can feel cinematic. The real system must feel like a premium recovery center operating interface.

```text
Public SAVEN: concept and confidence
Real SAVEN: support and continuity
```

## 2. Full Route Hierarchy

```text
/saven
  Public SAVEN website

/saven/about
  Public explanation and positioning

/saven/how-it-works
  Public model to support flow

/saven/robotics
  Public robotics readiness and Body Layer story

/saven/partners
  Public partner and investor entry

/app/saven/today
  Main daily support operating center

/app/saven/support
  Support flow, active care actions, responsibility, and continuity

/app/saven/timeline
  Verified human support history

/app/saven/circle
  Relationship view of family, caregivers, clinicians, support providers, devices, and robots

/app/saven/devices
  Device readiness and telemetry state

/app/saven/robots
  Robot readiness, allowed actions, safe execution, and physical limitations

/app/saven/environments
  Care environments, rules, connected people, connected devices, and escalation chains

/app/saven/recovery
  Recovery mode for post-surgery, rehabilitation, temporary recovery, and mobility rebuilding

/app/saven/verification
  Verification center for confirmed, unresolved, telemetry-based, and confidence-scored support actions

/app/saven/settings
  Preferences, adaptation, notification style, support defaults, and safety boundaries
```

## 3. Real Production-Level Layout System

### App Shell

```text
SAVENAppShell
  Context rail
  Person status header
  Adaptive main content
  Needs Attention panel
  Verified support timeline preview
  Live continuity pulse
```

### Desktop Layout

```text
Left context rail
  Person
  Today
  Support
  Timeline
  Circle
  Devices
  Robots
  Environments
  Recovery
  Verification
  Settings

Top status area
  Person name
  Support mode
  Environment
  Continuity state
  Coverage
  Emotional comfort
  Mobility state

Main support stream
  Active support flow
  Priority support actions
  Next support window

Right attention rail
  Delayed actions
  Missed verification
  Device disconnected
  Caregiver unavailable
  Robot offline
  Incomplete recovery sequence

Bottom continuity layer
  Verified human support timeline
```

### Tablet Layout

```text
Top navigation
  Context selectors
  Support status

Main content
  Support header
  Support stream
  Attention panel
  Timeline preview

Secondary panels
  Collapse into horizontal cards
```

### Mobile Layout

```text
Top context bar
  Person
  Status
  Environment

Primary sequence
  Needs attention
  Next support window
  Active support stream
  Verified actions
  Support circle

Navigation
  Bottom tab bar with Today, Support, Timeline, Circle, More
```

## 4. Advanced Component Hierarchy

```text
components/saven/app-shell/
  SAVENAppShell.tsx
  SAVENContextRail.tsx
  SAVENMobileTabBar.tsx
  SAVENTopStatus.tsx
  SupportPulse.tsx
  AdaptiveSurface.tsx

components/saven/today/
  HumanSupportHeader.tsx
  TodaySupportStream.tsx
  SupportActionCard.tsx
  NeedsAttentionPanel.tsx
  VerifiedSupportTimelinePreview.tsx
  NextSupportWindow.tsx
  ContinuityStatePanel.tsx
  SupportCoveragePanel.tsx

components/saven/support-flow/
  SupportFlowVisualization.tsx
  SupportFlowStep.tsx
  ResponsibilityBridge.tsx
  VerificationBridge.tsx
  ContinuityUpdateNode.tsx

components/saven/timeline/
  HumanSupportTimeline.tsx
  TimelineDayGroup.tsx
  TimelineSupportItem.tsx
  TimelineTrustMarker.tsx
  TimelineContinuityLine.tsx

components/saven/circle/
  SupportCircleMap.tsx
  CirclePersonNode.tsx
  CircleDeviceNode.tsx
  CircleRobotNode.tsx
  RelationshipArc.tsx
  ResponsibilityPanel.tsx

components/saven/robots/
  RobotReadinessGrid.tsx
  RobotReadinessCard.tsx
  RobotSafetyState.tsx
  RobotCapabilityPanel.tsx
  RobotActionLimits.tsx
  RobotAssignmentState.tsx

components/saven/recovery/
  RecoveryModeShell.tsx
  RecoveryFocusHeader.tsx
  RecoverySequence.tsx
  RecoveryProgressRibbon.tsx
  RecoveryTaskCard.tsx
  RecoveryContinuityPanel.tsx

components/saven/verification/
  VerificationCenter.tsx
  VerificationQueue.tsx
  VerificationConfidenceCard.tsx
  VerificationMethodPanel.tsx
  UnresolvedActionCard.tsx
  VerificationSourceBadge.tsx

components/saven/shared/
  SupportModeBadge.tsx
  MobilityStateBadge.tsx
  EmotionalComfortBadge.tsx
  ContinuityBadge.tsx
  ExecutorBadge.tsx
  SafeExecutionBadge.tsx
  AttentionBadge.tsx
  SoftPanel.tsx
  LayeredCard.tsx
  CalmButton.tsx
  ProgressiveDisclosure.tsx
```

## 5. Human-Centered UX Flows

### Daily Support Flow

```text
Open Today
  -> See who needs support
  -> See today's active support stream
  -> Resolve Needs Attention
  -> Confirm or review priority actions
  -> See verified support history
  -> Understand next support window
```

### Family Reassurance Flow

```text
Open Today
  -> See support active
  -> See completed verified actions
  -> See caregiver coverage
  -> See no unresolved attention
  -> Leave reassured
```

### Caregiver Clarity Flow

```text
Open Support
  -> See assigned actions
  -> See why each action exists
  -> Complete support action
  -> Confirm completion
  -> Timeline updates
  -> Next action becomes clear
```

### Recovery Focus Flow

```text
Open Recovery
  -> See simplified recovery sequence
  -> Complete current recovery support action
  -> Verify result
  -> See continuity updated
  -> Prepare for next support window
```

## 6. Dynamic Operational Support Flow

This flow must be visible as a graphical operating sequence, not hidden inside a table.

```text
Need Detected
  -> Support Task Created
  -> Assigned to Person / Device / Robot
  -> Action Performed
  -> Verification Received
  -> Continuity Updated
```

### Support Flow States

```text
detected
created
assigned
in_progress
performed
verified
updated
attention_required
escalated
```

### Support Flow Visualization Rules

- Use a horizontal flow on desktop.
- Use a vertical stepper on mobile.
- Highlight the current step with soft motion.
- Completed steps use calm green.
- Attention states use amber.
- Escalation uses restrained red.
- Each step includes plain language, not technical labels.

## 7. Support Continuity Visualization

Continuity is not a score. It is an operational condition.

### Continuity States

```text
steady
active_support
needs_attention
handoff
interrupted
escalated
```

### Continuity Display

```text
Continuity ribbon
  Left: support mode
  Center: active support pulse
  Right: next support window

Continuity line
  Verified actions
  Delayed confirmations
  Handovers
  Device state changes
  Robot readiness changes
```

### Continuity Language

Use:

```text
Support is active
Continuity is steady
Next support window is ready
Confirmation received
Coverage is complete
Needs attention
Handoff in progress
```

Avoid:

```text
Risk score
Patient status
Clinical stability
Case health
Workflow completion
```

## 8. Live State Interaction System

### Real-Time Events

```text
support.need_detected
support.task_created
support.assigned
support.started
support.performed
support.verified
support.delayed
support.escalated
support.continuity_updated
circle.coverage_changed
device.readiness_changed
robot.readiness_changed
verification.received
recovery.sequence_updated
```

### UI Response Rules

```text
support.verified
  Add timeline item
  Animate support flow to verified
  Update continuity state
  Show soft success feedback

support.delayed
  Add Needs Attention item
  Set action card to amber
  Keep language calm

support.escalated
  Move item to top of attention rail
  Use restrained red
  Show responsible person or role

device.readiness_changed
  Update device readiness
  If disconnected, show attention only if related to active support

robot.readiness_changed
  Update robot card
  Show safe execution state
  Never use alarming robot visuals
```

### Live Pulse

The system should include a subtle real-time pulse that communicates active support without becoming distracting.

```text
SupportPulse
  idle
  monitoring
  action_active
  verification_waiting
  continuity_updated
  attention
```

## 9. Recovery Mode UX

Route: `/app/saven/recovery`

Recovery Mode is a simplified operational mode for post-surgery, rehabilitation, temporary recovery, and mobility rebuilding.

### Recovery Mode Principles

```text
Reduce cognitive load
Prioritize recovery sequence
Show one current action clearly
Use larger touch targets
Minimize simultaneous choices
Emphasize verified progression
Keep family and caregivers informed
```

### Recovery Layout

```text
RecoveryFocusHeader
  Person
  Recovery mode
  Environment
  Current continuity state

RecoverySequence
  Current action
  Next action
  Rest period
  Verification needed

RecoveryProgressRibbon
  Completed today
  Waiting confirmation
  Next support window

RecoveryContinuityPanel
  Caregiver coverage
  Device readiness
  Mobility support state
```

### Senior Recovery Adaptation

```text
Larger type
Fewer cards on screen
Softer reminder language
Strong next-action focus
More explicit confirmation state
Reduced animation density
```

## 10. Robot Interaction UX

Route: `/app/saven/robots`

Robots are support executors, not independent care decision-makers.

### Robot Visual Language

```text
Safe
Calm
Human-compatible
Premium
Non-threatening
Warm interaction style
Soft humanoid references
Rounded surfaces
Tesla Optimus inspired
```

### Robot Card Content

```text
Robot name
Robot type
Support capability
Current readiness
Allowed actions
Current assignment
Physical limitations
Environment restrictions
Last telemetry
Safe execution state
```

### Robot Readiness States

```text
ready
standby
limited
maintenance
offline
disabled
```

### Robot UX Language

Use:

```text
Robot readiness
Support capability
Safe execution
Task availability
Physical action limits
Human approval required
Environment allowed
```

Avoid:

```text
Autonomous care
Robot command
Control terminal
Mission
Target
Deploy
Override human
```

## 11. Verification UX

Route: `/app/saven/verification`

Verification is the heart of SAVEN. It must show reality, not assumptions.

### Verification Center Layout

```text
Verification summary
  Verified today
  Waiting confirmation
  Telemetry verified
  Human verified
  Needs review

Verification queue
  Unresolved actions
  Missing confirmation
  Conflicting signal
  Low confidence telemetry

Verified actions
  What was verified
  By whom
  How
  When
  Confidence

Verification methods
  User confirmed
  Caregiver confirmed
  Family confirmed
  Wearable telemetry
  Robot telemetry
  Sensor confirmation
  System inference
```

### Confidence Display

Confidence must not feel like diagnosis. It is only trust in completion evidence.

Use:

```text
Confirmation confidence
Evidence strength
Source reliability
Needs review
```

Avoid:

```text
Clinical confidence
Diagnostic certainty
Risk probability
Treatment confidence
```

## 12. Support Circle UX

Route: `/app/saven/circle`

The Support Circle shows who is helping the person.

### Circle Nodes

```text
Supported person
Family
Caregivers
Clinicians
Support providers
Devices
Robots
Environment systems
```

### Circle Visualization

```text
Center: supported person
Inner ring: family and caregivers
Middle ring: clinicians and support providers
Outer ring: devices, robots, environments
Relationship arcs: responsibility, verification, escalation, coverage
```

### Circle Questions

```text
Who is helping?
Who can verify actions?
Who is responsible now?
Who receives escalation?
Which devices or robots support this environment?
```

### Circle Interaction

```text
Select node
  Show role
  Show current responsibility
  Show access level
  Show verification ability
  Show escalation role
```

## 13. Real-Time Operational State Logic

### State Model

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

export type SupportFlowStep =
  | 'need_detected'
  | 'task_created'
  | 'assigned'
  | 'action_performed'
  | 'verification_received'
  | 'continuity_updated';

export type AdaptationProfile = {
  ageGroup: 'child' | 'teen' | 'adult' | 'senior' | 'advanced_senior';
  mobilityLevel: 'fully_independent' | 'light_assistance' | 'walking_support' | 'limited_mobility' | 'wheelchair_support' | 'bed_recovery';
  supportMode: 'independent_living' | 'home_recovery' | 'post_surgery_recovery' | 'rehabilitation' | 'senior_support' | 'chronic_condition_support' | 'child_support' | 'temporary_care' | 'wellness_monitoring';
  cognitiveLoad: 'standard' | 'reduced' | 'minimal';
  recoveryState: 'none' | 'active' | 'resting' | 'progressing' | 'needs_review';
  emotionalComfort: 'steady' | 'needs_reassurance' | 'avoid_pressure';
  technologyComfort: 'human_first' | 'device_comfortable' | 'robot_cautious' | 'robot_ready';
};
```

### Adaptation Rules

```text
Senior recovery mode
  Larger type
  Fewer simultaneous actions
  Softer reminders
  Strong continuity emphasis
  Reduced motion

Robot cautious mode
  Robot language becomes readiness-focused
  Human approval appears more prominently
  Physical action limits are visible

Low mobility mode
  Mobility support appears higher
  Device readiness and caregiver coverage are emphasized
  Escalation chain is easier to access

Caregiver-first communication
  Support actions show caregiver responsibility first
  User prompts become secondary
```

## 14. Responsive Desktop Tablet Mobile Behavior

### Desktop

```text
Three-zone operating layout
  Context rail
  Main support stream
  Needs Attention panel

Bottom continuity timeline
  Visible on Today
  Expanded on Timeline

Support Flow
  Horizontal visual sequence
```

### Tablet

```text
Two-zone layout
  Main support stream
  Collapsible attention panel

Context rail
  Collapses into top navigation

Support Flow
  Two-row sequence
```

### Mobile

```text
Single-zone support-first layout
  Needs attention
  Next support window
  Active support
  Verified actions

Navigation
  Bottom tab bar

Support Flow
  Vertical sequence
```

## 15. Animation And Motion Principles

Motion should reassure, not entertain.

### Motion Rules

```text
Duration
  160ms to 260ms for state changes
  320ms to 480ms for continuity transitions

Easing
  ease-out for confirmations
  ease-in-out for flow movement

Motion scale
  subtle
  calm
  no bouncing
  no aggressive flashes
```

### Microinteractions

```text
Support verified
  Soft green glow
  Timeline item appears
  Continuity pulse updates

Needs attention
  Amber edge appears
  No shaking
  No alarm animation

Escalation
  Restrained red state
  Clear responsible party
  Calm next action

Robot readiness changed
  Readiness badge transitions
  Physical limits remain visible

Timeline progression
  Smooth vertical reveal
  Trust marker appears
```

## 16. Design Token System

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
    railWidth: '292px',
    attentionWidth: '360px',
    maxContent: '1440px'
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
Font family
  Inter or system sans

Hero status
  48px to 64px
  font weight 600
  line height 1.02

Page title
  36px to 48px
  font weight 600
  line height 1.08

Section title
  22px to 28px
  font weight 600
  line height 1.15

Card title
  18px to 22px
  font weight 600
  line height 1.2

Body
  15px to 17px
  line height 1.65

Metadata
  12px to 14px
  font weight 500 or 600
```

### Typography Rules

- Status text should be instantly readable.
- Avoid compressed text blocks.
- Use sentence case for human language.
- Use technical labels only in secondary details.
- Increase type size in senior recovery adaptation.

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
  Dense support cards: 12px to 16px
  Main sections: 24px to 32px
  Page groups: 40px to 56px

Touch targets
  Minimum 44px

Card density
  One clear purpose per card
  No nested card stacks unless showing an event list
```

### Layout Rules

- Needs Attention must not hide below low-priority content on desktop.
- Next support window must be visible without scrolling on Today.
- Timeline preview should be visible on Today but expanded on Timeline.
- Support stream is not a table.
- Tasks are support actions, not project tickets.
- Robot information must show safety boundaries before advanced details.

## 20. Production UI Implementation Plan

### Phase 1: Design Foundation

```text
Create design tokens
Create color system
Create typography system
Create shell layout
Create adaptive layout rules
Create shared surfaces and badges
```

### Phase 2: Today Operating Center

```text
Build HumanSupportHeader
Build TodaySupportStream
Build NeedsAttentionPanel
Build NextSupportWindow
Build VerifiedSupportTimelinePreview
Build SupportPulse
Build ContinuityStatePanel
```

### Phase 3: Support Flow System

```text
Build SupportFlowVisualization
Build SupportFlowStep
Build ResponsibilityBridge
Build VerificationBridge
Build ContinuityUpdateNode
Connect live event states
```

### Phase 4: Timeline And Continuity

```text
Build HumanSupportTimeline
Build TimelineDayGroup
Build TimelineSupportItem
Build TimelineTrustMarker
Build TimelineContinuityLine
Connect verified actions
```

### Phase 5: Support Circle

```text
Build SupportCircleMap
Build node components
Build relationship arcs
Build responsibility panel
Add role and escalation visibility
```

### Phase 6: Recovery Mode

```text
Build RecoveryModeShell
Build RecoveryFocusHeader
Build RecoverySequence
Build RecoveryProgressRibbon
Build RecoveryContinuityPanel
Add senior recovery adaptation
```

### Phase 7: Verification Center

```text
Build VerificationCenter
Build VerificationQueue
Build VerificationConfidenceCard
Build VerificationMethodPanel
Build UnresolvedActionCard
Connect verification event updates
```

### Phase 8: Robots And Devices

```text
Build RobotReadinessGrid
Build RobotReadinessCard
Build RobotSafetyState
Build RobotCapabilityPanel
Build RobotActionLimits
Build device readiness panels
Connect readiness events
```

### Phase 9: Real-Time State Layer

```text
Create operational state reducer
Create support pulse state machine
Create WebSocket event handling
Create optimistic state transitions
Create calm error and reconnect states
```

### Phase 10: Responsive And QA

```text
Verify desktop layout
Verify tablet layout
Verify mobile layout
Verify senior recovery adaptation
Verify robot cautious adaptation
Verify reduced motion mode
Verify all UI copy
Verify visual contrast
Verify no CRM or hospital dashboard drift
```

## Production Acceptance Criteria

- Today immediately answers who, what, what happened, what needs attention, and who is responsible.
- The main center feels like a live support stream, not a static dashboard.
- Needs Attention contains only unresolved or risky situations.
- Timeline feels like human support history, not an audit log.
- Support Circle visually explains who is helping the person.
- Robot experience feels safe, calm, human-compatible, and non-threatening.
- Recovery Mode reduces cognitive load and prioritizes verified progression.
- Verification Center clearly shows what was verified, by whom, how, when, and confidence.
- Interface adapts to age group, mobility, support mode, recovery state, emotional comfort, technology comfort, and robot comfort.
- Animations are soft, purposeful, and reassuring.
- All code, labels, file names, enums, routes, database fields, and UI strings remain in English.
