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
