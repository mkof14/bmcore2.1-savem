import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['live-backend:saven'] !== 'node scripts/saven-live-backend-activation-audit.mjs') {
  throw new Error('package.json is missing live-backend:saven script.');
}
console.log('[live-backend] ok package live-backend:saven script');

const requiredScripts = [
  'backend:saven',
  'db:saven',
  'edge:saven',
  'prod-env:saven',
  'prod-smoke:saven',
  'admin:saven',
  'admin-deploy:saven',
  'cutover:saven',
  'launch-record:saven',
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[live-backend] ok package ${script} script`);
}

const checks = [
  {
    label: 'Live backend activation package',
    file: 'docs/SAVEN_LIVE_BACKEND_ACTIVATION.md',
    markers: [
      'SAVEN Live Backend Activation Package',
      'Activation Modes',
      'Activation Order',
      'Backend Holds',
      'Safety Gates',
    ],
  },
  {
    label: 'Production env gate',
    file: 'docs/SAVEN_PRODUCTION_ENV_GATE.md',
    markers: ['SAVEN Production Environment Gate', 'Production Edge Mode', 'Production HTTP Mode'],
  },
  {
    label: 'Supabase migration kit',
    file: 'supabase/saven/001_saven_core_schema.sql',
    markers: ['saven_profiles', 'saven_commands', 'saven_events', 'saven_incidents'],
  },
  {
    label: 'RLS policy draft',
    file: 'supabase/migrations/20260524091000_saven_rls_policy_draft.sql',
    markers: ['is_saven_admin', 'enable row level security', 'Critical writes'],
  },
  {
    label: 'Edge Function gateway',
    file: 'supabase/functions/saven-gateway/index.ts',
    markers: ['saven-gateway', 'review_command_permission', 'apply_admin_override', 'No external dispatch'],
  },
  {
    label: 'Backend selector',
    file: 'src/features/saven/services/savenBackendGatewaySelector.ts',
    markers: ['VITE_SAVEN_BACKEND_MODE', 'VITE_SAVEN_EDGE_FUNCTION_URL', 'VITE_SAVEN_BACKEND_URL'],
  },
  {
    label: 'Admin Ops persistence',
    file: 'src/pages/AdminPanel.tsx',
    markers: [
      'data-saven-admin-ops="true"',
      'data-saven-admin-persistence-status="true"',
      'data-saven-admin-event-audit="true"',
      'data-saven-admin-incident-readiness="true"',
    ],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN live backend artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN live backend marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[live-backend] ok ${check.label}`);
}

console.log('SAVEN live backend activation audit passed.');
