# SAVEN Alerting Runbook Kit

SAVEN alerts are not generic server alerts. They are support-operation alerts: command backlog, proof wait, incident ownership, robot gate, emergency gate, and endpoint availability.

## Alert Routes

- `admin_ops`
- `caregiver_review`
- `emergency_review`
- `robot_review`
- `device_review`

## Alert Rules

### Command Backlog

Route: `admin_ops`

Runbook:

- Open SAVEN Commands.
- Resolve stale voice/text items.
- Confirm owner for each active command.

### Proof Wait SLO

Route: `caregiver_review`

Runbook:

- Open Today support flow.
- Ask caregiver or device for confirmation.
- Hold continuity update until proof arrives.

### Incident Severity

Route: `admin_ops`

Runbook:

- Open Admin Ops incident readiness.
- Assign a human owner.
- Record event audit note.

### Robot Gate

Route: `robot_review`

Runbook:

- Freeze robot physical action.
- Open command permission review.
- Require caregiver/admin approval.

### Emergency Gate

Route: `emergency_review`

Runbook:

- Show emergency rules.
- Require human confirmation.
- Do not perform automatic external dispatch.

### Endpoint Availability

Route: `device_review`

Runbook:

- Check device connection.
- Check robot readiness.
- Check environment permissions.

## Audit

Run:

```zsh
npm run alerts:saven
```
