import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['operator-brief:saven'] !== 'node scripts/saven-release-operator-brief-audit.mjs') {
  throw new Error('package.json is missing operator-brief:saven script.');
}
console.log('[operator-brief] ok package operator-brief:saven script');

const requiredScripts = [
  'evidence-index:saven',
  'production-release:saven',
  'launch-record:saven',
  'go-no-go:saven',
  'prod-env:saven',
  'prod-smoke:saven',
  'ready:saven',
  'ship:saven',
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[operator-brief] ok package ${script} script`);
}

const checks = [
  {
    label: 'Release operator brief',
    file: 'docs/SAVEN_RELEASE_OPERATOR_BRIEF.md',
    markers: [
      'SAVEN Release Operator Brief',
      'Current Decision',
      'What Is Ready',
      'What Still Holds Production',
      'Next Human Actions',
      'Non-Negotiable Safety Position',
      'Short Handoff',
    ],
  },
  {
    label: 'Production evidence index',
    file: 'docs/SAVEN_PRODUCTION_EVIDENCE_INDEX.md',
    markers: ['SAVEN Production Evidence Index', 'Current Release Posture', 'Evidence Map', 'Production Holds'],
  },
  {
    label: 'Production launch record',
    file: 'docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md',
    markers: ['SAVEN Production Launch Record', 'Launch Identity', 'Backend Record', 'Safety Sign-Off'],
  },
  {
    label: 'Production release orchestrator',
    file: 'docs/SAVEN_PRODUCTION_RELEASE_ORCHESTRATOR.md',
    markers: ['SAVEN Production Release Orchestrator', 'Release Sequence', 'Final Human Decision'],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN operator brief artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN operator brief marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[operator-brief] ok ${check.label}`);
}

console.log('SAVEN release operator brief audit passed.');
