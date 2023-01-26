import { last } from 'ramda';

import { TMessage } from '../entities';
import { getSenderFromMessage } from '../tools';
import { State } from './types';

export const getNotifications = (state: State) => state.notifications;

export const getMyself = (state: State) => state.myself;

export const getByMyself = (state: State) => (id: number) => state.myself && state.myself.id === id;

export const getChatIds = (state: State) => state.chats.map(chat => chat.id);

export const getLastMessageForChat = (state: State) => (chatId: number) =>
  last(state.messages.filter(message => message.chat_id === chatId).sort((a, b) => b.date - a.date));

export const getLastMessagesLoaded = (state: State) => state.lastMessagesLoaded;

export const getMyId = (state: State) => {
  if (!state.options.my_id) return 0;

  return parseInt(state.options.my_id.value);
};

export const getStateRestored = (state: State) => state.isRestored;

export const getIsInitialized = (state: State) => state.isInitialized;

export const getLoadMessage = (state: State) => state.loadMessage;

export const getFeedMessages = (state: State) => state.chatMessages;

export const getMessagesForSelectedChat = (state: State) => {
  if (!state.selectedChat) return [];

  return state.chatMessages
    .filter(message => message.chat_id === state.selectedChat?.id)
    .sort((a, b) => b.date - a.date);
};

export const getChats = (state: State) => state.chats;

export const getChatById = (state: State) => (id: number) => state.chats.find(chat => chat.id === id);

export const getUserById = (state: State) => (id: number) =>
  (state.myself && state.myself.id) === id ? state.myself : state.users.find(user => user.id === id);

export const getSenderFromMsg =
  (state: State) =>
  (message: TMessage, isChat = false) =>
    getSenderFromMessage({
      isChat,
      message,
      getChat: getChatById(state),
      getUser: getUserById(state),
      myself: state.myself,
    });

export const getAuthPasswordHint = (state: State) => state.authPasswordHint;

export const getSelectedChatDetails = (state: State) => state.chats.find(chat => chat.id === state.selectedChat?.id);

export const getSelectedChatTitle = (state: State) => state.selectedChat?.title;

export const getSelectedChat = (state: State) => state.selectedChat;
