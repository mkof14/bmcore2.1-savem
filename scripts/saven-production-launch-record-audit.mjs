import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['launch-record:saven'] !== 'node scripts/saven-production-launch-record-audit.mjs') {
  throw new Error('package.json is missing launch-record:saven script.');
}
console.log('[launch-record] ok package launch-record:saven script');

const requiredScripts = [
  'ready:saven',
  'ship:saven',
  'admin-deploy:saven',
  'go-no-go:saven',
  'prod-env:saven',
  'prod-smoke:saven',
  'rollback:saven',
  'postlaunch:saven',
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[launch-record] ok package ${script} script`);
}

const checks = [
  {
    label: 'Production launch record',
    file: 'docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md',
    markers: [
      'SAVEN Production Launch Record',
      'Launch Identity',
      'Backend Record',
      'Required Proof Before GO',
      'Launch Holds',
      'First-Hour Watch',
      'Safety Sign-Off',
    ],
  },
  {
    label: 'Production go/no-go package',
    file: 'docs/SAVEN_PRODUCTION_GO_NO_GO.md',
    markers: [
      'SAVEN Production Go / No-Go Package',
      'GO',
      'HOLD',
      'RC ONLY',
      'Non-Negotiable Safety Holds',
    ],
  },
  {
    label: 'BioMath Admin deploy checklist',
    file: 'docs/SAVEN_BIOMATH_ADMIN_DEPLOY_CHECKLIST.md',
    markers: [
      'SAVEN BioMath Admin Deploy Checklist',
      'Admin Surface Contract',
      'Operator Flow',
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
  {
    label: 'Production URL smoke gate',
    file: 'docs/SAVEN_PRODUCTION_URL_SMOKE_GATE.md',
    markers: [
      'SAVEN Production URL Smoke Gate',
      'Live URL Mode',
      'Hold Rules',
    ],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN launch record artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN launch record marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[launch-record] ok ${check.label}`);
}

console.log('SAVEN production launch record audit passed.');
