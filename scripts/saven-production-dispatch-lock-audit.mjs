import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['dispatch-lock:saven'] !== 'node scripts/saven-production-dispatch-lock-audit.mjs') {
  throw new Error('package.json is missing dispatch-lock:saven script.');
}
console.log('[dispatch-lock] ok package dispatch-lock:saven script');

const requiredScripts = [
  'workers:saven',
  'admin-workers:saven',
  'admin-access:saven',
  'privacy-live:saven',
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
  console.log(`[dispatch-lock] ok package ${script} script`);
}

const checks = [
  {
    label: 'Production dispatch lock package',
    file: 'docs/SAVEN_PRODUCTION_DISPATCH_LOCK.md',
    markers: [
      'SAVEN Production Dispatch Lock Package',
      'Dispatch Lock Model',
      'Allowed Production Behavior',
      'Locked Behavior',
      'Activation Holds',
    ],
  },
  {
    label: 'Worker handoff service',
    file: 'src/features/saven/services/savenWorkerHandoffService.ts',
    markers: [
      'savenWorkerEndpoints',
      'createSavenWorkerHandoffPacket',
      'createSavenWorkerShiftBoard',
      'requires_confirmation',
      'blocked',
      'automatic_external_dispatch',
      'physical_action_without_approval',
      'Human-confirmed emergency path',
      'Robot readiness gate',
    ],
  },
  {
    label: 'Worker handoff tests',
    file: 'src/features/saven/services/__tests__/savenWorkerHandoffService.test.ts',
    markers: [
      'routes nurse voice command',
      'keeps robot handoff locked',
      'blocks automatic emergency dispatch',
      'builds a shift board across worker endpoints',
    ],
  },
  {
    label: 'Command permission service',
    file: 'src/features/saven/services/savenCommandPermissionService.ts',
    markers: [
      'requires_human_confirmation',
      'admin_review',
      'blocked',
      'Display emergency rules without automatic external dispatch.',
      'Keep physical action locked until admin or caregiver approval.',
    ],
  },
  {
    label: 'Edge Function dispatch lock',
    file: 'supabase/functions/saven-gateway/index.ts',
    markers: [
      'blocked_external_dispatch',
      'Block automatic dispatch',
      'No external dispatch',
      'Show robot readiness while physical action remains locked.',
      'Prepare nurse follow-up package without external dispatch.',
    ],
  },
  {
    label: 'Admin worker shift surface',
    file: 'src/pages/AdminPanel.tsx',
    markers: [
      'data-saven-admin-worker-shift="true"',
      'createSavenWorkerShiftBoard',
      'SAVEN worker shift board',
      'before real dispatch is connected',
    ],
  },
  {
    label: 'Launch record dispatch evidence',
    file: 'docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md',
    markers: [
      'Production Dispatch Lock',
      'dispatch-lock:saven',
      'Dispatch lock reviewer',
    ],
  },
  {
    label: 'Cutover dispatch gate',
    file: 'docs/SAVEN_PRODUCTION_CUTOVER_CHECKLIST.md',
    markers: [
      'Production Dispatch Lock',
      'dispatch-lock:saven',
      'blocked_external_dispatch',
    ],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN production dispatch lock artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN production dispatch lock marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[dispatch-lock] ok ${check.label}`);
}

console.log('SAVEN production dispatch lock audit passed.');
