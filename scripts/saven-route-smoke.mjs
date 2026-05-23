import fs from 'node:fs';

const baseUrl = process.env.SAVEN_SMOKE_BASE_URL || 'http://127.0.0.1:5173';

const routes = [
  '/app/saven',
  '/app/saven/today',
  '/app/saven/care-routes',
  '/app/saven/robots',
  '/app/saven/devices',
  '/app/saven/environments',
  '/app/saven/verification',
  '/app/saven/settings',
  '/app/saven/faq',
  '/app/saven/learning',
];

const sourceExpectations = [
  ['Care Routes page', ['function SavenCareRoutes()', 'Care Routes']],
  ['Backend Gateway map', ['SavenBackendGatewayPanel', 'Backend gateway map', 'Backend Gateway Map', 'backend gateway']],
  ['Robot Device Service Matrix', ['Robot / Device Service Matrix', 'Robot Device Service Matrix', 'Physical orchestration', 'Physical support becomes visible', 'Physical support becomes visible, permissioned, and verified']],
  ['Device Verification Gateway', ['Device Gateway', 'verification gateway for real-world support']],
  ['Environment Permissions', ['Environment permissions', 'Environment flow']],
  ['Verification Engine', ['Verification Engine', 'Open verifications']],
  ['Today Operational Clarity', ['Today operational clarity', 'TodayOperationalClarity']],
  ['Timeline Operational Clarity', ['TimelineOperationalClarity', 'Timeline clarity']],
  ['Voice Settings', ['Speak with SAVEN']],
  ['Final Readiness Report', ['SAVEN Final Readiness Report']],
];

async function checkRoute(route) {
  const url = baseUrl + route;
  let response;

  try {
    response = await fetch(url, { redirect: 'manual' });
  } catch {
    throw new Error('Cannot reach ' + baseUrl + '. Start it first with: npm run dev:saven');
  }

  const text = await response.text();
  const contentType = response.headers.get('content-type') || '';

  if (response.status !== 200) {
    throw new Error(route + ' returned HTTP ' + response.status);
  }

  if (!contentType.includes('text/html')) {
    throw new Error(route + ' returned unexpected content-type: ' + contentType);
  }

  if (!text.includes('<div id="root"></div>')) {
    throw new Error(route + ' did not return the app shell');
  }

  return route;
}

function readProjectFile(relativePath) {
  return fs.readFileSync(new URL('../' + relativePath, import.meta.url), 'utf8');
}

async function main() {
  console.log('SAVEN smoke check against ' + baseUrl);

  const routeResults = await Promise.all(routes.map(checkRoute));
  for (const route of routeResults) {
    console.log('[route] ok ' + route);
  }

  const savenPage = readProjectFile('src/pages/Saven.tsx');
  const readinessReport = readProjectFile('docs/SAVEN_FINAL_READINESS_REPORT.md');
  const combined = savenPage + '\n' + readinessReport;

  for (const [label, expectedOptions] of sourceExpectations) {
    const matched = expectedOptions.some((expected) => combined.includes(expected));
    if (!matched) {
      throw new Error('Missing expected SAVEN marker: ' + label + ' -> ' + expectedOptions.join(' | '));
    }
    console.log('[marker] ok ' + label);
  }

  if (combined.includes('Cannot find name')) {
    throw new Error('Source contains unresolved TypeScript error text');
  }

  console.log('SAVEN smoke check passed.');
}

main().catch((error) => {
  console.error('SAVEN smoke check failed.');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
