import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (packageJson.scripts?.['values-worksheet:saven'] !== 'node scripts/saven-production-values-worksheet-audit.mjs') {
  throw new Error('package.json is missing values-worksheet:saven script.');
}
console.log('[values-worksheet] ok package values-worksheet:saven script');

for (const script of ['values-ready:saven', 'production-values:saven', 'strict-go:saven', 'next-phase:saven']) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[values-worksheet] ok package ${script} script`);
}

const checks = [
  ['docs/SAVEN_PRODUCTION_VALUES_WORKSHEET.md', ['SAVEN Production Values Worksheet', 'Public Values To Record In Launch Record', 'Secrets Not To Commit', 'Fill Order', 'Strict Checks']],
  ['docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md', ['Production URL', 'Launch decision', 'Supabase project', 'Edge Function URL']],
  ['docs/SAVEN_PRODUCTION_VALUES_READY.md', ['Required Production Values', 'Values Ready Rule']],
  ['docs/SAVEN_NEXT_PHASE_MAP.md', ['Phase A: Real Production Values']],
  ['.env.saven.example', ['VITE_SUPABASE_URL', 'VITE_SAVEN_EDGE_FUNCTION_URL']],
];

for (const [file, markers] of checks) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing values worksheet artifact: ${file}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing values worksheet marker in ${file}: ${marker}`);
    }
  }
  console.log(`[values-worksheet] ok ${file}`);
}

console.log('SAVEN production values worksheet audit passed.');
