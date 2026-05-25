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
