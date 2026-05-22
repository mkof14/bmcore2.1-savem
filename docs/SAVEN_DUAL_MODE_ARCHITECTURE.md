# SAVEN Dual Mode Architecture

## Product Requirement

SAVEN must operate in two modes:

1. BioMath Connected Mode
2. Autonomous Mode

Both modes use the same SAVEN operational core:

- Execution engine
- Verification engine
- Support timeline
- Environment system
- Device layer
- Robot layer
- Access control
- Escalation system
- Continuity engine

The modes differ by intelligence source, recommendation depth, personalization depth, and continuity modeling.

## Mode 1: BioMath Connected SAVEN

BioMath Connected Mode uses BioMath Core as the human understanding engine.

BioMath Core provides:

- Physiological patterns
- Behavior analysis
- Recovery patterns
- Dynamic routines
- Personalized support recommendations
- Continuity intelligence
- Biological trends
- Contextual adaptation
- Support priorities
- Escalation indicators
- Adaptive thresholds

SAVEN receives this context and turns it into operational support:

- Create support tasks
- Assign support actions
- Coordinate people, devices, and robots
- Verify execution
- Update continuity state
- Send execution results back to BioMath Core

Connected operational flow:

BioMath Core -> Human Understanding Layer -> SAVEN Coordination Layer -> People / Devices / Robots -> Verification Layer -> Continuity Update -> BioMath Core Update

## Mode 2: Autonomous SAVEN

Autonomous Mode allows SAVEN to function without BioMath Core.

This mode supports:

- Senior support
- Home recovery
- Rehabilitation
- Assisted living
- Family monitoring
- Child support
- Caregiver coordination
- Device management
- Robot task orchestration
- Continuity tracking

Autonomous SAVEN does not use biomathematical modeling. It uses built-in operational support intelligence.

Autonomous task generation uses:

- Age group
- Support mode
- Mobility level
- Environment
- Recovery type
- Support goals
- Daily rhythm
- Caregiver availability
- Device availability
- Robot availability

## Autonomous Support Engine

The Autonomous Support Engine generates tasks from profile context, predefined support templates, environment rules, availability, and verification requirements.

Core capabilities:

- Daily support scheduling
- Recovery workflows
- Mobility workflows
- Hydration workflows
- Wellness routines
- Safety checks
- Support continuity tracking
- Caregiver coordination
- Device verification
- Robot task orchestration
- Escalation handling
- Environment rules
- Human support timeline
- Support load balancing
- Reminder adaptation

## Built-in Support Templates

### Senior Support

Default workflows:

- Morning check-in
- Hydration checks
- Mobility checks
- Meal confirmations
- Evening safety checks

Verification:

- Family confirmation
- Caregiver confirmation
- Sensor confirmation

Escalation:

- Assigned helper
- Family representative
- Caregiver
- Support provider
- Environment admin

### Post Surgery Recovery

Default workflows:

- Breathing exercises
- Assisted walking
- Medication support reminders
- Recovery rest monitoring
- Evening recovery review

Verification:

- Caregiver confirmation
- User confirmation
- Wearable telemetry

Escalation:

- Caregiver
- Family representative
- Support provider

### Rehabilitation

Default workflows:

- Mobility sessions
- Exercise verification
- Fatigue monitoring
- Caregiver confirmations
- Recovery pacing

Verification:

- Caregiver confirmation
- Device telemetry
- User confirmation

### Assisted Living

Default workflows:

- Shift handoff support
- Meal confirmation
- Mobility support
- Safety checks
- Staff confirmation

Verification:

- Caregiver confirmation
- Environment system event
- Sensor confirmation

### Temporary Recovery

Default workflows:

- Short-term support schedule
- Mobility check
- Rest period check
- Family update
- Completion review

### Family Monitoring

Default workflows:

- Daily routine check
- Family update
- Missed action review
- Evening check-in

### Child Support

Default workflows:

- Routine check
- Meal confirmation
- Activity reminder
- Family confirmation
- Evening review

