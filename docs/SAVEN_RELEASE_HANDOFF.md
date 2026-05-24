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

## Supabase And Edge Checklist

- Apply the SAVEN schema draft from `docs/SAVEN_BACKEND_MONITORING_ADMIN.md`.
- Apply the RLS policy draft before real user data is stored.
- Deploy the SAVEN Edge Function gateway.
- Confirm the gateway exposes command ingestion, persistence status, permission review, audit events, and incident readiness.
- Keep local mode available for demo and fallback review.

## Admin And Monitoring Checklist

- Confirm BioMath Core Admin shows SAVEN backend health.
- Confirm persistence status appears in Admin Ops.
- Confirm incident readiness and command permission review are visible.
- Confirm event audit entries are inspectable.
- Confirm production QA and deploy readiness checks pass before release.

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

## Release Blockers

- Missing Supabase production credentials.
- Missing Edge Function URL in edge mode.
- Admin Ops cannot see backend or persistence status.
- Command permission review is absent from the backend gateway.
- Production QA, deploy readiness, release readiness, typecheck, tests, smoke, or build fails.
