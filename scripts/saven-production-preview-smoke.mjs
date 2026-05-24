import { spawn } from 'node:child_process';

const host = '127.0.0.1';
const port = Number(process.env.SAVEN_PREVIEW_PORT || 4173);
const baseUrl = `http://${host}:${port}`;

const routes = [
  '/app/saven',
  '/app/saven/today',
  '/app/saven/commands',
  '/app/saven/care-routes',
  '/app/saven/robots',
  '/app/saven/devices',
  '/app/saven/environments',
  '/app/saven/verification',
  '/app/saven/settings',
];

const markers = [
  'SAVEN',
  'SAVEN commands',
  'Voice Control',
];

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: options.stdio || 'inherit',
      env: {
        ...process.env,
        VITE_SUPABASE_URL: '',
        VITE_SUPABASE_ANON_KEY: '',
      },
      shell: process.platform === 'win32',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}`));
      }
    });
  });
}

function startPreview() {
  const child = spawn('npx', ['vite', 'preview', '--host', host, '--port', String(port), '--strictPort'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
  });

  child.stdout.on('data', (chunk) => process.stdout.write(chunk));
  child.stderr.on('data', (chunk) => process.stderr.write(chunk));

  return child;
}

async function waitForPreview(timeoutMs = 15000) {
  const start = Date.now();
  let lastError;

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Cannot reach production preview at ${baseUrl}: ${lastError?.message || 'timeout'}`);
}

async function checkRoute(route) {
  const response = await fetch(`${baseUrl}${route}`);
  if (!response.ok) {
    throw new Error(`Preview route failed: ${route} -> ${response.status}`);
  }

  const html = await response.text();
  if (!html.includes('<div id="root">')) {
    throw new Error(`Preview route did not return app shell: ${route}`);
  }

  if (html.includes('Loading Application')) {
    throw new Error(`Preview route contains stale Loading Application fallback: ${route}`);
  }

  console.log(`[preview] ok shell ${route}`);
}

async function checkBundle() {
  const indexResponse = await fetch(baseUrl);
  const html = await indexResponse.text();
  const assetMatches = [...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map((match) => match[1]);

  if (!assetMatches.length) {
    throw new Error('Preview index has no JavaScript bundle.');
  }

  const bundleText = await Promise.all(
    assetMatches.map(async (asset) => {
      const response = await fetch(`${baseUrl}${asset}`);
      return response.ok ? response.text() : '';
    }),
  );
  const combined = bundleText.join('\n');

  for (const marker of markers) {
    if (!combined.includes(marker)) {
      throw new Error(`Production preview bundle is missing marker: ${marker}`);
    }
  }

  console.log('[preview] ok SAVEN bundle markers');
}

let preview;

try {
  console.log('Building SAVEN production bundle for preview smoke.');
  await run('npm', ['run', 'build']);

  console.log(`Starting production preview at ${baseUrl}`);
  preview = startPreview();
  await waitForPreview();

  for (const route of routes) {
    await checkRoute(route);
  }

  await checkBundle();
  console.log('SAVEN production preview smoke passed.');
} catch (error) {
  console.error('SAVEN production preview smoke failed.');
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (preview) {
    console.log('Stopping production preview.');
    preview.kill('SIGTERM');
  }
}
