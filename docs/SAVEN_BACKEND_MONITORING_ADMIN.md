# SAVEN Backend, Monitoring, and Admin Foundation

This document defines the next SAVEN system layer after the local UI and mock gateway work.

## Direction

SAVEN should not become a separate admin island. SAVEN operations should be managed inside BioMath Core Admin with a dedicated SAVEN Ops section.

## Backend Boundary

The existing `SavenBackendGateway` remains the single adapter boundary.

Real backend implementation should add:

- profile persistence
- command intake
- task lifecycle persistence
- care contact routing
- device and robot endpoint registry
- environment permissions
- verification records
- continuity timeline
- admin override audit log

## Monitoring Signals

SAVEN monitoring should track:

- command latency
- failed command classification
- open proof waits
- overdue support tasks
- escalation backlog
- caregiver response delay
- device endpoint health
- robot endpoint readiness
- environment permission blocks
- admin overrides

## Admin Controls

BioMath Core Admin should expose:

- SAVEN Ops overview
- command queue
- proof wait queue
- escalation queue
- endpoint health
- profile rule review
- pause / resume support
- reassign task owner
- approve or deny robot physical action
- export audit timeline

## Safety Rule

Real emergency, clinical, robot, external notification, and family-routing actions must remain human-confirmed unless a separately approved production safety policy is implemented.

## Current Implementation Marker

`src/pages/AdminPanel.tsx` now includes a SAVEN Ops section with `data-saven-admin-ops="true"`.

## Monitoring Contract Implementation

SAVEN now has a local monitoring model that can become the backend monitoring adapter:

- `SavenMonitoringSignal`
- `SavenMonitoringQueueItem`
- `SavenMonitoringSnapshot`
- `createSavenMonitoringSnapshot(state)`
- `SavenBackendGateway.getMonitoringSnapshot()`

The monitoring snapshot covers command intake, proof waits, endpoint health, robot policy, escalation routes, and emergency safety gates.

Implementation files:

- `src/features/saven/services/savenMonitoringService.ts`
- `src/features/saven/services/__tests__/savenMonitoringService.test.ts`

## Admin Reads Monitoring Snapshot

The BioMath Core Admin SAVEN Ops section now reads `savenLocalBackendGateway.getMonitoringSnapshot()` instead of showing only static placeholder rows.

The admin UI exposes:

- summary cards from `SavenMonitoringSnapshot.summary`
- signal cards from `SavenMonitoringSnapshot.signals`
- live queue rows from `SavenMonitoringSnapshot.queues`

This keeps the current version local and safe while making the Admin section backend-adapter ready.

## Admin Override Contract

SAVEN now models admin override actions through the backend gateway:

- `SavenAdminOverrideAction`
- `SavenAdminOverrideInput`
- `SavenAdminOverrideResult`
- `SavenBackendGateway.applyAdminOverride(input)`

Current local actions are audit-first and do not perform real external dispatch. Robot action approval and escalation hold return `requires_review` to preserve the safety boundary.

## HTTP Backend Adapter

SAVEN now has a production-facing HTTP adapter skeleton:

- `createSavenHttpBackendAdapter(options)`
- backend base URL normalization
- optional auth token injection
- typed gateway methods matching `SavenBackendGateway`
- backend error handling

Current route contract:

- `GET /snapshot`
- `GET /monitoring`
- `GET /tasks`
- `GET /endpoints`
- `GET /care-contacts`
- `POST /tasks`
- `POST /tasks/:taskId/assignment`
- `POST /tasks/:taskId/verification`
- `POST /tasks/:taskId/continuity`
- `POST /commands`
- `POST /escalations`
- `POST /care-contact-requests`
- `POST /admin-overrides`

The adapter is not activated by default. The current UI remains on the local gateway until a real backend service is deployed and intentionally wired.

## Backend Gateway Selector

SAVEN now has a safe gateway selector:

- `createSavenBackendGatewayFromEnv(options)`
- `savenBackendGateway`
- default mode: local gateway
- HTTP mode: requires `VITE_SAVEN_BACKEND_MODE=http` and `VITE_SAVEN_BACKEND_URL`

BioMath Core Admin now reads from `savenBackendGateway`, so it can stay local-safe today and switch to the HTTP backend adapter later without rewriting the Admin UI.

## Backend Readiness Audit

`npm run backend:saven` verifies that the SAVEN backend foundation remains present:

