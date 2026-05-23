import { spawn } from 'node:child_process';

const baseUrl = process.env.SAVEN_SMOKE_BASE_URL || 'http://127.0.0.1:5173';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function canReachServer() {
  try {
    const response = await fetch(baseUrl + '/app/saven/settings');
    return response.ok;
  } catch {
    return false;
  }
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      ...options,
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(command + ' ' + args.join(' ') + ' failed with exit code ' + code));
    });
  });
}

async function waitForServer() {
  for (let index = 0; index < 60; index += 1) {
    if (await canReachServer()) return;
    await wait(250);
  }

  throw new Error('SAVEN dev server did not become ready at ' + baseUrl);
}

async function main() {
  let server = null;

  if (await canReachServer()) {
    console.log('SAVEN dev server already running at ' + baseUrl);
  } else {
    console.log('Starting SAVEN dev server at ' + baseUrl);
    server = spawn('npm', ['run', 'dev:saven'], {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: { ...process.env, BROWSER: 'none' },
    });
    await waitForServer();
  }

  try {
    await runCommand('npm', ['run', 'smoke:saven']);
  } finally {
    if (server) {
      console.log('Stopping SAVEN dev server.');
      server.kill('SIGTERM');
      await wait(300);
      if (!server.killed) server.kill('SIGKILL');
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
