# SAVEN Production Values Ready

This package explains exactly what must be filled before SAVEN can move from RC-ready to live GO. It is intentionally stricter than normal release readiness.

## Required Production Values

- production URL;
- release tag;
- backend mode;
- Supabase URL;
- Supabase anon key;
- Edge Function URL or HTTP backend URL;
- decision owner;
- Admin Ops reviewer;
- backend owner;
- monitoring owner;
- rollback owner;
- first-hour watch owner;
- privacy reviewer;
- dispatch lock reviewer;
- robot/emergency safety reviewer.

## Values Ready Rule

Normal mode confirms the checklist exists:

```zsh
npm run values-ready:saven
```

Strict mode confirms the launch record no longer contains placeholders:

```zsh
SAVEN_STRICT_PRODUCTION_VALUES=1 npm run values-ready:saven
```

## Hold Rule

If any required value is pending, TBD, placeholder, or RC ONLY, SAVEN remains RC-ready but not production GO.
