# SAVEN GitHub Release Checklist

Use this checklist only after the local release candidate passes.

## Local Checks

- [ ] `npm run ready:saven`
- [ ] `npm run ship:saven`
- [ ] `npm run rc:saven`
- [ ] `npm run github-release:saven`
- [ ] `git status` clean except intentional files
- [ ] `public/version.json` restored if build metadata should not be committed

## GitHub

- [ ] Push `codex/bmcore2.1-savem` to `savem-origin/main`
- [ ] Tag candidate as `bmcore2.1-savem-rc1`
- [ ] Use `docs/SAVEN_GITHUB_RELEASE_NOTES.md` for release body
- [ ] Link `docs/SAVEN_FINAL_SHIP_MANIFEST.md`
- [ ] Link `docs/SAVEN_RELEASE_CANDIDATE_SNAPSHOT.md`

## Production

- [ ] Supabase project selected
- [ ] RLS reviewed
- [ ] Edge Function deployed or explicitly held
- [ ] Production environment variables configured
- [ ] Admin Ops reviewed
- [ ] Launch Control reviewed
