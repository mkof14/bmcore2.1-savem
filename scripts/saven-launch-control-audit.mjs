import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    label: 'Launch control service',
    file: 'src/features/saven/services/savenLaunchControlService.ts',
    markers: [
      'createSavenLaunchControlReport',
      'saven-launch-control-report',
      'ops-evidence',
      'command-worker-loop',
      'privacy-safety',
      'production-preview',
    ],
  },
  {
    label: 'Launch control tests',
    file: 'src/features/saven/services/__tests__/savenLaunchControlService.test.ts',
    markers: [
      'createSavenLaunchControlReport',
      'production preview',
      'operator next actions',
    ],
  },
  {
    label: 'Launch control docs',
    file: 'docs/SAVEN_LAUNCH_CONTROL_KIT.md',
    markers: [
      'SAVEN Launch Control Kit',
      'Launch Gates',
      'go',
      'hold',
      'npm run launch:saven',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['launch:saven'] !== 'node scripts/saven-launch-control-audit.mjs') {
  throw new Error('package.json is missing launch:saven script.');
}
console.log('[launch] ok package launch:saven script');

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN launch artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN launch marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[launch] ok ${check.label}`);
}

console.log('SAVEN launch control audit passed.');
