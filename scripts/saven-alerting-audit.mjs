import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    label: 'Alerting service',
    file: 'src/features/saven/services/savenAlertingService.ts',
    markers: [
      'createSavenOpsAlerts',
      'getSavenAlertRules',
      'robot_review',
      'emergency_review',
      'proof-wait-slo',
      'endpoint-availability',
    ],
  },
  {
    label: 'Alerting tests',
    file: 'src/features/saven/services/__tests__/savenAlertingService.test.ts',
    markers: [
      'savenAlertingService',
      'critical alerts',
      'robot-gate',
      'emergency-gate',
    ],
  },
  {
    label: 'Alerting runbook',
    file: 'docs/SAVEN_ALERTING_RUNBOOK_KIT.md',
    markers: [
      'SAVEN Alerting Runbook Kit',
      'Command Backlog',
      'Robot Gate',
      'Emergency Gate',
      'npm run alerts:saven',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['alerts:saven'] !== 'node scripts/saven-alerting-audit.mjs') {
  throw new Error('package.json is missing alerts:saven script.');
}
console.log('[alerts] ok package alerts:saven script');

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN alerting artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN alerting marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[alerts] ok ${check.label}`);
}

console.log('SAVEN alerting audit passed.');
