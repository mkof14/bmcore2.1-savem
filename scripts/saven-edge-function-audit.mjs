import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    label: 'SAVEN Edge Function source',
    file: 'supabase/functions/saven-gateway/index.ts',
    markers: [
      'SAVEN Supabase Edge Function gateway',
      'ALLOWED_ACTIONS',
      'send_command',
      'interpret_command',
      'review_command_permission',
      'persistence_status',
      'incident_readiness',
      'apply_admin_override',
      'No external dispatch',
      'blocked_external_dispatch',
    ],
  },
  {
    label: 'SAVEN Edge Function docs',
    file: 'docs/SAVEN_EDGE_FUNCTION_PACKAGE.md',
    markers: [
      'SAVEN Edge Function Package',
      'supabase functions deploy saven-gateway',
      'VITE_SAVEN_BACKEND_MODE=edge',
      'VITE_SAVEN_EDGE_FUNCTION_URL',
      'npm run edge:saven',
    ],
  },
  {
    label: 'Edge adapter integration',
    file: 'src/features/saven/services/savenEdgeFunctionBackendAdapter.ts',
    markers: [
      'createSavenEdgeFunctionBackendAdapter',
      'review_command_permission',
      'persistence_status',
      'incident_readiness',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['edge:saven'] !== 'node scripts/saven-edge-function-audit.mjs') {
  throw new Error('package.json is missing edge:saven script.');
}
console.log('[edge] ok package edge:saven script');

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN Edge artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN Edge marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[edge] ok ${check.label}`);
}

console.log('SAVEN Edge Function package audit passed.');
