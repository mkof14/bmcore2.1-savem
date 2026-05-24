#!/usr/bin/env node
import fs from 'node:fs';

const checks = [
  {
    label: 'SAVEN app shell',
    file: 'src/pages/Saven.tsx',
    markers: [
      'data-saven-command-execution-loop="true"',
      'data-saven-command-permission-review="true"',
      'aria-label="Open SAVEN voice and text commands"',
      'SavenCommandStrip',
    ],
  },
  {
    label: 'SAVEN Today page',
    file: 'src/features/saven/pages/SavenTodayPage.tsx',
    markers: ['Today operational clarity', 'TodayOperationalClarity'],
  },
  {
    label: 'SAVEN Admin Ops',
    file: 'src/pages/AdminPanel.tsx',
    markers: [
      'data-saven-admin-ops="true"',
      'data-saven-admin-persistence-status="true"',
      'data-saven-admin-event-audit="true"',
      'data-saven-admin-incident-readiness="true"',
    ],
  },
  {
    label: 'Backend and deploy readiness',
    file: 'scripts/saven-full-readiness.mjs',
    markers: ['Backend readiness', 'Deploy readiness', 'Theme contrast', 'SAVEN route smoke', 'Production build'],
  },
  {
    label: 'Route smoke coverage',
    file: 'scripts/saven-route-smoke.mjs',
    markers: ['/app/saven/commands', '/app/saven/settings', '/app/saven/verification', 'Command Permission Review'],
  },
  {
    label: 'Production QA checklist',
    file: 'docs/SAVEN_PRODUCTION_QA_CHECKLIST.md',
    markers: ['SAVEN Production QA Checklist', 'Voice command QA', 'Backend readiness QA', 'Release decision'],
  },
];

const forbiddenMarkers = [
  'Cannot find name',
  'Unexpected token',
  'Declaration or statement expected',
  'TODO: fix before release',
];

function read(relativePath) {
  return fs.readFileSync(new URL('../' + relativePath, import.meta.url), 'utf8');
}

console.log('SAVEN production QA audit');

for (const check of checks) {
  const source = read(check.file);
  for (const marker of check.markers) {
    if (!source.includes(marker)) {
      console.error('Missing production QA marker: ' + check.label + ' -> ' + marker);
      process.exit(1);
    }
  }
  console.log('[qa] ok ' + check.label);
}

const sourceFiles = [
  'src/pages/Saven.tsx',
  'src/pages/AdminPanel.tsx',
  'src/features/saven/pages/SavenTodayPage.tsx',
  'src/features/saven/services/savenCommandExecutionService.ts',
  'src/features/saven/services/savenCommandPermissionService.ts',
];

for (const relativePath of sourceFiles) {
  const source = read(relativePath);
  for (const marker of forbiddenMarkers) {
    if (source.includes(marker)) {
      console.error('Production QA found forbidden marker in ' + relativePath + ': ' + marker);
      process.exit(1);
    }
  }
}

console.log('SAVEN production QA audit passed.');
