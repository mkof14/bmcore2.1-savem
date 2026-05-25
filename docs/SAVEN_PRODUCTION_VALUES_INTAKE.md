# SAVEN Production Values Intake Package

This package turns the remaining SAVEN production unknowns into a controlled intake checklist. It does not force GO. It makes the difference between RC-ready and production-ready explicit.

## Intake Model

Before SAVEN can move from `RC ONLY` to `GO`, a human operator must record real values for:

- release tag;
- production URL;
- backend mode;
- Supabase project;
- Edge Function or HTTP backend URL;
- decision owner;
- Admin Ops reviewer;
- backend owner;
- rollback owner;
- first-hour watch owner;
- admin access owner and reviewer;
- privacy reviewer;
- dispatch lock reviewer;
- robot/emergency safety reviewer;
- freeze reviewer.

## RC-Safe Mode

Normal mode is RC-safe:

```zsh
npm run production-values:saven
```

It confirms that the intake package, launch record fields, release handoff, evidence index, cutover checklist, freeze package, and production gates exist.

## Strict GO Mode

Strict mode is for the final production decision:

```zsh
SAVEN_STRICT_PRODUCTION_VALUES=1 npm run production-values:saven
```

Strict mode fails if the launch record still contains `pending`, `TBD`, or `RC ONLY`. Use it only when real production values and owner names have been recorded.

## Required Values Table

| Field | Source |
| --- | --- |
| Release tag | launch record |
| Production URL | launch record |
| Backend mode | launch record |
| Supabase project | launch record |
| Backend URL | launch record |
| Decision owner | launch record |
| Admin Ops reviewer | launch record |
| Backend owner | launch record |
| Rollback owner | launch record |
| First-hour watch owner | launch record |
| Admin access owner/reviewer | launch record |
| Privacy reviewer | launch record |
| Dispatch lock reviewer | launch record |
| Robot/emergency safety reviewer | launch record |
| Freeze reviewer | launch record |

## Production Holds

Hold production if:

- strict mode fails;
- production URL is not final;
- Supabase project is not final;
- backend URL is not final;
- any owner or reviewer is still pending;
- launch decision is still `RC ONLY`;
- robot/emergency, dispatch, privacy, admin access, live backend, live monitoring, cutover, rollback, or freeze gate is missing.
