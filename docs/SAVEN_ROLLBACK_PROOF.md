# SAVEN Rollback Proof Package

This package turns rollback from a document into a short evidence check. It confirms the launch room knows where rollback lives, who owns it, and what proof must be captured after rollback.

## Rollback Proof Model

- rollback trigger is named;
- rollback owner is named;
- first five minutes are defined;
- recovery proof is defined;
- Admin Ops evidence is defined;
- production URL smoke is repeated after rollback;
- release notes and launch record stay consistent.

## Proof Sequence

Run:

```zsh
npm run rollback-proof:saven
npm run rollback:saven
npm run launch-room:saven
```

Then capture:

- route smoke result;
- Admin Ops render result;
- backend mode after rollback;
- alert route state;
- dispatch lock state;
- robot/emergency gate state.

## Rollback Holds

Hold if:

- rollback document is missing;
- launch room does not name rollback trigger;
- post-launch ops has no rollback trigger;
- production evidence index does not reference rollback;
- operator brief does not keep RC-only or hold path visible.

## Operator Command

```zsh
npm run rollback-proof:saven
```
