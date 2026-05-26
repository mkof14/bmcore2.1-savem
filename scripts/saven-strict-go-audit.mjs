import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const strict = process.env.SAVEN_STRICT_GO === '1';
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (packageJson.scripts?.['strict-go:saven'] !== 'node scripts/saven-strict-go-audit.mjs') {
  throw new Error('package.json is missing strict-go:saven script.');
}
console.log('[strict-go] ok package strict-go:saven script');

for (const script of ['values-ready:saven', 'release-lock:saven', 'production-go:saven', 'go-dry-run:saven']) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[strict-go] ok package ${script} script`);
}

const checks = [
  ['docs/SAVEN_STRICT_GO.md', ['SAVEN Strict GO', 'Normal Mode', 'Strict Mode', 'Strict GO Boundary']],
  ['docs/SAVEN_PRODUCTION_VALUES_READY.md', ['SAVEN Production Values Ready']],
  ['docs/SAVEN_RELEASE_LOCK.md', ['SAVEN Release Lock']],
  ['docs/SAVEN_PRODUCTION_GO_DECISION.md', ['SAVEN Production GO Decision', 'Required Evidence For GO']],
  ['docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md', ['Launch decision', 'RC ONLY']],
];

for (const [file, markers] of checks) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing strict-go artifact: ${file}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing strict-go marker in ${file}: ${marker}`);
    }
  }
  console.log(`[strict-go] ok ${file}`);
}

if (strict) {
  const launchRecord = fs.readFileSync(path.join(root, 'docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md'), 'utf8');
  for (const blocker of ['pending', 'TBD', 'RC ONLY', 'your-project', 'your-domain']) {
    if (launchRecord.includes(blocker)) {
      throw new Error(`Strict GO mode failed: launch record still contains ${blocker}.`);
    }
  }
  console.log('[strict-go] ok strict GO launch record');
} else {
  console.log('[strict-go] RC-safe mode: set SAVEN_STRICT_GO=1 only after real production values are recorded.');
}

console.log('SAVEN strict GO audit passed.');
