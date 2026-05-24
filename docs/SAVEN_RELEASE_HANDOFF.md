# SAVEN Release Handoff

SAVEN is being separated as its own product line while staying able to connect with BioMath Core Admin. This handoff keeps the final release path explicit: local review, production credentials, backend mode, monitoring, admin, and safety gates.

## Current Release Shape

- User-facing SAVEN app with dedicated Today, Commands, Care Routes, Robots, Devices, Environments, Verification, Settings, FAQ, and Learning routes.
- Global command rail available across the SAVEN operating system.
- Backend gateway abstraction with local, HTTP, Edge Function, persistence status, command permission review, event audit, and incident readiness paths.
- Admin Ops can show gateway health, persistence status, incident posture, command review, and event audit.
- Full readiness runs through `npm run ready:saven`.

## Local Review

Use local mode when reviewing UI and flows without production credentials.

```zsh
cp .env.saven.example .env.local
npm run ready:saven
npm run dev:saven
```

Expected local defaults:

- `VITE_SAVEN_BACKEND_MODE=local`
- `VITE_MOCK_MODE=1`
- No production Supabase keys required.

## Production Environment

For a production release, set these values in the hosting provider:

- `SAVEN_DEPLOY_TARGET=production`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SAVEN_BACKEND_MODE=edge`
- `VITE_SAVEN_EDGE_FUNCTION_URL`

Optional direct backend mode:

- `VITE_SAVEN_BACKEND_MODE=http`
- `VITE_SAVEN_BACKEND_URL`

## Supabase Migration Kit

Run:

```zsh
npm run db:saven
```

Review `supabase/saven/001_saven_core_schema.sql` and `supabase/saven/002_saven_review_seed.sql` before production database setup.

## Edge Function Package

Run:

```zsh
npm run edge:saven
```

Review and deploy `supabase/functions/saven-gateway/index.ts` when SAVEN is ready for production Edge mode.

## Supabase And Edge Checklist

- Apply the SAVEN schema draft from `docs/SAVEN_BACKEND_MONITORING_ADMIN.md`.
- Apply the RLS policy draft before real user data is stored.
- Deploy the SAVEN Edge Function gateway.
- Confirm the gateway exposes command ingestion, persistence status, permission review, audit events, and incident readiness.
- Keep local mode available for demo and fallback review.

## Admin Alert Routes Panel

Run:

```zsh
npm run admin-alerts:saven
```

Admin Ops should show active SAVEN alert routes and runbook steps when SLO metrics move into watch or breach.

## Alerting Runbook Kit

Run:

```zsh
npm run alerts:saven
```

Alerting connects SAVEN SLO breaches to operator routes: Admin Ops, caregiver review, robot review, emergency review, and device review.

## Monitoring SLO Kit

Run:

```zsh
npm run monitoring:saven
```

This checks SAVEN-specific operational signals before release: command backlog, proof waits, incident severity, robot gate, emergency gate, and endpoint availability.

## Admin SLO Panel

Run:

```zsh
npm run admin:saven
```

Admin Ops should show SAVEN SLO posture inside BioMath Core Admin: command backlog, proof wait, incident severity, robot gate, emergency gate, and endpoint availability.

## Admin And Monitoring Checklist

- Confirm BioMath Core Admin shows SAVEN backend health.
- Confirm persistence status appears in Admin Ops.
- Confirm incident readiness and command permission review are visible.
- Confirm event audit entries are inspectable.
- Confirm production QA and deploy readiness checks pass before release.

## Command Contract Fixtures

Run:

```zsh
npm run commands:saven
```

This verifies SAVEN command fixtures for nurse, caregiver, doctor, device, robot, and emergency flows before release.

## Security And Privacy Guardrails

Run:

```zsh
npm run privacy:saven
```

Review SAVEN data classes, role visibility, family-digest redaction, robot gate retention, emergency route retention, and admin audit handling before production.

## Admin Worker Shift Board

Run:

```zsh
npm run admin-workers:saven
```

Admin Ops should show SAVEN worker command packets before live worker dispatch is connected.

## Worker Handoff Kit

Run:

```zsh
npm run workers:saven
```

Worker handoff verifies SAVEN voice/text routing for caregiver, nurse, doctor, robot, device, emergency route, and Admin Ops before release.

## Safety Gates

- No robot or physical execution path should bypass command permission review.
- Emergency, caregiver, nurse, doctor, robot, and device commands must stay visible in the Commands center.
- Production release should not rely on mock-only text for backend health.
- The command layer must remain non-overlapping with SAVEN screens on desktop and mobile.

## GitHub And Hosting Steps

1. Push the current branch to `savem-origin/main`.
2. Configure production variables from `.env.saven.example`.
3. Run `npm run ready:saven`.
4. Run `npm run release:saven`.
5. Build with public environment variables unset for fallback verification.
6. Preview the production bundle before handing the link to reviewers.

## Visual Acceptance

Run:

```zsh
npm run visual:saven
```

This keeps SAVEN from drifting into generic site patterns and checks the main command rail, mic level indicator, dark-operational surfaces, and light-theme readability guardrails.

See `docs/SAVEN_VISUAL_ACCEPTANCE.md`.

## Production Preview Gate

Before final handoff, run the production preview gate:

```zsh
npm run preview:saven:auto
```

This gate builds the production bundle, serves it through Vite preview, checks SAVEN routes, verifies bundle markers, and fails if the app falls back to stale `Loading Application` behavior.

For final shipping review:

```zsh
npm run ship:saven
```

## Admin Ops Evidence Panel

Run:

```zsh
npm run admin-evidence:saven
```

Admin Ops should show the SAVEN evidence pack as release posture, gate status, evidence counts, and operator narrative.

## Ops Evidence Pack

Run:

```zsh
npm run evidence:saven
```

The evidence pack summarizes command fixtures, worker handoff, privacy, monitoring, alerts, and Admin Ops into one operator release posture.

## Launch Control Kit

Run:

```zsh
npm run launch:saven
```

Launch Control summarizes SAVEN release gates into a `go` or `hold` decision before production handoff.

## Release Blockers

- Missing Supabase production credentials.
- Missing Edge Function URL in edge mode.
- Admin Ops cannot see backend or persistence status.
- Command permission review is absent from the backend gateway.
- Production QA, deploy readiness, release readiness, typecheck, tests, smoke, or build fails.
