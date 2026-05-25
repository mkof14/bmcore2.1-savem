# SAVEN GO Decision Dry Run Package

This package gives SAVEN a safe final decision rehearsal. It does not mark the release as GO. It tells the operator whether the launch record is still RC-only or ready for a strict GO review.

## Decision Dry Run Model

The dry run checks that these release layers exist:

- production values intake;
- release candidate freeze;
- robot/emergency safety gate;
- dispatch lock;
- live privacy redaction;
- production admin access;
- live backend activation;
- live monitoring activation;
- production release orchestrator;
- launch record;
- go/no-go package;
- cutover checklist.

## Normal Mode

```zsh
npm run go-dry-run:saven
```

Normal mode is RC-safe. It confirms the final decision package exists and reminds the operator that pending values mean `RC ONLY`.

## Strict Mode

```zsh
SAVEN_STRICT_GO=1 npm run go-dry-run:saven
```

Strict mode fails unless:

- launch record has no `pending`;
- launch record has no `TBD`;
- launch decision is not `RC ONLY`;
- production values strict mode would be expected to pass;
- all final gate documents and commands are present.

## GO Dry Run Result

If normal mode passes and strict mode fails, SAVEN is still a healthy release candidate, not a production GO.

If strict mode passes, the operator can continue to production URL smoke, strict production values, strict RC tag, and human launch decision review.

## Holds

Hold or remain RC-only if:

- any owner or reviewer is missing;
- production URL is not final;
- backend values are not final;
- robot/emergency safety reviewer is missing;
- dispatch lock reviewer is missing;
- privacy reviewer is missing;
- Admin Ops reviewer is missing;
- rollback owner is missing;
- first-hour watch owner is missing.
