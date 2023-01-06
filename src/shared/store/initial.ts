import { TMessage } from '../entities';
import { State } from './types';

export const INITIAL_STATE: State = {
  notifications: [],
  users: [],
  superGroups: [],
  usersFullInfo: [],
  messages: [],
  chats: [],
  filters: [],
  chatMessages: new Map<number, TMessage[]>(),
  threadMessages: new Map<number, TMessage[]>(),
  currentUserId: 0,
};
