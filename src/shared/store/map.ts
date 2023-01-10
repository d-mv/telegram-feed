import { R } from '@mv-d/toolbelt';

import { Message } from '../../domains';
import { StorageService, TChat, TMessage, TSupergroup, TUser, TUserFullInfo } from '../entities';
import { INITIAL_STATE } from './initial';
import { Action, MappedReducerFns, StateActions, SelectedChatId, StateUser } from './types';

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

  if (state.users.length > 100) return state;

  return R.assoc('users', [...state.users, action.payload], state);
});

MAP.set(
  StateActions.UPDATE_USERS_FULL_INFO,
  (state, action: Action<Omit<TUserFullInfo, '@type'> & { user_id: number }>) => {
    // if (!action.payload) return state;

    // const mapperFn = (user: StateUser) => (user.id === action.payload?.user_id ? { ...user, ...action.payload } : user);

    // return R.assoc('users', state.users.map(mapperFn), state);
    return state;
  },
);

MAP.set(StateActions.UPDATE_SUPERGROUP, (state, action: Action<TSupergroup>) => {
  if (!action.payload) return state;

  const existingSuperGroup = state.superGroups.find(s => s.id === action.payload?.id);

  if (existingSuperGroup) return state;

  return R.assoc('superGroups', [...state.superGroups, action.payload], state);
});

MAP.set(StateActions.ADD_MESSAGE, (state, action: Action<TMessage>) => {
  if (!action.payload) return state;

  const threadId = action.payload.message_thread_id;

  if (threadId === 0) {
    const messages = state.chatMessages;

    const filteredMessages = messages.filter(message => message.id !== action.payload?.id);

    filteredMessages.push(action.payload);

    return R.assoc('chatMessages', filteredMessages, state);
  } else {
    const messages = state.threadMessages.get(threadId) || [];

    const filteredMessages = messages.filter(m => m.id !== action.payload?.id);

    const newMessages = [...filteredMessages, action.payload];

    return R.assoc('threadMessages', state.threadMessages.set(threadId, newMessages), state);
  }
});

MAP.set(StateActions.ADD_MESSAGES, (state, action: Action<TMessage[]>) => {
  if (!action.payload) return state;

  const noThreadMessages = action.payload.filter(m => m.message_thread_id === 0);

  const ids = noThreadMessages.map(m => m.id);

  const filteredMessages = state.chatMessages.filter(message => !ids.includes(message.id));

  filteredMessages.push(...noThreadMessages);

  return R.assoc('chatMessages', filteredMessages, state);
  // const threadId = action.payload.message_thread_id;

  // if (threadId === 0) {
  //   const messages = state.chatMessages;

  //   const filteredMessages = messages.filter(message => message.id !== action.payload?.id);

  //   filteredMessages.push(action.payload);

  //   return R.assoc('chatMessages', filteredMessages, state);
  // } else {
  // const messages = state.threadMessages.get(threadId) || [];

  // const filteredMessages = messages.filter(m => m.id !== action.payload?.id);

  // const newMessages = [...filteredMessages, action.payload];

  // return R.assoc('threadMessages', state.threadMessages.set(threadId, newMessages), state);
  // }
});

MAP.set(StateActions.SET_CURRENT_USER_ID, (state, action: Action<number>) => {
  if (!action.payload) return R.assoc('currentUserId', 0, state);

  return R.assoc('currentUserId', action.payload, state);
});

MAP.set(StateActions.ADD_CHAT, (state, action: Action<TChat>) => {
  const { payload } = action;

  if (!payload) return state;

  return R.assoc('chats', [...state.chats.filter(chat => chat.id !== payload.id), payload], state);
});

MAP.set(StateActions.UPDATE_AUTH_PASSWORD_HINT, (state, action: Action<TChat>) => {
  if (!action.payload) return R.dissoc('authPasswordHint', state);

  return R.assoc('authPasswordHint', action.payload, state);
});

MAP.set(StateActions.SET_SELECTED_CHAT_ID, (state, action: Action<SelectedChatId>) => {
  if (!action.payload) {
    StorageService.remove('selectedChat');
    return R.dissoc('selectedChat', state);
  }

  StorageService.set('selectedChat', action.payload);
  return R.assoc('selectedChat', action.payload, state);
});

MAP.set(StateActions.RESTORE_STATE, state => {
  return { ...state, ...StorageService.state };
});
