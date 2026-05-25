import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    label: 'Live privacy redaction package',
    file: 'docs/SAVEN_LIVE_PRIVACY_REDACTION.md',
    markers: [
      'SAVEN Live Privacy Redaction Package',
      'Live Privacy Model',
      'Live Review Holds',
    ],
  },
  {
    label: 'Production dispatch lock package',
    file: 'docs/SAVEN_PRODUCTION_DISPATCH_LOCK.md',
    markers: [
      'SAVEN Production Dispatch Lock Package',
      'Dispatch Lock Model',
      'Activation Holds',
    ],
  },
  {
    label: 'Robot emergency safety gate',
    file: 'docs/SAVEN_ROBOT_EMERGENCY_SAFETY_GATE.md',
    markers: [
      'SAVEN Robot Emergency Safety Gate',
      'Robot Boundary',
      'Emergency Boundary',
      'Production Holds',
    ],
  },
  {
    label: 'Release candidate freeze package',
    file: 'docs/SAVEN_RELEASE_CANDIDATE_FREEZE.md',
    markers: [
      'SAVEN Release Candidate Freeze Package',
      'Freeze State',
      'Human Decision',
    ],
  },
  {
    label: 'Production values intake package',
    file: 'docs/SAVEN_PRODUCTION_VALUES_INTAKE.md',
    markers: [
      'SAVEN Production Values Intake Package',
      'Intake Model',
      'Strict GO Mode',
    ],
  },
  {
    label: 'GO decision dry run package',
    file: 'docs/SAVEN_GO_DECISION_DRY_RUN.md',
    markers: [
      'SAVEN GO Decision Dry Run Package',
      'Strict Mode',
      'GO Dry Run Result',
    ],
  },
  {
    label: 'Final operator packet',
    file: 'docs/SAVEN_FINAL_OPERATOR_PACKET.md',
    markers: [
      'SAVEN Final Operator Packet',
      'One-Pass RC Check',
      'Strict GO Rehearsal',
    ],
  },
  {
    label: 'Launch room runbook',
    file: 'docs/SAVEN_LAUNCH_ROOM_RUNBOOK.md',
    markers: [
      'SAVEN Launch Room Runbook',
      'T-24 Hours',
      'Rollback Trigger',
    ],
  },
  {
    label: 'Release env example',
    file: '.env.saven.example',
    markers: [
      'VITE_SAVEN_BACKEND_MODE=local',
      'SAVEN_DEPLOY_TARGET=production',
      'VITE_SAVEN_BACKEND_MODE=edge',
      'VITE_SAVEN_EDGE_FUNCTION_URL',
    ],
  },
  {
    label: 'Release handoff doc',
    file: 'docs/SAVEN_RELEASE_HANDOFF.md',
    markers: [
      'SAVEN Release Handoff',
      'npm run ready:saven',
      'npm run release:saven',
      'Admin And Monitoring Checklist',
      'Safety Gates',
    ],
  },
  {
    label: 'Full readiness includes release readiness',
    file: 'scripts/saven-full-readiness.mjs',
    markers: [
      'Release readiness',
      "['run', 'release:saven']",
    ],
  },
  {
    label: 'Deploy readiness still present',
    file: 'scripts/saven-deploy-readiness-audit.mjs',
    markers: [
      'Deploy readiness',
      'VITE_SAVEN_BACKEND_MODE',
    ],
  },
  {
    label: 'Production QA still present',
    file: 'scripts/saven-production-qa-audit.mjs',
    markers: [
      'Production QA',
      'SAVEN',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['preview:saven:auto'] !== 'node scripts/saven-production-preview-smoke.mjs') {
  throw new Error('package.json is missing preview:saven:auto script.');
}
console.log('[release] ok package preview:saven:auto script');

if (packageJson.scripts?.['ship:saven'] !== 'npm run ready:saven && npm run preview:saven:auto') {
  throw new Error('package.json is missing ship:saven script.');
}
console.log('[release] ok package ship:saven script');

if (packageJson.scripts?.['visual:saven'] !== 'node scripts/saven-visual-acceptance-audit.mjs') {
  throw new Error('package.json is missing visual:saven script.');
}
console.log('[release] ok package visual:saven script');

if (packageJson.scripts?.['commands:saven'] !== 'node scripts/saven-command-contract-audit.mjs') {
  throw new Error('package.json is missing commands:saven script.');
}
console.log('[release] ok package commands:saven script');

if (packageJson.scripts?.['db:saven'] !== 'node scripts/saven-supabase-migration-audit.mjs') {
  throw new Error('package.json is missing db:saven script.');
}
console.log('[release] ok package db:saven script');

if (packageJson.scripts?.['edge:saven'] !== 'node scripts/saven-edge-function-audit.mjs') {
  throw new Error('package.json is missing edge:saven script.');
}
console.log('[release] ok package edge:saven script');

if (packageJson.scripts?.['monitoring:saven'] !== 'node scripts/saven-monitoring-slo-audit.mjs') {
  throw new Error('package.json is missing monitoring:saven script.');
}
console.log('[release] ok package monitoring:saven script');

if (packageJson.scripts?.['admin:saven'] !== 'node scripts/saven-admin-ops-audit.mjs') {
  throw new Error('package.json is missing admin:saven script.');
}
console.log('[release] ok package admin:saven script');

if (packageJson.scripts?.['alerts:saven'] !== 'node scripts/saven-alerting-audit.mjs') {
  throw new Error('package.json is missing alerts:saven script.');
}
console.log('[release] ok package alerts:saven script');

if (packageJson.scripts?.['admin-alerts:saven'] !== 'node scripts/saven-admin-alerts-audit.mjs') {
  throw new Error('package.json is missing admin-alerts:saven script.');
}
console.log('[release] ok package admin-alerts:saven script');

if (packageJson.scripts?.['privacy:saven'] !== 'node scripts/saven-privacy-guardrails-audit.mjs') {
  throw new Error('package.json is missing privacy:saven script.');
}
console.log('[release] ok package privacy:saven script');

if (packageJson.scripts?.['workers:saven'] !== 'node scripts/saven-worker-handoff-audit.mjs') {
  throw new Error('package.json is missing workers:saven script.');
}
console.log('[release] ok package workers:saven script');

if (packageJson.scripts?.['admin-workers:saven'] !== 'node scripts/saven-admin-worker-shift-audit.mjs') {
  throw new Error('package.json is missing admin-workers:saven script.');
}
console.log('[release] ok package admin-workers:saven script');

if (packageJson.scripts?.['evidence:saven'] !== 'node scripts/saven-ops-evidence-audit.mjs') {
  throw new Error('package.json is missing evidence:saven script.');
}
console.log('[release] ok package evidence:saven script');

if (packageJson.scripts?.['admin-evidence:saven'] !== 'node scripts/saven-admin-evidence-audit.mjs') {
  throw new Error('package.json is missing admin-evidence:saven script.');
}
console.log('[release] ok package admin-evidence:saven script');

if (packageJson.scripts?.['launch:saven'] !== 'node scripts/saven-launch-control-audit.mjs') {
  throw new Error('package.json is missing launch:saven script.');
}
console.log('[release] ok package launch:saven script');

if (packageJson.scripts?.['admin-launch:saven'] !== 'node scripts/saven-admin-launch-audit.mjs') {
  throw new Error('package.json is missing admin-launch:saven script.');
}
console.log('[release] ok package admin-launch:saven script');

if (packageJson.scripts?.['manifest:saven'] !== 'node scripts/saven-final-ship-manifest-audit.mjs') {
  throw new Error('package.json is missing manifest:saven script.');
}
console.log('[release] ok package manifest:saven script');

if (packageJson.scripts?.['rc:saven'] !== 'node scripts/saven-release-candidate-audit.mjs') {
  throw new Error('package.json is missing rc:saven script.');
}
console.log('[release] ok package rc:saven script');

if (packageJson.scripts?.['github-release:saven'] !== 'node scripts/saven-github-release-audit.mjs') {
  throw new Error('package.json is missing github-release:saven script.');
}
console.log('[release] ok package github-release:saven script');

if (packageJson.scripts?.['postlaunch:saven'] !== 'node scripts/saven-post-launch-ops-audit.mjs') {
  throw new Error('package.json is missing postlaunch:saven script.');
}
console.log('[release] ok package postlaunch:saven script');

if (packageJson.scripts?.['hosting:saven'] !== 'node scripts/saven-hosting-deployment-audit.mjs') {
  throw new Error('package.json is missing hosting:saven script.');
}
console.log('[release] ok package hosting:saven script');

if (packageJson.scripts?.['rollback:saven'] !== 'node scripts/saven-rollback-drill-audit.mjs') {
  throw new Error('package.json is missing rollback:saven script.');
}
console.log('[release] ok package rollback:saven script');

if (packageJson.scripts?.['prod-env:saven'] !== 'node scripts/saven-production-env-gate.mjs') {
  throw new Error('package.json is missing prod-env:saven script.');
}
console.log('[release] ok package prod-env:saven script');

if (packageJson.scripts?.['tag:saven'] !== 'node scripts/saven-final-release-tag-gate.mjs') {
  throw new Error('package.json is missing tag:saven script.');
}
console.log('[release] ok package tag:saven script');

if (packageJson.scripts?.['prod-smoke:saven'] !== 'node scripts/saven-production-url-smoke-gate.mjs') {
  throw new Error('package.json is missing prod-smoke:saven script.');
}
console.log('[release] ok package prod-smoke:saven script');

if (packageJson.scripts?.['admin-deploy:saven'] !== 'node scripts/saven-admin-deploy-checklist-audit.mjs') {
  throw new Error('package.json is missing admin-deploy:saven script.');
}
console.log('[release] ok package admin-deploy:saven script');

if (packageJson.scripts?.['go-no-go:saven'] !== 'node scripts/saven-production-go-no-go-audit.mjs') {
  throw new Error('package.json is missing go-no-go:saven script.');
}
console.log('[release] ok package go-no-go:saven script');

if (packageJson.scripts?.['launch-record:saven'] !== 'node scripts/saven-production-launch-record-audit.mjs') {
  throw new Error('package.json is missing launch-record:saven script.');
}
console.log('[release] ok package launch-record:saven script');

if (packageJson.scripts?.['production-release:saven'] !== 'node scripts/saven-production-release-orchestrator.mjs') {
  throw new Error('package.json is missing production-release:saven script.');
}
console.log('[release] ok package production-release:saven script');

if (packageJson.scripts?.['evidence-index:saven'] !== 'node scripts/saven-production-evidence-index-audit.mjs') {
  throw new Error('package.json is missing evidence-index:saven script.');
}
console.log('[release] ok package evidence-index:saven script');

if (packageJson.scripts?.['operator-brief:saven'] !== 'node scripts/saven-release-operator-brief-audit.mjs') {
  throw new Error('package.json is missing operator-brief:saven script.');
}
console.log('[release] ok package operator-brief:saven script');

if (packageJson.scripts?.['rc-tag:saven'] !== 'node scripts/saven-rc-tag-command-audit.mjs') {
  throw new Error('package.json is missing rc-tag:saven script.');
}
console.log('[release] ok package rc-tag:saven script');

if (packageJson.scripts?.['cutover:saven'] !== 'node scripts/saven-production-cutover-checklist-audit.mjs') {
  throw new Error('package.json is missing cutover:saven script.');
}
console.log('[release] ok package cutover:saven script');

if (packageJson.scripts?.['live-backend:saven'] !== 'node scripts/saven-live-backend-activation-audit.mjs') {
  throw new Error('package.json is missing live-backend:saven script.');
}
console.log('[release] ok package live-backend:saven script');

if (packageJson.scripts?.['live-monitoring:saven'] !== 'node scripts/saven-live-monitoring-activation-audit.mjs') {
  throw new Error('package.json is missing live-monitoring:saven script.');
}
console.log('[release] ok package live-monitoring:saven script');

if (packageJson.scripts?.['admin-access:saven'] !== 'node scripts/saven-production-admin-access-audit.mjs') {
  throw new Error('package.json is missing admin-access:saven script.');
}
console.log('[release] ok package admin-access:saven script');

if (packageJson.scripts?.['privacy-live:saven'] !== 'node scripts/saven-live-privacy-redaction-audit.mjs') {
  throw new Error('package.json is missing privacy-live:saven script.');
}
console.log('[release] ok package privacy-live:saven script');

if (packageJson.scripts?.['dispatch-lock:saven'] !== 'node scripts/saven-production-dispatch-lock-audit.mjs') {
  throw new Error('package.json is missing dispatch-lock:saven script.');
}
console.log('[release] ok package dispatch-lock:saven script');

if (packageJson.scripts?.['robot-emergency:saven'] !== 'node scripts/saven-robot-emergency-safety-gate-audit.mjs') {
  throw new Error('package.json is missing robot-emergency:saven script.');
}
console.log('[release] ok package robot-emergency:saven script');

if (packageJson.scripts?.['rc-freeze:saven'] !== 'node scripts/saven-release-candidate-freeze-audit.mjs') {
  throw new Error('package.json is missing rc-freeze:saven script.');
}
console.log('[release] ok package rc-freeze:saven script');

if (packageJson.scripts?.['production-values:saven'] !== 'node scripts/saven-production-values-intake-audit.mjs') {
  throw new Error('package.json is missing production-values:saven script.');
}
console.log('[release] ok package production-values:saven script');

if (packageJson.scripts?.['go-dry-run:saven'] !== 'node scripts/saven-go-decision-dry-run-audit.mjs') {
  throw new Error('package.json is missing go-dry-run:saven script.');
}
console.log('[release] ok package go-dry-run:saven script');

if (packageJson.scripts?.['final-operator:saven'] !== 'node scripts/saven-final-operator-packet-audit.mjs') {
  throw new Error('package.json is missing final-operator:saven script.');
}
console.log('[release] ok package final-operator:saven script');

if (packageJson.scripts?.['launch-room:saven'] !== 'node scripts/saven-launch-room-runbook-audit.mjs') {
  throw new Error('package.json is missing launch-room:saven script.');
}
console.log('[release] ok package launch-room:saven script');

if (packageJson.scripts?.['release:saven'] !== 'node scripts/saven-release-readiness-audit.mjs') {
  throw new Error('package.json is missing release:saven script.');
}
console.log('[release] ok package release:saven script');

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing release file: ${check.file}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing release marker in ${check.file}: ${marker}`);
    }
  }
  console.log(`[release] ok ${check.label}`);
}

console.log('SAVEN release readiness audit passed.');
