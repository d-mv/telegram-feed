import { State } from './types';

export const getNotifications = (state: State) => state.notifications;

export const getMyself = (state: State) => state.myself;

export const getByMyself = (state: State) => (id: number) => state.myself && state.myself.id === id;

export const getChatIds = (state: State) => state.chatIds;

export const getMyId = (state: State) => {
  if (!state.options.my_id) return 0;

  return parseInt(state.options.my_id.value);
};

export const getLoadMessage = (state: State) => state.loadMessage;

export const getMessages = (state: State) => {
  return state.chatMessages
    .filter(
      message =>
        message.sender_id['@type'] !== 'messageSenderUser' || message.sender_id.user_id !== state.currentUserId,
    )
    .sort((a, b) => b.date - a.date);
};

export const getMessagesForSelectedChat = (state: State) => {
  if (!state.selectedChat) return [];

  return state.chatMessages
    .filter(message => message.chat_id === state.selectedChat?.id)
    .sort((a, b) => b.date - a.date);
};

export const getChatById = (state: State) => (id: number) => state.chats.find(chat => chat.id === id);

export const getUserById = (state: State) => (id: number) => state.users.find(user => user.id === id);

export const getAuthPasswordHint = (state: State) => state.authPasswordHint;

export const getSelectedChatDetails = (state: State) => state.chats.find(chat => chat.id === state.selectedChat?.id);

export const getSelectedChatTitle = (state: State) => state.selectedChat?.title;

export const getSelectedChat = (state: State) => state.selectedChat;
