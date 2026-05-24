# SAVEN Supabase Migration Kit

This kit turns the backend contract into concrete Supabase review artifacts.

## Files

- `supabase/saven/001_saven_core_schema.sql`
- `supabase/saven/002_saven_review_seed.sql`

## What The Schema Covers

- `saven_profiles`
- `saven_tasks`
- `saven_commands`
- `saven_verifications`
- `saven_admin_overrides`
- `saven_events`
- `saven_incidents`

## Review Seed

The seed data mirrors SAVEN command contract fixtures:

- nurse follow-up
- robot readiness with approval lock
- emergency rule display without automatic dispatch

## Release Rule

Do not apply this blindly to production. Review ownership joins, data retention, service-role usage, and RLS policy enforcement first.

Run:

```zsh
npm run db:saven
```
