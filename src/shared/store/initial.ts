import { TMessage } from '../entities';
import { State } from './types';

export const INITIAL_STATE: State = {
  notifications: [],
  users: [],
  superGroups: [],
  messages: [],
  chats: [],
  filters: [],
  chatMessages: [],
  threadMessages: new Map<number, TMessage[]>(),
  currentUserId: 0,
  myself: undefined,
  options: {},
  loadMessage: 'Loading...',
  chatIds: [],
  isRestored: false,
  isInitialized: false,
};
