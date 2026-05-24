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
