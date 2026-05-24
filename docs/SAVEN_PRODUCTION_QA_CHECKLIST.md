# SAVEN Production QA Checklist

This checklist is the final practical gate before a SAVEN release candidate is treated as production-ready.

## Voice command QA

- Commands are visible from every SAVEN operating page.
- The command strip does not cover primary content.
- The Commands page shows intent, confidence, safety gate, route, and permission review.
- Emergency commands remain blocked from automatic external dispatch.
- Robot physical action remains admin-reviewed or human-confirmed.

## UI and readability QA

- Dark theme keeps SAVEN cards dark, not generic white cards.
- Light theme keeps text and icons readable.
- Today, Commands, Settings, Admin Ops, Verification, Robots, Devices, and Care Routes should be visually inspected.
- Mobile and desktop widths should keep text inside controls without overlap.

## Backend readiness QA

- `npm run backend:saven` passes.
- `npm run deploy:saven` passes in review mode.
- Production mode requires Supabase URL, anon key, Edge Function mode, and Edge Function URL.
- Persistence status remains visible in BioMath Core Admin.
- Event audit and incident readiness remain visible in BioMath Core Admin.

## Safety QA

- Admin override actions are audit-first.
- Incident actions are audit-first.
- Care contact routes are prepared, not silently dispatched.
- Emergency routes are visible but require explicit human action.
- External dispatch remains disabled until a separate approved production safety policy exists.

## Release decision

Release candidate can proceed only when:

- `npm run ready:saven` passes.
- `npm run qa:saven` passes.
- Production build passes with public environment fallback or real public env vars.
- Git working tree is clean except generated build metadata that has been intentionally restored.
