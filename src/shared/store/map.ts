import { assoc, mergeRight, omit, dissoc } from 'ramda';

import { Message } from '../../domains';
import {
  StorageService,
  TChat,
  TMessage,
  TSupergroup,
  TUpdateNewMessage,
  TUpdateOption,
  TUpdates,
  TUpdateUser,
  TUpdateUserFullInfo,
  TUser,
} from '../entities';
import { INITIAL_STATE } from './initial';
import { Action, MappedReducerFns, StateActions, SelectedChatId, StateUser, UpdateUserFullInfo } from './types';

export const MAP: MappedReducerFns = new Map();

MAP.set(StateActions.CLEAR_STATE, () => INITIAL_STATE);

MAP.set(StateActions.RESTORE_STATE, state => {
  return { ...state, ...StorageService.state, isRestored: true };
});

MAP.set(StateActions.SET_IS_INITIALIZED, state => {
  return assoc('isInitialized', true, state);
});

MAP.set(StateActions.ADD_NOTIFICATION, (state, action: Action<Message>) => {
  if (!action.payload) return state;

  return assoc('notifications', [...state.notifications, action.payload], state);
});

MAP.set(StateActions.REMOVE_NOTIFICATION, (state, action: Action<string>) => {
  if (!action.payload) return state;

  return assoc(
    'notifications',
    state.notifications.filter(n => n.id !== action.payload),
    state,
  );
});

MAP.set(StateActions.SET_MYSELF, (state, action: Action<TUser>) => {
  return assoc('myself', action.payload, state);
});

MAP.set(StateActions.SET_OPTION, (state, action: Action<TUpdateOption>) => {
  if (!action.payload) return state;

  const { name, value } = action.payload;

  if (state.options && Object.keys(state.options).find(o => o === name)) return state;

  return assoc('options', assoc(String(name), value, state.options), state);
});

MAP.set(StateActions.SET_LOAD_MESSAGE, (state, action: Action<string>) => {
  return assoc('loadMessage', action.payload || '', state);
});

MAP.set(StateActions.ADD_NEW_MESSAGE, (state, action: Action<TUpdateNewMessage>) => {
  if (!action.payload) return state;

  // don't add comments
  if (action.payload.message.message_thread_id) return state;

  if (state.chatIds.includes(action.payload.message.chat_id)) {
    return assoc('chatMessages', [...state.chatMessages, action.payload.message], state);
  }

  return state;
});

MAP.set(StateActions.SET_CHAT_IDS, (state, action: Action<number[]>) => {
  if (!action.payload) return state;

  StorageService.remove('chatIds');
  return assoc('chatIds', action.payload, state);
});

MAP.set(StateActions.ADD_USER, (state, action: Action<TUser>) => {
  if (!action.payload) return state;

  const existingUser = state.users.find(u => u.id === action.payload?.id);

  if (existingUser) return state;

  return assoc('users', [...state.users, action.payload], state);
});

MAP.set(StateActions.ADD_USER_FULL_INFO, (state, action: Action<UpdateUserFullInfo>) => {
  if (!action.payload) return state;

  const existingUser = state.users.find(u => u.id === action.payload?.id);

  if (!existingUser) return state;

  function updateUser(user: StateUser): StateUser {
    if (user.id === action.payload?.id) return mergeRight(user, omit(['@type'], action.payload?.data));

    return user;
  }

  return assoc('users', state.users.map(updateUser), state);
});

MAP.set(StateActions.UPDATE_USER, (state, action: Action<TUpdateUser>) => {
  if (!action.payload) return state;

  const existingUser = state.users.find(u => u.id === action.payload?.user.id);

  if (!existingUser) return state;

  function updateUser(user: StateUser): StateUser {
    if (user.id === action.payload?.user.id) return mergeRight(user, action.payload?.user);

    return user;
  }

  return assoc('users', state.users.map(updateUser), state);
});

