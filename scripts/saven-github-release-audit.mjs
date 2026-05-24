import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    label: 'GitHub release notes',
    file: 'docs/SAVEN_GITHUB_RELEASE_NOTES.md',
    markers: [
      'SAVEN GitHub Release Notes',
      'bmcore2.1-savem-rc1',
      'Required Checks',
      'Production Holds',
      'Reviewer Notes',
    ],
  },
  {
    label: 'GitHub release checklist',
    file: 'docs/SAVEN_GITHUB_RELEASE_CHECKLIST.md',
    markers: [
      'SAVEN GitHub Release Checklist',
      'npm run ready:saven',
      'npm run ship:saven',
      'savem-origin/main',
      'Launch Control reviewed',
    ],
  },
  {
    label: 'Release candidate snapshot',
    file: 'docs/SAVEN_RELEASE_CANDIDATE_SNAPSHOT.md',
    markers: [
      'SAVEN Release Candidate Snapshot',
      'GitHub Release Prep',
      'npm run rc:saven',
    ],
  },
  {
    label: 'Final ship manifest',
    file: 'docs/SAVEN_FINAL_SHIP_MANIFEST.md',
    markers: [
      'SAVEN Final Ship Manifest',
      'Known Production Preconditions',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['github-release:saven'] !== 'node scripts/saven-github-release-audit.mjs') {
  throw new Error('package.json is missing github-release:saven script.');
}
console.log('[github-release] ok package github-release:saven script');

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN GitHub release artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN GitHub release marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[github-release] ok ${check.label}`);
}

console.log('SAVEN GitHub release package audit passed.');
