import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const requiredFiles = [
  'src/pages/Saven.tsx',
  'src/pages/AdminPanel.tsx',
  'scripts/saven-full-readiness.mjs',
  'scripts/saven-route-smoke.mjs',
  'docs/SAVEN_RELEASE_HANDOFF.md',
  'docs/SAVEN_BACKEND_MONITORING_ADMIN.md',
  'docs/SAVEN_FINAL_SHIP_MANIFEST.md',
];

const optionalButExpected = [
  'docs/SAVEN_OPERATOR_ACCEPTANCE_DRILLS.md',
  'docs/SAVEN_VISUAL_ACCEPTANCE.md',
  'docs/SAVEN_SUPABASE_MIGRATION_KIT.md',
  'docs/SAVEN_EDGE_FUNCTION_PACKAGE.md',
  'docs/SAVEN_MONITORING_SLO_KIT.md',
  'docs/SAVEN_ALERTING_RUNBOOK_KIT.md',
  'docs/SAVEN_SECURITY_PRIVACY_GUARDRAILS.md',
  'docs/SAVEN_WORKER_HANDOFF_KIT.md',
  'docs/SAVEN_OPS_EVIDENCE_PACK.md',
  'docs/SAVEN_LAUNCH_CONTROL_KIT.md',
];

const markerChecks = [
  {
    label: 'Final ship manifest',
    file: 'docs/SAVEN_FINAL_SHIP_MANIFEST.md',
    markers: [
      'SAVEN Final Ship Manifest',
      'Voice And Worker Layer',
      'Backend Foundation',
      'Monitoring And Admin',
      'Safety And Privacy',
      'Release Control',
      'npm run ship:saven',
    ],
  },
  {
    label: 'SAVEN product shell',
    file: 'src/pages/Saven.tsx',
    markers: ['SAVEN', 'SAVEN commands', 'Open mic'],
  },
  {
    label: 'Admin Ops surface',
    file: 'src/pages/AdminPanel.tsx',
    markers: ['data-saven-admin-ops="true"', 'SAVEN Operations'],
  },
  {
    label: 'Full readiness',
    file: 'scripts/saven-full-readiness.mjs',
    markers: ['Backend readiness', 'SAVEN route smoke', 'Production build'],
  },
  {
    label: 'Release handoff',
    file: 'docs/SAVEN_RELEASE_HANDOFF.md',
    markers: ['SAVEN Release Handoff', 'npm run ready:saven'],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['manifest:saven'] !== 'node scripts/saven-final-ship-manifest-audit.mjs') {
  throw new Error('package.json is missing manifest:saven script.');
}
console.log('[manifest] ok package manifest:saven script');

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    throw new Error('Missing required SAVEN ship file: ' + file);
  }
  console.log('[manifest] ok required file ' + file);
}

const missingOptional = optionalButExpected.filter((file) => !fs.existsSync(path.join(root, file)));
if (missingOptional.length) {
  console.log('[manifest] note optional release docs not present yet: ' + missingOptional.join(', '));
}

for (const check of markerChecks) {
  const content = fs.readFileSync(path.join(root, check.file), 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN manifest marker in ${check.file}: ${marker}`);
    }
  }
  console.log(`[manifest] ok ${check.label}`);
}

console.log('SAVEN final ship manifest audit passed.');
