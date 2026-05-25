# SAVEN Production Release Orchestrator

This is the final local orchestration layer before a SAVEN release candidate is promoted or tagged. It does not replace the individual gates; it proves they are all present, connected, and ordered.

## Release Sequence

Run this sequence in a clean working tree:

```zsh
npm run production-release:saven
npm run ready:saven
npm run ship:saven
npm run github-release:saven
```

When production values are available:

```zsh
SAVEN_DEPLOY_TARGET=production npm run prod-env:saven
SAVEN_PRODUCTION_URL=https://your-saven-domain.example npm run prod-smoke:saven
```

## What The Orchestrator Proves

- Backend readiness package exists.
- Monitoring and alerting gates exist.
- BioMath Core Admin deploy checklist exists.
- Production env gate exists.
- Production URL smoke gate exists.
- Rollback drill exists.
- Post-launch ops package exists.
- Final tag gate exists.
- Go / No-Go gate exists.
- Launch record exists.
- Release handoff and GitHub release notes reference the production gates.

## Strict Production Mode

By default, `production-release:saven` is RC-safe and does not require real production env values. For a real production promotion, use the strict checks explicitly:

```zsh
SAVEN_DEPLOY_TARGET=production npm run prod-env:saven
SAVEN_PRODUCTION_URL=https://your-saven-domain.example npm run prod-smoke:saven
```

## Final Human Decision

The orchestrator can prove the release package is internally consistent. A human still decides:

- `GO`: production URL, env, backend, Admin Ops, rollback owner, and first-hour watch are recorded.
- `HOLD`: one or more production safety gates are unclear.
- `RC ONLY`: local package is strong, but live production values are not complete.

## Human Approval Note

This orchestrator is an operational release package check. It is not clinical, legal, emergency-service, medical-device, or robot-autonomy certification.


## Production Evidence Index

Run `npm run evidence-index:saven` before the final release pass. The index gives one human-readable map of ready evidence, production holds, and safety gates.
