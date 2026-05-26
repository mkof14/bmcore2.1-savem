import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const localFile = path.join(root, 'SAVEN_PRODUCTION_VALUES.local');

const template = `# SAVEN private production values
# This file is local-only and ignored by git through *.local.
# Do not paste private secrets into committed docs.

RELEASE_TAG=bmcore2.1-savem-rc1
PRODUCTION_URL=
LAUNCH_DECISION=RC ONLY

DEPLOY_TARGET=production
BACKEND_MODE=edge
SUPABASE_PROJECT=
EDGE_FUNCTION_URL=
HTTP_BACKEND_URL=
RLS_REVIEW=
MIGRATION_REVIEW=

DECISION_OWNER=
ADMIN_OPS_REVIEWER=
BACKEND_OWNER=
MONITORING_OWNER=
ROLLBACK_OWNER=
FIRST_HOUR_WATCH_OWNER=
ADMIN_ACCESS_OWNER=
ADMIN_ACCESS_REVIEWER=
PRIVACY_REVIEWER=
DISPATCH_LOCK_REVIEWER=
ROBOT_EMERGENCY_SAFETY_REVIEWER=
FREEZE_REVIEWER=
PRODUCTION_VALUES_REVIEWER=
GO_DRY_RUN_REVIEWER=
FINAL_OPERATOR_REVIEWER=
LAUNCH_ROOM_OWNER=

# Private secrets stay outside committed docs.
# SERVICE_ROLE_KEY=
# PRIVATE_BACKEND_SECRET=
# ADMIN_PASSWORD=
# DATABASE_PASSWORD=
# WEBHOOK_SECRET=
`;

if (fs.existsSync(localFile)) {
  console.log('[values-local] existing local file kept: ' + localFile);
} else {
  fs.writeFileSync(localFile, template);
  console.log('[values-local] created local file: ' + localFile);
}

const gitignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
if (!gitignore.includes('*.local')) {
  throw new Error('.gitignore must ignore *.local before using SAVEN_PRODUCTION_VALUES.local');
}

console.log('[values-local] ok *.local is ignored by git');
console.log('[values-local] fill SAVEN_PRODUCTION_VALUES.local first, then copy only safe public values into docs/SAVEN_PRODUCTION_LAUNCH_RECORD.md');
