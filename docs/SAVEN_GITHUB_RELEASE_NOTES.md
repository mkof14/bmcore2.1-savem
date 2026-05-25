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
