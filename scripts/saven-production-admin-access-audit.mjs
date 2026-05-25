import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['admin-access:saven'] !== 'node scripts/saven-production-admin-access-audit.mjs') {
  throw new Error('package.json is missing admin-access:saven script.');
}
console.log('[admin-access] ok package admin-access:saven script');

const requiredScripts = [
  'admin:saven',
  'admin-alerts:saven',
  'admin-workers:saven',
  'admin-evidence:saven',
  'admin-launch:saven',
  'live-backend:saven',
  'live-monitoring:saven',
  'launch-record:saven',
  'cutover:saven',
  'go-no-go:saven',
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[admin-access] ok package ${script} script`);
}

const checks = [
  {
    label: 'Production admin access package',
    file: 'docs/SAVEN_PRODUCTION_ADMIN_ACCESS.md',
    markers: [
      'SAVEN Production Admin Access Package',
      'Admin Access Model',
      'Production Access Holds',
      'Admin Actions',
      'Audit Requirements',
    ],
  },
  {
    label: 'BioMath Core Admin SAVEN Ops',
    file: 'src/pages/AdminPanel.tsx',
    markers: [
      'data-saven-admin-ops="true"',
      'data-saven-admin-launch-control="true"',
      'data-saven-admin-overrides="true"',
      'data-saven-admin-incident-actions="true"',
      'data-saven-admin-event-audit="true"',
      'data-saven-admin-persistence-status="true"',
      'data-saven-admin-slo="true"',
      'data-saven-admin-alerts="true"',
    ],
  },
  {
    label: 'SAVEN RLS admin policy draft',
    file: 'supabase/migrations/20260524091000_saven_rls_policy_draft.sql',
    markers: [
      'is_saven_admin',
      'profiles.is_admin',
      'saven admin overrides admin only',
      'saven incident actions admin only',
    ],
  },
  {
    label: 'SAVEN Edge Function admin gate',
    file: 'supabase/functions/saven-gateway/index.ts',
    markers: [
      'Admin access required',
      'apply_admin_override',
      'review_command_permission',
      'No external dispatch',
    ],
  },
  {
    label: 'Backend monitoring admin documentation',
    file: 'docs/SAVEN_BACKEND_MONITORING_ADMIN.md',
    markers: [
      'profiles.is_admin = true',
      'admin-only actions',
      'data-saven-admin-ops="true"',
    ],
  },
  {
    label: 'Launch record admin access evidence',
    file: 'docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md',
    markers: [
      'Production Admin Access',
      'admin-access:saven',
      'Admin access owner',
    ],
  },
  {
    label: 'Cutover admin access gate',
    file: 'docs/SAVEN_PRODUCTION_CUTOVER_CHECKLIST.md',
    markers: [
      'Production Admin Access',
      'admin-access:saven',
      'profiles.is_admin = true',
    ],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN production admin access artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN production admin access marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[admin-access] ok ${check.label}`);
}

console.log('SAVEN production admin access audit passed.');
