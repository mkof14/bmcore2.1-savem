# SAVEN Production Cutover Checklist

This checklist is for the moment SAVEN moves from RC-only to a live production candidate. It is deliberately operational, not generic deployment prose.

## Cutover State

Default state remains `RC ONLY` until a human owner records real production values in `docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md`.

## Required Cutover Inputs

| Input | Required value |
| --- | --- |
| Production URL | HTTPS SAVEN URL |
| Supabase project | Production project ID/name |
| Backend mode | edge or http |
| Edge Function URL | required for edge mode |
| HTTP backend URL | required for http mode |
| Admin Ops reviewer | named human |
| Rollback owner | named human |
| First-hour watch owner | named human |
| RLS review | signed off |
| Migration review | signed off |

## Cutover Commands

```zsh
npm run cutover:saven
npm run rc-tag:saven
npm run production-release:saven
npm run ready:saven
npm run ship:saven
SAVEN_DEPLOY_TARGET=production npm run prod-env:saven
SAVEN_PRODUCTION_URL=https://your-saven-domain.example npm run prod-smoke:saven
```

## Cutover Order

1. Confirm repo is clean.
2. Confirm release branch is pushed to `savem-origin/main`.
3. Run local readiness and production preview.
4. Configure production public env values.
5. Deploy Supabase migration.
6. Deploy Edge Function or HTTP backend.
7. Open production URL.
8. Run production URL smoke.
9. Open BioMath Core Admin.
10. Review SAVEN Ops launch control, evidence, SLO, alerts, workers, audit, incidents, overrides, and persistence.
11. Fill launch record.
12. Decide `GO`, `HOLD`, or `RC ONLY`.

## Immediate Hold Conditions

- Production URL route smoke fails.
- Backend mode is local in production.
- Admin Ops is missing any critical SAVEN panel.
- Robot physical action appears automatic.
- Emergency route appears automatic.
- Worker dispatch appears automatic.
- Production env exposes secret-like client variables.
- Launch record is still pending for owner or URL fields.

## After Cutover

Run:

```zsh
npm run postlaunch:saven
npm run rollback:saven
```

Then watch the first-hour list in `docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md`.

## Human Approval Note

This checklist is an operational cutover aid. It is not clinical, legal, emergency-service, medical-device, or robot-autonomy certification.


## Live Backend Activation Package

Run `npm run live-backend:saven` before cutover. Use `docs/SAVEN_LIVE_BACKEND_ACTIVATION.md` to confirm Supabase, RLS, Edge Function or HTTP backend, production env, Admin Ops persistence, event audit, and incident readiness.


## Live Monitoring Activation Package

Run `npm run live-monitoring:saven` before cutover. This confirms SLO posture, alerts, evidence, event audit, incident readiness, worker shift board, and first-hour monitoring ownership.


## Production Admin Access

Run `npm run admin-access:saven` before cutover. Confirm `profiles.is_admin = true` only applies to named operators, Admin Ops renders launch control, override, incident, event audit, persistence, alerts, evidence, and SLO panels, and the launch record names the admin access owner.
