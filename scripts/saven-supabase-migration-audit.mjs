import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    label: 'SAVEN schema migration',
    file: 'supabase/saven/001_saven_core_schema.sql',
    markers: [
      'SAVEN Supabase migration kit',
      'create table if not exists public.saven_profiles',
      'create table if not exists public.saven_commands',
      'create table if not exists public.saven_events',
      'create table if not exists public.saven_incidents',
      'saven_rls_policy_draft',
    ],
  },
  {
    label: 'SAVEN review seed',
    file: 'supabase/saven/002_saven_review_seed.sql',
    markers: [
      'SAVEN review seed',
      'cmd-nurse-follow-up',
      'cmd-robot-readiness',
      'cmd-emergency-rules',
      'incident-emergency-review',
    ],
  },
  {
    label: 'Migration kit doc',
    file: 'docs/SAVEN_SUPABASE_MIGRATION_KIT.md',
    markers: [
      'SAVEN Supabase Migration Kit',
      'saven_profiles',
      'saven_commands',
      'saven_events',
      'npm run db:saven',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['db:saven'] !== 'node scripts/saven-supabase-migration-audit.mjs') {
  throw new Error('package.json is missing db:saven script.');
}
console.log('[db] ok package db:saven script');

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN database artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN database marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[db] ok ${check.label}`);
}

console.log('SAVEN Supabase migration kit audit passed.');
