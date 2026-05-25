import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const requiredScripts = {
  'tag:saven': 'node scripts/saven-final-release-tag-gate.mjs',
  'ready:saven': 'node scripts/saven-full-readiness.mjs',
  'ship:saven': 'npm run ready:saven && npm run preview:saven:auto',
  'github-release:saven': 'node scripts/saven-github-release-audit.mjs',
  'hosting:saven': 'node scripts/saven-hosting-deployment-audit.mjs',
  'prod-env:saven': 'node scripts/saven-production-env-gate.mjs',
  'rollback:saven': 'node scripts/saven-rollback-drill-audit.mjs',
  'postlaunch:saven': 'node scripts/saven-post-launch-ops-audit.mjs',
};

for (const [name, command] of Object.entries(requiredScripts)) {
  if (packageJson.scripts?.[name] !== command) {
    throw new Error(`package.json is missing ${name} script.`);
  }
  console.log(`[tag] ok package ${name} script`);
}

const checks = [
  {
    label: 'Final release tag gate',
    file: 'docs/SAVEN_FINAL_RELEASE_TAG_GATE.md',
    markers: [
      'SAVEN Final Release Tag Gate',
      'Suggested Tag',
      'Required Local Proof',
      'Tag Hold Rules',
      'Release Evidence Map',
    ],
  },
  {
    label: 'GitHub release notes',
    file: 'docs/SAVEN_GITHUB_RELEASE_NOTES.md',
    markers: [
      'SAVEN GitHub Release Notes',
      'bmcore2.1-savem-rc1',
      'Production Holds',
      'Production Environment Gate',
      'Rollback Drill',
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
    label: 'Production env gate',
    file: 'docs/SAVEN_PRODUCTION_ENV_GATE.md',
    markers: [
      'SAVEN Production Environment Gate',
      'Production Edge Mode',
      'Production Hold Rules',
    ],
  },
  {
    label: 'Rollback drill',
    file: 'docs/SAVEN_ROLLBACK_DRILL.md',
    markers: [
      'SAVEN Rollback Drill Package',
      'Immediate Hold Triggers',
      'Recovery Proof',
    ],
  },
  {
    label: 'Post-launch ops',
    file: 'docs/SAVEN_POST_LAUNCH_OPS.md',
    markers: [
      'SAVEN Post-Launch Ops Package',
      'First Hour',
      'Rollback Triggers',
    ],
  },
  {
    label: 'Admin Ops release surface',
    file: 'src/pages/AdminPanel.tsx',
    markers: [
      'data-saven-admin-ops="true"',
      'data-saven-admin-launch-control="true"',
      'data-saven-admin-evidence-pack="true"',
      'data-saven-admin-alerts="true"',
      'data-saven-admin-worker-shift="true"',
    ],
  },
  {
    label: 'SAVEN command surface',
    file: 'src/pages/Saven.tsx',
    markers: [
      'SAVEN commands',
      'Open mic',
      'All commands',
    ],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN final tag artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN final tag marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[tag] ok ${check.label}`);
}

console.log('SAVEN final release tag gate passed.');
