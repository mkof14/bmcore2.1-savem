import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const strict = process.env.SAVEN_STRICT_PRODUCTION_VALUES === '1';

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['production-values:saven'] !== 'node scripts/saven-production-values-intake-audit.mjs') {
  throw new Error('package.json is missing production-values:saven script.');
}
console.log('[production-values] ok package production-values:saven script');

const requiredScripts = [
  'rc-freeze:saven',
  'robot-emergency:saven',
  'dispatch-lock:saven',
  'privacy-live:saven',
  'admin-access:saven',
  'live-backend:saven',
  'live-monitoring:saven',
  'production-release:saven',
  'ready:saven',
  'launch-record:saven',
  'go-no-go:saven',
  'cutover:saven',
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[production-values] ok package ${script} script`);
}

const checks = [
  {
    label: 'Production values intake package',
    file: 'docs/SAVEN_PRODUCTION_VALUES_INTAKE.md',
    markers: [
      'SAVEN Production Values Intake Package',
      'Intake Model',
      'RC-Safe Mode',
      'Strict GO Mode',
      'Required Values Table',
      'Production Holds',
    ],
  },
  {
    label: 'Launch record intake fields',
    file: 'docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md',
    markers: [
      'Production URL',
      'Launch decision',
      'Decision owner',
      'Admin Ops reviewer',
      'Backend owner',
      'Rollback owner',
      'First-hour watch owner',
      'Supabase project',
      'Admin access owner',
      'Privacy reviewer',
      'Dispatch lock reviewer',
      'Robot/emergency safety reviewer',
      'Freeze reviewer',
      'Production Values Intake',
    ],
  },
  {
    label: 'Release candidate freeze package',
    file: 'docs/SAVEN_RELEASE_CANDIDATE_FREEZE.md',
    markers: ['SAVEN Release Candidate Freeze Package', 'Freeze State', 'Strict RC Tag'],
  },
  {
    label: 'Release handoff values section',
    file: 'docs/SAVEN_RELEASE_HANDOFF.md',
    markers: ['Production Values Intake', 'production-values:saven', 'SAVEN_STRICT_PRODUCTION_VALUES=1'],
  },
  {
    label: 'Cutover values section',
    file: 'docs/SAVEN_PRODUCTION_CUTOVER_CHECKLIST.md',
    markers: ['Production Values Intake', 'production-values:saven', 'SAVEN_STRICT_PRODUCTION_VALUES=1'],
  },
  {
    label: 'Evidence index values section',
    file: 'docs/SAVEN_PRODUCTION_EVIDENCE_INDEX.md',
    markers: ['Production Values Intake', 'production-values:saven', 'RC-ready package'],
  },
  {
    label: 'Go no-go values section',
    file: 'docs/SAVEN_PRODUCTION_GO_NO_GO.md',
    markers: ['Production Values Intake', 'GO', 'HOLD', 'RC ONLY'],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN production values artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN production values marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[production-values] ok ${check.label}`);
}

if (strict) {
  const launchRecord = fs.readFileSync(path.join(root, 'docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md'), 'utf8');
  const blockers = ['pending', 'TBD', 'RC ONLY'];
  for (const blocker of blockers) {
    if (launchRecord.includes(blocker)) {
      throw new Error(`Strict production values mode failed: launch record still contains ${blocker}.`);
    }
  }
  console.log('[production-values] ok strict production values mode');
} else {
  console.log('[production-values] RC-safe mode: pending/TBD/RC ONLY values are allowed until final GO.');
}

console.log('SAVEN production values intake audit passed.');
