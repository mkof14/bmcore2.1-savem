import { describe, expect, it, vi } from 'vitest';
import { createSavenBackendGatewayFromEnv } from '../savenBackendGatewaySelector';
import { savenLocalBackendGateway } from '../savenLocalBackendGateway';

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

describe('savenBackendGatewaySelector', () => {
  it('uses the local gateway by default', () => {
    const gateway = createSavenBackendGatewayFromEnv({ env: {} });

    expect(gateway).toBe(savenLocalBackendGateway);
  });

  it('requires a URL for HTTP mode', () => {
    expect(() => createSavenBackendGatewayFromEnv({
      env: { VITE_SAVEN_BACKEND_MODE: 'http' },
    })).toThrow('SAVEN HTTP backend mode requires VITE_SAVEN_BACKEND_URL.');
  });

  it('uses the HTTP adapter when mode and URL are configured', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({
      generatedAt: 'test',
      mode: 'development_mock',
      activePersonId: 'person-anna',
      signals: [],
      queues: [],
      summary: {
        openProofWaits: 0,
        activeCommands: 0,
        escalationRoutes: 0,
        onlineEndpoints: 0,
        robotReadinessOnly: 0,
      },
    }));
    const gateway = createSavenBackendGatewayFromEnv({
      env: {
        VITE_SAVEN_BACKEND_MODE: 'http',
        VITE_SAVEN_BACKEND_URL: 'https://api.example.test/saven',
      },
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    await gateway.getMonitoringSnapshot();

    expect(fetchImpl).toHaveBeenCalledWith('https://api.example.test/saven/monitoring', expect.any(Object));
  });
});
