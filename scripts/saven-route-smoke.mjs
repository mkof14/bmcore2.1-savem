import fs from 'node:fs';

const baseUrl = process.env.SAVEN_SMOKE_BASE_URL || 'http://127.0.0.1:5173';

const routes = [
  '/app/saven',
  '/app/saven/life-setup',
  '/app/saven/today',
  '/app/saven/commands',
  '/app/saven/support',
  '/app/saven/lifecycle',
  '/app/saven/daily-plan',
  '/app/saven/continuity',
  '/app/saven/timeline',
  '/app/saven/circle',
  '/app/saven/recovery',
  '/app/saven/care-routes',
  '/app/saven/robots',
  '/app/saven/devices',
  '/app/saven/environments',
  '/app/saven/verification',
  '/app/saven/settings',
  '/app/saven/faq',
  '/app/saven/learning',
];

const sourceExpectations = [
  ['Dedicated Commands page', ['SAVEN Dispatch', 'Voice becomes assigned support', 'Command pad', 'Prepared command']],
  ['Operating Chain', ['data-saven-operating-chain="true"', 'SAVEN operating chain']],
  ['Start Operator Shortcuts', ['data-saven-start-shortcuts="true"', 'Operator shortcuts']],
  ['Launch Assurance', ['data-saven-launch-assurance="true"', 'Launch assurance']],
  ['Life Setup Rail', ['data-saven-life-setup-rail="true"', 'Setup command rail']],
  ['Care Routes page', ['function SavenCareRoutes()', 'Care Routes']],
  ['Backend Gateway map', ['SavenBackendGatewayPanel', 'Backend gateway map', 'Backend Gateway Map', 'backend gateway']],
  ['Monitoring Contract', ['SavenMonitoringSnapshot', 'createSavenMonitoringSnapshot', 'getMonitoringSnapshot']],
  ['Monitoring SLO Kit', ['Monitoring SLO Kit', 'createSavenMonitoringSloReport', 'monitoring:saven', 'robot gate']],
  ['Alerting Runbook Kit', ['Alerting Runbook Kit', 'createSavenOpsAlerts', 'alerts:saven', 'emergency_review']],
  ['Event Audit Model', ['SavenEventAuditRecord', 'createSavenEventAuditRecords', 'listEventAudit', 'saven_events']],
  ['Command Contract Fixtures', ['savenCommandAcceptanceFixtures', 'nurse-follow-up', 'robot-readiness-review', 'emergency-rule-display']],
  ['Worker Handoff Kit', ['SAVEN Worker Handoff Kit', 'savenWorkerEndpoints', 'workers:saven', 'automatic_external_dispatch']],
  ['HTTP Backend Adapter', ['createSavenHttpBackendAdapter', '/admin-overrides', '/monitoring']],
  ['Backend Gateway Selector', ['createSavenBackendGatewayFromEnv', 'VITE_SAVEN_BACKEND_MODE', 'savenBackendGateway']],
  ['Backend API Contract', ['savenBackendApiRoutes', 'getSavenBackendApiRoute', 'savenHumanConfirmedRouteIds', 'incident_readiness']],
  ['Backend Readiness Audit', ['saven-backend-readiness-audit.mjs', 'backend:saven', 'Backend readiness']],
  ['Deploy Readiness Audit', ['saven-deploy-readiness-audit.mjs', 'deploy:saven', 'SAVEN Deploy Readiness', 'SAVEN_DEPLOY_TARGET']],
  ['Production QA Audit', ['saven-production-qa-audit.mjs', 'qa:saven', 'SAVEN Production QA Checklist', 'Release decision']],
  ['Supabase Schema Draft', ['saven_backend_schema_draft', 'saven_admin_overrides', 'saven_verifications']],
  ['Supabase Migration Kit', ['Supabase Migration Kit', '001_saven_core_schema.sql', '002_saven_review_seed.sql', 'db:saven']],
  ['Supabase Persistence Bridge', ['createSavenSupabasePersistenceRepository', 'savenPersistenceTables', 'getPersistenceStatus', 'data-saven-admin-persistence-status="true"']],
  ['RLS Policy Draft', ['saven_rls_policy_draft', 'is_saven_admin', 'Critical writes']],
  ['Edge Function Gateway Draft', ['saven-gateway', 'ALLOWED_ACTIONS', 'No external dispatch']],
  ['Edge Function Package', ['Edge Function Package', 'edge:saven', 'supabase/functions/saven-gateway/index.ts', 'review_command_permission']],
  ['Edge Function Backend Adapter', ['createSavenEdgeFunctionBackendAdapter', 'VITE_SAVEN_EDGE_FUNCTION_URL', 'apply_admin_override']],
  ['Backend Monitoring Admin', ['data-saven-admin-ops="true"', 'SAVEN Backend, Monitoring, and Admin Foundation']],
  ['Admin Monitoring Snapshot', ['data-saven-admin-monitoring-live="true"', 'getMonitoringSnapshot()']],
  ['Admin SLO Panel', ['data-saven-admin-slo="true"', 'SAVEN SLO posture', 'createSavenMonitoringSloReport']],
  ['Admin Alert Routes Panel', ['data-saven-admin-alerts="true"', 'SAVEN alert routes', 'createSavenOpsAlerts']],
  ['Admin Worker Shift Board', ['data-saven-admin-worker-shift="true"', 'SAVEN worker shift board', 'createSavenWorkerShiftBoard']],
  ['Admin Override Contract', ['data-saven-admin-overrides="true"', 'SavenAdminOverrideResult', 'applyAdminOverride']],
  ['Admin Event Audit Review', ['data-saven-admin-event-audit="true"', 'SAVEN Ops event timeline', 'listEventAudit()']],
  ['Incident Readiness Model', ['SavenIncidentReadiness', 'createSavenIncidentReadiness', 'data-saven-admin-incident-readiness="true"', 'saven_incidents']],
  ['Executor Command Rails', ['data-saven-executor-command="care"', 'data-saven-executor-command="robot"', 'data-saven-executor-command="device"']],
  ['Robot Device Service Matrix', ['Robot / Device Service Matrix', 'Robot Device Service Matrix', 'Physical orchestration', 'Physical support becomes visible', 'Physical support becomes visible, permissioned, and verified']],
  ['Device Verification Gateway', ['Device Gateway', 'verification gateway for real-world support']],
  ['Environment Permissions', ['Environment permissions', 'Environment flow']],
  ['Gate Proof Centers', ['data-saven-gate-center="environment"', 'data-saven-gate-center="verification"']],
  ['Verification Engine', ['Verification Engine', 'Open verifications']],
  ['Live Shift Belt', ['Live shift belt', 'SavenLiveShiftBelt']],
  ['Today Operational Clarity', ['Today operational clarity', 'TodayOperationalClarity']],
  ['Timeline Operational Clarity', ['TimelineOperationalClarity', 'Timeline clarity']],
  ['Lifecycle Command Strip', ['data-saven-lifecycle-command="true"', 'Lifecycle command strip']],
  ['Operations Rails', ['data-saven-operations-rail="lifecycle"', 'data-saven-operations-rail="daily-plan"', 'data-saven-operations-rail="continuity"']],
  ['Human Recovery Rails', ['data-saven-human-rail="timeline"', 'data-saven-human-rail="circle"', 'data-saven-human-rail="recovery"']],
  ['Voice Settings', ['Speak with SAVEN']],
  ['Practice Training Layer', ['data-saven-practice-layer="faq"', 'data-saven-practice-layer="learning"']],
  ['Visual Acceptance', ['Visual Acceptance', 'visual:saven', 'SAVEN_VISUAL_ACCEPTANCE', 'dark-operational']],
  ['Security Privacy Guardrails', ['SAVEN Security And Privacy Guardrails', 'privacy:saven', 'savenPrivacyPolicyMatrix', 'emergency_route']],
  ['Ops Evidence Pack', ['SAVEN Ops Evidence Pack', 'createSavenOpsEvidencePack', 'evidence:saven', 'saven-ops-evidence-pack']],
  ['Admin Ops Evidence Panel', ['data-saven-admin-evidence-pack="true"', 'SAVEN ops evidence', 'admin-evidence:saven']],
  ['Launch Control Kit', ['SAVEN Launch Control Kit', 'createSavenLaunchControlReport', 'launch:saven', 'saven-launch-control-report']],
  ['Admin Launch Control Panel', ['data-saven-admin-launch-control="true"', 'SAVEN launch control', 'admin-launch:saven']],
  ['Final Ship Manifest', ['SAVEN Final Ship Manifest', 'manifest:saven', 'Voice And Worker Layer', 'Release Control']],
  ['Release Candidate Snapshot', ['SAVEN Release Candidate Snapshot', 'rc:saven', 'Go / Hold Review', 'GitHub Release Prep']],
  ['GitHub Release Package', ['SAVEN GitHub Release Notes', 'github-release:saven', 'bmcore2.1-savem-rc1', 'Production Holds']],
  ['Final Readiness Report', ['SAVEN Final Readiness Report']],
];

