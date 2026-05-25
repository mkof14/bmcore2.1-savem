import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['live-monitoring:saven'] !== 'node scripts/saven-live-monitoring-activation-audit.mjs') {
  throw new Error('package.json is missing live-monitoring:saven script.');
}
console.log('[live-monitoring] ok package live-monitoring:saven script');

const requiredScripts = [
  'live-backend:saven',
  'monitoring:saven',
  'alerts:saven',
  'admin-alerts:saven',
  'evidence:saven',
  'admin-evidence:saven',
  'admin:saven',
  'cutover:saven',
  'launch-record:saven',
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[live-monitoring] ok package ${script} script`);
}

const checks = [
  {
    label: 'Live monitoring activation package',
    file: 'docs/SAVEN_LIVE_MONITORING_ACTIVATION.md',
    markers: [
      'SAVEN Live Monitoring Activation Package',
      'Monitoring Activation Order',
      'First-Hour Metrics',
      'Alert Route Expectations',
      'Monitoring Holds',
    ],
  },
  {
    label: 'Monitoring SLO kit',
    file: 'docs/SAVEN_MONITORING_SLO_KIT.md',
    markers: ['SAVEN Monitoring SLO Kit', 'command backlog', 'robot gate', 'emergency gate'],
  },
  {
    label: 'Alerting runbook kit',
    file: 'docs/SAVEN_ALERTING_RUNBOOK_KIT.md',
    markers: ['SAVEN Alerting Runbook Kit', 'robot_review', 'emergency_review', 'proof-wait-slo'],
  },
  {
    label: 'Ops evidence pack',
    file: 'docs/SAVEN_OPS_EVIDENCE_PACK.md',
    markers: ['SAVEN Ops Evidence Pack', 'release posture', 'operator narrative'],
  },
  {
    label: 'Admin Ops monitoring surface',
    file: 'src/pages/AdminPanel.tsx',
    markers: [
      'data-saven-admin-monitoring-live="true"',
      'data-saven-admin-slo="true"',
      'data-saven-admin-alerts="true"',
      'data-saven-admin-evidence-pack="true"',
      'data-saven-admin-event-audit="true"',
      'data-saven-admin-incident-readiness="true"',
      'data-saven-admin-worker-shift="true"',
    ],
  },
  {
    label: 'Production launch record',
    file: 'docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md',
    markers: ['First-hour watch owner', 'First-Hour Watch', 'Production route smoke'],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN live monitoring artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN live monitoring marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[live-monitoring] ok ${check.label}`);
}

console.log('SAVEN live monitoring activation audit passed.');
