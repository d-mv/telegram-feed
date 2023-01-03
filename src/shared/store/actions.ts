import { Message } from '../../domains';
import { TChat, TMessage, TSupergroup, TSupergroupFullInfo, TUser, TUserFullInfo } from '../entities';
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

export const updateUsers = (payload: TUser): Action<TUser> => ({ type: StateActions.UPDATE_USERS, payload });

export const updateUsersFullInfo = (payload: TUserFullInfo & { user_id: number }): Action<TUserFullInfo> => ({
  type: StateActions.UPDATE_USERS_FULL_INFO,
  payload,
});

export const updateSupergroup = (payload: TSupergroup): Action<TSupergroup> => ({
  type: StateActions.UPDATE_SUPERGROUP,
  payload,
});

export const updateSuperGroupFullInfo = (payload: TSupergroupFullInfo): Action<TSupergroupFullInfo> => ({
  type: StateActions.UPDATE_SUPERGROUP_FULL_INFO,
  payload,
});

export const addMessage = (payload: TMessage): Action<TMessage> => ({ type: StateActions.ADD_MESSAGE, payload });

export const addChat = (payload: TChat): Action<TChat> => ({ type: StateActions.ADD_CHAT, payload });

export const updateAuthPasswordHint = (payload: string): Action<string> => ({
  type: StateActions.UPDATE_AUTH_PASSWORD_HINT,
  payload,
});
