import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (packageJson.scripts?.['go-handoff:saven'] !== 'node scripts/saven-production-go-handoff-audit.mjs') {
  throw new Error('package.json is missing go-handoff:saven script.');
}
console.log('[go-handoff] ok package go-handoff:saven script');

for (const script of ['production-values:saven', 'go-dry-run:saven', 'final-seal:saven', 'clean-release:saven']) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[go-handoff] ok package ${script} script`);
}

const checks = [
  ['docs/SAVEN_PRODUCTION_GO_HANDOFF.md', ['SAVEN Production GO Handoff', 'GO Handoff Inputs', 'GO Handoff Checks', 'GO Handoff Rule']],
  ['docs/SAVEN_PRODUCTION_VALUES_INTAKE.md', ['SAVEN Production Values Intake Package', 'Strict GO Mode']],
  ['docs/SAVEN_GO_DECISION_DRY_RUN.md', ['SAVEN GO Decision Dry Run Package', 'Strict Mode']],
  ['docs/SAVEN_FINAL_SEAL.md', ['SAVEN Final Seal']],
  ['docs/SAVEN_OPERATOR_SIGNOFF.md', ['SAVEN Operator Sign-Off']],
  ['docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md', ['Launch decision', 'RC ONLY']],
];

for (const [file, markers] of checks) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing GO handoff artifact: ${file}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing GO handoff marker in ${file}: ${marker}`);
    }
  }
  console.log(`[go-handoff] ok ${file}`);
}

console.log('SAVEN production GO handoff audit passed.');
