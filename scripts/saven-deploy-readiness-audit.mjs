#!/usr/bin/env node
import fs from 'node:fs';

const requiredMarkers = [
  {
    label: 'deploy readiness service',
    file: 'src/features/saven/services/savenDeploymentReadinessService.ts',
    markers: ['createSavenDeployReadinessReport', 'SAVEN_DEPLOY_TARGET', 'external dispatch disabled'],
  },
  {
    label: 'backend selector',
    file: 'src/features/saven/services/savenBackendGatewaySelector.ts',
    markers: ['VITE_SAVEN_BACKEND_MODE', 'VITE_SAVEN_BACKEND_URL', 'VITE_SAVEN_EDGE_FUNCTION_URL'],
  },
  {
    label: 'edge gateway draft',
    file: 'supabase/functions/saven-gateway/index.ts',
    markers: ['No external dispatch', 'Admin access required'],
  },
  {
    label: 'backend monitoring docs',
    file: 'docs/SAVEN_BACKEND_MONITORING_ADMIN.md',
    markers: ['SAVEN Deploy Readiness', 'VITE_SAVEN_BACKEND_MODE', 'SAVEN_DEPLOY_TARGET'],
  },
];

function read(relativePath) {
  return fs.readFileSync(new URL('../' + relativePath, import.meta.url), 'utf8');
}

function validUrl(value) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

console.log('SAVEN deploy readiness audit');

for (const check of requiredMarkers) {
  const source = read(check.file);
  for (const marker of check.markers) {
    if (!source.includes(marker)) {
      console.error('Missing deploy readiness marker: ' + check.label + ' -> ' + marker);
      process.exit(1);
    }
  }
  console.log('[deploy] ok ' + check.label);
}

const target = process.env.SAVEN_DEPLOY_TARGET === 'production' ? 'production' : 'review';
const mode = process.env.VITE_SAVEN_BACKEND_MODE || 'local';
const blockers = [];

if (target === 'production') {
  if (!validUrl(process.env.VITE_SUPABASE_URL)) blockers.push('VITE_SUPABASE_URL');
  if (!process.env.VITE_SUPABASE_ANON_KEY?.trim()) blockers.push('VITE_SUPABASE_ANON_KEY');
  if (mode !== 'edge') blockers.push('VITE_SAVEN_BACKEND_MODE=edge');
  if (!validUrl(process.env.VITE_SAVEN_EDGE_FUNCTION_URL)) blockers.push('VITE_SAVEN_EDGE_FUNCTION_URL');
}

if (mode === 'http' && !validUrl(process.env.VITE_SAVEN_BACKEND_URL)) {
  blockers.push('VITE_SAVEN_BACKEND_URL');
}

if (mode === 'edge' && !validUrl(process.env.VITE_SAVEN_EDGE_FUNCTION_URL)) {
  blockers.push('VITE_SAVEN_EDGE_FUNCTION_URL');
}

if (blockers.length > 0) {
  console.error('SAVEN deploy readiness blocked by: ' + blockers.join(', '));
  process.exit(1);
}

console.log('[deploy] target ' + target);
console.log('[deploy] backend mode ' + mode);
console.log('SAVEN deploy readiness audit passed.');
