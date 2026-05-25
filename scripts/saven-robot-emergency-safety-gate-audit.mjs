import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['robot-emergency:saven'] !== 'node scripts/saven-robot-emergency-safety-gate-audit.mjs') {
  throw new Error('package.json is missing robot-emergency:saven script.');
}
console.log('[robot-emergency] ok package robot-emergency:saven script');

const requiredScripts = [
  'dispatch-lock:saven',
  'monitoring:saven',
  'alerts:saven',
  'admin-alerts:saven',
  'workers:saven',
  'admin-workers:saven',
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
  console.log(`[robot-emergency] ok package ${script} script`);
}

const checks = [
  {
    label: 'Robot emergency safety gate package',
    file: 'docs/SAVEN_ROBOT_EMERGENCY_SAFETY_GATE.md',
    markers: [
      'SAVEN Robot Emergency Safety Gate',
      'Safety Gate Model',
      'Robot Boundary',
      'Emergency Boundary',
      'Production Holds',
    ],
  },
  {
    label: 'Command execution safety',
    file: 'src/features/saven/services/savenCommandExecutionService.ts',
    markers: [
      'check_robot_readiness',
      'Show robot readiness while physical action remains locked.',
      'show_emergency_rules',
      'blocked_external_dispatch',
      'Block automatic dispatch',
    ],
  },
  {
    label: 'Command permission safety',
    file: 'src/features/saven/services/savenCommandPermissionService.ts',
    markers: [
      'Keep physical action locked until admin or caregiver approval.',
      'Display emergency rules without automatic external dispatch.',
      'admin_review',
      'blocked',
    ],
  },
  {
    label: 'Worker handoff safety',
    file: 'src/features/saven/services/savenWorkerHandoffService.ts',
    markers: [
      'Robot readiness gate',
      'Human-confirmed emergency path',
      'physical_action_without_approval',
      'automatic_external_dispatch',
      'requires_confirmation',
      'blocked',
    ],
  },
  {
    label: 'Monitoring SLO safety',
    file: 'src/features/saven/services/savenMonitoringSloService.ts',
    markers: [
      'robot-gate',
      'emergency-gate',
      'Robot physical support remains readiness-only until approved.',
      'Emergency path is visible but not automatically dispatched.',
    ],
  },
  {
    label: 'Alerting safety',
    file: 'src/features/saven/services/savenAlertingService.ts',
    markers: [
      'Robot gate is unsafe',
      'Freeze robot physical action',
      'Emergency gate is unsafe',
      'Keep emergency route visible only',
    ],
  },
  {
    label: 'Edge Function safety',
    file: 'supabase/functions/saven-gateway/index.ts',
    markers: [
      'blocked_external_dispatch',
      'Block automatic dispatch',
      'Show robot readiness while physical action remains locked.',
      'No external dispatch',
    ],
  },
  {
    label: 'Admin Ops safety surface',
    file: 'src/pages/AdminPanel.tsx',
    markers: [
      'robot gate',
      'emergency gate',
      'Review robot action',
      'data-saven-admin-incident-readiness="true"',
      'data-saven-admin-worker-shift="true"',
    ],
  },
  {
    label: 'Launch record safety evidence',
    file: 'docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md',
    markers: [
      'Robot Emergency Safety Gate',
      'robot-emergency:saven',
      'Robot/emergency safety reviewer',
    ],
  },
  {
    label: 'Cutover safety gate',
    file: 'docs/SAVEN_PRODUCTION_CUTOVER_CHECKLIST.md',
    markers: [
      'Robot Emergency Safety Gate',
      'robot-emergency:saven',
      'blocked_external_dispatch',
    ],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN robot emergency safety artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN robot emergency safety marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[robot-emergency] ok ${check.label}`);
}

console.log('SAVEN robot emergency safety gate audit passed.');
