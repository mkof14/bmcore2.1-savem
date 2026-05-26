import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (packageJson.scripts?.['next-phase:saven'] !== 'node scripts/saven-next-phase-map-audit.mjs') {
  throw new Error('package.json is missing next-phase:saven script.');
}
console.log('[next-phase] ok package next-phase:saven script');

for (const script of ['handoff-final:saven', 'values-ready:saven', 'strict-go:saven', 'prod-smoke:saven']) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[next-phase] ok package ${script} script`);
}

const checks = [
  ['docs/SAVEN_NEXT_PHASE_MAP.md', ['SAVEN Next Phase Map', 'Phase A: Real Production Values', 'Phase B: Live Admin Operations', 'Phase C: First-Hour Watch', 'Phase D: Human GO Decision']],
  ['docs/SAVEN_FINAL_HANDOFF.md', ['Remaining Before Live GO']],
  ['docs/SAVEN_PRODUCTION_GO_HANDOFF.md', ['SAVEN Production GO Handoff']],
  ['docs/SAVEN_STRICT_GO.md', ['Strict Mode']],
];

for (const [file, markers] of checks) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing next phase artifact: ${file}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing next phase marker in ${file}: ${marker}`);
    }
  }
  console.log(`[next-phase] ok ${file}`);
}

console.log('SAVEN next phase map audit passed.');
