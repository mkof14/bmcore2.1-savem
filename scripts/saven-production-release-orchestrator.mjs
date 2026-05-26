import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (packageJson.scripts?.['production-release:saven'] !== 'node scripts/saven-production-release-orchestrator.mjs') {
  throw new Error('package.json is missing production-release:saven script.');
}
console.log('[production-release] ok package production-release:saven script');

const requiredScripts = [
  'ready:saven',
  'ship:saven',
  'release:saven',
  'github-release:saven',
  'hosting:saven',
  'postlaunch:saven',
  'rollback:saven',
  'prod-env:saven',
  'tag:saven',
  'prod-smoke:saven',
  'admin-deploy:saven',
  'go-no-go:saven',
  'launch-record:saven',
  'admin-access:saven',
  'privacy-live:saven',
  'dispatch-lock:saven',
  'robot-emergency:saven',
  'rc-freeze:saven',
  'production-values:saven',
  'go-dry-run:saven',
  'final-operator:saven',
  'launch-room:saven',
  'incident-drill:saven',
  'rollback-proof:saven',
  'operator-evidence:saven',
  'live-watch:saven',
  'signoff:saven',
  'final-seal:saven',
  'clean-release:saven',
  'go-handoff:saven',
  'production-go:saven',
  'values-ready:saven',
  'release-lock:saven',
  'strict-go:saven',
  'rc-proof:saven',
  'handoff-final:saven',
  'next-phase:saven',
  'values-worksheet:saven',
  'values-gap:saven',
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[production-release] ok package ${script} script`);
}

const checks = [
  {
    label: 'Production release orchestrator',
    file: 'docs/SAVEN_PRODUCTION_RELEASE_ORCHESTRATOR.md',
    markers: [
      'SAVEN Production Release Orchestrator',
      'Release Sequence',
      'What The Orchestrator Proves',
      'Strict Production Mode',
      'Final Human Decision',
    ],
  },
  {
    label: 'Release handoff',
    file: 'docs/SAVEN_RELEASE_HANDOFF.md',
    markers: [
      'SAVEN Release Handoff',
      'Production Launch Record',
      'Production Go / No-Go Package',
      'BioMath Admin Deploy Checklist',
      'Production URL Smoke Gate',
    ],
  },
  {
    label: 'GitHub release notes',
    file: 'docs/SAVEN_GITHUB_RELEASE_NOTES.md',
    markers: [
      'SAVEN GitHub Release Notes',
      'Production Launch Record',
      'Production Go / No-Go Package',
      'BioMath Admin Deploy Checklist',
      'Production URL Smoke Gate',
    ],
  },
  {
    label: 'Launch record',
    file: 'docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md',
    markers: [
      'SAVEN Production Launch Record',
      'Launch Identity',
      'Backend Record',
      'Safety Sign-Off',
    ],
  },
  {
    label: 'Go no-go gate',
    file: 'docs/SAVEN_PRODUCTION_GO_NO_GO.md',
    markers: [
      'SAVEN Production Go / No-Go Package',
      'GO',
      'HOLD',
      'RC ONLY',
    ],
  },
  {
    label: 'Admin deploy checklist',
    file: 'docs/SAVEN_BIOMATH_ADMIN_DEPLOY_CHECKLIST.md',
    markers: [
      'SAVEN BioMath Admin Deploy Checklist',
      'Admin Surface Contract',
      'Admin Hold Rules',
    ],
  },
  {
    label: 'Production env gate',
    file: 'docs/SAVEN_PRODUCTION_ENV_GATE.md',
    markers: [
      'SAVEN Production Environment Gate',
      'Production Hold Rules',
    ],
  },
  {
    label: 'Production URL smoke gate',
    file: 'docs/SAVEN_PRODUCTION_URL_SMOKE_GATE.md',
    markers: [
      'SAVEN Production URL Smoke Gate',
      'Live URL Mode',
      'Hold Rules',
    ],
  },
  {
    label: 'Rollback drill',
    file: 'docs/SAVEN_ROLLBACK_DRILL.md',
    markers: [
      'SAVEN Rollback Drill Package',
      'Recovery Proof',
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
    label: 'Final operator packet',
    file: 'docs/SAVEN_FINAL_OPERATOR_PACKET.md',
    markers: [
      'SAVEN Final Operator Packet',
      'One-Pass RC Check',
      'Strict GO Rehearsal',
    ],
  },
  {
    label: 'GO decision dry run',
    file: 'docs/SAVEN_GO_DECISION_DRY_RUN.md',
    markers: [
      'SAVEN GO Decision Dry Run Package',
      'Strict Mode',
      'GO Dry Run Result',
    ],
  },
  {
    label: 'Production values intake',
    file: 'docs/SAVEN_PRODUCTION_VALUES_INTAKE.md',
    markers: [
      'SAVEN Production Values Intake Package',
      'Intake Model',
      'Strict GO Mode',
    ],
  },
  {
    label: 'Release candidate freeze',
    file: 'docs/SAVEN_RELEASE_CANDIDATE_FREEZE.md',
    markers: [
      'SAVEN Release Candidate Freeze Package',
      'Freeze State',
      'Human Decision',
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
    label: 'Production dispatch lock',
    file: 'docs/SAVEN_PRODUCTION_DISPATCH_LOCK.md',
    markers: [
      'SAVEN Production Dispatch Lock Package',
      'Dispatch Lock Model',
      'Activation Holds',
    ],
  },
  {
    label: 'Live privacy redaction',
    file: 'docs/SAVEN_LIVE_PRIVACY_REDACTION.md',
    markers: [
      'SAVEN Live Privacy Redaction Package',
      'Live Privacy Model',
      'Live Review Holds',
    ],
  },
  {
    label: 'Production admin access',
    file: 'docs/SAVEN_PRODUCTION_ADMIN_ACCESS.md',
    markers: [
      'SAVEN Production Admin Access Package',
      'Admin Access Model',
      'Production Access Holds',
    ],
  },
  {
    label: 'Post-launch incident drill',
    file: 'docs/SAVEN_POSTLAUNCH_INCIDENT_DRILL.md',
    markers: [
      'SAVEN Post-Launch Incident Drill',
      'Drill Scenario',
      'Hold Conditions',
    ],
  },
  {
    label: 'Rollback proof package',
    file: 'docs/SAVEN_ROLLBACK_PROOF.md',
    markers: [
      'SAVEN Rollback Proof Package',
      'Rollback Proof Model',
      'Proof Sequence',
    ],
  },
  {
    label: 'Operator evidence package',
    file: 'docs/SAVEN_OPERATOR_EVIDENCE.md',
    markers: [
      'SAVEN Operator Evidence Package',
      'Evidence Model',
      'Decision Language',
    ],
  },
  {
    label: 'Live watch checklist',
    file: 'docs/SAVEN_LIVE_WATCH_CHECKLIST.md',
    markers: [
      'SAVEN Live Watch Checklist',
      'Live Watch Signals',
      'Hold Signals',
    ],
  },
  {
    label: 'Operator sign-off',
    file: 'docs/SAVEN_OPERATOR_SIGNOFF.md',
    markers: [
      'SAVEN Operator Sign-Off',
      'Sign-Off Owners',
      'Sign-Off Rule',
    ],
  },
  {
    label: 'Final seal',
    file: 'docs/SAVEN_FINAL_SEAL.md',
    markers: [
      'SAVEN Final Seal',
      'Final Seal Model',
      'Final Seal Holds',
    ],
  },
  {
    label: 'Clean release pass',
    file: 'docs/SAVEN_CLEAN_RELEASE_PASS.md',
    markers: [
      'SAVEN Clean Release Pass',
      'Clean Pass Model',
      'Clean Pass Holds',
    ],
  },
  {
    label: 'Production GO handoff',
    file: 'docs/SAVEN_PRODUCTION_GO_HANDOFF.md',
    markers: [
      'SAVEN Production GO Handoff',
      'GO Handoff Inputs',
      'GO Handoff Rule',
    ],
  },
  {
    label: 'Production GO decision',
    file: 'docs/SAVEN_PRODUCTION_GO_DECISION.md',
    markers: [
      'SAVEN Production GO Decision',
      'Decision States',
      'Safety Language',
    ],
  },
  {
    label: 'Production values ready',
    file: 'docs/SAVEN_PRODUCTION_VALUES_READY.md',
    markers: [
      'SAVEN Production Values Ready',
      'Required Production Values',
      'Hold Rule',
    ],
  },
  {
    label: 'Release lock',
    file: 'docs/SAVEN_RELEASE_LOCK.md',
    markers: [
      'SAVEN Release Lock',
      'Release Lock States',
      'Locked Safety Gates',
    ],
  },
  {
    label: 'Strict GO',
    file: 'docs/SAVEN_STRICT_GO.md',
    markers: [
      'SAVEN Strict GO',
      'Strict Mode',
      'Strict GO Boundary',
    ],
  },
  {
    label: 'RC proof',
    file: 'docs/SAVEN_RC_PROOF.md',
    markers: [
      'SAVEN RC Proof',
      'RC-Safe Result',
    ],
  },
  {
    label: 'Final handoff',
    file: 'docs/SAVEN_FINAL_HANDOFF.md',
    markers: [
      'SAVEN Final Handoff',
      'Remaining Before Live GO',
    ],
  },
  {
    label: 'Next phase map',
    file: 'docs/SAVEN_NEXT_PHASE_MAP.md',
    markers: [
      'SAVEN Next Phase Map',
      'Phase D: Human GO Decision',
    ],
  },
  {
    label: 'Production values worksheet',
    file: 'docs/SAVEN_PRODUCTION_VALUES_WORKSHEET.md',
    markers: [
      'SAVEN Production Values Worksheet',
      'Public Values To Record In Launch Record',
      'Secrets Not To Commit',
    ],
  },
  {
    label: 'Post-launch ops',
    file: 'docs/SAVEN_POST_LAUNCH_OPS.md',
    markers: [
      'SAVEN Post-Launch Ops Package',
      'First Hour',
      'Day 1',
    ],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN production release artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN production release marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[production-release] ok ${check.label}`);
}

console.log('SAVEN production release orchestrator passed.');
