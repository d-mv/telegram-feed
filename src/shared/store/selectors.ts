import { TMessage } from '../entities';
import { State } from './types';

export const getNotifications = (state: State) => state.notifications;

export const getUser = (state: State) => state.users[0];

export const getMessages = (state: State) => state.messages;

export const getChatById = (state: State) => (id: number) => state.chats.find(chat => chat.id === id);

export const getUserById = (state: State) => (id: number) => state.users.find(user => user.id === id);

export const getAuthPasswordHint = (state: State) => state.authPasswordHint;