// TODO: same as ADD_USER_FULL_INFO. Remove?
MAP.set(StateActions.UPDATE_USER_FULL_INFO, (state, action: Action<TUpdateUserFullInfo>) => {
  if (!action.payload) return state;

  const existingUser = state.users.find(u => u.id === action.payload?.user_id);

  if (!existingUser) return state;

  function updateUser(user: StateUser): StateUser {
    if (user.id === action.payload?.user_id) return mergeRight(user, omit(['@type'], action.payload?.user_full_info));

    return user;
  }

  return assoc('users', state.users.map(updateUser), state);
});

MAP.set(StateActions.ADD_CHAT, (state, action: Action<TChat>) => {
  const { payload } = action;

  if (!payload) return state;

  // // don't add "chats" for channels
  // if (payload.type['@type'] !== 'chatTypePrivate' && !payload.type.is_channel) {
  //   // eslint-disable-next-line no-console
  //   console.log('add chat', action.payload);
  //   return state;
  // }

  if (!state.chatIds.includes(payload.id)) return state;

  return assoc('chats', [...state.chats.filter(c => c.id !== payload.id), payload], state);
});

MAP.set(StateActions.ADD_LAST_MESSAGE, (state, action: Action<TUpdates>) => {
  const { payload } = action;

  if (!payload) return state;

  if (payload['@type'] !== 'updateChatLastMessage') return state;

  if (payload.last_message.message_thread_id) return state;

  const existingMessage = state.lastMessages.find(m => m.id === payload.last_message.id);

  if (existingMessage) return state;

  return assoc('lastMessages', [...state.lastMessages, payload.last_message], state);
});

MAP.set(StateActions.MAIN_CHATS_LOADED, state => {
  const chatMessages = state.lastMessages.filter(message => state.chatIds.includes(message.chat_id));

  return { ...state, lastMessages: [], chatMessages, lastMessagesLoaded: true };
});

// review

// MAP.set(
//   StateActions.UPDATE_USERS_FULL_INFO,
//   (state, action: Action<Omit<TUserFullInfo, '@type'> & { user_id: number }>) => {
//     // if (!action.payload) return state;

//     // const mapperFn = (user: StateUser) => (user.id === action.payload?.user_id ? { ...user, ...action.payload } : user);

//     // return assoc('users', state.users.map(mapperFn), state);
//     return state;
//   },
// );

MAP.set(StateActions.UPDATE_SUPERGROUP, (state, action: Action<TSupergroup>) => {
  if (!action.payload) return state;

  const existingSuperGroup = state.superGroups.find(s => s.id === action.payload?.id);

  if (existingSuperGroup) return state;

  return assoc('superGroups', [...state.superGroups, action.payload], state);
});

MAP.set(StateActions.ADD_MESSAGES, (state, action: Action<TMessage[]>) => {
  if (!action.payload) return state;

  const noThreadMessages = action.payload
    .filter(m => m.message_thread_id === 0)
    .filter(m => state.chatIds.includes(m.chat_id));

  const ids = noThreadMessages.map(m => m.id);

  const filteredMessages = state.chatMessages.filter(message => !ids.includes(message.id));

  filteredMessages.push(...noThreadMessages);

  return assoc('chatMessages', filteredMessages, state);
});

MAP.set(StateActions.SET_CURRENT_USER_ID, (state, action: Action<number>) => {
  if (!action.payload) return assoc('currentUserId', 0, state);

  return assoc('currentUserId', action.payload, state);
});

MAP.set(StateActions.UPDATE_AUTH_PASSWORD_HINT, (state, action: Action<TChat>) => {
  if (!action.payload) return dissoc('authPasswordHint', state);

  return assoc('authPasswordHint', action.payload, state);
});

MAP.set(StateActions.SET_SELECTED_CHAT_ID, (state, action: Action<SelectedChatId>) => {
  if (!action.payload) {
    StorageService.remove('selectedChat');
    return dissoc('selectedChat', state);
  }

  StorageService.set('selectedChat', action.payload);
  return assoc('selectedChat', action.payload, state);
});