- backend gateway contract
- local backend gateway
- monitoring service
- HTTP backend adapter
- backend gateway selector
- Admin Ops integration
- backend monitoring/admin documentation

`npm run ready:saven` now runs this audit before contrast, typecheck, tests, smoke, and production build.

## Supabase Schema Draft

A review-only SAVEN schema draft now exists at:

`supabase/migrations/20260524090000_saven_backend_schema_draft.sql`

It defines the first backend persistence shape:

- `saven_profiles`
- `saven_people`
- `saven_tasks`
- `saven_commands`
- `saven_endpoints`
- `saven_verifications`
- `saven_escalations`
- `saven_admin_overrides`

This migration should be reviewed before applying to any production Supabase project. It is intentionally treated as a schema draft until backend policies, RLS rules, and edge functions are finalized.

## Supabase Persistence Bridge

SAVEN now has a client-side persistence bridge for the Supabase backend draft:

- `savenPersistenceTables`
- `createSavenPersistenceStatus()`
- `createSavenSupabasePersistenceRepository(client)`
- `SavenBackendGateway.getPersistenceStatus()`
- `data-saven-admin-persistence-status="true"`

The bridge documents exactly which tables support profile, people, task, command, event, incident, verification, and admin override records. Critical writes remain gated and external dispatch remains disabled until production policy is approved.

## RLS Policy Draft

A review-only SAVEN RLS policy draft now exists at:

`supabase/migrations/20260524091000_saven_rls_policy_draft.sql`

The draft uses the current BioMath Core admin flag:

- `public.profiles.id = auth.uid()`
- `public.profiles.is_admin = true`

Policy intent:

- profile owners can read their own SAVEN profile data
- admins can operate SAVEN Ops
- command creation may come from the owner or admin
- escalations and admin overrides are admin-only
- critical writes stay behind approved Edge Functions or admin controls

Do not apply this draft to production until RLS recursion, service-role paths, and Edge Function write paths are reviewed.

## Edge Function Gateway Draft

A review-only Supabase Edge Function draft now exists at:

`supabase/functions/saven-gateway/index.ts`

It defines one controlled SAVEN backend entrypoint for:

- snapshot
- monitoring
- task lifecycle
- command intake
- care contact routing
- admin overrides

Safety rules:

- caller must be authenticated
- admin-only actions require `profiles.is_admin = true`
- no external dispatch is performed by this draft gateway
- critical writes remain behind the gateway boundary

This draft should be reviewed before deployment, especially service-role access, audit logging, RLS interaction, and production route mapping.

## Edge Function Backend Adapter

SAVEN now has a client-side adapter for the Supabase Edge Function gateway:

- `createSavenEdgeFunctionBackendAdapter(options)`
- selector mode: `VITE_SAVEN_BACKEND_MODE=edge`
- required URL: `VITE_SAVEN_EDGE_FUNCTION_URL`

The adapter maps the `SavenBackendGateway` interface to action/payload calls against `saven-gateway`, for example:

- `monitoring`
- `send_command`
- `apply_admin_override`
- `request_care_contact`

The default remains local mode.

## SAVEN Deploy Readiness

SAVEN now has a deploy readiness layer:

- `createSavenDeployReadinessReport(env)`
- `npm run deploy:saven`
- `SAVEN_DEPLOY_TARGET=production`
- `VITE_SAVEN_BACKEND_MODE`
- `VITE_SAVEN_EDGE_FUNCTION_URL`

Default review mode allows local/mock behavior with warnings. Production mode blocks unless Supabase public env vars are present, backend mode is `edge`, and the SAVEN Edge Function URL is configured. External dispatch remains disabled until a separately approved safety policy is implemented.

## Production QA Audit

SAVEN now has a production QA audit:

- `npm run qa:saven`
- `scripts/saven-production-qa-audit.mjs`
- `docs/SAVEN_PRODUCTION_QA_CHECKLIST.md`

The audit checks that the SAVEN command layer, permission review, Admin Ops, deploy readiness, route smoke coverage, and production QA checklist remain present before a release candidate is accepted.

## Backend API Contract

SAVEN now has one backend API route registry:

- `savenBackendApiRoutes`
- `getSavenBackendApiRoute(id)`
- `savenHumanConfirmedRouteIds`
- `incident_readiness`

This registry keeps HTTP routes, Edge Function actions, and safety risk levels aligned before a real backend is deployed. Routes that can affect people, care contacts, emergency paths, robot action, or admin override remain marked as human-confirmed or admin-controlled.

