# SAVEN Next Phase Map

This map is for the next large block of work after RC packaging.

## Phase A: Real Production Values

- choose production URL;
- choose backend mode;
- connect Supabase project;
- deploy Edge Function or HTTP gateway;
- update launch record;
- run strict production values checks.

## Phase B: Live Admin Operations

- verify BioMath Admin SAVEN Ops in production;
- verify event audit;
- verify command permission review;
- verify alert routes;
- verify worker shift board;
- verify SLO posture.

## Phase C: First-Hour Watch

- run production URL smoke;
- run live watch;
- run incident drill;
- confirm rollback owner and proof;
- keep robot/emergency/dispatch locks active.

## Phase D: Human GO Decision

- run strict GO;
- record GO, HOLD, or RC ONLY;
- tag release only after the human decision;
- keep all locked safety boundaries explicit.

## Operator Command

```zsh
npm run next-phase:saven
```
