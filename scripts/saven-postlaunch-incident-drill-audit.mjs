import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (packageJson.scripts?.['incident-drill:saven'] !== 'node scripts/saven-postlaunch-incident-drill-audit.mjs') {
  throw new Error('package.json is missing incident-drill:saven script.');
}
console.log('[incident-drill] ok package incident-drill:saven script');

for (const script of ['launch-room:saven', 'postlaunch:saven', 'alerts:saven', 'admin-alerts:saven', 'workers:saven', 'dispatch-lock:saven', 'robot-emergency:saven']) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[incident-drill] ok package ${script} script`);
}

const checks = [
  ['docs/SAVEN_POSTLAUNCH_INCIDENT_DRILL.md', ['SAVEN Post-Launch Incident Drill', 'Drill Scenario', 'Hold Conditions']],
  ['docs/SAVEN_LAUNCH_ROOM_RUNBOOK.md', ['First 15 Minutes', 'First Hour', 'Rollback Trigger']],
  ['docs/SAVEN_POST_LAUNCH_OPS.md', ['First 15 Minutes', 'First Hour', 'Rollback Triggers']],
  ['src/pages/AdminPanel.tsx', ['reviewCommandPermission', 'listEventAudit', 'data-saven-admin']],
  ['src/features/saven/services/savenAlertingService.ts', ['Emergency gate is unsafe', 'Keep emergency route visible only']],
  ['src/features/saven/services/savenCommandExecutionService.ts', ['blocked_external_dispatch', 'Show robot readiness while physical action remains locked.']],
];

for (const [file, markers] of checks) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing incident drill artifact: ${file}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing incident drill marker in ${file}: ${marker}`);
    }
  }
  console.log(`[incident-drill] ok ${file}`);
}

console.log('SAVEN post-launch incident drill audit passed.');
