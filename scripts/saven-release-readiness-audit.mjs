import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
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
if (packageJson.scripts?.['preview:saven:auto'] !== 'node scripts/saven-production-preview-smoke.mjs') {\n  throw new Error('package.json is missing preview:saven:auto script.');\n}\nconsole.log('[release] ok package preview:saven:auto script');\n\nif (packageJson.scripts?.['ship:saven'] !== 'npm run ready:saven && npm run preview:saven:auto') {\n  throw new Error('package.json is missing ship:saven script.');\n}\nconsole.log('[release] ok package ship:saven script');\n\nif (packageJson.scripts?.['visual:saven'] !== 'node scripts/saven-visual-acceptance-audit.mjs') {\n  throw new Error('package.json is missing visual:saven script.');\n}\nconsole.log('[release] ok package visual:saven script');\n\nif (packageJson.scripts?.['commands:saven'] !== 'node scripts/saven-command-contract-audit.mjs') {\n  throw new Error('package.json is missing commands:saven script.');\n}\nconsole.log('[release] ok package commands:saven script');\n\nif (packageJson.scripts?.['db:saven'] !== 'node scripts/saven-supabase-migration-audit.mjs') {\n  throw new Error('package.json is missing db:saven script.');\n}\nconsole.log('[release] ok package db:saven script');\n\nif (packageJson.scripts?.['edge:saven'] !== 'node scripts/saven-edge-function-audit.mjs') {\n  throw new Error('package.json is missing edge:saven script.');\n}\nconsole.log('[release] ok package edge:saven script');\n\nif (packageJson.scripts?.['monitoring:saven'] !== 'node scripts/saven-monitoring-slo-audit.mjs') {\n  throw new Error('package.json is missing monitoring:saven script.');\n}\nconsole.log('[release] ok package monitoring:saven script');\n\nif (packageJson.scripts?.['admin:saven'] !== 'node scripts/saven-admin-ops-audit.mjs') {\n  throw new Error('package.json is missing admin:saven script.');\n}\nconsole.log('[release] ok package admin:saven script');\n\nif (packageJson.scripts?.['alerts:saven'] !== 'node scripts/saven-alerting-audit.mjs') {\n  throw new Error('package.json is missing alerts:saven script.');\n}\nconsole.log('[release] ok package alerts:saven script');\n\nif (packageJson.scripts?.['admin-alerts:saven'] !== 'node scripts/saven-admin-alerts-audit.mjs') {\n  throw new Error('package.json is missing admin-alerts:saven script.');\n}\nconsole.log('[release] ok package admin-alerts:saven script');\n\nif (packageJson.scripts?.['privacy:saven'] !== 'node scripts/saven-privacy-guardrails-audit.mjs') {\n  throw new Error('package.json is missing privacy:saven script.');\n}\nconsole.log('[release] ok package privacy:saven script');\n\nif (packageJson.scripts?.['workers:saven'] !== 'node scripts/saven-worker-handoff-audit.mjs') {\n  throw new Error('package.json is missing workers:saven script.');\n}\nconsole.log('[release] ok package workers:saven script');\n\nif (packageJson.scripts?.['admin-workers:saven'] !== 'node scripts/saven-admin-worker-shift-audit.mjs') {\n  throw new Error('package.json is missing admin-workers:saven script.');\n}\nconsole.log('[release] ok package admin-workers:saven script');\n\nif (packageJson.scripts?.['evidence:saven'] !== 'node scripts/saven-ops-evidence-audit.mjs') {\n  throw new Error('package.json is missing evidence:saven script.');\n}\nconsole.log('[release] ok package evidence:saven script');\n\nif (packageJson.scripts?.['admin-evidence:saven'] !== 'node scripts/saven-admin-evidence-audit.mjs') {\n  throw new Error('package.json is missing admin-evidence:saven script.');\n}\nconsole.log('[release] ok package admin-evidence:saven script');\n\nif (packageJson.scripts?.['launch:saven'] !== 'node scripts/saven-launch-control-audit.mjs') {\n  throw new Error('package.json is missing launch:saven script.');\n}\nconsole.log('[release] ok package launch:saven script');\n\nif (packageJson.scripts?.['release:saven'] !== 'node scripts/saven-release-readiness-audit.mjs') {
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
