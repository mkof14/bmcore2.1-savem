# SAVEN Final Release Tag Gate

This package is the final local gate before creating a SAVEN release tag. It does not create the tag automatically. It proves that the repo has the release evidence needed for a human-approved tag.

## Suggested Tag

```zsh
git tag bmcore2.1-savem-rc1
git push savem-origin bmcore2.1-savem-rc1
```

Use a later tag name if this candidate changes after review.

## Required Local Proof

Run these in the same clean working tree:

```zsh
npm run tag:saven
npm run ready:saven
npm run ship:saven
npm run github-release:saven
```

## Tag Hold Rules

Do not tag if any of these are true:

- `ready:saven` fails.
- `ship:saven` fails production preview.
- `prod-env:saven` fails in production mode with real public env values.
- `rollback:saven` cannot prove hold and recovery path.
- `postlaunch:saven` cannot prove first-hour operator review.
- Admin Ops cannot show Launch Control, Evidence Pack, SLO posture, Alert Routes, and Worker Shift Board.
- Commands page is missing or voice command rail is unavailable across SAVEN.
- Robot, worker, or emergency actions appear automatic instead of approval-gated.

## Release Evidence Map

- Product surface: `scripts/saven-route-smoke.mjs`
- Final readiness: `scripts/saven-full-readiness.mjs`
- GitHub release notes: `docs/SAVEN_GITHUB_RELEASE_NOTES.md`
- Hosting: `docs/SAVEN_HOSTING_DEPLOYMENT_PACKAGE.md`
- Production env: `docs/SAVEN_PRODUCTION_ENV_GATE.md`
- Rollback: `docs/SAVEN_ROLLBACK_DRILL.md`
- Post-launch ops: `docs/SAVEN_POST_LAUNCH_OPS.md`
- Final manifest: `docs/SAVEN_FINAL_SHIP_MANIFEST.md`

## Human Approval Note

The release tag means SAVEN is packaged as a deployable release candidate. It does not certify clinical safety, emergency-service operation, medical-device status, legal compliance, or robot autonomy.


## Production URL Smoke Gate

After deployment URL exists, run `SAVEN_PRODUCTION_URL=https://your-saven-domain.example npm run prod-smoke:saven`. This live gate checks deployed Start, Today, Commands, Settings, and Verification routes over HTTPS.


## BioMath Admin Deploy Checklist

Before tagging a production candidate, run `npm run admin-deploy:saven`. This proves SAVEN remains operationally connected to BioMath Core Admin for launch, evidence, monitoring, alerts, workers, incidents, audit, overrides, and persistence.


## Production Go / No-Go Package

Before promotion, run `npm run go-no-go:saven` and use `docs/SAVEN_PRODUCTION_GO_NO_GO.md` to choose `GO`, `HOLD`, or `RC ONLY`.
