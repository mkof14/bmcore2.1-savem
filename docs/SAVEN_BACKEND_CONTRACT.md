# SAVEN Backend Contract Layer

This phase adds a backend-ready interface without connecting real databases, environment variables, external services, robots, medical systems, or emergency dispatch.

## What Exists Now

- `src/features/saven/contracts/savenBackendContract.ts` defines the SAVEN gateway contract.
- `src/features/saven/services/savenLocalBackendGateway.ts` implements the contract with local mock state.
- `src/features/saven/services/__tests__/savenLocalBackendGateway.test.ts` verifies the gateway behavior.

## Supported Mock Capabilities

- Read a full SAVEN snapshot.
- List tasks, devices, robots, environments, and care contacts.
- Create, assign, command, verify, escalate, and update continuity through the mock control API.
- Prepare contact routes for caregiver, family, nurse, doctor, and emergency help.

## Safety Boundary

Emergency routing is intentionally modeled as `requires_human_confirmation`.

The local version must never silently dispatch real emergency, medical, robot, device, or family notifications.

## Next Backend Step

When real backend work begins, implement `SavenBackendGateway` with a real adapter while keeping the UI and reducer code pointed at the same interface.

## Interface Gateway Panel

The developer readiness area now includes a Backend Gateway Map panel. It visualizes caregiver, family, nurse, doctor, and emergency routes, plus the safety gate that keeps the local version from dispatching real medical, robot, or emergency actions.