### Independent Wellness Support

Default workflows:

- Hydration reminder
- Mobility reminder
- Sleep preparation
- Wellness check
- Routine continuity

## Continuity Engine

The Continuity Engine tracks operational stability. It does not produce medical scoring.

Continuity factors:

- Completed actions
- Delayed actions
- Missed actions
- Verification stability
- Caregiver responsiveness
- Environment stability
- Device uptime
- Robot readiness
- Recovery consistency

Continuity detection:

- Declining support stability
- Support overload
- Recovery inconsistency
- Increasing gaps in execution
- Missing support coverage

Continuity output:

- Stable
- Needs attention
- Delayed
- Coverage gap
- Escalation required

## Biological vs Operational Intelligence

BioMath Core owns:

- Biological understanding
- Predictive modeling
- Dynamic interpretation
- Physiological analysis

SAVEN owns:

- Operational coordination
- Task execution
- Support continuity
- Verification
- Environments
- Device orchestration
- Robot orchestration
- Access control
- Escalation

## Verification System

Verification confirms reality before continuity is updated.

Verification methods:

- User confirmed
- Caregiver confirmed
- Family confirmed
- Wearable telemetry
- Robot telemetry
- Sensor confirmation
- System inference

Verification results:

- Verified
- Partially verified
- Failed
- Delayed
- Not confirmed

## Robot Orchestration Layer

Robots are not the intelligence center.

Robots are:

- Physical executors
- Telemetry providers
- Support operators

Robot task assignment requires:

- Device online status
- Environment permission
- User consent
- Task safety level
- Capability match
- Physical action limits

If safety check fails:

- Do not assign the robot
- Create execution event
- Assign to human executor
- Escalate if needed

## Environment Orchestration Layer

Environment rules shape execution.

Supported environments:

- Home
- Clinic
- Rehabilitation center
- Assisted living
- Senior care
- Hospital recovery

Each environment includes:

- Permissions
- Safety rules
- Connected devices
- Assigned caregivers
- Escalation settings
- Allowed physical execution types
- Restricted action types

## Demo Mode

Demo Mode presents a fully operational support environment for partners and investors.

Demo scenarios:

- Senior living support
- Post-surgery recovery
- Rehabilitation support
- Family support monitoring
- Robot-assisted environment

Each demo shows:

- Support flow
- Task creation
- Assignments
- Verification
- Continuity
- Escalation
- Robot integration
- Device telemetry

## State Transition Map

BioMath Connected Mode:

Signal received -> Recommendation mapped -> Task created -> Executor assigned -> Action performed -> Verification received -> Continuity updated -> BioMath Core updated

Autonomous Mode:

Profile context evaluated -> Template selected -> Task created -> Executor assigned -> Action performed -> Verification received -> Continuity updated -> Next support window adapted

Task lifecycle:

Planned -> Assigned -> Accepted -> In progress -> Completed -> Verified -> Timeline event -> Continuity update

Exception lifecycle:

Planned -> Missed -> Delayed -> Needs attention -> Escalated -> Resolved -> Timeline event -> Continuity update

## Implementation Roadmap

Phase 1:

- Add SAVEN operational mode model
- Add Connected Mode and Autonomous Mode UI
- Add autonomous support templates
- Add support task generation rules
- Add continuity factors
- Add demo scenario data

Phase 2:

- Add BioMath signal ingestion
- Add autonomous task generator service
- Add continuity engine service
- Add mode-aware support planning
- Add device and robot assignment safety checks

Phase 3:

- Add event-driven execution pipeline
- Add WebSocket operational updates
- Add telemetry ingestion
- Add verification confidence logic
- Add escalation workflows

Phase 4:

- Add robot adapter layer
- Add external device APIs
- Add environment rule engine
- Add demo environment simulator
- Add operational reporting

Phase 5:

- Add BioMath Core feedback loop
- Add adaptive threshold handling
- Add continuity trend detection
- Add multi-environment continuity
- Add production audit trails
