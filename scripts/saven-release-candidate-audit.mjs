import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();

const requiredScripts = [
  'ready:saven',
  'ship:saven',
  'manifest:saven',
  'launch:saven',
  'evidence:saven',
  'admin-launch:saven',
  'admin-evidence:saven',
  'rc:saven',
];

const requiredFiles = [
  'docs/SAVEN_RELEASE_CANDIDATE_SNAPSHOT.md',
  'docs/SAVEN_FINAL_SHIP_MANIFEST.md',
  'docs/SAVEN_RELEASE_HANDOFF.md',
  'docs/SAVEN_BACKEND_MONITORING_ADMIN.md',
  'scripts/saven-full-readiness.mjs',
  'scripts/saven-production-preview-smoke.mjs',
  'scripts/saven-final-ship-manifest-audit.mjs',
];

const markerChecks = [
  {
    label: 'Release candidate snapshot',
    file: 'docs/SAVEN_RELEASE_CANDIDATE_SNAPSHOT.md',
    markers: [
      'SAVEN Release Candidate Snapshot',
      'npm run ready:saven',
      'npm run ship:saven',
      'npm run rc:saven',
      'Go / Hold Review',
      'GitHub Release Prep',
    ],
  },
  {
    label: 'Final ship manifest',
    file: 'docs/SAVEN_FINAL_SHIP_MANIFEST.md',
    markers: [
      'SAVEN Final Ship Manifest',
      'Voice And Worker Layer',
      'Backend Foundation',
      'Release Control',
    ],
  },
  {
    label: 'Release handoff',
    file: 'docs/SAVEN_RELEASE_HANDOFF.md',
    markers: [
      'SAVEN Release Handoff',
      'Production Preview Gate',
      'Launch Control',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error('package.json is missing required SAVEN RC script: ' + script);
  }
  console.log('[rc] ok script ' + script);
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    throw new Error('Missing required SAVEN RC file: ' + file);
  }
  console.log('[rc] ok file ' + file);
}

for (const check of markerChecks) {
  const content = fs.readFileSync(path.join(root, check.file), 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN RC marker in ${check.file}: ${marker}`);
    }
  }
  console.log(`[rc] ok ${check.label}`);
}

const status = spawnSync('git', ['status', '--short'], {
  cwd: root,
  encoding: 'utf8',
});

if (status.error) {
  throw status.error;
}

const dirtyLines = status.stdout
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .filter((line) => !line.endsWith('public/version.json'));

if (dirtyLines.length) {
  console.log('[rc] note working tree has uncommitted files:');
  for (const line of dirtyLines) console.log('[rc]   ' + line);
} else {
  console.log('[rc] ok no uncommitted files except possible public/version.json build metadata');
}

console.log('SAVEN release candidate audit passed.');
