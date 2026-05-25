# SAVEN Production Go / No-Go Package

This is the final operator gate before calling a SAVEN release candidate ready for production promotion. It is intentionally stricter than a build check. SAVEN coordinates people, devices, workers, robots, environments, command routing, admin review, and emergency-sensitive paths.

## Decision States

### GO

SAVEN can be promoted only when:

- `ready:saven` passes in a clean working tree.
- `ship:saven` passes production preview.
- `admin-deploy:saven` proves BioMath Core Admin coverage.
- `prod-env:saven` passes with production public env values.
- `prod-smoke:saven` passes against the real deployed HTTPS URL.
- `rollback:saven` and `postlaunch:saven` pass.
- robot, worker, and emergency actions remain approval-gated.

### HOLD

Hold promotion if:

- live production URL is unavailable;
- Admin Ops cannot show launch, evidence, monitoring, alerts, workers, incidents, audit, overrides, and persistence;
- production backend mode is local;
- Edge or HTTP backend URL is missing;
- privacy redaction or human confirmation is unclear;
- any route falls back to stale loading behavior.

### RC ONLY

RC-only is acceptable when:

- local readiness and production preview pass;
- live production URL is not connected yet;
- production env values are not yet available;
- backend gateway remains local or review-only;
- human operator has not signed off Admin Ops.

## Final Command Set

```zsh
npm run go-no-go:saven
npm run ready:saven
npm run ship:saven
npm run admin-deploy:saven
npm run rollback:saven
npm run postlaunch:saven
npm run tag:saven
```

With production values:

```zsh
SAVEN_DEPLOY_TARGET=production npm run prod-env:saven
SAVEN_PRODUCTION_URL=https://your-saven-domain.example npm run prod-smoke:saven
```

## Human Sign-Off

Before GO, a human owner should record:

- release tag;
- production URL;
- backend mode;
- Supabase project;
- Edge Function URL or HTTP backend URL;
- Admin Ops reviewer;
- rollback owner;
- first-hour watch owner.

## Non-Negotiable Safety Holds

- No automatic emergency dispatch.
- No automatic robot physical action.
- No worker dispatch without explicit approval.
- No clinical or family context leak in command text.
- No production mode with local backend.
- No client-exposed service role or private secret.

## Human Approval Note

This gate is an operational release decision aid. It is not clinical, legal, emergency-service, medical-device, or robot-autonomy certification.


## Production Launch Record

Before calling `GO`, run `npm run launch-record:saven` and fill `docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md` with production URL, backend mode, Supabase project, reviewers, rollback owner, first-hour watch owner, and safety sign-off.


## Production Values Intake

Use `npm run production-values:saven` to confirm the intake package. Use `SAVEN_STRICT_PRODUCTION_VALUES=1 npm run production-values:saven` before changing from `RC ONLY` to `GO`. If strict mode fails, choose `HOLD` or remain `RC ONLY`.


## GO Decision Dry Run

Use `npm run go-dry-run:saven` to rehearse the final decision. Use `SAVEN_STRICT_GO=1 npm run go-dry-run:saven` before changing the launch record to `GO`. If strict mode fails, choose `HOLD` or remain `RC ONLY`.


## Final Operator Packet

Use `docs/SAVEN_FINAL_OPERATOR_PACKET.md` before the final decision. If strict GO rehearsal or strict production values fail, do not record `GO`.
