# SAVEN Operator Sign-Off

This document is the human sign-off contract for SAVEN. It does not certify medical, emergency, robotics, or legal readiness. It confirms the operator has evidence, owners, hold rules, and rollback visibility before changing launch decision language.

## Sign-Off Owners

- decision owner;
- Admin Ops reviewer;
- backend owner;
- monitoring owner;
- rollback owner;
- privacy reviewer;
- dispatch lock reviewer;
- robot/emergency safety reviewer;
- first-hour watch owner.

## Sign-Off Evidence

- final operator packet;
- launch room runbook;
- live watch checklist;
- operator evidence package;
- rollback proof;
- post-launch incident drill;
- production launch record;
- production evidence index.

## Sign-Off Rule

The operator records one:

- GO;
- HOLD;
- RC ONLY.

If any owner or safety gate is missing, the result remains HOLD or RC ONLY.

## Operator Command

```zsh
npm run signoff:saven
```
