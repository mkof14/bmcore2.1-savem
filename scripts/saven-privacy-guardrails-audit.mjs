import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    label: 'Privacy guardrails service',
    file: 'src/features/saven/services/savenPrivacyGuardrailsService.ts',
    markers: [
      'savenPrivacyPolicyMatrix',
      'classifySavenCommandText',
      'redactSavenSensitiveText',
      'createSavenPrivacyReview',
      'robot_gate',
      'emergency_route',
      'admin_audit',
    ],
  },
  {
    label: 'Privacy guardrails tests',
    file: 'src/features/saven/services/__tests__/savenPrivacyGuardrailsService.test.ts',
    markers: [
      'savenPrivacyGuardrailsService',
      'redacts sensitive free text',
      'family-safe review',
    ],
  },
  {
    label: 'Privacy guardrails docs',
    file: 'docs/SAVEN_SECURITY_PRIVACY_GUARDRAILS.md',
    markers: [
      'SAVEN Security And Privacy Guardrails',
      'Data Classes',
      'Role Matrix',
      'npm run privacy:saven',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['privacy:saven'] !== 'node scripts/saven-privacy-guardrails-audit.mjs') {
  throw new Error('package.json is missing privacy:saven script.');
}
console.log('[privacy] ok package privacy:saven script');

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN privacy artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN privacy marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[privacy] ok ${check.label}`);
}

console.log('SAVEN privacy guardrails audit passed.');
