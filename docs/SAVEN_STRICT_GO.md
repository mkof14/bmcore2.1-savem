# SAVEN Strict GO

Strict GO is the final optional production mode. It is not used for normal RC development. It is used only when a human operator has recorded real production values and owners.

## Normal Mode

```zsh
npm run strict-go:saven
```

Normal mode confirms the strict GO package exists and keeps the release in RC-safe language.

## Strict Mode

```zsh
SAVEN_STRICT_GO=1 npm run strict-go:saven
```

Strict mode fails if the launch record still contains:

- pending;
- TBD;
- RC ONLY;
- placeholder production URLs;
- placeholder owners.

## Strict GO Boundary

Strict GO does not unlock robot physical action, automatic emergency dispatch, medical-device behavior, or clinical certification. Those remain separate approvals.
