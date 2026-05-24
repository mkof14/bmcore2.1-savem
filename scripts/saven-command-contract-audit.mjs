import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    label: 'Command acceptance fixtures',
    file: 'src/features/saven/services/savenCommandAcceptanceFixtures.ts',
    markers: [
      'nurse-follow-up',
      'caregiver-assignment',
      'doctor-clinical-summary',
      'device-telemetry-confirmation',
      'robot-readiness-review',
      'emergency-rule-display',
    ],
  },
  {
    label: 'Command acceptance tests',
    file: 'src/features/saven/services/__tests__/savenCommandAcceptanceFixtures.test.ts',
    markers: [
      'saven command acceptance fixtures',
      'createSavenCommandExecutionPlan',
      'createSavenCommandPermissionReview',
      'createSavenLocalBackendGateway',
    ],
  },
  {
    label: 'Execution service',
    file: 'src/features/saven/services/savenCommandExecutionService.ts',
    markers: [
      'request_care_contact',
      'check_robot_readiness',
      'check_device_telemetry',
      'show_emergency_rules',
    ],
  },
  {
    label: 'Permission service',
    file: 'src/features/saven/services/savenCommandPermissionService.ts',
    markers: [
      'blocked',
      'admin_review',
      'requires_human_confirmation',
      'allowed',
    ],
  },
  {
    label: 'Admin visibility',
    file: 'src/pages/AdminPanel.tsx',
    markers: [
      'listEventAudit',
      'reviewCommandPermission',
      'data-saven-admin',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['commands:saven'] !== 'node scripts/saven-command-contract-audit.mjs') {
  throw new Error('package.json is missing commands:saven script.');
}
console.log('[commands] ok package commands:saven script');

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing command contract file: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing command contract marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[commands] ok ${check.label}`);
}

console.log('SAVEN command contract audit passed.');
