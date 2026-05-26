# SAVEN Live Watch Checklist

This checklist is the live watch surface for SAVEN after the launch room opens. It keeps attention on the operating system itself: commands, care routes, worker handoff, Admin Ops, SLO, alerts, privacy, rollback, robot gate, and emergency gate.

## Watch Windows

- first 15 minutes;
- first hour;
- end of day 1;
- next morning review.

## Live Watch Signals

- production route remains reachable;
- SAVEN command layer remains visible;
- Today operations remain visible;
- Admin Ops SAVEN panel remains visible;
- event audit receives entries;
- worker handoff stays human-owned;
- alert routes stay assigned;
- SLO posture stays reviewed;
- privacy redaction stays active;
- dispatch lock stays active;
- robot gate remains approval-only;
- emergency gate remains non-automatic.

## Hold Signals

Hold or rollback if:

- command rail disappears;
- Admin Ops cannot render;
- event audit is not visible;
- worker dispatch becomes automatic;
- emergency or robot path becomes automatic;
- privacy redaction is missing;
- production URL smoke fails;
- rollback owner is unavailable.

## Operator Command

```zsh
npm run live-watch:saven
```
