import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const strict = process.env.SAVEN_STRICT_PRODUCTION_VALUES === '1';
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (packageJson.scripts?.['values-ready:saven'] !== 'node scripts/saven-production-values-ready-audit.mjs') {
  throw new Error('package.json is missing values-ready:saven script.');
}
console.log('[values-ready] ok package values-ready:saven script');

for (const script of ['production-values:saven', 'go-handoff:saven', 'production-go:saven']) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[values-ready] ok package ${script} script`);
}

const checks = [
  ['docs/SAVEN_PRODUCTION_VALUES_READY.md', ['SAVEN Production Values Ready', 'Required Production Values', 'Values Ready Rule', 'Hold Rule']],
  ['docs/SAVEN_PRODUCTION_VALUES_INTAKE.md', ['SAVEN Production Values Intake Package', 'Strict GO Mode']],
  ['docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md', ['Production URL', 'Decision owner', 'Backend owner', 'Rollback owner']],
  ['.env.saven.example', ['VITE_SAVEN_BACKEND_MODE=edge', 'VITE_SAVEN_EDGE_FUNCTION_URL', 'VITE_SUPABASE_URL']],
];

for (const [file, markers] of checks) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing values-ready artifact: ${file}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing values-ready marker in ${file}: ${marker}`);
    }
  }
  console.log(`[values-ready] ok ${file}`);
}

if (strict) {
  const launchRecord = fs.readFileSync(path.join(root, 'docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md'), 'utf8');
  for (const blocker of ['pending', 'TBD', 'RC ONLY', 'your-project', 'your-domain']) {
    if (launchRecord.includes(blocker)) {
      throw new Error(`Strict production values ready mode failed: launch record still contains ${blocker}.`);
    }
  }
  console.log('[values-ready] ok strict production values ready mode');
} else {
  console.log('[values-ready] RC-safe mode: strict production values are not required yet.');
}

console.log('SAVEN production values ready audit passed.');
