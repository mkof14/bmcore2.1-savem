import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (packageJson.scripts?.['hosting:saven'] !== 'node scripts/saven-hosting-deployment-audit.mjs') {
  throw new Error('package.json is missing hosting:saven script.');
}

const checks = [
  {
    label: 'Hosting deployment package',
    file: 'docs/SAVEN_HOSTING_DEPLOYMENT_PACKAGE.md',
    markers: ['SAVEN Hosting Deployment Package', 'Vercel Setup', 'Promotion Gate', 'Rollback', 'Production Holds'],
  },
  {
    label: 'Vercel SPA rewrites',
    file: 'vercel.json',
    markers: ['rewrites', 'source', 'destination'],
  },
  {
    label: 'SAVEN env example',
    file: '.env.saven.example',
    markers: ['VITE_SAVEN_BACKEND_MODE', 'VITE_SAVEN_EDGE_FUNCTION_URL'],
  },
];

for (const check of checks) {
  const content = fs.readFileSync(path.join(root, check.file), 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN hosting marker in ${check.file}: ${marker}`);
    }
  }
  console.log(`[hosting] ok ${check.label}`);
}

console.log('SAVEN hosting deployment audit passed.');
