import { TMessage } from '../entities';
import { State } from './types';

export const getNotifications = (state: State) => state.notifications;

export const getCurrentUser = (state: State) => state.users.find(user => user.id === state.currentUserId);

export const getMessages = (state: State) => {
  const result: TMessage[] = [];

  state.chatMessages.forEach(messages =>
    result.push(
      ...messages.filter(
        m => m.sender_id['@type'] !== 'messageSenderUser' || m.sender_id.user_id !== state.currentUserId,
      ),
    ),
  );

  return result;
};

export const getMessagesForSelectedChat = (state: State) => {
  if (!state.selectedChat) return [];

  const result: TMessage[] = [];

  state.chatMessages.forEach(messages =>
    messages.forEach(message => {
      if (String(message.chat_id) === state.selectedChat?.id) result.push(message);
    }),
  );

  return result;
};

export const getChatById = (state: State) => (id: number) => state.chats.find(chat => chat.id === id);

export const getUserById = (state: State) => (id: number) => state.users.find(user => user.id === id);

export const getAuthPasswordHint = (state: State) => state.authPasswordHint;

export const getSelectedChat = (state: State) => state.chats.find(chat => String(chat.id) === state.selectedChat?.id);

export const getSelectedChatTitle = (state: State) =>
  state.chats.find(chat => String(chat.id) === state.selectedChat?.id)?.title;

export const getSelectedChatId = (state: State) => {
  // eslint-disable-next-line no-console
  // console.log(state);
  return state.selectedChat;
};
