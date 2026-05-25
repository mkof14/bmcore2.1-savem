import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['evidence-index:saven'] !== 'node scripts/saven-production-evidence-index-audit.mjs') {
  throw new Error('package.json is missing evidence-index:saven script.');
}
console.log('[evidence-index] ok package evidence-index:saven script');

const requiredScripts = [
  'production-release:saven',
  'launch-record:saven',
  'go-no-go:saven',
  'admin-deploy:saven',
  'prod-env:saven',
  'prod-smoke:saven',
  'tag:saven',
  'rollback:saven',
  'postlaunch:saven',
  'github-release:saven',
  'manifest:saven',
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[evidence-index] ok package ${script} script`);
}

const checks = [
  {
    label: 'Production evidence index',
    file: 'docs/SAVEN_PRODUCTION_EVIDENCE_INDEX.md',
    markers: [
      'SAVEN Production Evidence Index',
      'Current Release Posture',
      'Evidence Map',
      'Production Holds',
      'Ready Evidence',
      'Non-Negotiable Safety Gates',
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
    markers: ['SAVEN Production Launch Record', 'Launch Identity', 'Safety Sign-Off'],
  },
  {
    label: 'Final manifest',
    file: 'docs/SAVEN_FINAL_SHIP_MANIFEST.md',
    markers: ['SAVEN Final Ship Manifest', 'Known Production Preconditions', 'Release Control'],
  },
  {
    label: 'Admin deploy checklist',
    file: 'docs/SAVEN_BIOMATH_ADMIN_DEPLOY_CHECKLIST.md',
    markers: ['SAVEN BioMath Admin Deploy Checklist', 'Admin Surface Contract', 'Admin Hold Rules'],
  },
  {
    label: 'GitHub release notes',
    file: 'docs/SAVEN_GITHUB_RELEASE_NOTES.md',
    markers: ['SAVEN GitHub Release Notes', 'Production Release Orchestrator', 'Production Launch Record'],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN evidence index artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN evidence index marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[evidence-index] ok ${check.label}`);
}

console.log('SAVEN production evidence index audit passed.');
