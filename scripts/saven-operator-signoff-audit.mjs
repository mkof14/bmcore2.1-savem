import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (packageJson.scripts?.['signoff:saven'] !== 'node scripts/saven-operator-signoff-audit.mjs') {
  throw new Error('package.json is missing signoff:saven script.');
}
console.log('[signoff] ok package signoff:saven script');

for (const script of ['final-operator:saven', 'operator-evidence:saven', 'live-watch:saven', 'rollback-proof:saven', 'go-dry-run:saven']) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[signoff] ok package ${script} script`);
}

const checks = [
  ['docs/SAVEN_OPERATOR_SIGNOFF.md', ['SAVEN Operator Sign-Off', 'Sign-Off Owners', 'Sign-Off Evidence', 'Sign-Off Rule']],
  ['docs/SAVEN_FINAL_OPERATOR_PACKET.md', ['SAVEN Final Operator Packet']],
  ['docs/SAVEN_OPERATOR_EVIDENCE.md', ['SAVEN Operator Evidence Package']],
  ['docs/SAVEN_LIVE_WATCH_CHECKLIST.md', ['SAVEN Live Watch Checklist']],
  ['docs/SAVEN_ROLLBACK_PROOF.md', ['SAVEN Rollback Proof Package']],
  ['docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md', ['Launch decision', 'RC ONLY']],
];

for (const [file, markers] of checks) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing operator signoff artifact: ${file}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing operator signoff marker in ${file}: ${marker}`);
    }
  }
  console.log(`[signoff] ok ${file}`);
}

console.log('SAVEN operator sign-off audit passed.');
