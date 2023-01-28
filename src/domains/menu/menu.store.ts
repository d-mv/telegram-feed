import { atom, selector } from 'recoil';

export const menuIsOpenState = atom({ key: 'menu/isOpen', default: false });

export const menuIsOpenSelector = selector({
  key: 'menu/isOpen/selector',
  get: ({ get }) => get(menuIsOpenState),
  set: ({ set }, v) => set(menuIsOpenState, v),
});
