import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const strict = process.env.SAVEN_STRICT_VALUES_GAP === '1';
const launchRecordPath = path.join(root, 'docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md');
const launchRecord = fs.readFileSync(launchRecordPath, 'utf8');

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['values-gap:saven'] !== 'node scripts/saven-production-values-gap-report.mjs') {
  throw new Error('package.json is missing values-gap:saven script.');
}
console.log('[values-gap] ok package values-gap:saven script');

const requiredMarkers = [
  'SAVEN Production Launch Record',
  'Production URL',
  'Launch decision',
  'Decision owner',
  'Backend owner',
  'Rollback owner',
  'First-hour watch owner',
  'Supabase project',
  'Edge Function URL',
  'Production Values Intake',
];

for (const marker of requiredMarkers) {
  if (!launchRecord.includes(marker)) {
    throw new Error(`Launch record is missing marker: ${marker}`);
  }
}

const unresolvedRows = [];
const tableRowPattern = /^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/gm;
let match;
while ((match = tableRowPattern.exec(launchRecord))) {
  const field = match[1].trim();
  const value = match[2].trim();
  if (
    !['Field', '---'].includes(field) &&
    /\b(pending|TBD|RC ONLY|local until production env is set|review|not selected)\b/i.test(value)
  ) {
    unresolvedRows.push(`${field}: ${value}`);
  }
}

const unresolvedLines = [];
for (const line of launchRecord.split('\n')) {
  if (/^- .*:\s*(pending|TBD|RC ONLY)\s*$/i.test(line.trim())) {
    unresolvedLines.push(line.trim().replace(/^-\s*/, ''));
  }
}

const unresolved = [...unresolvedRows, ...unresolvedLines];

if (unresolved.length) {
  console.log('[values-gap] unresolved production values:');
  for (const item of unresolved) {
    console.log(' - ' + item);
  }
  if (strict) {
    throw new Error('Strict values gap mode failed: unresolved production values remain.');
  }
  console.log('[values-gap] RC-safe mode: unresolved values are allowed, but production GO must stay blocked.');
} else {
  console.log('[values-gap] ok no unresolved launch record placeholders detected');
}

console.log('SAVEN production values gap report passed.');
