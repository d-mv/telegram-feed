import { atom, DefaultValue, selector } from 'recoil';

import { TMessage } from '../entities';

export const messagesState = atom<TMessage[]>({
  key: 'messages',
  default: [],
});

export const messagesSelector = selector({
  key: 'messages/selector',
  get: ({ get }) => get(messagesState),
  set: ({ set, get }, v) => {
    if (v instanceof DefaultValue) {
      set(messagesState, v);
      return;
    }

    const newIds = v.map(m => m.id);

    set(messagesState, [...get(messagesState).filter(m => !newIds.includes(m.id)), ...v]);
  },
});
