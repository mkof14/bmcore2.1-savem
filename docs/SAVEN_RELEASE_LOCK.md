# SAVEN Release Lock

This package locks the release language. SAVEN can be clean, sealed, and RC-ready while still not being live-GO.

## Release Lock States

- RC READY: all release checks pass, but live production values are missing.
- HOLD: a safety, owner, backend, monitoring, or rollback issue exists.
- GO READY: real production values and owners are recorded, and strict GO passes.

## Locked Safety Gates

- automatic external dispatch remains locked;
- robot physical action remains locked;
- emergency route remains non-automatic;
- privacy redaction remains active;
- Admin Ops remains the review surface;
- rollback remains available.

## Operator Command

```zsh
npm run release-lock:saven
```
