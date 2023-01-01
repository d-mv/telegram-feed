import { AnyValue, RecordObject } from '@mv-d/toolbelt';

import { Message } from '../../domains';
import { TChat, TMessage, TSupergroup, TUser, TUserFullInfo } from '../entities';

export enum StateActions {
  CLEAR_STATE = 'clearState',
  ADD_NOTIFICATION = 'addNotification',
  REMOVE_NOTIFICATION = 'removeNotification',
  UPDATE_USERS = 'updateUsers',
  UPDATE_SUPERGROUP = 'updateSuperGroup',
  UPDATE_USERS_FULL_INFO = 'updateUsersFullInfo',
  UPDATE_SUPERGROUP_FULL_INFO = 'updateSuperGroupFullInfo',
  ADD_MESSAGE = 'addMessage',
  ADD_CHAT = 'addChat',
  UPDATE_CHAT = 'updateChat',
  UPDATE_AUTH_PASSWORD_HINT = 'updateAuthPasswordHint',
}

export interface Action<T = AnyValue> {
  type: StateActions;
  payload?: T;
  meta?: RecordObject;
}

export type Dispatch<T = unknown> = (action: Action<T>) => void;

export interface State {
  notifications: Message[];
  users: TUser[];
  usersFullInfo: (TUserFullInfo & { user_id: number })[];
  superGroups: TSupergroup[];
  messages: TMessage[];
  chats: TChat[];
  authPasswordHint?: string;
}

export type MappedReducerFns = Map<StateActions, (state: State, action: Action) => State>;
