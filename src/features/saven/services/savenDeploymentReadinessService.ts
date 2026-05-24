export type SavenDeployTarget = 'review' | 'production';

export type SavenDeployEnv = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  VITE_SAVEN_BACKEND_MODE?: string;
  VITE_SAVEN_BACKEND_URL?: string;
  VITE_SAVEN_EDGE_FUNCTION_URL?: string;
  SAVEN_DEPLOY_TARGET?: string;
};

export type SavenDeployReadinessCheck = {
  key: string;
  label: string;
  status: 'ready' | 'warning' | 'blocked';
  detail: string;
};

export type SavenDeployReadinessReport = {
  generatedAt: string;
  target: SavenDeployTarget;
  backendMode: 'local' | 'http' | 'edge';
  checks: SavenDeployReadinessCheck[];
  summary: {
    ready: number;
    warnings: number;
    blocked: number;
  };
};

function hasValue(value: string | undefined) {
  return Boolean(value && value.trim());
}

function validUrl(value: string | undefined) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function createSavenDeployReadinessReport(env: SavenDeployEnv = {}): SavenDeployReadinessReport {
  const target: SavenDeployTarget = env.SAVEN_DEPLOY_TARGET === 'production' ? 'production' : 'review';
  const backendMode = env.VITE_SAVEN_BACKEND_MODE === 'http' || env.VITE_SAVEN_BACKEND_MODE === 'edge'
    ? env.VITE_SAVEN_BACKEND_MODE
    : 'local';
  const production = target === 'production';

  const checks: SavenDeployReadinessCheck[] = [
    {
      key: 'supabase-url',
      label: 'Supabase URL',
      status: validUrl(env.VITE_SUPABASE_URL) ? 'ready' : production ? 'blocked' : 'warning',
      detail: validUrl(env.VITE_SUPABASE_URL) ? 'Public Supabase URL is configured.' : 'Review mode can use mock fallback; production must set VITE_SUPABASE_URL.',
    },
    {
      key: 'supabase-anon-key',
      label: 'Supabase anon key',
      status: hasValue(env.VITE_SUPABASE_ANON_KEY) ? 'ready' : production ? 'blocked' : 'warning',
      detail: hasValue(env.VITE_SUPABASE_ANON_KEY) ? 'Public anon key is configured.' : 'Review mode can use mock fallback; production must set VITE_SUPABASE_ANON_KEY.',
    },
    {
      key: 'backend-mode',
      label: 'SAVEN backend mode',
      status: backendMode === 'local' && production ? 'blocked' : 'ready',
      detail: backendMode === 'local' ? 'Local mode is safe for review, not production.' : 'SAVEN backend mode is ' + backendMode + '.',
    },
    {
      key: 'http-backend-url',
      label: 'HTTP backend URL',
      status: backendMode !== 'http' ? 'ready' : validUrl(env.VITE_SAVEN_BACKEND_URL) ? 'ready' : 'blocked',
      detail: backendMode !== 'http' ? 'Not required unless VITE_SAVEN_BACKEND_MODE=http.' : 'HTTP backend mode requires VITE_SAVEN_BACKEND_URL.',
    },
    {
      key: 'edge-function-url',
      label: 'Edge Function URL',
      status: backendMode !== 'edge' ? (production ? 'blocked' : 'warning') : validUrl(env.VITE_SAVEN_EDGE_FUNCTION_URL) ? 'ready' : 'blocked',
      detail: backendMode === 'edge' ? 'Edge mode requires VITE_SAVEN_EDGE_FUNCTION_URL.' : 'Production should use edge mode for the current SAVEN backend draft.',
    },
    {
      key: 'external-dispatch',
      label: 'External dispatch',
      status: 'ready',
      detail: 'SAVEN deploy readiness keeps external dispatch disabled until a separate safety policy is approved.',
    },
  ];

  return {
    generatedAt: 'development-snapshot',
    target,
    backendMode,
    checks,
    summary: {
      ready: checks.filter((check) => check.status === 'ready').length,
      warnings: checks.filter((check) => check.status === 'warning').length,
      blocked: checks.filter((check) => check.status === 'blocked').length,
    },
  };
}
