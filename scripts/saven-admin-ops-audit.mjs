import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    label: 'Admin SLO panel',
    file: 'src/pages/AdminPanel.tsx',
    markers: [
      'data-saven-admin-slo="true"',
      'createSavenMonitoringSloReport',
      'SAVEN SLO posture',
      'command backlog',
      'robot gate',
      'emergency gate',
    ],
  },
  {
    label: 'Monitoring SLO service',
    file: 'src/features/saven/services/savenMonitoringSloService.ts',
    markers: [
      'SavenMonitoringSloReport',
      'command-backlog',
      'proof-wait-slo',
      'endpoint-availability',
    ],
  },
  {
    label: 'Admin docs',
    file: 'docs/SAVEN_BACKEND_MONITORING_ADMIN.md',
    markers: [
      'Admin SLO Panel',
      'data-saven-admin-slo',
      'SAVEN SLO posture',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['admin:saven'] !== 'node scripts/saven-admin-ops-audit.mjs') {
  throw new Error('package.json is missing admin:saven script.');
}
console.log('[admin] ok package admin:saven script');

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN admin artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN admin marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[admin] ok ${check.label}`);
}

console.log('SAVEN Admin Ops audit passed.');
