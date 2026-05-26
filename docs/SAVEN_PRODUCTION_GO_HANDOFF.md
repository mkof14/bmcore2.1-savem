# SAVEN Production GO Handoff

This is the handoff from release candidate discipline to a real production GO decision. It keeps the distinction explicit: SAVEN can be RC-ready without being live-GO.

## GO Handoff Inputs

- production URL;
- backend mode;
- Supabase project;
- Edge or HTTP gateway owner;
- monitoring owner;
- Admin Ops reviewer;
- privacy reviewer;
- dispatch lock reviewer;
- robot/emergency safety reviewer;
- rollback owner;
- first-hour watch owner.

## GO Handoff Checks

- `npm run production-values:saven`
- `npm run go-dry-run:saven`
- `npm run final-seal:saven`
- `npm run clean-release:saven`
- `npm run production-go:saven`

## GO Handoff Rule

If real production values are missing, the release remains RC ONLY.

If any owner is missing, the release remains HOLD or RC ONLY.

If dispatch, robot, emergency, privacy, backend, monitoring, or rollback posture is unclear, the release remains HOLD.

## Operator Command

```zsh
npm run go-handoff:saven
```
