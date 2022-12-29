import { RecordObject } from '@mv-d/toolbelt';
import { Message } from '../../domains';

import { Action, StateActions, Notification } from './types';

export const clearState = (): Action<string> => ({
  type: StateActions.CLEAR_STATE,
});

export const setIsLoading = (item: string, value: boolean): Action<RecordObject> => ({
  type: StateActions.SET_IS_LOADING,
  payload: { item, value },
});

export const addNotification = (payload: Message): Action<Message> => ({
  type: StateActions.ADD_NOTIFICATION,
  payload,
});

export const removeNotification = (payload: string): Action<string> => ({
  type: StateActions.REMOVE_NOTIFICATION,
  payload,
});
