# SAVEN Clean Release Pass

This pass is the final clean-room check for the SAVEN release branch. It confirms that the release stack is internally complete before the operator decides whether the branch remains RC-only, moves to HOLD, or is prepared for production GO.

## Clean Pass Model

- release readiness package exists;
- production release orchestrator exists;
- full readiness includes final seal;
- final seal exists;
- live watch exists;
- operator sign-off exists;
- post-launch control stack exists;
- production build command is known;
- public build metadata can be restored before commit.

## Clean Pass Commands

```zsh
npm run clean-release:saven
npm run release:saven
npm run production-release:saven
npm run ready:saven
env -u VITE_SUPABASE_URL -u VITE_SUPABASE_ANON_KEY npm run build
git restore public/version.json
```

## Clean Pass Holds

Hold if:

- any final seal script is missing;
- any release document is missing;
- production build fails;
- working tree contains unexpected files;
- launch decision is described as GO without production values.
