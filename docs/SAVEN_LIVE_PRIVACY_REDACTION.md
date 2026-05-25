# SAVEN Live Privacy Redaction Package

This package makes SAVEN privacy production-visible. It verifies that voice commands, care contact routing, clinical context, device signals, robot gates, emergency routes, family digest text, and admin audit records have a live redaction and role-visibility review before launch.

## Live Privacy Model

SAVEN handles support context, not generic website form data. Production privacy review must cover:

- voice command text;
- worker, nurse, doctor, family, device, and robot routing context;
- clinical summaries and medication language;
- emergency route context;
- robot and physical-action approval gates;
- admin overrides and incident actions;
- family digest text;
- event audit records.

## Redaction Requirements

- Clinical context is summarized or redacted before broad sharing.
- Family digest text cannot expose clinical, device, emergency, or admin audit details.
- Robot gates stay visible only to caregiver/admin roles.
- Admin audit is admin-only and retained for operational review.
- Emergency route context is audit-visible but routine broadcast-safe.
- Raw service-role credentials must never appear in client env, logs, UI, or docs.

## Live Review Holds

Hold production if:

- `npm run privacy-live:saven` fails;
- family digest redaction is unclear;
- clinical context can leak into non-clinical views;
- admin audit can be read outside Admin Ops;
- robot or emergency route details are broadcast as routine summaries;
- logs include emails, SSNs, phone-like identifiers, medication doses, diagnosis text, or service-role material;
- launch record does not name the privacy reviewer.

## Operator Command

```zsh
npm run privacy-live:saven
```

This command confirms the privacy service, tests, privacy guardrails doc, launch record, cutover checklist, release handoff, backend monitoring admin notes, and Admin Ops privacy posture.
