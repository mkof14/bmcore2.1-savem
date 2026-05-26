import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (packageJson.scripts?.['rc-proof:saven'] !== 'node scripts/saven-rc-proof-audit.mjs') {
  throw new Error('package.json is missing rc-proof:saven script.');
}
console.log('[rc-proof] ok package rc-proof:saven script');

for (const script of ['release:saven', 'production-release:saven', 'ready:saven', 'strict-go:saven', 'release-lock:saven']) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[rc-proof] ok package ${script} script`);
}

const checks = [
  ['docs/SAVEN_RC_PROOF.md', ['SAVEN RC Proof', 'RC Proof', 'RC-Safe Result']],
  ['docs/SAVEN_STRICT_GO.md', ['SAVEN Strict GO', 'Strict GO Boundary']],
  ['docs/SAVEN_RELEASE_LOCK.md', ['SAVEN Release Lock']],
  ['docs/SAVEN_FINAL_SEAL.md', ['SAVEN Final Seal']],
  ['docs/SAVEN_CLEAN_RELEASE_PASS.md', ['SAVEN Clean Release Pass']],
  ['docs/SAVEN_PRODUCTION_GO_DECISION.md', ['SAVEN Production GO Decision']],
];

for (const [file, markers] of checks) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing RC proof artifact: ${file}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing RC proof marker in ${file}: ${marker}`);
    }
  }
  console.log(`[rc-proof] ok ${file}`);
}

console.log('SAVEN RC proof audit passed.');
