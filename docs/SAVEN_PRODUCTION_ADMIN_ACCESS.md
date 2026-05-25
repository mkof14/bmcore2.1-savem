# SAVEN Production Admin Access Package

This package makes production admin access explicit for SAVEN. BioMath Core Admin is the operator surface; SAVEN actions must stay gated by admin identity, RLS, Edge Function checks, and event audit.

## Admin Access Model

SAVEN production admin access requires all of these:

- a named operator in BioMath Core Admin;
- `profiles.is_admin = true` in Supabase;
- RLS checks through `public.is_saven_admin()`;
- Edge Function admin action checks;
- Admin Ops visibility for launch, overrides, incidents, event audit, persistence, SLO, alerts, evidence, and worker shift;
- launch record owner and reviewer.

## Production Access Holds

Hold production if:

- no named admin operator owns the release window;
- `profiles.is_admin = true` is not reviewed for production operators;
- RLS admin policies are not reviewed;
- Edge Function admin actions are not gated;
- Admin Ops cannot render launch control, overrides, incidents, event audit, persistence, alerts, evidence, and SLO posture;
- any service-role key is present in a client environment;
- an admin action can imply external dispatch without human approval;
- the launch record does not name admin access owner and reviewer.

## Admin Actions

Admin actions are audit-first. They can approve or block SAVEN operational posture, review command permissions, prepare overrides, prepare incidents, review worker handoff, and confirm launch posture.

Admin actions must not silently dispatch emergency, clinical, caregiver, robot, device, or worker action. External action remains a human-approved operational step.

## Audit Requirements

Every production admin access review must leave evidence for:

- operator identity;
- reviewed environment;
- reviewed RLS policy;
- reviewed Edge Function admin path;
- reviewed Admin Ops screens;
- launch record owner;
- launch record reviewer;
- go/no-go decision.

## Operator Command

```zsh
npm run admin-access:saven
```

This command confirms the admin access package, BioMath Core Admin SAVEN Ops markers, RLS draft, Edge Function gateway, backend monitoring docs, launch record, and cutover docs.
