# SAVEN Post-Launch Ops Package

This package defines what to do immediately after a SAVEN production candidate is promoted. It is focused on SAVEN as a support operating system, not a generic web launch.

## First 15 Minutes

- Open production SAVEN Start.
- Open Today.
- Open Commands.
- Open Admin Ops.
- Confirm Launch Control is visible.
- Confirm Ops Evidence is visible.
- Confirm SLO posture is visible.
- Confirm Alert Routes panel is visible.
- Confirm Worker Shift Board is visible.

## First Hour

- Run production route smoke against the deployed URL when available.
- Confirm Supabase persistence status in Admin Ops.
- Confirm Edge Function mode if `VITE_SAVEN_BACKEND_MODE=edge`.
- Send one nurse follow-up command in review mode.
- Send one device confirmation command in review mode.
- Confirm robot command stays approval-gated.
- Confirm emergency route stays human-confirmed and non-automatic.

## Day 1

- Review event audit.
- Review incident readiness.
- Review alert route count.
- Confirm no unexpected critical alert.
- Confirm family digest and clinical context redaction rules.
- Confirm no worker dispatch is live without explicit approval.

## Rollback Triggers

Rollback or hold promotion if any of these happen:

- SAVEN routes fail in production preview.
- Admin Ops cannot render Launch Control.
- Robot gate appears automatic.
- Emergency route appears automatic.
- Edge Function permission review fails.
- Privacy redaction fails for clinical or emergency context.
- SLO posture shows blocked gates without a human owner.

## Operator Commands

```zsh
npm run postlaunch:saven
npm run ship:saven
```

## Human Review Note

SAVEN post-launch review is an operational safety check. It is not clinical, legal, emergency-service, or medical-device certification.
