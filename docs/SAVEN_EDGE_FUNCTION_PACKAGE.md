# SAVEN Edge Function Package

This package gives SAVEN a concrete Supabase Edge Function gateway draft.

## Function

- `supabase/functions/saven-gateway/index.ts`

## Actions

- `send_command`
- `interpret_command`
- `review_command_permission`
- `persistence_status`
- `list_events`
- `incident_readiness`
- `apply_admin_override`

## Safety Posture

- No external dispatch happens inside the draft function.
- Emergency commands show rules and require human confirmation.
- Robot physical support remains locked behind review.
- Admin override requires an admin or caregiver actor marker in this draft.

## Deploy

```zsh
supabase functions deploy saven-gateway
```

Then configure:

```env
VITE_SAVEN_BACKEND_MODE=edge
VITE_SAVEN_EDGE_FUNCTION_URL=https://your-project.supabase.co/functions/v1/saven-gateway
```

Run:

```zsh
npm run edge:saven
```
