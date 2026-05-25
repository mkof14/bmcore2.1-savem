import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['go-no-go:saven'] !== 'node scripts/saven-production-go-no-go-audit.mjs') {
  throw new Error('package.json is missing go-no-go:saven script.');
}
console.log('[go-no-go] ok package go-no-go:saven script');

const requiredScripts = [
  'ready:saven',
  'ship:saven',
  'admin-deploy:saven',
  'rollback:saven',
  'postlaunch:saven',
  'tag:saven',
  'prod-env:saven',
  'prod-smoke:saven',
  'github-release:saven',
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[go-no-go] ok package ${script} script`);
}

const checks = [
  {
    label: 'Production go no-go package',
    file: 'docs/SAVEN_PRODUCTION_GO_NO_GO.md',
    markers: [
      'SAVEN Production Go / No-Go Package',
      'Decision States',
      'GO',
      'HOLD',
      'RC ONLY',
      'Non-Negotiable Safety Holds',
    ],
  },
  {
    label: 'Final ship manifest',
    file: 'docs/SAVEN_FINAL_SHIP_MANIFEST.md',
    markers: [
      'SAVEN Final Ship Manifest',
      'Known Production Preconditions',
      'Emergency route remains human-confirmed',
      'Robot physical action remains permissioned',
    ],
  },
  {
    label: 'Final release tag gate',
    file: 'docs/SAVEN_FINAL_RELEASE_TAG_GATE.md',
    markers: [
      'SAVEN Final Release Tag Gate',
      'Tag Hold Rules',
      'Production URL Smoke Gate',
      'BioMath Admin Deploy Checklist',
    ],
  },
  {
    label: 'BioMath Admin deploy checklist',
    file: 'docs/SAVEN_BIOMATH_ADMIN_DEPLOY_CHECKLIST.md',
    markers: [
      'SAVEN BioMath Admin Deploy Checklist',
      'Admin Surface Contract',
      'Admin Hold Rules',
    ],
  },
  {
    label: 'Production environment gate',
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
    throw new Error(`Missing SAVEN go/no-go artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN go/no-go marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[go-no-go] ok ${check.label}`);
}

console.log('SAVEN production go/no-go audit passed.');
