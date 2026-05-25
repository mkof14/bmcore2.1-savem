# SAVEN GitHub Release Notes

## Release Name

SAVEN Release Candidate

## Suggested Tag

`bmcore2.1-savem-rc1`

## Summary

This release candidate separates SAVEN as a real support operating system surface inside the BioMath Core platform family. It includes the SAVEN user app, global voice command layer, worker handoff model, backend foundation, Supabase migration kit, Edge Function package, monitoring, alerting, privacy guardrails, Admin Ops, evidence pack, and launch control.

## Included

- SAVEN product shell and routes
- Dedicated SAVEN Commands page
- Global voice command rail
- Command contract fixtures
- Worker handoff kit
- Admin worker shift board
- Supabase migration kit
- Edge Function gateway package
- Monitoring SLO kit
- Alerting runbook kit
- Security and privacy guardrails
- Ops evidence pack
- Launch control go/hold model
- Release candidate snapshot
- Final ship manifest

## Required Checks

```zsh
npm run ready:saven
npm run ship:saven
npm run rc:saven
npm run github-release:saven
```

## Production Holds

- Configure production Supabase credentials.
- Review RLS against real user ownership.
- Deploy SAVEN Edge Function if production uses Edge mode.
- Keep worker dispatch disabled until operational/legal approval.
- Keep robot physical action approval-gated.
- Keep emergency route human-confirmed and non-automatic.

## Reviewer Notes

- Admin Ops should show SAVEN Launch Control, Ops Evidence, Worker Shift Board, Alert Routes, SLO posture, event audit, incident readiness, and persistence status.
- Production preview must open SAVEN routes before external release.
- This release candidate is not a clinical, legal, or emergency-service certification.


## Post-Launch Ops

After deployment, use `docs/SAVEN_POST_LAUNCH_OPS.md` and run `npm run postlaunch:saven` to check first 15 minutes, first hour, day 1, rollback triggers, and Admin Ops review.


## Rollback Drill

Before tagging or promoting production, run `npm run rollback:saven`. Use `docs/SAVEN_ROLLBACK_DRILL.md` for hold triggers, first five minutes, production rollback actions, and recovery proof.


## Production Environment Gate

Run `npm run prod-env:saven` before tagging. For production promotion, run it with `SAVEN_DEPLOY_TARGET=production` and real public env variables to block local backend mode or missing backend URLs.


## Final Release Tag Gate

Before creating or pushing the release tag, run `npm run tag:saven`. The gate checks release notes, final ship manifest, production env gate, rollback drill, post-launch ops, Admin Ops, and command surface.


## Production URL Smoke Gate

After hosting is connected, run `SAVEN_PRODUCTION_URL=https://your-saven-domain.example npm run prod-smoke:saven` to verify live SAVEN routes over HTTPS.


## BioMath Admin Deploy Checklist

Run `npm run admin-deploy:saven` before production promotion. It verifies that SAVEN Ops is present inside BioMath Core Admin with launch control, evidence, monitoring, alerts, workers, incidents, audit, overrides, and persistence status.


## Production Go / No-Go Package

Run `npm run go-no-go:saven` before production promotion. The gate separates `GO`, `HOLD`, and `RC ONLY` states and keeps safety holds visible.


## Production Launch Record

Run `npm run launch-record:saven` and fill `docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md` before production promotion. Default decision remains `RC ONLY` until production URL, backend, reviewers, rollback owner, and first-hour watch owner are recorded.


## Production Release Orchestrator

Run `npm run production-release:saven` before the final release pass. It confirms all production gates, launch record, Admin deploy checklist, Go / No-Go package, production env, production URL smoke, rollback, and post-launch ops are connected.


## Production Evidence Index

Run `npm run evidence-index:saven` and review `docs/SAVEN_PRODUCTION_EVIDENCE_INDEX.md` before production promotion. The index summarizes ready evidence, production holds, and non-negotiable safety gates.


## Release Operator Brief

Run `npm run operator-brief:saven` and review `docs/SAVEN_RELEASE_OPERATOR_BRIEF.md` before production promotion. The brief summarizes current decision, ready evidence, production holds, and next human actions.


## RC Tag Command Package

Run `npm run rc-tag:saven` before creating the release candidate tag. For the final pre-tag check, use `SAVEN_STRICT_TAG=1 npm run rc-tag:saven` after the working tree is clean.
