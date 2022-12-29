import { Message } from '../../domains';
import { Action, StateActions } from './types';

export const clearState = (): Action<string> => ({
  type: StateActions.CLEAR_STATE,
});

export const addNotification = (payload: Message): Action<Message> => ({
  type: StateActions.ADD_NOTIFICATION,
  payload,
});

export const removeNotification = (payload: string): Action<string> => ({
  type: StateActions.REMOVE_NOTIFICATION,
  payload,
});
