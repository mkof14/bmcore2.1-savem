# SAVEN Production Values Worksheet

Use this worksheet before editing `docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md`. It keeps real production details organized without mixing secrets into the repo.

## Public Values To Record In Launch Record

| Field | Current placeholder | Real value |
| --- | --- | --- |
| Release tag | bmcore2.1-savem-rc1 |  |
| Production URL | pending |  |
| Launch decision | RC ONLY |  |
| Decision owner | pending |  |
| Admin Ops reviewer | pending |  |
| Backend owner | pending |  |
| Monitoring owner | pending |  |
| Rollback owner | pending |  |
| First-hour watch owner | pending |  |
| Deploy target | review | production |
| Backend mode | local until production env is set | edge or http |
| Supabase project | pending |  |
| Edge Function URL | pending |  |
| HTTP backend URL | not selected |  |
| RLS review | pending |  |
| Migration review | pending |  |
| Admin access owner | TBD |  |
| Admin access reviewer | TBD |  |
| Privacy reviewer | TBD |  |
| Dispatch lock reviewer | TBD |  |
| Robot/emergency safety reviewer | TBD |  |
| Freeze reviewer | TBD |  |
| Production values reviewer | TBD |  |
| GO dry run reviewer | TBD |  |
| Final operator reviewer | TBD |  |
| Launch room owner | TBD |  |

## Secrets Not To Commit

Do not place these secret values in docs:

- service role keys;
- private backend secrets;
- admin passwords;
- personal phone numbers;
- production database passwords;
- private webhook secrets.

Client-public values such as Supabase URL and anon key may be documented only if they are intended to be public client values.

## Fill Order

1. Fill production URL.
2. Choose backend mode: `edge` or `http`.
3. Record Supabase project and backend URL.
4. Name owners and reviewers.
5. Confirm RLS and migration review.
6. Keep launch decision `RC ONLY` until strict GO passes.
7. Run strict checks.

## Strict Checks

```zsh
npm run values-worksheet:saven
SAVEN_STRICT_PRODUCTION_VALUES=1 npm run values-ready:saven
SAVEN_STRICT_PRODUCTION_VALUES=1 npm run production-values:saven
SAVEN_STRICT_GO=1 npm run strict-go:saven
```

If any strict check fails, keep the decision as `RC ONLY` or `HOLD`.
