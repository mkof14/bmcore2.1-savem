# SAVEN BioMath Admin Deploy Checklist

This package is the final checklist for running SAVEN inside BioMath Core Admin during deployment. SAVEN should not become a separate admin island. BioMath Core Admin is the operator surface for launch control, evidence, monitoring, alerts, workers, incidents, persistence, and overrides.

## Admin Surface Contract

BioMath Core Admin must expose:

- SAVEN Ops entry point
- live monitoring snapshot
- SLO posture
- alert routes
- worker shift board
- ops evidence pack
- launch control
- event audit
- incident readiness
- incident actions
- admin overrides
- persistence status

## Deploy Checklist

Run:

```zsh
npm run admin-deploy:saven
npm run ready:saven
npm run ship:saven
```

Before real production promotion, also run:

```zsh
SAVEN_DEPLOY_TARGET=production npm run prod-env:saven
SAVEN_PRODUCTION_URL=https://your-saven-domain.example npm run prod-smoke:saven
```

## Admin Hold Rules

Do not promote if:

- Admin Ops is missing from BioMath Core Admin.
- Launch Control cannot show go, hold, and blocker states.
- Ops Evidence Pack cannot summarize readiness evidence.
- Worker Shift Board suggests automatic external dispatch.
- Alert Routes do not include emergency, robot, device, caregiver, and Admin Ops review.
- Event Audit is not visible.
- Incident Actions can execute without audit-first review.
- Persistence status is unclear while production backend mode is enabled.

## Operator Flow

1. Open BioMath Core Admin.
2. Open SAVEN Ops.
3. Review Launch Control.
4. Review Evidence Pack.
5. Review SLO posture and Alert Routes.
6. Review Worker Shift Board.
7. Review Event Audit and Incident Readiness.
8. Hold launch if robot, emergency, worker, or privacy gates are unclear.

## Human Approval Note

This checklist proves operator surface readiness. It does not certify clinical safety, emergency-service operation, legal compliance, medical-device status, or robot autonomy.
