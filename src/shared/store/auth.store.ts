import { atom, selector } from 'recoil';

export const authState = atom({
  key: 'auth',
  default: false,
});

export const authSelector = selector({
  key: 'auth/selector',
  get: ({ get }) => get(authState),
  set: ({ set }, v) => set(authState, v),
});

export const authLinkState = atom({ key: 'auth/link', default: '' });
