import { describe, expect, it, vi } from 'vitest';
import { createSavenEdgeFunctionBackendAdapter } from '../savenEdgeFunctionBackendAdapter';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('savenEdgeFunctionBackendAdapter', () => {
  it('posts monitoring action to the configured Edge Function URL', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({
      data: {
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
      },
    }));
    const adapter = createSavenEdgeFunctionBackendAdapter({
      functionUrl: 'https://example.supabase.co/functions/v1/saven-gateway/',
      fetchImpl: fetchImpl as unknown as typeof fetch,
      getAuthToken: () => 'token-abc',
    });

    await adapter.getMonitoringSnapshot();

    expect(fetchImpl).toHaveBeenCalledWith('https://example.supabase.co/functions/v1/saven-gateway', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ action: 'monitoring', payload: {} }),
      headers: expect.any(Headers),
    }));
    const headers = fetchImpl.mock.calls[0][1].headers as Headers;
    expect(headers.get('authorization')).toBe('Bearer token-abc');
  });

  it('maps admin overrides to apply_admin_override action', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({
      data: {
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
      },
    }));
    const adapter = createSavenEdgeFunctionBackendAdapter({
      functionUrl: 'https://example.supabase.co/functions/v1/saven-gateway',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    await adapter.applyAdminOverride({
      action: 'pause_support',
      actorId: 'admin',
      targetId: 'person-anna',
      reason: 'test',
    });

    expect(fetchImpl.mock.calls[0][1].body).toBe(JSON.stringify({
      action: 'apply_admin_override',
      payload: {
        action: 'pause_support',
        actorId: 'admin',
        targetId: 'person-anna',
        reason: 'test',
      },
    }));
  });

  it('throws useful errors for failed edge requests', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ error: 'forbidden' }, 403));
    const adapter = createSavenEdgeFunctionBackendAdapter({
      functionUrl: 'https://example.supabase.co/functions/v1/saven-gateway',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    await expect(adapter.listTasks()).rejects.toThrow('SAVEN edge gateway request failed: list_tasks returned HTTP 403');
  });
});
