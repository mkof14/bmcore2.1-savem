#!/usr/bin/env node
import fs from 'node:fs';

const checks = [
  {
    label: 'Command acceptance fixtures',
    file: 'src/features/saven/services/savenCommandAcceptanceFixtures.ts',
    markers: ['savenCommandAcceptanceFixtures', 'nurse-follow-up', 'robot-readiness-review', 'emergency-rule-display'],
  },
  {
    label: 'Backend gateway contract',
    file: 'src/features/saven/contracts/savenBackendContract.ts',
    markers: ['SavenBackendGateway', 'SavenMonitoringSnapshot', 'SavenAdminOverrideResult', 'SavenEventAuditRecord', 'SavenIncidentReadiness', 'SavenPersistenceStatus', 'SavenCommandPermissionReview', 'applyAdminOverride', 'listEventAudit', 'getIncidentReadiness', 'getPersistenceStatus', 'reviewCommandPermission'],
  },
  {
    label: 'Local backend gateway',
    file: 'src/features/saven/services/savenLocalBackendGateway.ts',
    markers: ['createSavenLocalBackendGateway', 'getMonitoringSnapshot', 'listEventAudit', 'getIncidentReadiness', 'getPersistenceStatus', 'reviewCommandPermission', 'applyAdminOverride'],
  },
  {
    label: 'Monitoring service',
    file: 'src/features/saven/services/savenMonitoringService.ts',
    markers: ['createSavenMonitoringSnapshot', 'proofQueue', 'emergency-safety'],
  },
  {
    label: 'HTTP backend adapter',
    file: 'src/features/saven/services/savenHttpBackendAdapter.ts',
    markers: ['createSavenHttpBackendAdapter', 'getSavenBackendApiRoute', '/monitoring', '/persistence/status', '/events', '/incidents/readiness', '/commands/permission-review', '/admin-overrides'],
  },
  {
    label: 'Backend gateway selector',
    file: 'src/features/saven/services/savenBackendGatewaySelector.ts',
    markers: ['createSavenBackendGatewayFromEnv', 'VITE_SAVEN_BACKEND_MODE', 'VITE_SAVEN_BACKEND_URL', 'savenBackendGateway'],
  },
  {
    label: 'Admin Ops integration',
    file: 'src/pages/AdminPanel.tsx',
    markers: ['data-saven-admin-ops="true"', 'data-saven-admin-monitoring-live="true"', 'data-saven-admin-overrides="true"', 'data-saven-admin-persistence-status="true"', 'data-saven-admin-event-audit="true"', 'data-saven-admin-incident-readiness="true"', 'savenBackendGateway'],
  },
  {
    label: 'Backend monitoring docs',
    file: 'docs/SAVEN_BACKEND_MONITORING_ADMIN.md',
    markers: ['SAVEN Deploy Readiness', 'Backend API Contract', 'Backend Gateway Selector', 'HTTP Backend Adapter', 'Admin Override Contract', 'Monitoring Contract Implementation'],
  },
  {
    label: 'Supabase schema draft',
    file: 'supabase/migrations/20260524090000_saven_backend_schema_draft.sql',
    markers: ['saven_profiles', 'saven_tasks', 'saven_commands', 'saven_verifications', 'saven_admin_overrides', 'saven_events', 'saven_incidents'],
  },
  {
    label: 'RLS policy draft',
    file: 'supabase/migrations/20260524091000_saven_rls_policy_draft.sql',
    markers: ['is_saven_admin', 'enable row level security', 'saven incidents owner or admin read', 'saven events owner or admin read', 'saven admin overrides admin only', 'Critical writes'],
  },
  {
    label: 'Edge Function gateway draft',
    file: 'supabase/functions/saven-gateway/index.ts',
    markers: ['ALLOWED_ACTIONS', 'persistence_status', 'list_events', 'incident_readiness', 'review_command_permission', 'apply_admin_override', 'No external dispatch', 'Admin access required'],
  },
  {
    label: 'Edge Function backend adapter',
    file: 'src/features/saven/services/savenEdgeFunctionBackendAdapter.ts',
    markers: ['createSavenEdgeFunctionBackendAdapter', 'persistence_status', 'list_events', 'incident_readiness', 'review_command_permission', 'apply_admin_override', 'VITE_SAVEN_EDGE_FUNCTION_URL'],
  },
];

function read(relativePath) {
  return fs.readFileSync(new URL('../' + relativePath, import.meta.url), 'utf8');
}

console.log('SAVEN backend readiness audit');

for (const check of checks) {
  const source = read(check.file);
  for (const marker of check.markers) {
    if (!source.includes(marker)) {
      console.error('Missing backend readiness marker: ' + check.label + ' -> ' + marker);
      process.exit(1);
    }
  }
  console.log('[backend] ok ' + check.label);
}

const selector = read('src/features/saven/services/savenBackendGatewaySelector.ts');
if (!selector.includes("env.VITE_SAVEN_BACKEND_MODE ?? 'local'")) {
  console.error('SAVEN backend selector must default to local mode.');
  process.exit(1);
}

console.log('SAVEN backend readiness audit passed.');
