import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (packageJson.scripts?.['rollback-proof:saven'] !== 'node scripts/saven-rollback-proof-audit.mjs') {
  throw new Error('package.json is missing rollback-proof:saven script.');
}
console.log('[rollback-proof] ok package rollback-proof:saven script');

for (const script of ['rollback:saven', 'launch-room:saven', 'prod-smoke:saven', 'operator-brief:saven', 'evidence-index:saven']) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[rollback-proof] ok package ${script} script`);
}

const checks = [
  ['docs/SAVEN_ROLLBACK_PROOF.md', ['SAVEN Rollback Proof Package', 'Rollback Proof Model', 'Proof Sequence']],
  ['docs/SAVEN_ROLLBACK_DRILL.md', ['SAVEN Rollback Drill Package', 'Recovery Proof']],
  ['docs/SAVEN_LAUNCH_ROOM_RUNBOOK.md', ['Rollback Trigger', 'rollback owner']],
  ['docs/SAVEN_POST_LAUNCH_OPS.md', ['Rollback Triggers']],
  ['docs/SAVEN_PRODUCTION_EVIDENCE_INDEX.md', ['rollback']],
  ['docs/SAVEN_RELEASE_OPERATOR_BRIEF.md', ['RC ONLY']],
];

for (const [file, markers] of checks) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing rollback proof artifact: ${file}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing rollback proof marker in ${file}: ${marker}`);
    }
  }
  console.log(`[rollback-proof] ok ${file}`);
}

console.log('SAVEN rollback proof audit passed.');
