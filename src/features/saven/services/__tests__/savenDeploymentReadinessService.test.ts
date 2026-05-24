import { describe, expect, it } from 'vitest';
import { createSavenDeployReadinessReport } from '../savenDeploymentReadinessService';

describe('createSavenDeployReadinessReport', () => {
  it('allows review mode to use local backend with warnings', () => {
    const report = createSavenDeployReadinessReport({});

    expect(report.target).toBe('review');
    expect(report.backendMode).toBe('local');
    expect(report.summary.warnings).toBeGreaterThan(0);
    expect(report.summary.blocked).toBe(0);
  });

  it('blocks production when required env vars are missing', () => {
    const report = createSavenDeployReadinessReport({ SAVEN_DEPLOY_TARGET: 'production' });

    expect(report.target).toBe('production');
    expect(report.summary.blocked).toBeGreaterThan(0);
  });

  it('accepts production edge mode when required public env vars are present', () => {
    const report = createSavenDeployReadinessReport({
      SAVEN_DEPLOY_TARGET: 'production',
      VITE_SUPABASE_URL: 'https://example.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'anon-key',
      VITE_SAVEN_BACKEND_MODE: 'edge',
      VITE_SAVEN_EDGE_FUNCTION_URL: 'https://example.supabase.co/functions/v1/saven-gateway',
    });

    expect(report.summary.blocked).toBe(0);
  });
});
