import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    label: 'Admin worker shift board',
    file: 'src/pages/AdminPanel.tsx',
    markers: [
      'data-saven-admin-worker-shift="true"',
      'createSavenWorkerShiftBoard',
      'SAVEN worker shift board',
      'Voice commands become role-specific handoffs',
    ],
  },
  {
    label: 'Worker handoff service',
    file: 'src/features/saven/services/savenWorkerHandoffService.ts',
    markers: [
      'createSavenWorkerShiftBoard',
      'savenWorkerEndpoints',
      'automatic_external_dispatch',
    ],
  },
  {
    label: 'Admin worker docs',
    file: 'docs/SAVEN_BACKEND_MONITORING_ADMIN.md',
    markers: [
      'Admin Worker Shift Board',
      'data-saven-admin-worker-shift',
      'createSavenWorkerShiftBoard',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['admin-workers:saven'] !== 'node scripts/saven-admin-worker-shift-audit.mjs') {
  throw new Error('package.json is missing admin-workers:saven script.');
}
console.log('[admin-workers] ok package admin-workers:saven script');

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN admin worker artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN admin worker marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[admin-workers] ok ${check.label}`);
}

console.log('SAVEN Admin worker shift audit passed.');
