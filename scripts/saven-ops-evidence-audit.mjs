import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    label: 'Ops evidence service',
    file: 'src/features/saven/services/savenOpsEvidenceService.ts',
    markers: [
      'createSavenOpsEvidencePack',
      'saven-ops-evidence-pack',
      'command-contract',
      'worker-handoff',
      'privacy-guardrails',
      'monitoring-slo',
      'alert-routes',
    ],
  },
  {
    label: 'Ops evidence tests',
    file: 'src/features/saven/services/__tests__/savenOpsEvidenceService.test.ts',
    markers: [
      'createSavenOpsEvidencePack',
      'release posture explicit',
      'Admin Ops',
    ],
  },
  {
    label: 'Ops evidence docs',
    file: 'docs/SAVEN_OPS_EVIDENCE_PACK.md',
    markers: [
      'SAVEN Ops Evidence Pack',
      'Command contract fixtures',
      'Worker endpoints',
      'Privacy reviews',
      'npm run evidence:saven',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['evidence:saven'] !== 'node scripts/saven-ops-evidence-audit.mjs') {
  throw new Error('package.json is missing evidence:saven script.');
}
console.log('[evidence] ok package evidence:saven script');

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN evidence artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN evidence marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[evidence] ok ${check.label}`);
}

console.log('SAVEN Ops evidence audit passed.');
