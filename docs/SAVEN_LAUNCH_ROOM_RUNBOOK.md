# SAVEN Launch Room Runbook

This runbook is the live-day operating script for SAVEN. It assumes the branch is an RC-ready package and the final operator is deciding whether the release stays `RC ONLY`, moves to `HOLD`, or proceeds toward `GO`.

## Launch Room Roles

- Decision owner
- Admin Ops reviewer
- Backend owner
- Monitoring owner
- Rollback owner
- First-hour watch owner
- Privacy reviewer
- Dispatch lock reviewer
- Robot/emergency safety reviewer

## T-24 Hours

Run:

```zsh
npm run final-operator:saven
npm run production-release:saven
npm run ready:saven
env -u VITE_SUPABASE_URL -u VITE_SUPABASE_ANON_KEY npm run build
```

Confirm:

- launch record owners are known;
- production URL is known or the release remains `RC ONLY`;
- Supabase and backend mode are known or the release remains `RC ONLY`;
- rollback owner is named;
- first-hour watch owner is named.

## T-1 Hour

Run:

```zsh
npm run production-values:saven
npm run go-dry-run:saven
npm run rollback:saven
npm run postlaunch:saven
```

If real values are filled, rehearse strict mode:

```zsh
SAVEN_STRICT_PRODUCTION_VALUES=1 npm run production-values:saven
SAVEN_STRICT_GO=1 npm run go-dry-run:saven
```

## T-0 Decision

Before GO:

- production URL smoke is ready;
- Admin Ops reviewer confirms SAVEN Ops;
- backend owner confirms Edge or HTTP mode;
- monitoring owner confirms SLO and alerts;
- privacy reviewer confirms redaction posture;
- dispatch lock reviewer confirms no external dispatch;
- robot/emergency reviewer confirms no physical or emergency automation;
- rollback owner confirms rollback path;
- first-hour watch owner is present.

## First 15 Minutes

Watch:

- production route availability;
- command rail visibility;
- Admin Ops visibility;
- backend gateway status;
- SLO posture;
- alert routes;
- event audit creation;
- robot gate;
- emergency gate;
- privacy redaction.

## First Hour

Watch:

- command backlog;
- proof wait;
- endpoint availability;
- worker handoff;
- incident readiness;
- rollback signals;
- user-visible SAVEN pages;
- BioMath Admin SAVEN Ops.

## Rollback Trigger

Rollback or hold if:

- production route smoke fails;
- Admin Ops cannot render;
- backend gateway mode is wrong;
- privacy redaction fails;
- emergency or robot gates appear automatic;
- worker dispatch appears live without approval;
- production URL or env is wrong;
- first-hour watch owner is absent.

## Operator Command

```zsh
npm run launch-room:saven
```

## Post-Launch Control Stack

After the launch room opens, run:

```zsh
npm run incident-drill:saven
npm run rollback-proof:saven
npm run operator-evidence:saven
```

The launch room should not move beyond RC-only unless incident drill, rollback proof, and operator evidence are reviewed by the owner group.
