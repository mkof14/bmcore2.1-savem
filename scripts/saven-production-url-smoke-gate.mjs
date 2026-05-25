import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const productionUrl = process.env.SAVEN_PRODUCTION_URL?.trim();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['prod-smoke:saven'] !== 'node scripts/saven-production-url-smoke-gate.mjs') {
  throw new Error('package.json is missing prod-smoke:saven script.');
}
console.log('[prod-smoke] ok package prod-smoke:saven script');

const docChecks = [
  {
    label: 'Production URL smoke gate',
    file: 'docs/SAVEN_PRODUCTION_URL_SMOKE_GATE.md',
    markers: [
      'SAVEN Production URL Smoke Gate',
      'Live URL Mode',
      'SAVEN_PRODUCTION_URL',
      'Hold Rules',
    ],
  },
  {
    label: 'Final release tag gate',
    file: 'docs/SAVEN_FINAL_RELEASE_TAG_GATE.md',
    markers: [
      'SAVEN Final Release Tag Gate',
      'Required Local Proof',
      'Tag Hold Rules',
    ],
  },
  {
    label: 'Hosting deployment package',
    file: 'docs/SAVEN_HOSTING_DEPLOYMENT_PACKAGE.md',
    markers: [
      'SAVEN Hosting Deployment Package',
      'Vercel Setup',
      'Promotion Gate',
    ],
  },
  {
    label: 'Production environment gate',
    file: 'docs/SAVEN_PRODUCTION_ENV_GATE.md',
    markers: [
      'SAVEN Production Environment Gate',
      'Production Edge Mode',
      'Production Hold Rules',
    ],
  },
];

for (const check of docChecks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN production URL artifact: ${check.file}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN production URL marker in ${check.file}: ${marker}`);
    }
  }
  console.log(`[prod-smoke] ok ${check.label}`);
}

if (!productionUrl) {
  console.log('[prod-smoke] skipped live route check because SAVEN_PRODUCTION_URL is not set.');
  console.log('SAVEN production URL smoke gate passed in review mode.');
  process.exit(0);
}

let baseUrl;
try {
  baseUrl = new URL(productionUrl);
} catch {
  throw new Error('SAVEN_PRODUCTION_URL must be a valid HTTPS URL.');
}

if (baseUrl.protocol !== 'https:') {
  throw new Error('SAVEN_PRODUCTION_URL must use HTTPS.');
}

const routes = [
  '/app/saven',
  '/app/saven/today',
  '/app/saven/commands',
  '/app/saven/settings',
  '/app/saven/verification',
];

async function checkRoute(route) {
  const url = new URL(route, baseUrl).toString();
  const response = await fetch(url, { redirect: 'manual' });
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  if (response.status !== 200) {
    throw new Error(`${route} returned HTTP ${response.status}`);
  }
  if (!contentType.includes('text/html')) {
    throw new Error(`${route} returned unexpected content-type: ${contentType}`);
  }
  if (!text.includes('<div id="root"></div>')) {
    throw new Error(`${route} did not return the app shell`);
  }

  console.log(`[prod-smoke] ok ${route}`);
}

console.log(`SAVEN production URL smoke against ${baseUrl.toString()}`);
for (const route of routes) {
  await checkRoute(route);
}

console.log('SAVEN production URL smoke gate passed.');
