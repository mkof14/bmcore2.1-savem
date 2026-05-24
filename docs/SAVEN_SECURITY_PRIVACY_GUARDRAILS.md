# SAVEN Security And Privacy Guardrails

SAVEN handles real support commands, care contacts, device signals, robot gates, emergency routes, and admin audit. The release path needs explicit privacy rules before real users or workers are involved.

## Data Classes

- `support_command`
- `care_contact`
- `clinical_context`
- `device_signal`
- `robot_gate`
- `emergency_route`
- `admin_audit`

## Guardrail Rules

- Clinical context should be summarized and reviewed, not broadly broadcast.
- Device signal data verifies support but should not expose raw telemetry broadly.
- Robot gate and emergency route events need stronger retention for safety review.
- Admin audit is admin-only.
- Family digest text must redact clinical and emergency details.

## Role Matrix

- Supported person: support command and routine confirmation.
- Caregiver: care contact, robot review, emergency route, device confirmation.
- Nurse: care concern review and limited clinical context.
- Doctor: clinical summary review.
- Device: low-risk confirmation only.
- Admin: audit, override, incident, robot, emergency, and release review.

## Audit

Run:

```zsh
npm run privacy:saven
```
