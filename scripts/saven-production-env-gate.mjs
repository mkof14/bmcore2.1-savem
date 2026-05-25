import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const validUrl = (value) => {
  if (!value || !value.trim()) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
};

const hasValue = (value) => Boolean(value && value.trim());
const target = process.env.SAVEN_DEPLOY_TARGET === 'production' ? 'production' : 'review';
const backendMode = process.env.VITE_SAVEN_BACKEND_MODE || 'local';

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['prod-env:saven'] !== 'node scripts/saven-production-env-gate.mjs') {
  throw new Error('package.json is missing prod-env:saven script.');
}
console.log('[prod-env] ok package prod-env:saven script');

const checks = [
  {
    label: 'Production env gate doc',
    file: 'docs/SAVEN_PRODUCTION_ENV_GATE.md',
    markers: [
      'SAVEN Production Environment Gate',
      'Review Mode',
      'Production Edge Mode',
      'Production HTTP Mode',
      'Production Hold Rules',
    ],
  },
  {
    label: 'SAVEN env example',
    file: '.env.saven.example',
    markers: [
      'SAVEN_DEPLOY_TARGET=production',
      'VITE_SAVEN_BACKEND_MODE=edge',
      'VITE_SAVEN_EDGE_FUNCTION_URL',
      'VITE_SAVEN_RELEASE_CHANNEL',
      'VITE_SAVEN_ADMIN_MODE',
    ],
  },
  {
    label: 'Hosting package',
    file: 'docs/SAVEN_HOSTING_DEPLOYMENT_PACKAGE.md',
    markers: [
      'Required Environment Variables',
      'Production Edge mode',
      'Production HTTP mode',
      'Promotion Gate',
    ],
  },
  {
    label: 'Release handoff',
    file: 'docs/SAVEN_RELEASE_HANDOFF.md',
    markers: [
      'SAVEN Release Handoff',
      'Hosting Deployment Package',
    ],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN production env artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN production env marker in ${check.file}: ${marker}`);
    }
  }
  console.log(`[prod-env] ok ${check.label}`);
}

const blockers = [];
if (target === 'production') {
  if (!validUrl(process.env.VITE_SUPABASE_URL)) blockers.push('VITE_SUPABASE_URL');
  if (!hasValue(process.env.VITE_SUPABASE_ANON_KEY)) blockers.push('VITE_SUPABASE_ANON_KEY');
  if (backendMode !== 'edge' && backendMode !== 'http') blockers.push('VITE_SAVEN_BACKEND_MODE=edge or http');
  if (backendMode === 'edge' && !validUrl(process.env.VITE_SAVEN_EDGE_FUNCTION_URL)) blockers.push('VITE_SAVEN_EDGE_FUNCTION_URL');
  if (backendMode === 'http' && !validUrl(process.env.VITE_SAVEN_BACKEND_URL)) blockers.push('VITE_SAVEN_BACKEND_URL');
}

for (const [key, value] of Object.entries(process.env)) {
  if (key.startsWith('VITE_') && /SERVICE_ROLE|SECRET|PRIVATE/i.test(key + value)) {
    blockers.push(`client env must not expose secret-like value: ${key}`);
  }
}

if (blockers.length) {
  throw new Error(`SAVEN production env gate blocked: ${blockers.join(', ')}`);
}

console.log(`[prod-env] ok target=${target} backendMode=${backendMode}`);
console.log('SAVEN production environment gate passed.');
