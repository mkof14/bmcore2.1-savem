# SAVEN Production Environment Gate

This package separates local review mode from production promotion. SAVEN can run locally with safe fallbacks, but production must prove its public environment, backend mode, command safety, and hosting target before release.

## Review Mode

Review mode is for local and preview work.

```env
SAVEN_DEPLOY_TARGET=review
VITE_SAVEN_BACKEND_MODE=local
VITE_MOCK_MODE=1
```

Review mode may use mock data and local adapters. It must still keep robot, worker, and emergency paths approval-gated.

## Production Edge Mode

Recommended production mode:

```env
SAVEN_DEPLOY_TARGET=production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_SAVEN_BACKEND_MODE=edge
VITE_SAVEN_EDGE_FUNCTION_URL=https://your-project.supabase.co/functions/v1/saven-gateway
VITE_SAVEN_RELEASE_CHANNEL=production
VITE_SAVEN_ADMIN_MODE=biomath-core
```

## Production HTTP Mode

HTTP mode is allowed only when the separate SAVEN backend is deployed and monitored:

```env
SAVEN_DEPLOY_TARGET=production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_SAVEN_BACKEND_MODE=http
VITE_SAVEN_BACKEND_URL=https://api.your-domain.com/saven
VITE_SAVEN_RELEASE_CHANNEL=production
VITE_SAVEN_ADMIN_MODE=biomath-core
```

## Gate Behavior

Run:

```zsh
npm run prod-env:saven
```

- In review mode, the audit confirms that examples and deployment docs are complete.
- In production mode, the audit blocks missing Supabase URL, anon key, backend mode, Edge Function URL, or HTTP backend URL.
- The audit never asks for secret service-role keys in client env.

## Production Hold Rules

- Do not promote if `SAVEN_DEPLOY_TARGET=production` and backend mode is still `local`.
- Do not promote Edge mode without `VITE_SAVEN_EDGE_FUNCTION_URL`.
- Do not promote HTTP mode without `VITE_SAVEN_BACKEND_URL`.
- Do not expose service-role keys to Vite client variables.
- Do not enable robot, worker, or emergency execution without explicit human approval.

## Operator Note

This gate checks environment readiness. It does not replace Supabase RLS review, Edge Function deployment review, legal review, emergency-service review, or medical-device certification.
