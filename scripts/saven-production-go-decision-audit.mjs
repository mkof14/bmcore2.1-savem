import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (packageJson.scripts?.['production-go:saven'] !== 'node scripts/saven-production-go-decision-audit.mjs') {
  throw new Error('package.json is missing production-go:saven script.');
}
console.log('[production-go] ok package production-go:saven script');

for (const script of ['clean-release:saven', 'go-handoff:saven', 'production-values:saven', 'go-dry-run:saven', 'final-seal:saven']) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[production-go] ok package ${script} script`);
}

const checks = [
  ['docs/SAVEN_PRODUCTION_GO_DECISION.md', ['SAVEN Production GO Decision', 'Decision States', 'Required Evidence For GO', 'Safety Language']],
  ['docs/SAVEN_PRODUCTION_GO_HANDOFF.md', ['SAVEN Production GO Handoff', 'GO Handoff Rule']],
  ['docs/SAVEN_CLEAN_RELEASE_PASS.md', ['SAVEN Clean Release Pass']],
  ['docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md', ['Launch decision', 'RC ONLY']],
  ['docs/SAVEN_PRODUCTION_GO_NO_GO.md', ['GO', 'HOLD', 'RC ONLY']],
  ['docs/SAVEN_ROBOT_EMERGENCY_SAFETY_GATE.md', ['Robot Boundary', 'Emergency Boundary']],
  ['docs/SAVEN_PRODUCTION_DISPATCH_LOCK.md', ['Dispatch Lock Model']],
];

for (const [file, markers] of checks) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing production GO artifact: ${file}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing production GO marker in ${file}: ${marker}`);
    }
  }
  console.log(`[production-go] ok ${file}`);
}

console.log('SAVEN production GO decision audit passed.');
