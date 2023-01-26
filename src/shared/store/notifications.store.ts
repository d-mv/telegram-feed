import { atom, DefaultValue, selector } from 'recoil';

import { Message } from '../../domains';

export const notificationsState = atom<Message[]>({
  key: 'notifications',
  default: [],
});

export const notificationsSelector = selector({
  key: 'notifications/selector',
  get: ({ get }) => get(notificationsState),
  set: ({ set, get }, v) => {
    if (v instanceof DefaultValue) set(notificationsState, v);
    else set(notificationsState, [...get(notificationsState), ...v]);
  },
});
