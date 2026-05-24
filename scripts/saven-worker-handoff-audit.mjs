import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    label: 'Worker handoff service',
    file: 'src/features/saven/services/savenWorkerHandoffService.ts',
    markers: [
      'savenWorkerEndpoints',
      'createSavenWorkerHandoffPacket',
      'createSavenWorkerShiftBoard',
      'physical_action_without_approval',
      'automatic_external_dispatch',
      'Nurse follow-up queue',
    ],
  },
  {
    label: 'Worker handoff tests',
    file: 'src/features/saven/services/__tests__/savenWorkerHandoffService.test.ts',
    markers: [
      'savenWorkerHandoffService',
      'routes nurse voice command',
      'keeps robot handoff locked',
      'blocks automatic emergency dispatch',
    ],
  },
  {
    label: 'Worker handoff docs',
    file: 'docs/SAVEN_WORKER_HANDOFF_KIT.md',
    markers: [
      'SAVEN Worker Handoff Kit',
      'Worker Endpoints',
      'Confirmation Rules',
      'npm run workers:saven',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['workers:saven'] !== 'node scripts/saven-worker-handoff-audit.mjs') {
  throw new Error('package.json is missing workers:saven script.');
}
console.log('[workers] ok package workers:saven script');

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN worker artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN worker marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[workers] ok ${check.label}`);
}

console.log('SAVEN worker handoff audit passed.');
