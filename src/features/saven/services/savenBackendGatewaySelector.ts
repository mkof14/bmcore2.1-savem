import type { SavenBackendGateway } from '../contracts/savenBackendContract';
import { createSavenEdgeFunctionBackendAdapter } from './savenEdgeFunctionBackendAdapter';
import { createSavenHttpBackendAdapter } from './savenHttpBackendAdapter';
import { savenLocalBackendGateway } from './savenLocalBackendGateway';

type SavenBackendGatewaySelectorEnv = {
  VITE_SAVEN_BACKEND_MODE?: string;
  VITE_SAVEN_BACKEND_URL?: string;
  VITE_SAVEN_EDGE_FUNCTION_URL?: string;
};

type SavenBackendGatewaySelectorOptions = {
  env?: SavenBackendGatewaySelectorEnv;
  fetchImpl?: typeof fetch;
  getAuthToken?: () => string | undefined | Promise<string | undefined>;
};

function readViteEnv(): SavenBackendGatewaySelectorEnv {
  if (typeof import.meta === 'undefined') return {};
  return (import.meta as unknown as { env?: SavenBackendGatewaySelectorEnv }).env ?? {};
}

export function createSavenBackendGatewayFromEnv(options: SavenBackendGatewaySelectorOptions = {}): SavenBackendGateway {
  const env = options.env ?? readViteEnv();
  const mode = env.VITE_SAVEN_BACKEND_MODE ?? 'local';
  const url = env.VITE_SAVEN_BACKEND_URL;

  if (mode === 'http') {
    if (!url) {
      throw new Error('SAVEN HTTP backend mode requires VITE_SAVEN_BACKEND_URL.');
    }

    return createSavenHttpBackendAdapter({
      baseUrl: url,
      fetchImpl: options.fetchImpl,
      getAuthToken: options.getAuthToken,
    });
  }

  if (mode === 'edge') {
    const functionUrl = env.VITE_SAVEN_EDGE_FUNCTION_URL;
    if (!functionUrl) {
      throw new Error('SAVEN Edge Function backend mode requires VITE_SAVEN_EDGE_FUNCTION_URL.');
    }

    return createSavenEdgeFunctionBackendAdapter({
      functionUrl,
      fetchImpl: options.fetchImpl,
      getAuthToken: options.getAuthToken,
    });
  }

  return savenLocalBackendGateway;
}

export const savenBackendGateway = createSavenBackendGatewayFromEnv();
