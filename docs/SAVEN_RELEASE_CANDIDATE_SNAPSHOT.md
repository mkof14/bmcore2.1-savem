# SAVEN Release Candidate Snapshot

This snapshot marks the current SAVEN branch as a release-candidate review surface. It does not claim production launch. It records what must be true before a final tag, GitHub release, or production handoff.

## Candidate Identity

- Product: SAVEN
- Repo: `mkof14/bmcore2.1-savem`
- Primary branch target: `main`
- Local development branch: `codex/bmcore2.1-savem`
- Review command: `npm run rc:saven`

## Candidate Evidence

- Final ship manifest: `docs/SAVEN_FINAL_SHIP_MANIFEST.md`
- Release handoff: `docs/SAVEN_RELEASE_HANDOFF.md`
- Backend, monitoring, admin foundation: `docs/SAVEN_BACKEND_MONITORING_ADMIN.md`
- Launch control: `docs/SAVEN_LAUNCH_CONTROL_KIT.md`
- Ops evidence: `docs/SAVEN_OPS_EVIDENCE_PACK.md`

## Required Review Commands

```zsh
npm run ready:saven
npm run ship:saven
npm run rc:saven
```

## Go / Hold Review

Before calling this a final release:

- Launch Control must be inspected in Admin Ops.
- Production preview must open SAVEN routes.
- Supabase production credentials must be configured.
- Edge Function mode must be deployed or explicitly held.
- Worker dispatch must remain disabled until human/legal/operational approval exists.
- Robot physical action must remain approval-gated.
- Emergency route must remain human-confirmed and non-automatic.

## GitHub Release Prep

When ready:

1. Run `npm run rc:saven`.
2. Run `npm run ship:saven`.
3. Restore `public/version.json` if build metadata should not be committed.
4. Push `codex/bmcore2.1-savem` to `savem-origin/main`.
5. Create a release tag only after production preview and Admin Ops review.

## Current Recommendation

Treat SAVEN as a strong release candidate only after `ready:saven`, `ship:saven`, and `rc:saven` all pass in the same working tree.