async function checkRoute(route) {
  const url = baseUrl + route;
  let response;

  try {
    response = await fetch(url, { redirect: 'manual' });
  } catch {
    throw new Error('Cannot reach ' + baseUrl + '. Start it first with: npm run dev:saven');
  }

  const text = await response.text();
  const contentType = response.headers.get('content-type') || '';

  if (response.status !== 200) {
    throw new Error(route + ' returned HTTP ' + response.status);
  }

  if (!contentType.includes('text/html')) {
    throw new Error(route + ' returned unexpected content-type: ' + contentType);
  }

  if (!text.includes('<div id="root"></div>')) {
    throw new Error(route + ' did not return the app shell');
  }

  return route;
}

function readProjectFile(relativePath) {
  return fs.readFileSync(new URL('../' + relativePath, import.meta.url), 'utf8');
}

async function main() {
  console.log('SAVEN smoke check against ' + baseUrl);

  const routeResults = await Promise.all(routes.map(checkRoute));
  for (const route of routeResults) {
    console.log('[route] ok ' + route);
  }

  const savenPage = readProjectFile('src/pages/Saven.tsx');
  const readinessReport = readProjectFile('docs/SAVEN_FINAL_READINESS_REPORT.md');
  const adminPanel = readProjectFile('src/pages/AdminPanel.tsx');
  const backendMonitoringAdmin = readProjectFile('docs/SAVEN_BACKEND_MONITORING_ADMIN.md');
  const splitPageDir = new URL('../src/features/saven/pages/', import.meta.url);
  const splitPages = fs.existsSync(splitPageDir)
    ? fs.readdirSync(splitPageDir)
        .filter((file) => file.endsWith('.tsx'))
        .map((file) => fs.readFileSync(new URL(file, splitPageDir), 'utf8'))
        .join('\n')
    : '';
  const combined = savenPage + '\n' + readinessReport + '\n' + adminPanel + '\n' + backendMonitoringAdmin + '\n' + splitPages;

  for (const [label, expectedOptions] of sourceExpectations) {
    const matched = expectedOptions.some((expected) => combined.includes(expected));
    if (!matched) {
      throw new Error('Missing expected SAVEN marker: ' + label + ' -> ' + expectedOptions.join(' | '));
    }
    console.log('[marker] ok ' + label);
  }

  if (combined.includes('Cannot find name')) {
    throw new Error('Source contains unresolved TypeScript error text');
  }

  console.log('SAVEN smoke check passed.');
}

main().catch((error) => {
  console.error('SAVEN smoke check failed.');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
