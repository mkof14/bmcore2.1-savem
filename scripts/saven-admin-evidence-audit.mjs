import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    label: 'Admin ops evidence pack panel',
    file: 'src/pages/AdminPanel.tsx',
    markers: [
      'data-saven-admin-evidence-pack="true"',
      'createSavenOpsEvidencePack',
      'SAVEN ops evidence',
      'Release posture is visible before handoff',
      'Operator narrative',
    ],
  },
  {
    label: 'Ops evidence service',
    file: 'src/features/saven/services/savenOpsEvidenceService.ts',
    markers: [
      'createSavenOpsEvidencePack',
      'saven-ops-evidence-pack',
      'releasePosture',
    ],
  },
  {
    label: 'Admin evidence docs',
    file: 'docs/SAVEN_BACKEND_MONITORING_ADMIN.md',
    markers: [
      'Admin Ops Evidence Panel',
      'data-saven-admin-evidence-pack',
      'createSavenOpsEvidencePack',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['admin-evidence:saven'] !== 'node scripts/saven-admin-evidence-audit.mjs') {
  throw new Error('package.json is missing admin-evidence:saven script.');
}
console.log('[admin-evidence] ok package admin-evidence:saven script');

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN admin evidence artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN admin evidence marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[admin-evidence] ok ${check.label}`);
}

console.log('SAVEN Admin evidence audit passed.');
