# SAVEN Rollback Drill Package

This package defines how SAVEN should be held, paused, or rolled back after a production promotion. It is written for SAVEN as a real support operating system where safety, verification, and human approval matter more than speed.

## Rollback Principle

SAVEN rollback is human-approved. The system can show evidence, route owners, and recommended actions, but it must not automatically reverse a production deployment, dispatch a robot, or trigger emergency escalation.

## Immediate Hold Triggers

- Production SAVEN cannot open Start, Today, Commands, or Admin Ops.
- Voice command layer is unavailable on SAVEN pages.
- Admin Ops cannot show Launch Control, Evidence Pack, SLO posture, or Alert Routes.
- Robot action appears executable without approval.
- Emergency command appears automatic instead of human-confirmed.
- Privacy redaction fails for clinical, family, location, or emergency context.
- Edge Function mode rejects required permission checks.
- Supabase migration state is unclear.

## First Five Minutes

1. Put SAVEN promotion on hold.
2. Open Admin Ops and capture Launch Control state.
3. Open Ops Evidence and capture the failed check.
4. Confirm whether user-facing support routes still render.
5. Assign one owner: product, backend, monitoring, or hosting.

## Rollback Drill

Run:

```zsh
npm run rollback:saven
npm run postlaunch:saven
npm run ship:saven
```

The drill checks that SAVEN has a documented rollback path, clear hold triggers, admin evidence, post-launch checks, hosting rollback guidance, and release notes.

## Production Rollback Actions

- Use Vercel deployment rollback only after a human owner confirms the failed release.
- If the issue is configuration-only, correct environment variables and re-run production smoke before code rollback.
- If the issue touches database shape, do not roll back code until migration compatibility is confirmed.
- If the issue touches command routing, disable affected command category before re-promoting.
- If the issue touches robot or emergency routes, keep those routes approval-gated and manually reviewed.

## Recovery Proof

A rollback is complete only after these are true:

- Start renders.
- Today renders.
- Commands renders.
- Admin Ops renders.
- Launch Control shows a hold or ready state.
- Route smoke passes.
- No robot or emergency action is automatic.
- One evidence note is recorded for the incident.

## Human Review Note

This package is an operational rollback drill. It is not clinical, legal, emergency-service, or medical-device certification.


## Environment Rollback Check

If a deployment fails because of configuration, run `npm run prod-env:saven` before code rollback. A missing Edge Function URL, wrong backend mode, or missing Supabase public config should be corrected and re-smoked before reverting code.
