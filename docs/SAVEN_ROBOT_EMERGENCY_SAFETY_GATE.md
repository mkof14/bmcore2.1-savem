# SAVEN Robot Emergency Safety Gate

This package is the final production gate for SAVEN physical and emergency boundaries. It keeps robots in readiness and telemetry mode, and emergency routes in rules/context mode, until a later, separate legal, clinical, robotics, and operations activation is approved.

## Safety Gate Model

The gate covers:

- robot readiness commands;
- robot physical action requests;
- device telemetry used to support robot review;
- emergency route commands;
- emergency context preparation;
- Admin Ops incident review;
- SLO and alerting posture for robot and emergency gates.

## Robot Boundary

Allowed:

- show robot readiness;
- collect robot telemetry;
- route robot action to caregiver/admin review;
- freeze robot physical action when gate status is unsafe;
- record audit evidence.

Locked:

- autonomous movement;
- physical assistance;
- medication, mobility, lifting, door, appliance, or environmental action;
- robot action without explicit human approval;
- any robot behavior implied by voice command alone.

## Emergency Boundary

Allowed:

- show emergency rules;
- prepare context for a human reviewer;
- display escalation state;
- keep route visible in Admin Ops;
- alert operator that emergency gate is unsafe.

Locked:

- automatic emergency service call;
- phone, SMS, email, API, or external dispatch;
- routine broadcast of emergency details;
- hiding the fact that external dispatch is blocked.

## Production Holds

Hold production if:

- `npm run robot-emergency:saven` fails;
- robot gate or emergency gate is missing from monitoring SLO;
- alerting cannot freeze robot physical action;
- emergency route is not `blocked_external_dispatch`;
- Edge Function does not state no external dispatch;
- Admin Ops cannot show robot/emergency review posture;
- launch record does not name robot/emergency safety reviewer.

## Operator Command

```zsh
npm run robot-emergency:saven
```

This command confirms command execution, command permissions, worker handoff, monitoring SLO, alerting, Edge Function no-dispatch language, Admin Ops review, launch record, cutover checklist, and release handoff.
