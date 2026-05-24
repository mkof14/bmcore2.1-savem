import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

const files = {
  shell: 'src/pages/Saven.tsx',
  today: 'src/features/saven/pages/SavenTodayPage.tsx',
  settings: 'src/features/saven/pages/SavenSettingsPage.tsx',
  commandsDoc: 'docs/SAVEN_VISUAL_ACCEPTANCE.md',
  adminDoc: 'docs/SAVEN_BACKEND_MONITORING_ADMIN.md',
};

const checks = [
  {
    label: 'SAVEN visual acceptance doc',
    file: files.commandsDoc,
    markers: [
      'SAVEN Visual Acceptance',
      'dark-operational',
      'voice command rail',
      'mic level indicator',
      'Light theme must keep icons and labels readable',
    ],
  },
  {
    label: 'Global SAVEN command rail',
    file: files.shell,
    markers: [
      'SAVEN commands',
      'Open mic',
      'Open service',
      'All commands',
      'Mic level',
    ],
  },
  {
    label: 'SAVEN command targets',
    file: files.shell,
    markers: [
      'Caregiver',
      'Nurse',
      'Doctor',
      'Robot',
      'Device',
      'Emergency',
    ],
  },
  {
    label: 'Today screen keeps support context',
    file: files.today,
    markers: [
      'Today Operational Clarity',
      'caregiver',
      'nurse',
    ],
  },
  {
    label: 'Voice settings remain user-facing',
    file: files.settings,
    markers: [
      'Speak with SAVEN',
      'Wake phrase',
      'Voice style',
    ],
  },
  {
    label: 'Admin visual evidence remains operational',
    file: files.adminDoc,
    markers: [
      'Admin Event Audit Review',
      'Incident Readiness Model',
      'Supabase Persistence Bridge',
    ],
  },
];

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['visual:saven'] !== 'node scripts/saven-visual-acceptance-audit.mjs') {
  throw new Error('package.json is missing visual:saven script.');
}
console.log('[visual] ok package visual:saven script');

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing visual acceptance file: ${check.file}`);
  }

  const content = readProjectFile(check.file);
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      throw new Error(`Missing visual acceptance marker in ${check.file}: ${marker}`);
    }
  }

  console.log(`[visual] ok ${check.label}`);
}

const savenSources = [
  files.shell,
  files.today,
  files.settings,
  'src/features/saven/pages/SavenCareRoutesPage.tsx',
  'src/features/saven/pages/SavenRobotsPage.tsx',
  'src/features/saven/pages/SavenDevicesPage.tsx',
  'src/features/saven/pages/SavenVerificationPage.tsx',
].filter((file) => fs.existsSync(path.join(root, file))).map(readProjectFile).join('\n');

const whiteSurfaceMatches = savenSources.match(/bg-white/g) || [];
if (whiteSurfaceMatches.length > 18) {
  throw new Error(`Too many plain bg-white surfaces in SAVEN screens: ${whiteSurfaceMatches.length}. Keep SAVEN dark-operational and use white only for focused command/action elements.`);
}
console.log(`[visual] ok plain white surface count: ${whiteSurfaceMatches.length}`);

const lowContrastPairs = [
  'text-white bg-white',
  'text-slate-100 bg-white',
  'text-slate-200 bg-white',
  'text-white/70 bg-white',
];

for (const pair of lowContrastPairs) {
  if (savenSources.includes(pair)) {
    throw new Error(`Potential low-contrast light-theme pair found: ${pair}`);
  }
}
console.log('[visual] ok obvious light-theme contrast pairs');

console.log('SAVEN visual acceptance audit passed.');
