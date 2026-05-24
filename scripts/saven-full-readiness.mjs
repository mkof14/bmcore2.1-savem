#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const steps = [
  { label: 'Theme contrast', command: 'npm', args: ['run', 'contrast:saven'] },
  { label: 'Typecheck', command: 'npm', args: ['run', 'typecheck'] },
  { label: 'Tests', command: 'npm', args: ['run', 'test', '--', '--run'] },
  { label: 'SAVEN route smoke', command: 'npm', args: ['run', 'smoke:saven:auto'] },
  {
    label: 'Production build',
    command: 'npm',
    args: ['run', 'build'],
    cleanPublicEnv: true,
  },
];

function buildEnv(step) {
  const env = { ...process.env };
  if (step.cleanPublicEnv) {
    delete env.VITE_SUPABASE_URL;
    delete env.VITE_SUPABASE_ANON_KEY;
  }
  return env;
}

function runStep(step) {
  console.log('\n=== SAVEN readiness: ' + step.label + ' ===');
  const result = spawnSync(step.command, step.args, {
    cwd: process.cwd(),
    env: buildEnv(step),
    stdio: 'inherit',
    shell: false,
  });

  if (result.error) {
    console.error('\nSAVEN readiness failed during ' + step.label + '.');
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error('\nSAVEN readiness failed during ' + step.label + ' with exit code ' + result.status + '.');
    process.exit(result.status || 1);
  }
}

for (const step of steps) {
  runStep(step);
}

const versionStatus = spawnSync('git', ['status', '--short', 'public/version.json'], {
  cwd: process.cwd(),
  encoding: 'utf8',
});

console.log('\nSAVEN full readiness passed.');
if (versionStatus.stdout.trim()) {
  console.log('Note: public/version.json changed during build. Restore it before commit if you do not want build metadata committed.');
}
