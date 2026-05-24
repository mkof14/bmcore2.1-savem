import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    label: 'Monitoring SLO service',
    file: 'src/features/saven/services/savenMonitoringSloService.ts',
    markers: [
      'createSavenMonitoringSloReport',
      'command-backlog',
      'proof-wait-slo',
      'incident-severity',
      'robot-gate',
      'emergency-gate',
      'endpoint-availability',
    ],
  },
  {
    label: 'Monitoring SLO tests',
    file: 'src/features/saven/services/__tests__/savenMonitoringSloService.test.ts',
    markers: [
      'createSavenMonitoringSloReport',
      'breaches when robot or emergency gates disappear',
    ],
  },
  {
    label: 'Monitoring SLO docs',
    file: 'docs/SAVEN_MONITORING_SLO_KIT.md',
    markers: [
      'SAVEN Monitoring SLO Kit',
      'Robot gate',
      'Emergency gate',
      'npm run monitoring:saven',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['monitoring:saven'] !== 'node scripts/saven-monitoring-slo-audit.mjs') {
  throw new Error('package.json is missing monitoring:saven script.');
}
console.log('[monitoring] ok package monitoring:saven script');

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN monitoring artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN monitoring marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[monitoring] ok ${check.label}`);
}

console.log('SAVEN monitoring SLO audit passed.');
