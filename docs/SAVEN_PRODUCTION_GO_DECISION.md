# SAVEN Production GO Decision

This package records the final release language. It does not force a GO. It confirms the release is either still RC ONLY, placed on HOLD, or ready for a human operator to record GO with real production values.

## Decision States

- RC ONLY: release package is complete, but live production values or owner confirmations are missing.
- HOLD: a blocker, unsafe condition, or missing owner exists.
- GO: production values, owners, safety gates, rollback, live watch, and sign-off are complete.

## Required Evidence For GO

- clean release pass;
- production GO handoff;
- production values intake;
- GO dry run;
- final seal;
- operator sign-off;
- live watch checklist;
- rollback proof;
- incident drill;
- production build.

## Safety Language

GO does not unlock automatic external dispatch, robot physical action, medical-device behavior, emergency-service automation, or clinical certification. Those remain separate approvals.

## Operator Command

```zsh
npm run production-go:saven
```
