# SAVEN Monitoring SLO Kit

SAVEN monitoring is not generic uptime. It tracks whether real support can move safely from voice or text command to human, device, robot, verification, and admin review.

## SLO Signals

- Command backlog
- Proof wait SLO
- Incident severity
- Robot gate
- Emergency gate
- Endpoint availability

## Operational Meaning

- Command backlog shows whether SAVEN is becoming a pile of unresolved requests.
- Proof wait SLO protects continuity from being updated before verification.
- Incident severity keeps urgent and critical items human-owned.
- Robot gate proves physical robot action stays locked until approval.
- Emergency gate proves emergency path is visible without automatic external dispatch.
- Endpoint availability proves devices, robots, and environments are still usable.

## Runbook

Run:

```zsh
npm run monitoring:saven
```

If a metric breaches:

1. Open Admin Ops.
2. Review event audit and incident readiness.
3. Assign a human owner.
4. Re-run `npm run ready:saven`.
