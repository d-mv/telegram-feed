import { Message } from '../../domains';
import { TChat, TMessage, TSupergroup, TSupergroupFullInfo, TUser, TUserFullInfo } from '../entities';
import { Action, FeedFilters, SelectedChatId, StateActions } from './types';

export const clearState = (): Action => ({
  type: StateActions.CLEAR_STATE,
});

export const restoreState = (): Action => ({ type: StateActions.RESTORE_STATE });

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

export const clearFilters = (): Action<string> => ({
  type: StateActions.CLEAR_FILTERS,
});

interface Filter {
  id: FeedFilters;
  value: string;
}

export const updateFilter = (payload: Filter): Action<Filter> => ({
  type: StateActions.UPDATE_FILTER,
  payload,
});

export const removeFilter = (id: FeedFilters): Action<Filter> => ({
  type: StateActions.UPDATE_FILTER,
  payload: { id, value: '' },
});

export const setSelectedChatId = (payload: SelectedChatId): Action<SelectedChatId> => ({
  type: StateActions.SET_SELECTED_CHAT_ID,
  payload,
});

export const clearSelectedChatId = (): Action<SelectedChatId> => ({
  type: StateActions.SET_SELECTED_CHAT_ID,
});

export const setCurrentUserId = (payload: number): Action<number> => ({
  type: StateActions.SET_CURRENT_USER_ID,
  payload,
});
