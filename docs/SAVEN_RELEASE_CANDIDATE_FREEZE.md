# SAVEN Release Candidate Freeze Package

This package freezes SAVEN as a release candidate. After this point, the branch should accept only release-blocker fixes, evidence corrections, or production value updates recorded in the launch record.

## Freeze State

SAVEN is RC-ready when:

- `npm run rc-freeze:saven` passes;
- `npm run production-release:saven` passes;
- `npm run ready:saven` passes;
- production build passes with public Supabase env unset;
- launch record still says `RC ONLY` unless real production values are complete;
- robot/emergency, dispatch, privacy, admin, live backend, live monitoring, cutover, rollback, and go/no-go gates are all present.

## Change Rules After Freeze

Allowed after freeze:

- release-blocker bug fix;
- production URL or backend value update;
- launch owner/reviewer update;
- documentation correction for release evidence;
- safety hold clarification.

Not allowed after freeze:

- new SAVEN feature;
- new visual redesign;
- new command behavior;
- new admin action;
- automatic external dispatch unlock;
- robot physical action unlock;
- emergency service activation.

## Final RC Commands

```zsh
npm run rc-freeze:saven
npm run production-release:saven
npm run ready:saven
env -u VITE_SUPABASE_URL -u VITE_SUPABASE_ANON_KEY npm run build
SAVEN_STRICT_TAG=1 npm run rc-tag:saven
```

## Strict RC Tag

Use strict RC tagging only after the working tree is clean and the release candidate has passed the freeze, production release, full readiness, and production build commands.

## Freeze Holds

Hold the RC if:

- working tree is not clean before strict tag;
- `ready:saven` fails;
- production build fails;
- release audit fails;
- launch record is missing owners;
- robot/emergency, dispatch, privacy, or admin access gate is missing;
- BioMath Admin cannot render SAVEN Ops;
- production values are claimed but not recorded.

## Human Decision

This freeze does not make SAVEN a live production service by itself. It creates a disciplined release candidate. A human operator still decides `GO`, `HOLD`, or `RC ONLY` in the launch record.
