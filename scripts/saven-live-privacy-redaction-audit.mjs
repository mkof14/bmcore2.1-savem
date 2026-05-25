import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['privacy-live:saven'] !== 'node scripts/saven-live-privacy-redaction-audit.mjs') {
  throw new Error('package.json is missing privacy-live:saven script.');
}
console.log('[privacy-live] ok package privacy-live:saven script');

const requiredScripts = [
  'privacy:saven',
  'admin-access:saven',
  'live-backend:saven',
  'live-monitoring:saven',
  'launch-record:saven',
  'cutover:saven',
  'go-no-go:saven',
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[privacy-live] ok package ${script} script`);
}

const checks = [
  {
    label: 'Live privacy redaction package',
    file: 'docs/SAVEN_LIVE_PRIVACY_REDACTION.md',
    markers: [
      'SAVEN Live Privacy Redaction Package',
      'Live Privacy Model',
      'Redaction Requirements',
      'Live Review Holds',
      'privacy-live:saven',
    ],
  },
  {
    label: 'Privacy guardrails service',
    file: 'src/features/saven/services/savenPrivacyGuardrailsService.ts',
    markers: [
      'savenPrivacyPolicyMatrix',
      'classifySavenCommandText',
      'redactSavenSensitiveText',
      'createSavenPrivacyReview',
      'familyDigestText',
      'robot_gate',
      'emergency_route',
      'admin_audit',
    ],
  },
  {
    label: 'Privacy guardrails tests',
    file: 'src/features/saven/services/__tests__/savenPrivacyGuardrailsService.test.ts',
    markers: [
      'redacts sensitive free text',
      'family-safe review',
      'robot and emergency rules restricted',
    ],
  },
  {
    label: 'Security privacy guardrails doc',
    file: 'docs/SAVEN_SECURITY_PRIVACY_GUARDRAILS.md',
    markers: [
      'SAVEN Security And Privacy Guardrails',
      'Data Classes',
      'Role Matrix',
      'npm run privacy:saven',
    ],
  },
  {
    label: 'Backend monitoring admin privacy posture',
    file: 'docs/SAVEN_BACKEND_MONITORING_ADMIN.md',
    markers: [
      'npm run privacy:saven',
      'role visibility',
      'admin audit',
    ],
  },
  {
    label: 'Launch record privacy evidence',
    file: 'docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md',
    markers: [
      'Live Privacy Redaction',
      'privacy-live:saven',
      'Privacy reviewer',
    ],
  },
  {
    label: 'Cutover privacy gate',
    file: 'docs/SAVEN_PRODUCTION_CUTOVER_CHECKLIST.md',
    markers: [
      'Live Privacy Redaction',
      'privacy-live:saven',
      'family digest redaction',
    ],
  },
  {
    label: 'Release handoff privacy package',
    file: 'docs/SAVEN_RELEASE_HANDOFF.md',
    markers: [
      'Live Privacy Redaction',
      'privacy-live:saven',
      'family digest',
    ],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN live privacy artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN live privacy marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[privacy-live] ok ${check.label}`);
}

const forbiddenClientMarkers = ['SUPABASE_SERVICE_ROLE_KEY', 'service_role'];
const clientFiles = [
  'src/pages/Saven.tsx',
  'src/pages/AdminPanel.tsx',
  'src/features/saven/services/savenPrivacyGuardrailsService.ts',
];

for (const file of clientFiles) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  for (const marker of forbiddenClientMarkers) {
    if (content.includes(marker)) {
      throw new Error(`Forbidden client privacy marker in ${file}: ${marker}`);
    }
  }
  console.log(`[privacy-live] ok no service-role marker in ${file}`);
}

console.log('SAVEN live privacy redaction audit passed.');
