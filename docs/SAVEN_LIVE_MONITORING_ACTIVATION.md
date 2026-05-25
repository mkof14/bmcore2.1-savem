# SAVEN Live Monitoring Activation Package

This package activates the live monitoring posture for SAVEN. It connects backend readiness, Admin Ops, SLO posture, alert routes, event audit, incident readiness, evidence, and first-hour watch into one production monitoring path.

## Monitoring Activation Order

1. Activate live backend path with `npm run live-backend:saven`.
2. Confirm monitoring SLO contract with `npm run monitoring:saven`.
3. Confirm alert routes with `npm run alerts:saven`.
4. Confirm Admin alert routes with `npm run admin-alerts:saven`.
5. Confirm evidence pack with `npm run evidence:saven`.
6. Confirm Admin evidence with `npm run admin-evidence:saven`.
7. Open BioMath Core Admin and inspect SAVEN Ops.
8. Fill first-hour watch owner in launch record.

## Live Monitoring Commands

```zsh
npm run live-monitoring:saven
npm run monitoring:saven
npm run alerts:saven
npm run admin-alerts:saven
npm run evidence:saven
npm run admin-evidence:saven
```

## First-Hour Metrics

- route availability
- command backlog
- proof wait
- incident severity
- robot gate
- emergency gate
- endpoint availability
- worker handoff status
- alert route ownership
- event audit creation
- persistence status

## Alert Route Expectations

- Admin Ops review
- caregiver review
- robot review
- emergency review
- device review
- worker review

## Monitoring Holds

Hold production if:

- SLO posture cannot render in Admin Ops;
- Alert Routes panel is missing;
- Ops Evidence Pack is missing;
- Event Audit is missing;
- Incident Readiness is missing;
- Worker Shift Board is missing;
- no first-hour watch owner is named;
- emergency, robot, or worker alerts imply automatic external action.

## Human Approval Note

This package activates operational monitoring posture. It is not clinical, legal, emergency-service, medical-device, or robot-autonomy certification.
