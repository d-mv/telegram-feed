import { Message } from '../../../domains';
import { TUser, TUserFullInfo, TSupergroup, TMessage, TChat } from '../../entities';
import { SelectedChatId } from './data.types';

export enum FeedFilters {
  NO_COMMENTS = 'noComments',
}

export interface State {
  notifications: Message[];
  users: TUser[];
  usersFullInfo: (TUserFullInfo & { user_id: number })[];
  currentUserId: number;
  superGroups: TSupergroup[];
  messages: TMessage[];
  chats: TChat[];
  authPasswordHint?: string;
  filters: FeedFilters[];
  selectedChat?: SelectedChatId;
  chatMessages: Map<number, TMessage[]>;
  threadMessages: Map<number, TMessage[]>;
}
