import { describe, expect, it } from 'vitest';
import { getSavenBackendApiRoute, savenBackendApiRoutes, savenHumanConfirmedRouteIds } from '../savenBackendApiContract';

describe('savenBackendApiRoutes', () => {
  it('keeps HTTP paths and Edge actions unique', () => {
    const httpPaths = savenBackendApiRoutes.map((route) => route.method + ' ' + route.httpPath);
    const edgeActions = savenBackendApiRoutes.map((route) => route.edgeAction);

    expect(new Set(httpPaths).size).toBe(httpPaths.length);
    expect(new Set(edgeActions).size).toBe(edgeActions.length);
  });

  it('marks real-world routes as human-confirmed or admin', () => {
    expect(savenHumanConfirmedRouteIds).toEqual(expect.arrayContaining([
      'verify-action',
      'escalate',
      'care-contact-request',
      'admin-override',
    ]));
  });

  it('documents the incident readiness endpoint', () => {
    expect(getSavenBackendApiRoute('incident-readiness')).toMatchObject({
      httpPath: '/incidents/readiness',
      edgeAction: 'incident_readiness',
      risk: 'read',
    });
  });
});
