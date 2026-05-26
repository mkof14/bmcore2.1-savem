import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (packageJson.scripts?.['handoff-final:saven'] !== 'node scripts/saven-final-handoff-audit.mjs') {
  throw new Error('package.json is missing handoff-final:saven script.');
}
console.log('[handoff-final] ok package handoff-final:saven script');

for (const script of ['rc-proof:saven', 'strict-go:saven', 'production-go:saven', 'values-ready:saven']) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[handoff-final] ok package ${script} script`);
}

const checks = [
  ['docs/SAVEN_FINAL_HANDOFF.md', ['SAVEN Final Handoff', 'Current State', 'Completed', 'Remaining Before Live GO']],
  ['docs/SAVEN_RC_PROOF.md', ['SAVEN RC Proof']],
  ['docs/SAVEN_PRODUCTION_VALUES_READY.md', ['SAVEN Production Values Ready']],
  ['docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md', ['Launch decision', 'RC ONLY']],
  ['docs/SAVEN_RELEASE_HANDOFF.md', ['Final Handoff']],
  ['docs/SAVEN_PRODUCTION_EVIDENCE_INDEX.md', ['Final Handoff']],
];

for (const [file, markers] of checks) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing final handoff artifact: ${file}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing final handoff marker in ${file}: ${marker}`);
    }
  }
  console.log(`[handoff-final] ok ${file}`);
}

console.log('SAVEN final handoff audit passed.');
