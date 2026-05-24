import { describe, expect, it } from 'vitest';
import { savenMockState } from '../../mock/savenMockState';
import { createSavenMonitoringSnapshot } from '../savenMonitoringService';
import { createSavenLocalBackendGateway } from '../savenLocalBackendGateway';

describe('savenMonitoringService', () => {
  it('summarizes proof waits, commands, escalations, and endpoints', () => {
    const snapshot = createSavenMonitoringSnapshot(savenMockState);

    expect(snapshot.summary.openProofWaits).toBe(1);
    expect(snapshot.summary.activeCommands).toBe(2);
    expect(snapshot.summary.robotReadinessOnly).toBe(1);
    expect(snapshot.signals.map((signal) => signal.id)).toContain('emergency-safety');
  });

  it('exposes monitoring through the local backend gateway', async () => {
    const gateway = createSavenLocalBackendGateway();
    const snapshot = await gateway.getMonitoringSnapshot();

    expect(snapshot.mode).toBe('development_mock');
    expect(snapshot.queues.some((item) => item.queue === 'proof')).toBe(true);
    expect(snapshot.queues.some((item) => item.queue === 'escalation')).toBe(true);
  });
});
