# SAVEN Release Operator Brief

This is the short release brief for the person deciding what happens next. It summarizes the current SAVEN state without forcing the reviewer to read every implementation document first.

## Current Decision

**Decision:** RC ONLY

SAVEN has a strong release-candidate package. Production launch stays on hold until live production values and owners are recorded.

## What Is Ready

- SAVEN app shell and routes.
- Today, Commands, Settings, Verification, Care Routes, Robots, Devices, Environments, FAQ, and Learning routes.
- Global voice/text command layer.
- BioMath Core Admin SAVEN Ops surface.
- Backend gateway selector.
- Supabase schema and migration kit.
- Edge Function package.
- Monitoring SLO and alert routes.
- Worker handoff model.
- Ops evidence pack.
- Launch control.
- Rollback drill.
- Post-launch ops.
- Production release orchestrator.
- Production evidence index.

## What Still Holds Production

- Real production URL is not recorded.
- Real Supabase project is not recorded.
- Edge Function URL or HTTP backend URL is not recorded.
- RLS review is not signed off.
- Migration review is not signed off.
- Admin Ops reviewer is not recorded.
- Rollback owner is not recorded.
- First-hour watch owner is not recorded.

## Next Human Actions

1. Choose production hosting URL.
2. Configure production public env values.
3. Deploy Supabase migration.
4. Deploy Edge Function or HTTP backend.
5. Open BioMath Core Admin and review SAVEN Ops.
6. Fill `docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md`.
7. Run strict production env and URL smoke gates.
8. Decide `GO`, `HOLD`, or `RC ONLY`.

## Command Set

```zsh
npm run operator-brief:saven
npm run evidence-index:saven
npm run production-release:saven
npm run ready:saven
npm run ship:saven
SAVEN_DEPLOY_TARGET=production npm run prod-env:saven
SAVEN_PRODUCTION_URL=https://your-saven-domain.example npm run prod-smoke:saven
```

## Non-Negotiable Safety Position

- Emergency paths stay human-confirmed.
- Robot physical action stays permissioned.
- Worker dispatch stays approval-gated.
- Clinical, family, location, and emergency context stay protected.
- Client env must not expose service-role or private secrets.
- Production backend must not remain local.

## Short Handoff

SAVEN is ready as a release candidate package. It is not ready for live production until the launch record is filled with real production URL, backend, Supabase, reviewer, rollback, and first-hour watch ownership.


## RC Tag Command Package

Run `npm run rc-tag:saven` before creating a release candidate tag. Use `SAVEN_STRICT_TAG=1 npm run rc-tag:saven` only after the working tree is clean.
