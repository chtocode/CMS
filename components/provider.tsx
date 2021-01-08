import { createContext, Dispatch, useContext, useReducer } from 'react';
import { MessageType } from '../lib/model/message';

export type MessageTypeWithTotal = MessageType | 'total';

export type StoreState = { [key in MessageTypeWithTotal]: number };

export type ActionType = 'increment' | 'decrement' | 'reset';

export type MessageAction = {
  type: ActionType;
  payload?: { count: number; type: MessageTypeWithTotal };
};

const store: StoreState = {
  total: 0,
  notification: 0,
  message: 0,
};

export function messageReducer(state: StoreState, action: MessageAction) {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        [action.payload.type]: state[action.payload.type] + action.payload.count,
        total: state.total + action.payload.count,
      };
    case 'decrement':
      return {
        ...state,
        [action.payload.type]: state[action.payload.type] - action.payload.count,
        total: state.total - action.payload.count,
      };
    case 'reset':
      return { ...store };
    default:
      return { ...state };
  }
}
export const MessageStatisticsContext = createContext<{
  msgStore: StoreState;
  dispatch: Dispatch<MessageAction>;
}>(null);

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, store);

  return (
    <MessageStatisticsContext.Provider value={{ msgStore: state, dispatch }}>
      {children}
    </MessageStatisticsContext.Provider>
  );
};

export const useMsgStatistic = () =>
  useContext<{ msgStore: StoreState; dispatch: Dispatch<MessageAction> }>(MessageStatisticsContext);
