import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['cutover:saven'] !== 'node scripts/saven-production-cutover-checklist-audit.mjs') {
  throw new Error('package.json is missing cutover:saven script.');
}
console.log('[cutover] ok package cutover:saven script');

const requiredScripts = [
  'rc-tag:saven',
  'production-release:saven',
  'ready:saven',
  'ship:saven',
  'prod-env:saven',
  'prod-smoke:saven',
  'admin-deploy:saven',
  'go-no-go:saven',
  'launch-record:saven',
  'postlaunch:saven',
  'rollback:saven',
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[cutover] ok package ${script} script`);
}

const checks = [
  {
    label: 'Production cutover checklist',
    file: 'docs/SAVEN_PRODUCTION_CUTOVER_CHECKLIST.md',
    markers: [
      'SAVEN Production Cutover Checklist',
      'Required Cutover Inputs',
      'Cutover Commands',
      'Cutover Order',
      'Immediate Hold Conditions',
      'After Cutover',
    ],
  },
  {
    label: 'Production launch record',
    file: 'docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md',
    markers: ['SAVEN Production Launch Record', 'Launch Identity', 'First-Hour Watch', 'Safety Sign-Off'],
  },
  {
    label: 'Release operator brief',
    file: 'docs/SAVEN_RELEASE_OPERATOR_BRIEF.md',
    markers: ['SAVEN Release Operator Brief', 'What Still Holds Production', 'Next Human Actions'],
  },
  {
    label: 'Production evidence index',
    file: 'docs/SAVEN_PRODUCTION_EVIDENCE_INDEX.md',
    markers: ['SAVEN Production Evidence Index', 'Production Holds', 'Non-Negotiable Safety Gates'],
  },
  {
    label: 'BioMath Admin deploy checklist',
    file: 'docs/SAVEN_BIOMATH_ADMIN_DEPLOY_CHECKLIST.md',
    markers: ['SAVEN BioMath Admin Deploy Checklist', 'Admin Surface Contract', 'Admin Hold Rules'],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN cutover artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN cutover marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[cutover] ok ${check.label}`);
}

console.log('SAVEN production cutover checklist audit passed.');
