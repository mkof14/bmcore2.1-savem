# SAVEN Live Backend Activation Package

This package is for switching SAVEN from local/review backend behavior to a live production backend. It keeps the activation human-approved and keeps worker, robot, and emergency-sensitive paths gated.

## Activation Modes

### Edge Mode

Recommended production path:

```env
SAVEN_DEPLOY_TARGET=production
VITE_SAVEN_BACKEND_MODE=edge
VITE_SAVEN_EDGE_FUNCTION_URL=https://your-project.supabase.co/functions/v1/saven-gateway
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

### HTTP Mode

Use only when a separate SAVEN backend service is deployed and monitored:

```env
SAVEN_DEPLOY_TARGET=production
VITE_SAVEN_BACKEND_MODE=http
VITE_SAVEN_BACKEND_URL=https://api.your-domain.com/saven
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

## Activation Order

1. Run `npm run db:saven`.
2. Apply Supabase migrations in production.
3. Review RLS policies against real ownership.
4. Deploy Edge Function or HTTP backend.
5. Run `npm run edge:saven` for Edge package proof.
6. Configure production public env values.
7. Run strict production env gate.
8. Run live production URL smoke.
9. Open BioMath Core Admin and inspect SAVEN Ops.
10. Keep launch decision `RC ONLY` until launch record has real values and owners.

## Activation Commands

```zsh
npm run live-backend:saven
npm run db:saven
npm run edge:saven
SAVEN_DEPLOY_TARGET=production npm run prod-env:saven
SAVEN_PRODUCTION_URL=https://your-saven-domain.example npm run prod-smoke:saven
```

## Backend Holds

Hold activation if:

- Supabase production project is not selected.
- RLS review is incomplete.
- Migration review is incomplete.
- Edge Function URL or HTTP backend URL is missing.
- Backend mode remains `local` in production.
- Admin Ops cannot show persistence status.
- Event audit cannot render.
- Incident readiness cannot render.
- Command permission review is unclear.

## Safety Gates

- Edge/HTTP backend may interpret and record commands, but external dispatch stays blocked unless separately approved.
- Robot physical action remains approval-gated.
- Emergency routes remain human-confirmed and non-automatic.
- Worker dispatch remains approval-gated.
- No service role key belongs in Vite client env.

## Human Approval Note

This package activates backend readiness. It is not clinical, legal, emergency-service, medical-device, or robot-autonomy certification.
