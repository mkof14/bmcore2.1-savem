import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (packageJson.scripts?.['final-seal:saven'] !== 'node scripts/saven-final-seal-audit.mjs') {
  throw new Error('package.json is missing final-seal:saven script.');
}
console.log('[final-seal] ok package final-seal:saven script');

const requiredScripts = [
  'release:saven',
  'production-release:saven',
  'ready:saven',
  'incident-drill:saven',
  'rollback-proof:saven',
  'operator-evidence:saven',
  'live-watch:saven',
  'signoff:saven',
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[final-seal] ok package ${script} script`);
}

const checks = [
  ['docs/SAVEN_FINAL_SEAL.md', ['SAVEN Final Seal', 'Final Seal Model', 'Final Seal Holds', 'Final Command']],
  ['docs/SAVEN_OPERATOR_SIGNOFF.md', ['SAVEN Operator Sign-Off', 'Sign-Off Rule']],
  ['docs/SAVEN_LIVE_WATCH_CHECKLIST.md', ['SAVEN Live Watch Checklist', 'Live Watch Signals']],
  ['docs/SAVEN_OPERATOR_EVIDENCE.md', ['SAVEN Operator Evidence Package']],
  ['docs/SAVEN_PRODUCTION_EVIDENCE_INDEX.md', ['Final Seal', 'Operator Evidence Package']],
  ['docs/SAVEN_RELEASE_HANDOFF.md', ['Final Seal', 'Post-Launch Control Stack']],
  ['scripts/saven-full-readiness.mjs', ['Live watch checklist', 'Operator sign-off', 'Final seal package']],
  ['scripts/saven-production-release-orchestrator.mjs', ['final-seal:saven', 'SAVEN Final Seal']],
  ['scripts/saven-release-readiness-audit.mjs', ['final-seal:saven', 'SAVEN Final Seal']],
];

for (const [file, markers] of checks) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing final seal artifact: ${file}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing final seal marker in ${file}: ${marker}`);
    }
  }
  console.log(`[final-seal] ok ${file}`);
}

console.log('SAVEN final seal audit passed.');
