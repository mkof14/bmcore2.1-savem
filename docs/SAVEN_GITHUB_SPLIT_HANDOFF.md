# SAVEN GitHub Split Handoff

This handoff is for publishing `bmcore2.1-savem` as a separate GitHub project/repository while keeping the current local development history.

## Local Project

```text
/Users/mk/Desktop/bmcore2.1-savem
branch: codex/bmcore2.1-savem
version: bmcore2.1-savem
```

## Current Validation Standard

Run this before pushing:

```zsh
cd /Users/mk/Desktop/bmcore2.1-savem
npm run validate:saven
env -u VITE_SUPABASE_URL -u VITE_SUPABASE_ANON_KEY npm run build
```

Expected:

- typecheck passes
- tests pass
- SAVEN auto smoke passes
- production build passes using local fallbacks

## Clean Working Tree

Builds can update `public/version.json`. If it is the only modified file and you do not want to commit build-time metadata, restore it:

```zsh
cd /Users/mk/Desktop/bmcore2.1-savem
git status
git restore public/version.json
git status
```

## Create New GitHub Repository

Create a new empty GitHub repository, for example:

```text
bmcore2.1-savem
```

Do not initialize it with README, license, or gitignore if you want to push the current local history directly.

## Push To New Remote

After GitHub gives you the repo URL, use one of these patterns.

HTTPS:

```zsh
cd /Users/mk/Desktop/bmcore2.1-savem
git remote add savem-origin https://github.com/<OWNER>/bmcore2.1-savem.git
git push -u savem-origin codex/bmcore2.1-savem:main
git push savem-origin bmcore2.1-savem-dev-ready
```

SSH:

```zsh
cd /Users/mk/Desktop/bmcore2.1-savem
git remote add savem-origin git@github.com:<OWNER>/bmcore2.1-savem.git
git push -u savem-origin codex/bmcore2.1-savem:main
git push savem-origin bmcore2.1-savem-dev-ready
```

## Important Commits In This Phase

- Freeze bmcore2.1-savem development baseline
- Add SAVEN mock flow, control API, and handoff
- Modularize SAVEN engine and backend contracts
- Add SAVEN care routes and backend gateway UI
- Add SAVEN robot device and environment service matrix
- Add SAVEN verification engine UI
- Add SAVEN today and timeline operational clarity
- Add SAVEN final readiness report
- Add SAVEN route smoke checks
- Add SAVEN validation workflow

## Next Development Direction

Recommended next phase after the split:

1. Split `src/pages/Saven.tsx` into dedicated page/component files.
2. Keep `SavenBackendGateway` as the single future backend boundary.
3. Add local persistence only after the UI flow is stable.
4. Add real backend adapters later without changing the UI contract.
5. Keep emergency, clinical, robot physical action, and external notifications human-confirmed.
