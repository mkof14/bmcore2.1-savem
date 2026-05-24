# SAVEN Ops Evidence Pack

SAVEN now has many operational pieces: command fixtures, worker handoff, privacy guardrails, monitoring SLO, alert routes, Admin Ops, Supabase, and Edge Function package. The evidence pack gives a single review object that explains what is ready and what needs operator review.

## Evidence Covered

- Command contract fixtures
- Worker endpoints and handoff packets
- Privacy reviews and role policies
- Monitoring SLO metrics
- Alert routes and runbook actions
- Admin Ops visibility

## Release Posture

The pack reports one of three states:

- `review_ready`
- `needs_operator_review`
- `blocked`

This is not a legal or clinical certification. It is an operational release signal for SAVEN review.

## Audit

Run:

```zsh
npm run evidence:saven
```
