import { RecordObject } from '@mv-d/toolbelt';

import { Action, StateActions } from './types';

export const clearState = (): Action<string> => ({
  type: StateActions.CLEAR_STATE,
});

export const setIsLoading = (item: string, value: boolean): Action<RecordObject> => ({
  type: StateActions.SET_IS_LOADING,
  payload: { item, value },
});
