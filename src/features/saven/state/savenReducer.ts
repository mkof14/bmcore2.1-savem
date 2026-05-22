import { savenMockState, type SavenMockState, type SavenMockTask, type SavenMockCommand, type SavenMockEscalation } from '../mock/savenMockState';

export type SavenAction =
  | { type: 'createTask'; task: SavenMockTask }
  | { type: 'assignTask'; taskId: string; ownerId: string }
  | { type: 'sendCommand'; command: SavenMockCommand }
  | { type: 'verifyAction'; taskId: string; verifierId: string }
  | { type: 'escalate'; escalation: SavenMockEscalation }
  | { type: 'updateContinuity'; taskId: string };

export const initialSavenState = savenMockState;

export function savenReducer(state: SavenMockState, action: SavenAction): SavenMockState {
  switch (action.type) {
    case 'createTask':
      return {
        ...state,
        tasks: [...state.tasks, action.task],
      };
    case 'assignTask':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.taskId ? { ...task, ownerId: action.ownerId, lifecycle: 'assigned' } : task
        ),
      };
    case 'sendCommand':
      return {
        ...state,
        commands: [action.command, ...state.commands],
        tasks: state.tasks.map((task) =>
          task.id === action.command.targetTaskId ? { ...task, lifecycle: 'commanded' } : task
        ),
      };
    case 'verifyAction':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.taskId ? { ...task, verifierId: action.verifierId, lifecycle: 'verified' } : task
        ),
        continuity: {
          ...state.continuity,
          openVerifications: Math.max(0, state.continuity.openVerifications - 1),
        },
      };
    case 'escalate':
      return {
        ...state,
        escalations: [action.escalation, ...state.escalations],
      };
    case 'updateContinuity':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.taskId ? { ...task, lifecycle: 'continuity' } : task
        ),
        continuity: {
          ...state.continuity,
          score: Math.min(100, state.continuity.score + 2),
          state: 'Strong',
          lastUpdated: 'mock-now',
        },
      };
    default:
      return state;
  }
}
