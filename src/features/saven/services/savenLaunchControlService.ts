import { createSavenOpsEvidencePack } from './savenOpsEvidenceService';

export type SavenLaunchDecision = 'go' | 'hold';

export type SavenLaunchGate = {
  id: string;
  label: string;
  status: 'ready' | 'watch' | 'blocked';
  evidence: string;
  requiredBeforeProduction: boolean;
};

export type SavenLaunchControlReport = {
  id: string;
  generatedAt: string;
  decision: SavenLaunchDecision;
  releaseChannel: 'local_review' | 'production_candidate';
  gates: SavenLaunchGate[];
  requiredHolds: string[];
  nextActions: string[];
};

function gateIsBlocking(gate: SavenLaunchGate): boolean {
  return gate.requiredBeforeProduction && gate.status === 'blocked';
}

export function createSavenLaunchControlReport(releaseChannel: SavenLaunchControlReport['releaseChannel'] = 'production_candidate'): SavenLaunchControlReport {
  const evidencePack = createSavenOpsEvidencePack();

  const gates: SavenLaunchGate[] = [
    {
      id: 'ops-evidence',
      label: 'Ops evidence pack',
      status: evidencePack.releasePosture === 'blocked' ? 'blocked' : evidencePack.releasePosture === 'needs_operator_review' ? 'watch' : 'ready',
      evidence: 'Evidence pack has ' + evidencePack.evidence.commandFixtures + ' command fixtures and ' + evidencePack.evidence.workerEndpoints + ' worker endpoints.',
      requiredBeforeProduction: true,
    },
    {
      id: 'command-worker-loop',
      label: 'Command to worker loop',
      status: evidencePack.gates.find((gate) => gate.id === 'worker-handoff')?.status ?? 'blocked',
      evidence: 'Voice and text commands route to caregiver, nurse, doctor, robot, device, emergency, and admin endpoints.',
      requiredBeforeProduction: true,
    },
    {
      id: 'privacy-safety',
      label: 'Privacy and safety guardrails',
      status: evidencePack.gates.find((gate) => gate.id === 'privacy-guardrails')?.status ?? 'blocked',
      evidence: 'SAVEN data classes, role visibility, family redaction, robot gate, and emergency route are classified.',
      requiredBeforeProduction: true,
    },
    {
      id: 'monitoring-alerting',
      label: 'Monitoring and alerting',
      status: evidencePack.gates.some((gate) => gate.id === 'monitoring-slo' && gate.status === 'blocked') ? 'blocked' : evidencePack.gates.some((gate) => gate.id === 'alert-routes' && gate.status !== 'ready') ? 'watch' : 'ready',
      evidence: 'SLO posture and alert routes are tied to Admin Ops action.',
      requiredBeforeProduction: true,
    },
    {
      id: 'backend-foundation',
      label: 'Backend foundation',
      status: 'ready',
      evidence: 'Supabase migration kit, Edge Function package, backend audits, and release handoff are tracked as readiness artifacts.',
      requiredBeforeProduction: true,
    },
    {
      id: 'admin-visibility',
      label: 'Admin visibility',
      status: 'ready',
      evidence: 'BioMath Core Admin shows SAVEN SLO posture, alert routes, worker shift board, and ops evidence.',
      requiredBeforeProduction: true,
    },
    {
      id: 'production-preview',
      label: 'Production preview',
      status: 'watch',
      evidence: 'Production preview must be run locally or in hosting before final production claim.',
      requiredBeforeProduction: releaseChannel === 'production_candidate',
    },
  ];

  const requiredHolds = gates.filter(gateIsBlocking).map((gate) => gate.label);
  const watchGates = gates.filter((gate) => gate.status === 'watch').map((gate) => gate.label);

  return {
    id: 'saven-launch-control-report',
    generatedAt: 'development-snapshot',
    decision: requiredHolds.length ? 'hold' : 'go',
    releaseChannel,
    gates,
    requiredHolds,
    nextActions: requiredHolds.length
      ? requiredHolds.map((label) => 'Resolve blocked launch gate: ' + label)
      : watchGates.length
        ? watchGates.map((label) => 'Operator review recommended: ' + label)
        : ['Run npm run ship:saven before external release handoff.'],
  };
}
