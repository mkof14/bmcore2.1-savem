import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    label: 'Admin alert routes panel',
    file: 'src/pages/AdminPanel.tsx',
    markers: [
      'data-saven-admin-alerts="true"',
      'createSavenOpsAlerts',
      'SAVEN alert routes',
      'caregiver review',
      'robot review',
      'emergency review',
    ],
  },
  {
    label: 'Alerting service',
    file: 'src/features/saven/services/savenAlertingService.ts',
    markers: [
      'createSavenOpsAlerts',
      'robot_review',
      'emergency_review',
      'device_review',
    ],
  },
  {
    label: 'Admin alert docs',
    file: 'docs/SAVEN_BACKEND_MONITORING_ADMIN.md',
    markers: [
      'Admin Alert Routes Panel',
      'data-saven-admin-alerts',
      'createSavenOpsAlerts',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['admin-alerts:saven'] !== 'node scripts/saven-admin-alerts-audit.mjs') {
  throw new Error('package.json is missing admin-alerts:saven script.');
}
console.log('[admin-alerts] ok package admin-alerts:saven script');

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN admin alert artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN admin alert marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[admin-alerts] ok ${check.label}`);
}

console.log('SAVEN Admin alert routes audit passed.');
