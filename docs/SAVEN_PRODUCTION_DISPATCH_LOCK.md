# SAVEN Production Dispatch Lock Package

This package keeps SAVEN production-safe while live integrations are prepared. SAVEN can prepare worker, nurse, doctor, robot, device, caregiver, family, and emergency handoffs, but it must not perform automatic external dispatch.

## Dispatch Lock Model

The lock applies to:

- nurse follow-up;
- doctor clinical summary;
- caregiver task ownership;
- family digest;
- device proof attachment;
- robot readiness and physical-action gates;
- emergency route display;
- Admin Ops override and incident actions.

## Allowed Production Behavior

- Prepare a route.
- Show the right worker queue.
- Create an audit-first handoff packet.
- Require human confirmation.
- Block emergency external dispatch.
- Keep robot physical action locked.
- Attach device proof only as low-risk support evidence.

## Locked Behavior

SAVEN must not:

- call emergency services;
- send SMS, phone calls, emails, or external worker messages;
- trigger robot physical movement;
- change clinical plans;
- silently approve admin overrides;
- broadcast raw clinical or emergency context.

## Activation Holds

Hold production if:

- `npm run dispatch-lock:saven` fails;
- emergency route is not `blocked_external_dispatch`;
- robot action is not locked behind approval;
- nurse, doctor, caregiver, or admin routes do not require confirmation;
- Admin worker shift board cannot render;
- Edge Function says or implies external dispatch is enabled;
- launch record does not name dispatch lock reviewer.

## Operator Command

```zsh
npm run dispatch-lock:saven
```

This command confirms worker handoff service, worker tests, Admin worker shift board, Edge Function no-dispatch language, live backend posture, and production release docs.
