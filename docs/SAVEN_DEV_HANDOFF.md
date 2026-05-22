# SAVEN Development Handoff

Version: bmcore2.1-savem
Status: development-ready mock prototype

## What This Version Is

SAVEN is now a development-ready support operating system prototype inside BioMath Core. It is not only a visual concept page anymore. It has a visible product structure for:

- person setup;
- daily support operations;
- support lifecycle;
- voice and text commands;
- support circle permissions;
- devices and robots;
- care contacts;
- verification;
- escalation;
- continuity;
- local mock state;
- future control API contracts.

## What Is Mock Only

This version intentionally does not connect to real external systems.

Mock-only areas:

- no real database persistence;
- no real Supabase write flow;
- no real doctor, nurse, clinic, SMS, phone, or emergency service connection;
- no real robot API;
- no real device API;
- no real medical decision automation;
- no real emergency escalation.

The emergency path is UI/dev mock only.

## Main App Routes

- /app/saven/start
- /app/saven/today
- /app/saven/command
- /app/saven/support
- /app/saven/lifecycle
- /app/saven/daily-plan
- /app/saven/verification-policy
- /app/saven/continuity
- /app/saven/timeline
- /app/saven/circle
- /app/saven/devices
- /app/saven/robots
- /app/saven/environments
- /app/saven/recovery
- /app/saven/verification
- /app/saven/settings
- /app/saven/faq
- /app/saven/learning

## Core Product Flow

The primary end-to-end flow is:

Need detected -> Support task created -> Assigned -> Voice/text command -> Care network ready -> Verified -> Continuity updated

This flow is visible on Today through the End-to-end scenario block.

## Local Mock State

The version includes a local data model in Saven.tsx:

- people;
- tasks;
- endpoints;
- commands;
- escalations;
- continuity.

This prepares the product for backend/API work while keeping the development version independent from DB/env connections.

## SAVEN Control API Mock

The current mock API contract includes:

- createTask;
- assignTask;
- sendCommand;
- verifyAction;
- escalate;
- updateContinuity.

These functions are local product contracts, not real backend calls.

## Verification Completed

The working terminal verified:

- typecheck passes;
- dev server starts on http://127.0.0.1:5173/;
- earlier finalization script passed tests and production build after cleanup.

Recommended final verification before any major branch/commit:

```bash
cd /Users/mk/Desktop/bmcore2.1-savem
npm run typecheck
npm run test -- --run
env -u VITE_SUPABASE_URL -u VITE_SUPABASE_ANON_KEY npm run build
npm run dev:saven
```

## Current Product Assessment

Ready for next development phase:

- frontend product structure is in place;
- routes are defined;
- mock operational model exists;
- end-to-end scenario exists;
- voice/text command layer exists;
- robot/device/care contact logic is represented visually;
- emergency boundaries are explicit;
- technical panels are collapsed into Developer readiness to reduce UI overload.

Not ready for production use:

- no persistence;
- no authentication-linked SAVEN profile;
- no real notification delivery;
- no real device/robot integration;
- no real medical workflow integration;
- no real emergency workflow integration.

## Recommended Next Phase

Build the backend-ready SAVEN service layer in this order:

1. Move mock state out of Saven.tsx into a dedicated local module.
2. Convert control API mock functions into a typed service file.
3. Add state transitions for task lifecycle.
4. Add local reducer/store for UI actions.
5. Add tests for createTask, assignTask, sendCommand, verifyAction, escalate, and updateContinuity.
6. Only after that, connect persistence.

## Stable Development Command

```bash
cd /Users/mk/Desktop/bmcore2.1-savem
npm run dev:saven
```

Primary local URL:

http://127.0.0.1:5173/app/saven/settings

## Backend-ready contract layer

SAVEN now has a contract-first backend boundary:

- `src/features/saven/contracts/savenBackendContract.ts`
- `src/features/saven/services/savenLocalBackendGateway.ts`
- `src/features/saven/services/__tests__/savenLocalBackendGateway.test.ts`
- `docs/SAVEN_BACKEND_CONTRACT.md`

This is intentionally local-only. It prepares the architecture for backend, doctors, nurses, emergency routing, family routing, robot/device services, and continuity workflows without real db/env/external connections.
