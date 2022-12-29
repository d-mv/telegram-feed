import { R } from '@mv-d/toolbelt';

import { Message } from '../../domains';
import { INITIAL_STATE } from './initial';
import { Action, MappedReducerFns, StateActions } from './types';

export const MAP: MappedReducerFns = new Map();

MAP.set(StateActions.CLEAR_STATE, () => INITIAL_STATE);

MAP.set(StateActions.ADD_NOTIFICATION, (state, action: Action<Message>) => {
  if (!action.payload) return state;

  return R.assoc('notifications', [...state.notifications, action.payload], state);
});

MAP.set(StateActions.REMOVE_NOTIFICATION, (state, action: Action<string>) => {
  if (!action.payload) return state;

  return R.assoc(
    'notifications',
    state.notifications.filter(n => n.id !== action.payload),
    state,
  );
});
