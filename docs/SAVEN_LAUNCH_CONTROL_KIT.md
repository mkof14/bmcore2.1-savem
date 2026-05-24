# SAVEN Launch Control Kit

SAVEN now has multiple operational layers. Launch Control turns them into one release decision model.

## Launch Gates

- Ops evidence pack
- Command to worker loop
- Privacy and safety guardrails
- Monitoring and alerting
- Backend foundation
- Admin visibility
- Production preview

## Decision

The report returns:

- `go`
- `hold`

It also returns required holds and next actions. A `go` decision is not a medical, legal, or clinical certification. It means SAVEN release evidence is present and the operator gates are not blocked.

## Audit

Run:

```zsh
npm run launch:saven
```
