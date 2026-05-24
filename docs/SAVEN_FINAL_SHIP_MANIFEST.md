# SAVEN Final Ship Manifest

This manifest is the single handoff map for the current SAVEN release candidate. It is not a generic website checklist. It is the SAVEN operating-system map: voice, care workers, devices, robots, verification, backend, monitoring, admin, privacy, and release control.

## Product Surface

- SAVEN shell and dark operational interface
- Today support operations
- Dedicated Commands center
- Care Routes
- Robots
- Devices
- Environments
- Verification
- Voice Settings
- FAQ and Learning

## Voice And Worker Layer

- Global SAVEN command rail
- Command contract fixtures
- Worker handoff kit
- Admin worker shift board
- Nurse, caregiver, doctor, robot, device, emergency, and admin endpoints

## Backend Foundation

- Backend gateway abstraction
- Local backend gateway
- HTTP backend adapter
- Edge Function backend adapter
- Supabase migration kit
- Supabase Edge Function package
- Persistence status
- Permission review
- Event audit
- Incident readiness

## Monitoring And Admin

- Monitoring SLO kit
- Alerting runbook kit
- Admin SLO panel
- Admin alert routes panel
- Admin worker shift board
- Admin Ops evidence panel
- Admin Launch Control panel

## Safety And Privacy

- Security and privacy guardrails
- Role visibility matrix
- Family digest redaction
- Robot gate review
- Emergency route review
- Admin audit retention posture

## Release Control

- Release handoff
- Production preview gate
- Operator acceptance drills
- Visual acceptance audit
- Ops evidence pack
- Launch control kit
- Final `go / hold` decision model

## Required Commands

```zsh
npm run ready:saven
npm run ship:saven
npm run manifest:saven
```

## Final Review Order

1. Run `npm run ready:saven`.
2. Run `npm run ship:saven`.
3. Open BioMath Core Admin and inspect SAVEN Ops.
4. Confirm Launch Control shows the current `go / hold` state.
5. Confirm production preview opens SAVEN routes.
6. Confirm backend production credentials and Edge Function deployment are configured before real users.

## Known Production Preconditions

- Production Supabase project selected.
- RLS reviewed against real ownership model.
- Edge Function deployed if `VITE_SAVEN_BACKEND_MODE=edge`.
- Worker dispatch remains disabled until legal, operational, and human confirmation process is approved.
- Robot physical action remains permissioned and non-automatic.
- Emergency route remains human-confirmed and non-automatic.
