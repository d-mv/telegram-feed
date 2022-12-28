import { R } from '@mv-d/toolbelt';

import { INITIAL_STATE } from './initial';
import { Action, MappedReducerFns, StateActions, State, LoadingItems } from './types';

export const MAP: MappedReducerFns = new Map();

MAP.set(StateActions.CLEAR_STATE, () => INITIAL_STATE);

MAP.set(StateActions.SET_IS_LOADING, (state, action: Action<{ item: LoadingItems; value: boolean }>) => {
  if (!action.payload) return state;

  const { item, value } = action.payload;

  return R.assoc('isLoading', R.assoc(item, value, state.isLoading), state);
});
