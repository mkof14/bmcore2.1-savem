# SAVEN RC Tag Command Package

This package prepares the release-candidate tag command for SAVEN. It does not create the tag automatically. It exists so the tag is created only after the release gates and human launch record are reviewed.

## Suggested RC Tag

```zsh
git tag bmcore2.1-savem-rc1
git push savem-origin bmcore2.1-savem-rc1
```

If more changes are added after this point, use the next tag:

```zsh
git tag bmcore2.1-savem-rc2
git push savem-origin bmcore2.1-savem-rc2
```

## Before Tagging

Run:

```zsh
npm run rc-tag:saven
npm run operator-brief:saven
npm run evidence-index:saven
npm run production-release:saven
npm run ready:saven
npm run ship:saven
git status
```

For a strict local tag preflight:

```zsh
SAVEN_STRICT_TAG=1 npm run rc-tag:saven
```

Strict mode requires a clean working tree. Normal mode is safe for `ready:saven` because it checks the package without blocking active development changes.

## Tag Holds

Do not tag if:

- release operator brief is missing;
- evidence index is missing;
- production release orchestrator is missing;
- final release tag gate is missing;
- GitHub release notes are missing;
- launch record still says `GO` while production fields are pending;
- `ready:saven` or `ship:saven` fails.

## Human Approval Note

The RC tag marks a release candidate package. It does not certify clinical safety, legal compliance, emergency-service operation, medical-device status, or robot autonomy.
