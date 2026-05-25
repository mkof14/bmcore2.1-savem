import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['rollback:saven'] !== 'node scripts/saven-rollback-drill-audit.mjs') {
  throw new Error('package.json is missing rollback:saven script.');
}
console.log('[rollback] ok package rollback:saven script');

const checks = [
  {
    label: 'Rollback drill package',
    file: 'docs/SAVEN_ROLLBACK_DRILL.md',
    markers: [
      'SAVEN Rollback Drill Package',
      'Immediate Hold Triggers',
      'First Five Minutes',
      'Production Rollback Actions',
      'Recovery Proof',
    ],
  },
  {
    label: 'Post-launch ops handoff',
    file: 'docs/SAVEN_POST_LAUNCH_OPS.md',
    markers: [
      'Rollback Triggers',
      'npm run postlaunch:saven',
    ],
  },
  {
    label: 'Hosting deployment rollback guidance',
    file: 'docs/SAVEN_HOSTING_DEPLOYMENT_PACKAGE.md',
    markers: [
      'Rollback',
      'Production Holds',
    ],
  },
  {
    label: 'Release handoff',
    file: 'docs/SAVEN_RELEASE_HANDOFF.md',
    markers: [
      'SAVEN Release Handoff',
      'Post-Launch Ops Package',
    ],
  },
  {
    label: 'Admin Ops evidence surface',
    file: 'src/pages/AdminPanel.tsx',
    markers: [
      'data-saven-admin-ops="true"',
      'data-saven-admin-launch-control="true"',
      'data-saven-admin-evidence-pack="true"',
    ],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN rollback artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN rollback marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[rollback] ok ${check.label}`);
}

console.log('SAVEN rollback drill audit passed.');
