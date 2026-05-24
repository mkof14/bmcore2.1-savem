# SAVEN Worker Handoff Kit

SAVEN voice commands must reach the right operational endpoint: caregiver, nurse, doctor, robot, device, emergency route, or Admin Ops. This kit defines who can receive commands, what must stay blocked, and when human confirmation is required.

## Worker Endpoints

- Caregiver Maya
- Nurse Olivia Grant
- Dr. Elena Morris
- SAVEN Assist R1
- Wearable recovery tracker
- Emergency route
- BioMath Core Admin

## Confirmation Rules

- Nurse, doctor, caregiver, robot, emergency, and admin routes require confirmation.
- Device proof can be prepared without broad human review when it is low-risk telemetry.
- Robot physical action is always blocked without approval.
- Emergency route is visible but automatic external dispatch stays blocked.
- Admin actions are audit-first.

## Audit

Run:

```zsh
npm run workers:saven
```
