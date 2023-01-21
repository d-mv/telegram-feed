import { Message } from '../../domains';
import {
  TChat,
  TMessage,
  TSupergroup,
  TSupergroupFullInfo,
  TUpdateDeleteMessages,
  TUpdateNewMessage,
  TUpdateOption,
  TUpdateUser,
  TUpdateUserFullInfo,
  TUser,
  TUserFullInfo,
} from '../entities';
import { Action, FeedFilters, SelectedChatId, StateActions, UpdateUserFullInfo } from './types';

export const clearState = (): Action => ({
  type: StateActions.CLEAR_STATE,
});

export const restoreState = (): Action => ({
  type: StateActions.RESTORE_STATE,
});

export const setIsInitialized = (): Action => ({
  type: StateActions.SET_IS_INITIALIZED,
});

export const addNotification = (payload: Message): Action<Message> => ({
  type: StateActions.ADD_NOTIFICATION,
  payload,
});

export const removeNotification = (payload: string): Action<string> => ({
  type: StateActions.REMOVE_NOTIFICATION,
  payload,
});

export const setMyself = (payload: TUser): Action<TUser> => ({ type: StateActions.SET_MYSELF, payload });

export const setOption = (payload: TUpdateOption): Action<TUpdateOption> => ({
  type: StateActions.SET_OPTION,
  payload,
});

export const setLoadMessage = (payload: string) => ({ type: StateActions.SET_LOAD_MESSAGE, payload });

export const addNewMessage = (payload: TUpdateNewMessage): Action<TUpdateNewMessage> => ({
  type: StateActions.ADD_NEW_MESSAGE,
  payload,
});

export const setChatIds = (payload: number[]): Action<number[]> => ({ type: StateActions.SET_CHAT_IDS, payload });

export const addUser = (payload: TUser): Action<TUser> => ({ type: StateActions.ADD_USER, payload });

export const updateUser = (payload: TUpdateUser): Action<TUpdateUser> => ({ type: StateActions.UPDATE_USER, payload });

export const addUserFullInfo = (payload: UpdateUserFullInfo): Action<UpdateUserFullInfo> => ({
  type: StateActions.ADD_USER_FULL_INFO,
  payload,
});

export const updateUserFullInfo = (payload: TUpdateUserFullInfo): Action<TUpdateUserFullInfo> => ({
  type: StateActions.UPDATE_USER_FULL_INFO,
  payload,
});

// review
export const updateSupergroup = (payload: TSupergroup): Action<TSupergroup> => ({
  type: StateActions.UPDATE_SUPERGROUP,
  payload,
});

export const updateSuperGroupFullInfo = (payload: TSupergroupFullInfo): Action<TSupergroupFullInfo> => ({
  type: StateActions.UPDATE_SUPERGROUP_FULL_INFO,
  payload,
});

export const addMessages = (payload: TMessage[]): Action<TMessage[]> => ({ type: StateActions.ADD_MESSAGES, payload });

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
