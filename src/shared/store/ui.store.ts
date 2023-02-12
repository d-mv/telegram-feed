import { atom, DefaultValue, selector } from 'recoil';

export const containerWidthState = atom<number>({
  key: 'ui/containerWidth',
  default: 0,
});

export const containerWidthSelector = selector({
  key: 'ui/containerWidth/selector',
  get: ({ get }) => get(containerWidthState),
  set: ({ set, get }, v) => {
    if (v instanceof DefaultValue) return set(containerWidthState, v);

    if (get(containerWidthState) !== v) set(containerWidthState, v);
  },
});
