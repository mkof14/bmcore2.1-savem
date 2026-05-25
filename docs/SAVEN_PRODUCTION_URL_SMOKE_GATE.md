# SAVEN Production URL Smoke Gate

This package checks a real deployed SAVEN URL after hosting is connected. Local preview remains covered by `ship:saven`; this gate is for the live production or preview URL that a human will open.

## Review Mode

Without `SAVEN_PRODUCTION_URL`, the audit checks that this package, release notes, and hosting docs exist, then exits without touching the network.

```zsh
npm run prod-smoke:saven
```

## Live URL Mode

Set a deployed URL and run:

```zsh
SAVEN_PRODUCTION_URL=https://your-saven-domain.example npm run prod-smoke:saven
```

The gate checks:

- `/app/saven`
- `/app/saven/today`
- `/app/saven/commands`
- `/app/saven/settings`
- `/app/saven/verification`

Each route must return the Vite app shell over HTTPS with HTTP 200.

## Hold Rules

Do not promote if:

- the URL is not HTTPS;
- any SAVEN route returns non-200;
- any route fails to return the app shell;
- Commands route is unavailable;
- Today route is unavailable;
- Admin and release evidence have not passed locally.

## Operator Note

This is a route and shell proof for deployed SAVEN. It does not validate clinical, emergency-service, legal, robot autonomy, or medical-device certification.
