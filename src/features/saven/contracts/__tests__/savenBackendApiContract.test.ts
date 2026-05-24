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

  it('documents the admin incident action endpoint', () => {
    expect(getSavenBackendApiRoute('incident-action')).toMatchObject({
      httpPath: '/incidents/:incidentId/actions',
      edgeAction: 'apply_incident_action',
      risk: 'admin',
    });
  });

  it('documents the command interpretation endpoint', () => {
    expect(getSavenBackendApiRoute('interpret-command')).toMatchObject({
      httpPath: '/commands/interpret',
      edgeAction: 'interpret_command',
      risk: 'write',
    });
  });

  it('documents the command permission review endpoint', () => {
    expect(getSavenBackendApiRoute('command-permission-review')).toMatchObject({
      httpPath: '/commands/permission-review',
      edgeAction: 'review_command_permission',
      risk: 'human_confirmed',
    });
  });
});
