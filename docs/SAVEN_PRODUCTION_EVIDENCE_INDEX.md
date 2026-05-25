# SAVEN Production Evidence Index

This is the single evidence map for SAVEN production readiness. It is intentionally written for human review: what is ready, what is gated, what remains RC-only, and where each proof lives.

## Current Release Posture

**Status:** RC-ready package, production promotion held until live values are recorded.

SAVEN has local release gates, backend contracts, monitoring, admin ops, rollback, post-launch review, and production URL smoke readiness. It should remain `RC ONLY` until production URL, Supabase project, Edge Function or HTTP backend URL, Admin Ops reviewer, rollback owner, and first-hour watch owner are filled in the launch record.

## Evidence Map

| Area | Proof | Command |
| --- | --- | --- |
| Full readiness | `scripts/saven-full-readiness.mjs` | `npm run ready:saven` |
| Production preview | `scripts/saven-production-preview-smoke.mjs` | `npm run ship:saven` |
| Release orchestrator | `docs/SAVEN_PRODUCTION_RELEASE_ORCHESTRATOR.md` | `npm run production-release:saven` |
| Launch record | `docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md` | `npm run launch-record:saven` |
| Go / No-Go | `docs/SAVEN_PRODUCTION_GO_NO_GO.md` | `npm run go-no-go:saven` |
| BioMath Admin deploy | `docs/SAVEN_BIOMATH_ADMIN_DEPLOY_CHECKLIST.md` | `npm run admin-deploy:saven` |
| Production env | `docs/SAVEN_PRODUCTION_ENV_GATE.md` | `npm run prod-env:saven` |
| Live URL smoke | `docs/SAVEN_PRODUCTION_URL_SMOKE_GATE.md` | `npm run prod-smoke:saven` |
| Final tag gate | `docs/SAVEN_FINAL_RELEASE_TAG_GATE.md` | `npm run tag:saven` |
| Rollback | `docs/SAVEN_ROLLBACK_DRILL.md` | `npm run rollback:saven` |
| Post-launch ops | `docs/SAVEN_POST_LAUNCH_OPS.md` | `npm run postlaunch:saven` |
| GitHub release | `docs/SAVEN_GITHUB_RELEASE_NOTES.md` | `npm run github-release:saven` |
| Final manifest | `docs/SAVEN_FINAL_SHIP_MANIFEST.md` | `npm run manifest:saven` |

## Production Holds

- Production URL is not recorded.
- Supabase project is not recorded.
- Edge Function URL or HTTP backend URL is not recorded.
- RLS review is not recorded.
- Migration review is not recorded.
- Admin Ops reviewer is not recorded.
- Rollback owner is not recorded.
- First-hour watch owner is not recorded.

## Ready Evidence

- SAVEN app routes have local smoke coverage.
- Commands route exists.
- Global voice command layer exists.
- BioMath Core Admin contains SAVEN Ops.
- Launch Control exists.
- Ops Evidence Pack exists.
- Monitoring SLO exists.
- Alert Routes exist.
- Worker Shift Board exists.
- Event Audit exists.
- Incident Readiness exists.
- Admin Overrides exist.
- Persistence status exists.
- Rollback drill exists.
- Post-launch ops exists.

## Non-Negotiable Safety Gates

- No automatic emergency dispatch.
- No automatic robot physical action.
- No worker dispatch without explicit approval.
- No production mode with local backend.
- No client-exposed service role or private secret.
- No clinical, family, location, or emergency context leak in command text.

## Final Review Commands

```zsh
npm run evidence-index:saven
npm run production-release:saven
npm run ready:saven
npm run ship:saven
SAVEN_DEPLOY_TARGET=production npm run prod-env:saven
SAVEN_PRODUCTION_URL=https://your-saven-domain.example npm run prod-smoke:saven
```

## Human Approval Note

This evidence index is an operational readiness map. It is not clinical, legal, emergency-service, medical-device, or robot-autonomy certification.


## Release Operator Brief

Run `npm run operator-brief:saven` and review `docs/SAVEN_RELEASE_OPERATOR_BRIEF.md` before production promotion. The brief gives the short current decision, ready areas, production holds, and next human actions.
