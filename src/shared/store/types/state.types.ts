import { Message } from '../../../domains';
import { TUser, TUserFullInfo, TSupergroup, TMessage, TChat } from '../../entities';

export enum FeedFilters {
  NO_COMMENTS = 'noComments',
}

export interface State {
  notifications: Message[];
  users: TUser[];
  usersFullInfo: (TUserFullInfo & { user_id: number })[];
  superGroups: TSupergroup[];
  messages: TMessage[];
  chats: TChat[];
  authPasswordHint?: string;
  filters: FeedFilters[];
  selectedChatId?: number;
  chatMessages: Record<number, TMessage[]>;
  threadMessages: Record<number, TMessage[]>;
}
