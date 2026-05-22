import { savenMockState, type SavenMockEscalation, type SavenMockState } from '../mock/savenMockState';

export type SavenControlApiResult = {
  operation: string;
  status: 'mock_ready' | 'blocked_by_policy' | 'requires_confirmation';
  summary: string;
  payload: Record<string, string | number | boolean>;
};

export function createSavenControlApiMock(state: SavenMockState = savenMockState) {
  return {
    createTask(taskTitle: string): SavenControlApiResult {
      return {
        operation: 'createTask',
        status: 'mock_ready',
        summary: 'Creates a structured support task from a detected need without writing to a database.',
        payload: {
          taskTitle,
          personId: state.activePersonId,
          lifecycle: 'created',
          verificationRequired: true,
        },
      };
    },
    assignTask(taskId: string, ownerId: string): SavenControlApiResult {
      const owner = state.people.find((person) => person.id === ownerId);
      return {
        operation: 'assignTask',
        status: owner ? 'mock_ready' : 'requires_confirmation',
        summary: owner ? 'Routes the task to a permitted support circle member.' : 'Owner is not in the local support circle.',
        payload: {
          taskId,
          ownerId,
          ownerName: owner?.name || 'Unknown owner',
        },
      };
    },
    sendCommand(commandText: string, taskId: string): SavenControlApiResult {
      return {
        operation: 'sendCommand',
        status: 'mock_ready',
        summary: 'Interprets voice or text as a task command while preserving policy gates.',
        payload: {
          commandText,
          taskId,
          source: commandText.toLowerCase().startsWith('hey saven') ? 'voice' : 'text',
        },
      };
    },
    verifyAction(taskId: string, verifierId: string): SavenControlApiResult {
      const verifier = state.people.find((person) => person.id === verifierId);
      return {
        operation: 'verifyAction',
        status: verifier ? 'mock_ready' : 'requires_confirmation',
        summary: 'Confirms reality before SAVEN updates continuity.',
        payload: {
          taskId,
          verifierId,
          verifierName: verifier?.name || 'Unknown verifier',
          continuityWillUpdate: Boolean(verifier),
        },
      };
    },
    escalate(level: SavenMockEscalation['level']): SavenControlApiResult {
      const escalation = state.escalations.find((item) => item.level === level);
      return {
        operation: 'escalate',
        status: level === 'emergency' ? 'blocked_by_policy' : 'mock_ready',
        summary: level === 'emergency'
          ? 'Emergency route is displayed as UI only in development and does not call real services.'
          : 'Routes the concern to the configured mock support path.',
        payload: {
          level,
          route: escalation?.route || 'No route configured',
          realExternalConnection: false,
        },
      };
    },
    updateContinuity(taskId: string): SavenControlApiResult {
      return {
        operation: 'updateContinuity',
        status: 'requires_confirmation',
        summary: 'Updates continuity only after verification has been received.',
        payload: {
          taskId,
          currentScore: state.continuity.score,
          openVerifications: state.continuity.openVerifications,
        },
      };
    },
  };
}

export const savenControlApiMock = createSavenControlApiMock();