## Event Audit Model

SAVEN now has an event audit model for backend, monitoring, and admin review:

- `SavenEventAuditRecord`
- `createSavenEventAuditRecords(state)`
- `SavenBackendGateway.listEventAudit()`
- `saven_events`

The event timeline records command intake, proof waits, escalation preparation, robot readiness review, admin overrides, and continuity updates. It is audit-first: current local and Edge Function drafts do not perform external dispatch.

## Admin Event Audit Review

BioMath Core Admin now reads `SavenBackendGateway.listEventAudit()` and renders the SAVEN Ops event timeline with `data-saven-admin-event-audit="true"`.

This gives administrators a visible explanation layer for command intake, proof waits, robot review, escalation preparation, and future backend audit records.

## Incident Readiness Model

SAVEN now derives admin-ready incidents from the event audit model:

- `SavenIncidentReadiness`
- `createSavenIncidentReadiness(state)`
- `SavenBackendGateway.getIncidentReadiness()`
- `saven_incidents`

Incident readiness separates normal activity from items needing attention: proof waits, escalation preparation, robot readiness review, and admin override review. BioMath Core Admin renders this layer with `data-saven-admin-incident-readiness="true"`.


## Release Handoff

SAVEN Release Handoff is now tracked as a release artifact instead of a loose checklist.

- `.env.saven.example` documents local, Edge Function, and HTTP backend modes.
- `docs/SAVEN_RELEASE_HANDOFF.md` keeps GitHub, hosting, Supabase, Edge Function, Admin Ops, monitoring, and safety gates together.
- `npm run release:saven` verifies release handoff materials.
- Production handoff requires `SAVEN_DEPLOY_TARGET=production` and `VITE_SAVEN_BACKEND_MODE=edge` when the Edge Function gateway is used.


## Production Preview Gate

SAVEN production preview is now a release gate:

- `npm run preview:saven:auto` builds and serves the production bundle.
- `npm run ship:saven` runs full readiness plus production preview smoke.
- The preview gate checks SAVEN routes, command layer bundle markers, and stale `Loading Application` fallback behavior.


## Visual Acceptance

SAVEN Visual Acceptance is now tracked as a release gate:

- `docs/SAVEN_VISUAL_ACCEPTANCE.md` defines SAVEN-specific interface rules.
- `npm run visual:saven` checks command rail, mic level indicator, light-theme contrast guardrails, dark-operational surfaces, and operator-facing screen coverage.
- SAVEN should stay visually distinct from generic BioMath Core pages while still connecting to BioMath Core Admin.


## Command Contract Fixtures

SAVEN command acceptance fixtures now cover the core voice/backend/admin loop:

- nurse follow-up
- caregiver assignment
- doctor clinical summary
- device telemetry confirmation
- robot readiness with approval lock
- emergency rule display without automatic dispatch

`npm run commands:saven` verifies that every fixture maps through execution planning, permission review, local backend gateway behavior, and admin-facing evidence.


## Supabase Migration Kit

SAVEN now has concrete Supabase review artifacts:

- `supabase/saven/001_saven_core_schema.sql`
- `supabase/saven/002_saven_review_seed.sql`
- `docs/SAVEN_SUPABASE_MIGRATION_KIT.md`
- `npm run db:saven`

The migration kit covers profiles, tasks, commands, verifications, admin overrides, event audit, incidents, indexes, and the `saven_rls_policy_draft` marker for production RLS review.


## Edge Function Package

SAVEN now has a concrete Supabase Edge Function package:

- `supabase/functions/saven-gateway/index.ts`
- `docs/SAVEN_EDGE_FUNCTION_PACKAGE.md`
- `npm run edge:saven`

The gateway draft supports `send_command`, `interpret_command`, `review_command_permission`, `persistence_status`, `list_events`, `incident_readiness`, and `apply_admin_override`. It intentionally performs no external dispatch and keeps emergency and robot paths gated for human review.


## Monitoring SLO Kit

SAVEN Monitoring SLO Kit makes monitoring operational:

- `src/features/saven/services/savenMonitoringSloService.ts`
- `docs/SAVEN_MONITORING_SLO_KIT.md`
- `npm run monitoring:saven`

The SLO report tracks command backlog, proof wait SLO, incident severity, robot gate, emergency gate, and endpoint availability. These are SAVEN-specific safety signals, not generic uptime counters.
