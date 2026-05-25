# SAVEN Final Operator Packet

This is the shortest human entrypoint for the final SAVEN release review. It is written for the person who must decide whether SAVEN stays `RC ONLY`, moves to `HOLD`, or can proceed toward `GO`.

## Current Default

Default state is `RC ONLY`.

That is intentional. SAVEN can be a strong release candidate while production URL, backend values, reviewers, owners, rollback owner, first-hour watch owner, and final decision are still not recorded.

## One-Pass RC Check

Run:

```zsh
npm run final-operator:saven
npm run production-release:saven
npm run ready:saven
env -u VITE_SUPABASE_URL -u VITE_SUPABASE_ANON_KEY npm run build
```

If this passes, the local release package is coherent.

## Strict GO Rehearsal

Run only when the launch record is filled with real values:

```zsh
SAVEN_STRICT_PRODUCTION_VALUES=1 npm run production-values:saven
SAVEN_STRICT_GO=1 npm run go-dry-run:saven
SAVEN_STRICT_TAG=1 npm run rc-tag:saven
```

If any strict command fails, stay `RC ONLY` or choose `HOLD`.

## Operator Decision

- `RC ONLY`: local package is ready, live values are incomplete.
- `HOLD`: a production blocker is known.
- `GO`: strict values, strict GO dry run, production URL smoke, full readiness, build, rollback, first-hour watch, and human sign-off are complete.

## Final Safety Reminder

SAVEN does not become a clinical, emergency-service, medical-device, or robot-autonomy system through this release packet. Robot physical action, emergency dispatch, worker dispatch, clinical plan change, and admin override remain human-gated.

## Operator Checklist

- Production URL recorded.
- Supabase project recorded.
- Backend URL recorded.
- Decision owner named.
- Admin Ops reviewer named.
- Backend owner named.
- Rollback owner named.
- First-hour watch owner named.
- Admin access reviewer named.
- Privacy reviewer named.
- Dispatch lock reviewer named.
- Robot/emergency safety reviewer named.
- Freeze reviewer named.
- GO dry run reviewer named.
