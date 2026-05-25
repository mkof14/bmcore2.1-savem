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
if (packageJson.scripts?.['preview:saven:auto'] !== 'node scripts/saven-production-preview-smoke.mjs') {\n  throw new Error('package.json is missing preview:saven:auto script.');\n}\nconsole.log('[release] ok package preview:saven:auto script');\n\nif (packageJson.scripts?.['ship:saven'] !== 'npm run ready:saven && npm run preview:saven:auto') {\n  throw new Error('package.json is missing ship:saven script.');\n}\nconsole.log('[release] ok package ship:saven script');\n\nif (packageJson.scripts?.['visual:saven'] !== 'node scripts/saven-visual-acceptance-audit.mjs') {\n  throw new Error('package.json is missing visual:saven script.');\n}\nconsole.log('[release] ok package visual:saven script');\n\nif (packageJson.scripts?.['commands:saven'] !== 'node scripts/saven-command-contract-audit.mjs') {\n  throw new Error('package.json is missing commands:saven script.');\n}\nconsole.log('[release] ok package commands:saven script');\n\nif (packageJson.scripts?.['db:saven'] !== 'node scripts/saven-supabase-migration-audit.mjs') {\n  throw new Error('package.json is missing db:saven script.');\n}\nconsole.log('[release] ok package db:saven script');\n\nif (packageJson.scripts?.['edge:saven'] !== 'node scripts/saven-edge-function-audit.mjs') {\n  throw new Error('package.json is missing edge:saven script.');\n}\nconsole.log('[release] ok package edge:saven script');\n\nif (packageJson.scripts?.['monitoring:saven'] !== 'node scripts/saven-monitoring-slo-audit.mjs') {\n  throw new Error('package.json is missing monitoring:saven script.');\n}\nconsole.log('[release] ok package monitoring:saven script');\n\nif (packageJson.scripts?.['admin:saven'] !== 'node scripts/saven-admin-ops-audit.mjs') {\n  throw new Error('package.json is missing admin:saven script.');\n}\nconsole.log('[release] ok package admin:saven script');\n\nif (packageJson.scripts?.['alerts:saven'] !== 'node scripts/saven-alerting-audit.mjs') {\n  throw new Error('package.json is missing alerts:saven script.');\n}\nconsole.log('[release] ok package alerts:saven script');\n\nif (packageJson.scripts?.['admin-alerts:saven'] !== 'node scripts/saven-admin-alerts-audit.mjs') {\n  throw new Error('package.json is missing admin-alerts:saven script.');\n}\nconsole.log('[release] ok package admin-alerts:saven script');\n\nif (packageJson.scripts?.['privacy:saven'] !== 'node scripts/saven-privacy-guardrails-audit.mjs') {\n  throw new Error('package.json is missing privacy:saven script.');\n}\nconsole.log('[release] ok package privacy:saven script');\n\nif (packageJson.scripts?.['workers:saven'] !== 'node scripts/saven-worker-handoff-audit.mjs') {\n  throw new Error('package.json is missing workers:saven script.');\n}\nconsole.log('[release] ok package workers:saven script');\n\nif (packageJson.scripts?.['admin-workers:saven'] !== 'node scripts/saven-admin-worker-shift-audit.mjs') {\n  throw new Error('package.json is missing admin-workers:saven script.');\n}\nconsole.log('[release] ok package admin-workers:saven script');\n\nif (packageJson.scripts?.['evidence:saven'] !== 'node scripts/saven-ops-evidence-audit.mjs') {\n  throw new Error('package.json is missing evidence:saven script.');\n}\nconsole.log('[release] ok package evidence:saven script');\n\nif (packageJson.scripts?.['admin-evidence:saven'] !== 'node scripts/saven-admin-evidence-audit.mjs') {\n  throw new Error('package.json is missing admin-evidence:saven script.');\n}\nconsole.log('[release] ok package admin-evidence:saven script');\n\nif (packageJson.scripts?.['launch:saven'] !== 'node scripts/saven-launch-control-audit.mjs') {\n  throw new Error('package.json is missing launch:saven script.');\n}\nconsole.log('[release] ok package launch:saven script');\n\nif (packageJson.scripts?.['admin-launch:saven'] !== 'node scripts/saven-admin-launch-audit.mjs') {\n  throw new Error('package.json is missing admin-launch:saven script.');\n}\nconsole.log('[release] ok package admin-launch:saven script');\n\nif (packageJson.scripts?.['manifest:saven'] !== 'node scripts/saven-final-ship-manifest-audit.mjs') {\n  throw new Error('package.json is missing manifest:saven script.');\n}\nconsole.log('[release] ok package manifest:saven script');\n\nif (packageJson.scripts?.['rc:saven'] !== 'node scripts/saven-release-candidate-audit.mjs') {\n  throw new Error('package.json is missing rc:saven script.');\n}\nconsole.log('[release] ok package rc:saven script');\n\nif (packageJson.scripts?.['github-release:saven'] !== 'node scripts/saven-github-release-audit.mjs') {\n  throw new Error('package.json is missing github-release:saven script.');\n}\nconsole.log('[release] ok package github-release:saven script');\n\nif (packageJson.scripts?.['postlaunch:saven'] !== 'node scripts/saven-post-launch-ops-audit.mjs') {\n  throw new Error('package.json is missing postlaunch:saven script.');\n}\nconsole.log('[release] ok package postlaunch:saven script');\n\nif (packageJson.scripts?.['hosting:saven'] !== 'node scripts/saven-hosting-deployment-audit.mjs') {\n  throw new Error('package.json is missing hosting:saven script.');\n}\nconsole.log('[release] ok package hosting:saven script');\n\nif (packageJson.scripts?.['rollback:saven'] !== 'node scripts/saven-rollback-drill-audit.mjs') {\n  throw new Error('package.json is missing rollback:saven script.');\n}\nconsole.log('[release] ok package rollback:saven script');\n\nif (packageJson.scripts?.['prod-env:saven'] !== 'node scripts/saven-production-env-gate.mjs') {\n  throw new Error('package.json is missing prod-env:saven script.');\n}\nconsole.log('[release] ok package prod-env:saven script');\n\nif (packageJson.scripts?.['tag:saven'] !== 'node scripts/saven-final-release-tag-gate.mjs') {\n  throw new Error('package.json is missing tag:saven script.');\n}\nconsole.log('[release] ok package tag:saven script');\n\nif (packageJson.scripts?.['prod-smoke:saven'] !== 'node scripts/saven-production-url-smoke-gate.mjs') {\n  throw new Error('package.json is missing prod-smoke:saven script.');\n}\nconsole.log('[release] ok package prod-smoke:saven script');\n\nif (packageJson.scripts?.['admin-deploy:saven'] !== 'node scripts/saven-admin-deploy-checklist-audit.mjs') {\n  throw new Error('package.json is missing admin-deploy:saven script.');\n}\nconsole.log('[release] ok package admin-deploy:saven script');\n\nif (packageJson.scripts?.['go-no-go:saven'] !== 'node scripts/saven-production-go-no-go-audit.mjs') {\n  throw new Error('package.json is missing go-no-go:saven script.');\n}\nconsole.log('[release] ok package go-no-go:saven script');\n\nif (packageJson.scripts?.['launch-record:saven'] !== 'node scripts/saven-production-launch-record-audit.mjs') {\n  throw new Error('package.json is missing launch-record:saven script.');\n}\nconsole.log('[release] ok package launch-record:saven script');\n\nif (packageJson.scripts?.['production-release:saven'] !== 'node scripts/saven-production-release-orchestrator.mjs') {\n  throw new Error('package.json is missing production-release:saven script.');\n}\nconsole.log('[release] ok package production-release:saven script');\n\nif (packageJson.scripts?.['evidence-index:saven'] !== 'node scripts/saven-production-evidence-index-audit.mjs') {\n  throw new Error('package.json is missing evidence-index:saven script.');\n}\nconsole.log('[release] ok package evidence-index:saven script');\n\nif (packageJson.scripts?.['operator-brief:saven'] !== 'node scripts/saven-release-operator-brief-audit.mjs') {\n  throw new Error('package.json is missing operator-brief:saven script.');\n}\nconsole.log('[release] ok package operator-brief:saven script');\n\nif (packageJson.scripts?.['release:saven'] !== 'node scripts/saven-release-readiness-audit.mjs') {
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
