# SAVEN Hosting Deployment Package

This package describes how to deploy SAVEN without mixing the release candidate back into older BioMath Core production assumptions.

## Recommended Hosting Shape

- GitHub repository: `mkof14/bmcore2.1-savem`
- Production branch: `main`
- Build command: `npm run build`
- Preview command before release: `npm run ship:saven`
- Static output: `dist`
- Runtime: Vite SPA with route rewrites

## Required Environment Variables

Use `.env.saven.example` as the source of truth.

### Production Edge mode

```env
SAVEN_DEPLOY_TARGET=production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_SAVEN_BACKEND_MODE=edge
VITE_SAVEN_EDGE_FUNCTION_URL=https://your-project.supabase.co/functions/v1/saven-gateway
```

### Production HTTP mode

```env
SAVEN_DEPLOY_TARGET=production
VITE_SAVEN_BACKEND_MODE=http
VITE_SAVEN_BACKEND_URL=https://api.your-domain.com/saven
```

## Vercel Setup

1. Import `mkof14/bmcore2.1-savem`.
2. Use branch `main`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add SAVEN environment variables.
6. Confirm `vercel.json` keeps SPA route rewrites.

## Promotion Gate

```zsh
npm run ready:saven
npm run ship:saven
npm run hosting:saven
```

## Rollback

Rollback instead of hot patching when production routes fail, Admin Ops cannot show Launch Control, Edge Function permissions fail, or robot/emergency gates appear automatic.

## Production Holds

- RLS must be reviewed against real ownership.
- Edge Function must be deployed if Edge mode is selected.
- Worker dispatch must remain disabled until legal and operational review.
- Robot physical action remains approval-gated.
- Emergency route remains human-confirmed and non-automatic.


## Production Environment Gate

Run `npm run prod-env:saven` in review mode for documentation coverage. Before promotion, run the same gate with `SAVEN_DEPLOY_TARGET=production` and the real production public variables. The gate blocks local backend mode, missing Supabase public config, missing Edge Function URL, missing HTTP backend URL, and secret-like client variables.


## Production URL Smoke Gate

When the deployed URL is available, run `SAVEN_PRODUCTION_URL=https://your-saven-domain.example npm run prod-smoke:saven`. This proves the live URL serves the SAVEN app shell for Start, Today, Commands, Settings, and Verification.
