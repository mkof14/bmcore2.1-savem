import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['launch-room:saven'] !== 'node scripts/saven-launch-room-runbook-audit.mjs') {
  throw new Error('package.json is missing launch-room:saven script.');
}
console.log('[launch-room] ok package launch-room:saven script');

const requiredScripts = [
  'final-operator:saven',
  'go-dry-run:saven',
  'production-values:saven',
  'rc-freeze:saven',
  'robot-emergency:saven',
  'dispatch-lock:saven',
  'privacy-live:saven',
  'admin-access:saven',
  'production-release:saven',
  'ready:saven',
  'prod-smoke:saven',
  'rollback:saven',
  'postlaunch:saven',
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[launch-room] ok package ${script} script`);
}

const checks = [
  {
    label: 'Launch room runbook',
    file: 'docs/SAVEN_LAUNCH_ROOM_RUNBOOK.md',
    markers: [
      'SAVEN Launch Room Runbook',
      'Launch Room Roles',
      'T-24 Hours',
      'T-1 Hour',
      'T-0 Decision',
      'First 15 Minutes',
      'First Hour',
      'Rollback Trigger',
      'launch-room:saven',
    ],
  },
  {
    label: 'Final operator packet',
    file: 'docs/SAVEN_FINAL_OPERATOR_PACKET.md',
    markers: ['SAVEN Final Operator Packet', 'Strict GO Rehearsal', 'Operator Decision'],
  },
  {
    label: 'Post launch ops',
    file: 'docs/SAVEN_POST_LAUNCH_OPS.md',
    markers: ['SAVEN Post-Launch Ops Package', 'First Hour', 'npm run postlaunch:saven'],
  },
  {
    label: 'Rollback drill',
    file: 'docs/SAVEN_ROLLBACK_DRILL.md',
    markers: ['SAVEN Rollback Drill Package', 'Immediate Hold Triggers', 'Recovery Proof'],
  },
  {
    label: 'Launch record',
    file: 'docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md',
    markers: ['Launch Room Runbook', 'launch-room:saven', 'First-hour watch owner'],
  },
  {
    label: 'Release handoff',
    file: 'docs/SAVEN_RELEASE_HANDOFF.md',
    markers: ['Launch Room Runbook', 'launch-room:saven', 'T-24'],
  },
  {
    label: 'Evidence index',
    file: 'docs/SAVEN_PRODUCTION_EVIDENCE_INDEX.md',
    markers: ['Launch Room Runbook', 'launch-room:saven', 'RC-ready package'],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN launch room artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN launch room marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[launch-room] ok ${check.label}`);
}

console.log('SAVEN launch room runbook audit passed.');
