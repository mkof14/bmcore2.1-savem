#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const steps = [
  { label: 'Backend readiness', command: 'npm', args: ['run', 'backend:saven'] },
  { label: 'Privacy guardrails', command: 'npm', args: ['run', 'privacy:saven'] },
  { label: 'Monitoring SLO', command: 'npm', args: ['run', 'monitoring:saven'] },
  { label: 'Alerting runbook', command: 'npm', args: ['run', 'alerts:saven'] },
  { label: 'Admin Ops', command: 'npm', args: ['run', 'admin:saven'] },
  { label: 'Admin alert routes', command: 'npm', args: ['run', 'admin-alerts:saven'] },
  { label: 'Supabase migration kit', command: 'npm', args: ['run', 'db:saven'] },
  { label: 'Edge Function package', command: 'npm', args: ['run', 'edge:saven'] },
  { label: 'Command contract', command: 'npm', args: ['run', 'commands:saven'] },
  { label: 'Worker handoff', command: 'npm', args: ['run', 'workers:saven'] },
  { label: 'Admin worker shift', command: 'npm', args: ['run', 'admin-workers:saven'] },
  { label: 'Ops evidence pack', command: 'npm', args: ['run', 'evidence:saven'] },
  { label: 'Launch control', command: 'npm', args: ['run', 'launch:saven'] },
  { label: 'Final ship manifest', command: 'npm', args: ['run', 'manifest:saven'] },
  { label: 'Release candidate snapshot', command: 'npm', args: ['run', 'rc:saven'] },
  { label: 'GitHub release package', command: 'npm', args: ['run', 'github-release:saven'] },
  { label: 'Hosting deployment package', command: 'npm', args: ['run', 'hosting:saven'] },
  { label: 'Post-launch ops package', command: 'npm', args: ['run', 'postlaunch:saven'] },
  { label: 'Rollback drill package', command: 'npm', args: ['run', 'rollback:saven'] },
  { label: 'Production env gate', command: 'npm', args: ['run', 'prod-env:saven'] },
  { label: 'Final release tag gate', command: 'npm', args: ['run', 'tag:saven'] },
  { label: 'Production URL smoke gate', command: 'npm', args: ['run', 'prod-smoke:saven'] },
  { label: 'BioMath Admin deploy checklist', command: 'npm', args: ['run', 'admin-deploy:saven'] },
  { label: 'Production go/no-go package', command: 'npm', args: ['run', 'go-no-go:saven'] },
  { label: 'Production launch record', command: 'npm', args: ['run', 'launch-record:saven'] },
  { label: 'Production release orchestrator', command: 'npm', args: ['run', 'production-release:saven'] },
  { label: 'Production evidence index', command: 'npm', args: ['run', 'evidence-index:saven'] },
  { label: 'Release operator brief', command: 'npm', args: ['run', 'operator-brief:saven'] },
  { label: 'RC tag command package', command: 'npm', args: ['run', 'rc-tag:saven'] },
  { label: 'Production cutover checklist', command: 'npm', args: ['run', 'cutover:saven'] },
  { label: 'Live backend activation package', command: 'npm', args: ['run', 'live-backend:saven'] },
  { label: 'Admin launch control', command: 'npm', args: ['run', 'admin-launch:saven'] },
  { label: 'Admin evidence pack', command: 'npm', args: ['run', 'admin-evidence:saven'] },
  { label: 'Deploy readiness', command: 'npm', args: ['run', 'deploy:saven'] },
  { label: 'Production QA audit', command: 'npm', args: ['run', 'qa:saven'] },
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
