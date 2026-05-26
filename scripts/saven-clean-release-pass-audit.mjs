import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (packageJson.scripts?.['clean-release:saven'] !== 'node scripts/saven-clean-release-pass-audit.mjs') {
  throw new Error('package.json is missing clean-release:saven script.');
}
console.log('[clean-release] ok package clean-release:saven script');

for (const script of ['release:saven', 'production-release:saven', 'ready:saven', 'final-seal:saven', 'signoff:saven', 'live-watch:saven']) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[clean-release] ok package ${script} script`);
}

const checks = [
  ['docs/SAVEN_CLEAN_RELEASE_PASS.md', ['SAVEN Clean Release Pass', 'Clean Pass Model', 'Clean Pass Commands', 'Clean Pass Holds']],
  ['docs/SAVEN_FINAL_SEAL.md', ['SAVEN Final Seal', 'Final Seal Model']],
  ['docs/SAVEN_OPERATOR_SIGNOFF.md', ['SAVEN Operator Sign-Off']],
  ['docs/SAVEN_LIVE_WATCH_CHECKLIST.md', ['SAVEN Live Watch Checklist']],
  ['docs/SAVEN_RELEASE_HANDOFF.md', ['Final Seal']],
  ['scripts/saven-full-readiness.mjs', ['Final seal package', 'Production build']],
  ['scripts/saven-production-release-orchestrator.mjs', ['final-seal:saven']],
  ['scripts/saven-release-readiness-audit.mjs', ['final-seal:saven']],
];

for (const [file, markers] of checks) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing clean release artifact: ${file}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing clean release marker in ${file}: ${marker}`);
    }
  }
  console.log(`[clean-release] ok ${file}`);
}

console.log('SAVEN clean release pass audit passed.');
