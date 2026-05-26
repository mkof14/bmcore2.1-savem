import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (packageJson.scripts?.['release-lock:saven'] !== 'node scripts/saven-release-lock-audit.mjs') {
  throw new Error('package.json is missing release-lock:saven script.');
}
console.log('[release-lock] ok package release-lock:saven script');

for (const script of ['clean-release:saven', 'final-seal:saven', 'values-ready:saven', 'production-go:saven']) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[release-lock] ok package ${script} script`);
}

const checks = [
  ['docs/SAVEN_RELEASE_LOCK.md', ['SAVEN Release Lock', 'Release Lock States', 'Locked Safety Gates']],
  ['docs/SAVEN_FINAL_SEAL.md', ['SAVEN Final Seal']],
  ['docs/SAVEN_PRODUCTION_GO_DECISION.md', ['SAVEN Production GO Decision', 'Safety Language']],
  ['docs/SAVEN_PRODUCTION_DISPATCH_LOCK.md', ['Dispatch Lock Model']],
  ['docs/SAVEN_ROBOT_EMERGENCY_SAFETY_GATE.md', ['Robot Boundary', 'Emergency Boundary']],
  ['docs/SAVEN_LIVE_PRIVACY_REDACTION.md', ['Live Privacy Model']],
];

for (const [file, markers] of checks) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing release-lock artifact: ${file}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing release-lock marker in ${file}: ${marker}`);
    }
  }
  console.log(`[release-lock] ok ${file}`);
}

console.log('SAVEN release lock audit passed.');
