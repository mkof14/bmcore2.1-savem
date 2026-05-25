# SAVEN Operator Evidence Package

This is the final human-readable evidence bundle for the SAVEN operator. It keeps the release decision concrete: what passed, what remains RC-only, who owns the watch, and what must be captured during the first hour.

## Evidence Model

- final operator packet;
- launch room runbook;
- production launch record;
- production evidence index;
- Admin deploy checklist;
- backend and monitoring record;
- privacy, dispatch, robot, and emergency safety gates;
- rollback proof;
- post-launch incident drill.

## Operator Evidence Checklist

- command layer visible;
- Today operations visible;
- BioMath Admin SAVEN Ops visible;
- event audit visible;
- SLO and alert posture visible;
- worker shift board visible;
- production values recorded or release remains RC-only;
- rollback proof reviewed;
- incident drill reviewed.

## Decision Language

The operator records one of:

- GO;
- HOLD;
- RC ONLY.

If production URL, backend mode, monitoring owner, rollback owner, or safety reviewer is missing, the decision stays RC ONLY or HOLD.

## Operator Command

```zsh
npm run operator-evidence:saven
```
