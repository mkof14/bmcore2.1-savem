import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['final-operator:saven'] !== 'node scripts/saven-final-operator-packet-audit.mjs') {
  throw new Error('package.json is missing final-operator:saven script.');
}
console.log('[final-operator] ok package final-operator:saven script');

const requiredScripts = [
  'go-dry-run:saven',
  'production-values:saven',
  'rc-freeze:saven',
  'robot-emergency:saven',
  'dispatch-lock:saven',
  'privacy-live:saven',
  'admin-access:saven',
  'production-release:saven',
  'ready:saven',
  'prod-smoke:saven',
  'rc-tag:saven',
  'rollback:saven',
  'postlaunch:saven',
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[final-operator] ok package ${script} script`);
}

const checks = [
  {
    label: 'Final operator packet',
    file: 'docs/SAVEN_FINAL_OPERATOR_PACKET.md',
    markers: [
      'SAVEN Final Operator Packet',
      'Current Default',
      'One-Pass RC Check',
      'Strict GO Rehearsal',
      'Operator Decision',
      'Final Safety Reminder',
      'Operator Checklist',
    ],
  },
  {
    label: 'GO decision dry run',
    file: 'docs/SAVEN_GO_DECISION_DRY_RUN.md',
    markers: ['SAVEN GO Decision Dry Run Package', 'Strict Mode', 'GO Dry Run Result'],
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
    markers: ['Production URL', 'Launch decision', 'Final Operator Packet', 'final-operator:saven'],
  },
  {
    label: 'Release handoff',
    file: 'docs/SAVEN_RELEASE_HANDOFF.md',
    markers: ['Final Operator Packet', 'final-operator:saven', 'SAVEN_STRICT_GO=1'],
  },
  {
    label: 'Operator brief',
    file: 'docs/SAVEN_RELEASE_OPERATOR_BRIEF.md',
    markers: ['Final Operator Packet', 'final-operator:saven', 'RC ONLY'],
  },
  {
    label: 'Evidence index',
    file: 'docs/SAVEN_PRODUCTION_EVIDENCE_INDEX.md',
    markers: ['Final Operator Packet', 'final-operator:saven', 'RC-ready package'],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN final operator artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN final operator marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[final-operator] ok ${check.label}`);
}

console.log('SAVEN final operator packet audit passed.');
