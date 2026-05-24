import { describe, expect, it, vi } from 'vitest';
import { createSavenHttpBackendAdapter } from '../savenHttpBackendAdapter';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('savenHttpBackendAdapter', () => {
  it('requests monitoring snapshot through the configured backend base URL', async () => {
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
    const adapter = createSavenHttpBackendAdapter({
      baseUrl: 'https://api.example.test/saven/',
      fetchImpl: fetchImpl as unknown as typeof fetch,
      getAuthToken: () => 'token-123',
    });

    await adapter.getMonitoringSnapshot();

    expect(fetchImpl).toHaveBeenCalledWith('https://api.example.test/saven/monitoring', expect.objectContaining({
      headers: expect.any(Headers),
    }));
    const headers = fetchImpl.mock.calls[0][1].headers as Headers;
    expect(headers.get('authorization')).toBe('Bearer token-123');
  });

  it('posts admin overrides to the backend boundary', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({
      id: 'override-1',
      status: 'recorded',
      action: 'pause_support',
      targetId: 'person-anna',
      message: 'recorded',
      auditTrail: {
        actorId: 'admin',
        reason: 'test',
        recordedAt: 'now',
      },
    }));
    const adapter = createSavenHttpBackendAdapter({
      baseUrl: 'https://api.example.test/saven',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    await adapter.applyAdminOverride({
      action: 'pause_support',
      actorId: 'admin',
      targetId: 'person-anna',
      reason: 'test',
    });

    expect(fetchImpl).toHaveBeenCalledWith('https://api.example.test/saven/admin-overrides', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        action: 'pause_support',
        actorId: 'admin',
        targetId: 'person-anna',
        reason: 'test',
      }),
    }));
  });

  it('throws useful errors for failed backend requests', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ error: 'nope' }, 503));
    const adapter = createSavenHttpBackendAdapter({
      baseUrl: 'https://api.example.test/saven',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    await expect(adapter.listTasks()).rejects.toThrow('SAVEN backend request failed: /tasks returned HTTP 503');
  });
});
