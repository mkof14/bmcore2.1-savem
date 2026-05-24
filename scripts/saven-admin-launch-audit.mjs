import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    label: 'Admin launch control panel',
    file: 'src/pages/AdminPanel.tsx',
    markers: [
      'data-saven-admin-launch-control="true"',
      'createSavenLaunchControlReport',
      'SAVEN launch control',
      'Final handoff has a visible go / hold decision',
      'Required holds',
    ],
  },
  {
    label: 'Launch control service',
    file: 'src/features/saven/services/savenLaunchControlService.ts',
    markers: [
      'createSavenLaunchControlReport',
      'saven-launch-control-report',
      'go',
      'hold',
    ],
  },
  {
    label: 'Admin launch docs',
    file: 'docs/SAVEN_BACKEND_MONITORING_ADMIN.md',
    markers: [
      'Admin Launch Control Panel',
      'data-saven-admin-launch-control',
      'createSavenLaunchControlReport',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['admin-launch:saven'] !== 'node scripts/saven-admin-launch-audit.mjs') {
  throw new Error('package.json is missing admin-launch:saven script.');
}
console.log('[admin-launch] ok package admin-launch:saven script');

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN admin launch artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN admin launch marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[admin-launch] ok ${check.label}`);
}

console.log('SAVEN Admin launch audit passed.');
