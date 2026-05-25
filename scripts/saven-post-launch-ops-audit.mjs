import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    label: 'Post-launch ops doc',
    file: 'docs/SAVEN_POST_LAUNCH_OPS.md',
    markers: [
      'SAVEN Post-Launch Ops Package',
      'First 15 Minutes',
      'First Hour',
      'Day 1',
      'Rollback Triggers',
      'npm run postlaunch:saven',
    ],
  },
  {
    label: 'Admin Ops coverage',
    file: 'src/pages/AdminPanel.tsx',
    markers: [
      'data-saven-admin-ops="true"',
      'data-saven-admin-launch-control="true"',
      'data-saven-admin-evidence-pack="true"',
    ],
  },
  {
    label: 'SAVEN shell coverage',
    file: 'src/pages/Saven.tsx',
    markers: [
      'SAVEN',
      'SAVEN commands',
      'Open mic',
    ],
  },
  {
    label: 'Release handoff',
    file: 'docs/SAVEN_RELEASE_HANDOFF.md',
    markers: [
      'SAVEN Release Handoff',
      'Hosting Deployment Package',
      'Launch Control',
    ],
  },
  {
    label: 'Final ship manifest',
    file: 'docs/SAVEN_FINAL_SHIP_MANIFEST.md',
    markers: [
      'Known Production Preconditions',
      'Emergency route remains human-confirmed',
      'Robot physical action remains permissioned',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['postlaunch:saven'] !== 'node scripts/saven-post-launch-ops-audit.mjs') {
  throw new Error('package.json is missing postlaunch:saven script.');
}
console.log('[postlaunch] ok package postlaunch:saven script');

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN post-launch artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN post-launch marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[postlaunch] ok ${check.label}`);
}

console.log('SAVEN post-launch ops audit passed.');
