import { Optional } from '@mv-d/toolbelt';
import { atom, DefaultValue, selector } from 'recoil';

import { isChannel, isPrivate, StorageService, TChat } from '../entities';
import { SelectedChatId } from './types';

export const chatsLoadedState = atom({
  key: 'chats/loaded',
  default: false,
});

export const chatsLoadedSelector = selector({
  key: 'chats/loaded/selector',
  get: ({ get }) => get(chatsLoadedState),
  set: ({ set }, v) => set(chatsLoadedState, v),
});

export const chatIdsState = atom<number[]>({
  key: 'chats/ids',
  default: [],
});

export const chatIdsSelector = selector({
  key: 'chats/ids/selector',
  get: ({ get }) => get(chatIdsState),
  set: ({ set }, v) => set(chatIdsState, v),
});

export const chatsState = atom<TChat[]>({
  key: 'chats',
  default: [],
});

export const chatsSelector = selector({
  key: 'chats/selector',
  get: ({ get }) => get(chatsState),
  set: ({ set, get }, v) => {
    if (v instanceof DefaultValue) {
      set(chatsState, v);
      return;
    }

    set(chatsState, [...get(chatsState), ...v.filter(c => isPrivate(c) || isChannel(c))]);
  },
});

export const selectedChatState = atom<Optional<SelectedChatId>>({
  key: 'chats/selected',
  default: undefined,
});

export const selectedChatSelector = selector({
  key: 'chats/selected/selector',
  get: ({ get }) => get(selectedChatState),
  set: ({ set }, v) => {
    set(selectedChatState, v);
    StorageService.set('selectedChat', v);
  },
});

// TODO: do we need this?
export const supergroupsState = atom<Record<number, { username: string }>>({
  key: 'chats/supergroups',
  default: {},
});

export const supergroupsSelector = selector({
  key: 'chats/supergroups/selector',
  get: ({ get }) => get(supergroupsState),
  set: ({ set, get }, v) => {
    if (v instanceof DefaultValue) {
      set(supergroupsState, v);
      return;
    }

    const entry = Object.entries(v)[0];

    set(supergroupsState, { ...get(supergroupsState), [entry[0]]: entry[1] });
  },
});
