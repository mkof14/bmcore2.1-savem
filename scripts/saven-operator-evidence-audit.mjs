import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (packageJson.scripts?.['operator-evidence:saven'] !== 'node scripts/saven-operator-evidence-audit.mjs') {
  throw new Error('package.json is missing operator-evidence:saven script.');
}
console.log('[operator-evidence] ok package operator-evidence:saven script');

for (const script of ['final-operator:saven', 'launch-room:saven', 'incident-drill:saven', 'rollback-proof:saven', 'go-dry-run:saven']) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[operator-evidence] ok package ${script} script`);
}

const checks = [
  ['docs/SAVEN_OPERATOR_EVIDENCE.md', ['SAVEN Operator Evidence Package', 'Evidence Model', 'Operator Evidence Checklist', 'Decision Language']],
  ['docs/SAVEN_FINAL_OPERATOR_PACKET.md', ['SAVEN Final Operator Packet', 'One-Pass RC Check']],
  ['docs/SAVEN_LAUNCH_ROOM_RUNBOOK.md', ['Launch Room Roles', 'First Hour']],
  ['docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md', ['SAVEN Production Launch Record', 'Launch decision']],
  ['docs/SAVEN_PRODUCTION_EVIDENCE_INDEX.md', ['SAVEN production readiness', 'Operator Evidence Package']],
  ['docs/SAVEN_POSTLAUNCH_INCIDENT_DRILL.md', ['Post-Launch Incident Drill']],
  ['docs/SAVEN_ROLLBACK_PROOF.md', ['Rollback Proof Package']],
];

for (const [file, markers] of checks) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing operator evidence artifact: ${file}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing operator evidence marker in ${file}: ${marker}`);
    }
  }
  console.log(`[operator-evidence] ok ${file}`);
}

console.log('SAVEN operator evidence audit passed.');
