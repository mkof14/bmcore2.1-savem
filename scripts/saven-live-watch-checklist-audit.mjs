import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (packageJson.scripts?.['live-watch:saven'] !== 'node scripts/saven-live-watch-checklist-audit.mjs') {
  throw new Error('package.json is missing live-watch:saven script.');
}
console.log('[live-watch] ok package live-watch:saven script');

for (const script of ['incident-drill:saven', 'operator-evidence:saven', 'launch-room:saven', 'prod-smoke:saven', 'admin-alerts:saven']) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[live-watch] ok package ${script} script`);
}

const checks = [
  ['docs/SAVEN_LIVE_WATCH_CHECKLIST.md', ['SAVEN Live Watch Checklist', 'Live Watch Signals', 'Hold Signals']],
  ['docs/SAVEN_POSTLAUNCH_INCIDENT_DRILL.md', ['SAVEN Post-Launch Incident Drill', 'Drill Scenario']],
  ['docs/SAVEN_LAUNCH_ROOM_RUNBOOK.md', ['First 15 Minutes', 'First Hour']],
  ['docs/SAVEN_POST_LAUNCH_OPS.md', ['First 15 Minutes', 'Day 1']],
  ['src/pages/AdminPanel.tsx', ['data-saven-admin', 'listEventAudit', 'reviewCommandPermission']],
  ['src/features/saven/services/savenMonitoringSloService.ts', ['robot-gate', 'emergency-gate']],
  ['src/features/saven/services/savenAlertingService.ts', ['Emergency gate is unsafe', 'Robot gate is unsafe']],
];

for (const [file, markers] of checks) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing live watch artifact: ${file}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing live watch marker in ${file}: ${marker}`);
    }
  }
  console.log(`[live-watch] ok ${file}`);
}

console.log('SAVEN live watch checklist audit passed.');
