# SAVEN Private Production Values

This note explains the local-only production values file. It is not a place for committed secrets.

## Local File

Run:

```zsh
npm run values-local:saven
```

This creates:

```text
SAVEN_PRODUCTION_VALUES.local
```

The file is ignored by git because `.gitignore` already ignores `*.local`.

## What Goes In The Local File

Use it to collect real values before editing the public launch record:

- production URL;
- backend mode;
- Supabase project reference;
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

## What Does Not Go In Committed Docs

Do not commit:

- service role keys;
- private backend secrets;
- admin passwords;
- personal phone numbers;
- database passwords;
- private webhook secrets.

## Promotion Rule

After the local values are reviewed, copy only safe public values and owner names into `docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md`, then run strict checks.
