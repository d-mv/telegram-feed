import { Optional } from '@mv-d/toolbelt';
import { Message } from '../../../domains';
import { TSupergroup, TMessage, TChat, TOptions } from '../../entities';
import { SelectedChatId, StateUser } from './data.types';

export enum FeedFilters {
  NO_COMMENTS = 'noComments',
}

export interface State {
  notifications: Message[];
  loadMessage: string;
  users: StateUser[];
  currentUserId: number;
  superGroups: TSupergroup[];
  messages: TMessage[];
  chats: TChat[];
  authPasswordHint?: string;
  filters: FeedFilters[];
  selectedChat?: SelectedChatId;
  chatMessages: TMessage[];
  threadMessages: Map<number, TMessage[]>;
  myself: Optional<StateUser>;
  options: Partial<TOptions>;
}
