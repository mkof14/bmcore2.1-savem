import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['rc-tag:saven'] !== 'node scripts/saven-rc-tag-command-audit.mjs') {
  throw new Error('package.json is missing rc-tag:saven script.');
}
console.log('[rc-tag] ok package rc-tag:saven script');

const requiredScripts = [
  'operator-brief:saven',
  'evidence-index:saven',
  'production-release:saven',
  'tag:saven',
  'ready:saven',
  'ship:saven',
  'github-release:saven',
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`package.json is missing ${script} script.`);
  }
  console.log(`[rc-tag] ok package ${script} script`);
}

const checks = [
  {
    label: 'RC tag command package',
    file: 'docs/SAVEN_RC_TAG_COMMANDS.md',
    markers: [
      'SAVEN RC Tag Command Package',
      'Suggested RC Tag',
      'Before Tagging',
      'SAVEN_STRICT_TAG=1',
      'Tag Holds',
    ],
  },
  {
    label: 'Release operator brief',
    file: 'docs/SAVEN_RELEASE_OPERATOR_BRIEF.md',
    markers: ['SAVEN Release Operator Brief', 'Current Decision', 'Short Handoff'],
  },
  {
    label: 'Production evidence index',
    file: 'docs/SAVEN_PRODUCTION_EVIDENCE_INDEX.md',
    markers: ['SAVEN Production Evidence Index', 'Evidence Map', 'Production Holds'],
  },
  {
    label: 'Final release tag gate',
    file: 'docs/SAVEN_FINAL_RELEASE_TAG_GATE.md',
    markers: ['SAVEN Final Release Tag Gate', 'Suggested Tag', 'Tag Hold Rules'],
  },
  {
    label: 'GitHub release notes',
    file: 'docs/SAVEN_GITHUB_RELEASE_NOTES.md',
    markers: ['SAVEN GitHub Release Notes', 'bmcore2.1-savem-rc1'],
  },
];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing SAVEN RC tag artifact: ${check.file}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing SAVEN RC tag marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[rc-tag] ok ${check.label}`);
}

if (process.env.SAVEN_STRICT_TAG === '1') {
  const status = spawnSync('git', ['status', '--short'], { cwd: root, encoding: 'utf8' });
  if (status.status !== 0) {
    throw new Error('Could not read git status for strict tag preflight.');
  }
  if (status.stdout.trim()) {
    throw new Error('SAVEN strict tag preflight requires a clean working tree.');
  }
  console.log('[rc-tag] ok clean working tree');
} else {
  console.log('[rc-tag] strict clean-tree check skipped; set SAVEN_STRICT_TAG=1 before creating the real tag.');
}

console.log('SAVEN RC tag command audit passed.');
