import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const strict = process.env.SAVEN_STRICT_GO === '1';

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['go-dry-run:saven'] !== 'node scripts/saven-go-decision-dry-run-audit.mjs') {
  throw new Error('package.json is missing go-dry-run:saven script.');
}
console.log('[go-dry-run] ok package go-dry-run:saven script');

const requiredScripts = [
  'production-values:saven',
  'rc-freeze:saven',
  'robot-emergency:saven',
  'dispatch-lock:saven',
  'privacy-live:saven',
  'admin-access:saven',
  'live-backend:saven',
  'live-monitoring:saven',
  'production-release:saven',
  'launch-record:saven',
  'go-no-go:saven',
  'cutover:saven',
  'prod-smoke:saven',
  'rc-tag:saven',
  'ready:saven',
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[go-dry-run] ok package ${script} script`);
}

const checks = [
  {
    label: 'GO decision dry run package',
    file: 'docs/SAVEN_GO_DECISION_DRY_RUN.md',
    markers: [
      'SAVEN GO Decision Dry Run Package',
      'Decision Dry Run Model',
      'Normal Mode',
      'Strict Mode',
      'GO Dry Run Result',
      'Holds',
    ],
  },
  {
    label: 'Production values intake',
    file: 'docs/SAVEN_PRODUCTION_VALUES_INTAKE.md',
    markers: ['SAVEN Production Values Intake Package', 'Strict GO Mode', 'Production Holds'],
  },
  {
    label: 'Release candidate freeze',
    file: 'docs/SAVEN_RELEASE_CANDIDATE_FREEZE.md',
    markers: ['SAVEN Release Candidate Freeze Package', 'Strict RC Tag', 'Human Decision'],
  },
  {
    label: 'Launch record',
    file: 'docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md',
    markers: [
      'Production URL',
      'Launch decision',
      'Decision owner',
      'Production Values Intake',
      'GO Decision Dry Run',
    ],
  },
  {
    label: 'Go no-go package',
    file: 'docs/SAVEN_PRODUCTION_GO_NO_GO.md',
    markers: ['GO', 'HOLD', 'RC ONLY', 'GO Decision Dry Run'],
  },
  {
    label: 'Release handoff',
    file: 'docs/SAVEN_RELEASE_HANDOFF.md',
    markers: ['GO Decision Dry Run', 'go-dry-run:saven', 'SAVEN_STRICT_GO=1'],
  },
  {
    label: 'Cutover checklist',
    file: 'docs/SAVEN_PRODUCTION_CUTOVER_CHECKLIST.md',
    markers: ['GO Decision Dry Run', 'go-dry-run:saven', 'SAVEN_STRICT_GO=1'],
  },
  {
    label: 'Evidence index',
    file: 'docs/SAVEN_PRODUCTION_EVIDENCE_INDEX.md',
    markers: ['GO Decision Dry Run', 'go-dry-run:saven', 'RC-ready package'],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN GO dry run artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN GO dry run marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[go-dry-run] ok ${check.label}`);
}

const launchRecord = fs.readFileSync(path.join(root, 'docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md'), 'utf8');
const blockers = ['pending', 'TBD', 'RC ONLY'];
const presentBlockers = blockers.filter((blocker) => launchRecord.includes(blocker));

if (strict && presentBlockers.length) {
  throw new Error('Strict GO dry run failed. Launch record still contains: ' + presentBlockers.join(', '));
}

if (presentBlockers.length) {
  console.log('[go-dry-run] RC-only result: launch record still contains ' + presentBlockers.join(', '));
} else {
  console.log('[go-dry-run] strict-ready result: launch record has no pending/TBD/RC ONLY markers');
}

console.log('SAVEN GO decision dry run audit passed.');
