import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['rc-freeze:saven'] !== 'node scripts/saven-release-candidate-freeze-audit.mjs') {
  throw new Error('package.json is missing rc-freeze:saven script.');
}
console.log('[rc-freeze] ok package rc-freeze:saven script');

const requiredScripts = [
  'production-release:saven',
  'ready:saven',
  'release:saven',
  'rc-tag:saven',
  'go-no-go:saven',
  'launch-record:saven',
  'cutover:saven',
  'live-backend:saven',
  'live-monitoring:saven',
  'admin-access:saven',
  'privacy-live:saven',
  'dispatch-lock:saven',
  'robot-emergency:saven',
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[rc-freeze] ok package ${script} script`);
}

const checks = [
  {
    label: 'Release candidate freeze package',
    file: 'docs/SAVEN_RELEASE_CANDIDATE_FREEZE.md',
    markers: [
      'SAVEN Release Candidate Freeze Package',
      'Freeze State',
      'Change Rules After Freeze',
      'Final RC Commands',
      'Freeze Holds',
      'Human Decision',
    ],
  },
  {
    label: 'Production release orchestrator',
    file: 'docs/SAVEN_PRODUCTION_RELEASE_ORCHESTRATOR.md',
    markers: ['SAVEN Production Release Orchestrator', 'Release Sequence', 'Final Human Decision'],
  },
  {
    label: 'Launch record',
    file: 'docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md',
    markers: ['SAVEN Production Launch Record', '| Launch decision | RC ONLY |', 'Release Candidate Freeze', 'rc-freeze:saven'],
  },
  {
    label: 'Operator brief',
    file: 'docs/SAVEN_RELEASE_OPERATOR_BRIEF.md',
    markers: ['SAVEN Release Operator Brief', '**Decision:** RC ONLY', 'Release Candidate Freeze', 'rc-freeze:saven'],
  },
  {
    label: 'Release handoff',
    file: 'docs/SAVEN_RELEASE_HANDOFF.md',
    markers: ['SAVEN Release Handoff', 'Release Candidate Freeze', 'rc-freeze:saven'],
  },
  {
    label: 'Production evidence index',
    file: 'docs/SAVEN_PRODUCTION_EVIDENCE_INDEX.md',
    markers: ['SAVEN production readiness', 'RC-ready package', 'Release Candidate Freeze'],
  },
  {
    label: 'Robot emergency safety gate',
    file: 'docs/SAVEN_ROBOT_EMERGENCY_SAFETY_GATE.md',
    markers: ['SAVEN Robot Emergency Safety Gate', 'Robot Boundary', 'Emergency Boundary'],
  },
  {
    label: 'Production dispatch lock',
    file: 'docs/SAVEN_PRODUCTION_DISPATCH_LOCK.md',
    markers: ['SAVEN Production Dispatch Lock Package', 'Locked Behavior', 'Activation Holds'],
  },
  {
    label: 'Live privacy redaction',
    file: 'docs/SAVEN_LIVE_PRIVACY_REDACTION.md',
    markers: ['SAVEN Live Privacy Redaction Package', 'Live Review Holds'],
  },
  {
    label: 'Production admin access',
    file: 'docs/SAVEN_PRODUCTION_ADMIN_ACCESS.md',
    markers: ['SAVEN Production Admin Access Package', 'Production Access Holds'],
  },
  {
    label: 'RC tag command package',
    file: 'docs/SAVEN_RC_TAG_COMMANDS.md',
    markers: ['SAVEN RC Tag Command Package', 'SAVEN_STRICT_TAG=1 npm run rc-tag:saven', 'Tag Holds'],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN RC freeze artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN RC freeze marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[rc-freeze] ok ${check.label}`);
}

console.log('SAVEN release candidate freeze audit passed.');
