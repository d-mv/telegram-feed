import { State } from './types';

export const getNotifications = (state: State) => state.notifications;

export const getCurrentUser = (state: State) => state.users.find(user => user.id === state.currentUserId);

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
