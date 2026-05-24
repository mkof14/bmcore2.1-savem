# SAVEN QA Runbook

Use this runbook before committing major SAVEN changes.

## Main Local Validation

```zsh
npm run validate:saven
```

This runs:

- `npm run contrast:saven`
- `npm run typecheck`
- `npm run test -- --run`
- `npm run smoke:saven:auto`

The smoke check starts the local SAVEN dev server, verifies key routes, verifies important SAVEN page markers, and stops the server.

## Full Readiness Gate

```zsh
npm run ready:saven
```

Use this before a push or release handoff. It runs SAVEN theme contrast, TypeScript, tests, route smoke with an auto-started SAVEN dev server, and a production build with public Supabase variables removed so the fallback path is verified.

After the build, restore generated build metadata before committing:

```zsh
git restore public/version.json
```

## Theme Contrast Check

```zsh
npm run contrast:saven
```

This SAVEN-only check catches risky light-theme contrast combinations before they reach visual QA, especially white or very light text on pale surfaces.

## Production Build Check

```zsh
env -u VITE_SUPABASE_URL -u VITE_SUPABASE_ANON_KEY npm run build
```

Missing Supabase public environment variables are expected in local development. The app should use client fallbacks.

## Key SAVEN Routes

- `/app/saven`
- `/app/saven/today`
- `/app/saven/care-routes`
- `/app/saven/robots`
- `/app/saven/devices`
- `/app/saven/environments`
- `/app/saven/verification`
- `/app/saven/settings`
- `/app/saven/faq`
- `/app/saven/learning`

## What Must Stay True

- SAVEN must run locally at `http://127.0.0.1:5173/`.
- The dev version must not require real database, env, medical, robot, emergency, phone, or SMS integrations.
- Emergency, clinical, and robot physical action flows must remain human-confirmed.
- Care Routes, Robot/Device/Environment service layers, Verification Engine, Today clarity, Timeline clarity, Voice Settings, and Final Readiness Report must remain visible in code and routes.

## Recommended Commit Pattern

After successful validation:

```zsh
git status
git add <changed files>
git commit -m "<clear SAVEN change>"
```
