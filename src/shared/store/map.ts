import { Optional, R } from '@mv-d/toolbelt';

import { Message } from '../../domains';
import { TChat, TMessage, TSupergroup, TUser, TUserFullInfo } from '../entities';
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

MAP.set(StateActions.UPDATE_USERS, (state, action: Action<TUser>) => {
  if (!action.payload) return state;

  const existingUser = state.users.find(u => u.id === action.payload?.id);

  if (existingUser) return state;

  return R.assoc('users', [...state.users, action.payload], state);
});

MAP.set(StateActions.UPDATE_USERS_FULL_INFO, (state, action: Action<TUserFullInfo & { user_id: number }>) => {
  if (!action.payload) return state;

  const existingUser = state.usersFullInfo.find(u => u.user_id === action.payload?.user_id);

  if (existingUser) return state;

  return R.assoc('usersFullInfo', [...state.usersFullInfo, action.payload], state);
});

MAP.set(StateActions.UPDATE_SUPERGROUP, (state, action: Action<TSupergroup>) => {
  if (!action.payload) return state;

  const existingSuperGroup = state.superGroups.find(s => s.id === action.payload?.id);

  if (existingSuperGroup) return state;

  return R.assoc('superGroups', [...state.superGroups, action.payload], state);
});

MAP.set(StateActions.ADD_MESSAGE, (state, action: Action<TMessage>) => {
  if (!action.payload) return state;

  const newListOfMessages = [...state.messages.filter(m => m.id !== action.payload?.id), action.payload].sort(
    (a, b) => b.date - a.date,
  );

  return R.assoc('messages', newListOfMessages, state);
});

MAP.set(StateActions.ADD_CHAT, (state, action: Action<TChat>) => {
  if (!action.payload) return state;

  return R.assoc('chats', [...state.chats, action.payload], state);
});

MAP.set(StateActions.UPDATE_AUTH_PASSWORD_HINT, (state, action: Action<TChat>) => {
  if (!action.payload) return R.dissoc('authPasswordHint', state);

  return R.assoc('authPasswordHint', action.payload, state);
});
