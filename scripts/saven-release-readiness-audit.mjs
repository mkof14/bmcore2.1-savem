import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    label: 'Release env example',
    file: '.env.saven.example',
    markers: [
      'VITE_SAVEN_BACKEND_MODE=local',
      'SAVEN_DEPLOY_TARGET=production',
      'VITE_SAVEN_BACKEND_MODE=edge',
      'VITE_SAVEN_EDGE_FUNCTION_URL',
    ],
  },
  {
    label: 'Release handoff doc',
    file: 'docs/SAVEN_RELEASE_HANDOFF.md',
    markers: [
      'SAVEN Release Handoff',
      'npm run ready:saven',
      'npm run release:saven',
      'Admin And Monitoring Checklist',
      'Safety Gates',
    ],
  },
  {
    label: 'Full readiness includes release readiness',
    file: 'scripts/saven-full-readiness.mjs',
    markers: [
      'Release readiness',
      "['run', 'release:saven']",
    ],
  },
  {
    label: 'Deploy readiness still present',
    file: 'scripts/saven-deploy-readiness-audit.mjs',
    markers: [
      'Deploy readiness',
      'VITE_SAVEN_BACKEND_MODE',
    ],
  },
  {
    label: 'Production QA still present',
    file: 'scripts/saven-production-qa-audit.mjs',
    markers: [
      'Production QA',
      'SAVEN',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['preview:saven:auto'] !== 'node scripts/saven-production-preview-smoke.mjs') {\n  throw new Error('package.json is missing preview:saven:auto script.');\n}\nconsole.log('[release] ok package preview:saven:auto script');\n\nif (packageJson.scripts?.['ship:saven'] !== 'npm run ready:saven && npm run preview:saven:auto') {\n  throw new Error('package.json is missing ship:saven script.');\n}\nconsole.log('[release] ok package ship:saven script');\n\nif (packageJson.scripts?.['visual:saven'] !== 'node scripts/saven-visual-acceptance-audit.mjs') {\n  throw new Error('package.json is missing visual:saven script.');\n}\nconsole.log('[release] ok package visual:saven script');\n\nif (packageJson.scripts?.['release:saven'] !== 'node scripts/saven-release-readiness-audit.mjs') {
  throw new Error('package.json is missing release:saven script.');
}
console.log('[release] ok package release:saven script');

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing release file: ${check.file}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing release marker in ${check.file}: ${marker}`);
    }
  }
  console.log(`[release] ok ${check.label}`);
}

console.log('SAVEN release readiness audit passed.');
