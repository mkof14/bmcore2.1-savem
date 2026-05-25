import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['admin-deploy:saven'] !== 'node scripts/saven-admin-deploy-checklist-audit.mjs') {
  throw new Error('package.json is missing admin-deploy:saven script.');
}
console.log('[admin-deploy] ok package admin-deploy:saven script');

const requiredScripts = [
  'admin:saven',
  'admin-alerts:saven',
  'admin-workers:saven',
  'admin-evidence:saven',
  'admin-launch:saven',
  'prod-env:saven',
  'prod-smoke:saven',
  'tag:saven',
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[admin-deploy] ok package ${script} script`);
}

const checks = [
  {
    label: 'BioMath Admin deploy checklist',
    file: 'docs/SAVEN_BIOMATH_ADMIN_DEPLOY_CHECKLIST.md',
    markers: [
      'SAVEN BioMath Admin Deploy Checklist',
      'Admin Surface Contract',
      'Deploy Checklist',
      'Admin Hold Rules',
      'Operator Flow',
    ],
  },
  {
    label: 'Admin Ops surface',
    file: 'src/pages/AdminPanel.tsx',
    markers: [
      'data-saven-admin-ops="true"',
      'data-saven-admin-monitoring-live="true"',
      'data-saven-admin-slo="true"',
      'data-saven-admin-alerts="true"',
      'data-saven-admin-worker-shift="true"',
      'data-saven-admin-evidence-pack="true"',
      'data-saven-admin-launch-control="true"',
      'data-saven-admin-event-audit="true"',
      'data-saven-admin-incident-readiness="true"',
      'data-saven-admin-incident-actions="true"',
      'data-saven-admin-overrides="true"',
      'data-saven-admin-persistence-status="true"',
    ],
  },
  {
    label: 'Backend monitoring admin doc',
    file: 'docs/SAVEN_BACKEND_MONITORING_ADMIN.md',
    markers: [
      'SAVEN Backend, Monitoring, and Admin Foundation',
      'BioMath Core Admin',
      'Final Release Tag Gate',
      'Production Environment Gate',
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
    label: 'Release handoff',
    file: 'docs/SAVEN_RELEASE_HANDOFF.md',
    markers: [
      'SAVEN Release Handoff',
      'Production URL Smoke Gate',
      'Final Release Tag Gate',
    ],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN admin deploy artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN admin deploy marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[admin-deploy] ok ${check.label}`);
}

console.log('SAVEN BioMath Admin deploy checklist audit passed.');
