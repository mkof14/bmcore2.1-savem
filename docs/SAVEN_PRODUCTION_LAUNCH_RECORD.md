# SAVEN Production Launch Record

This is the human launch record for SAVEN. It is designed to be filled before a production promotion, after all local release gates pass. It keeps the launch decision tied to people, URLs, backend mode, rollback ownership, and first-hour watch.

## Launch Identity

| Field | Value |
| --- | --- |
| Release tag | bmcore2.1-savem-rc1 |
| GitHub repository | mkof14/bmcore2.1-savem |
| Production branch | main |
| Production URL | pending |
| Launch decision | RC ONLY |
| Decision owner | pending |
| Admin Ops reviewer | pending |
| Backend owner | pending |
| Rollback owner | pending |
| First-hour watch owner | pending |

## Backend Record

| Field | Value |
| --- | --- |
| Deploy target | review |
| Backend mode | local until production env is set |
| Supabase project | pending |
| Edge Function URL | pending |
| HTTP backend URL | not selected |
| RLS review | pending |
| Migration review | pending |

## Required Proof Before GO

- `npm run ready:saven`
- `npm run ship:saven`
- `npm run admin-deploy:saven`
- `npm run go-no-go:saven`
- `SAVEN_DEPLOY_TARGET=production npm run prod-env:saven`
- `SAVEN_PRODUCTION_URL=https://your-saven-domain.example npm run prod-smoke:saven`

## Launch Holds

Current default decision is `RC ONLY` until these are filled with real production values:

- Production URL
- Supabase project
- Edge Function URL or HTTP backend URL
- Admin Ops reviewer
- Rollback owner
- First-hour watch owner
- RLS review
- Migration review

## First-Hour Watch

During the first hour after promotion, watch:

- SAVEN Start route
- Today route
- Commands route
- Admin Ops
- Launch Control
- Ops Evidence
- SLO posture
- Alert Routes
- Worker Shift Board
- Event Audit
- Incident Readiness
- Production route smoke

## Safety Sign-Off

Before GO, confirm:

- No automatic emergency dispatch.
- No automatic robot physical action.
- No worker dispatch without explicit approval.
- No clinical, family, location, or emergency context leak.
- No production mode with local backend.
- No client-exposed service role or private secret.

## Human Approval Note

This record is an operational release log. It is not clinical, legal, emergency-service, medical-device, or robot-autonomy certification.


## Production Release Orchestrator

Run `npm run production-release:saven` before filling final GO fields. This proves all release gates and docs are present before a human records production URL, backend mode, reviewers, rollback owner, and first-hour watch owner.


## Production Cutover Checklist

Run `npm run cutover:saven` before changing the launch decision from `RC ONLY` to `GO`. The checklist keeps production URL, backend, admin, rollback, first-hour watch, and safety holds in one cutover order.
