import { atom, DefaultValue, selector } from 'recoil';

import { TOptions } from '../entities';

export const optionsState = atom<Partial<TOptions>>({
  key: 'options',
  default: {},
});

export const optionsSelector = selector({
  key: 'options/selector',
  get: ({ get }) => get(optionsState),
  set: ({ set, get }, v) => {
    if (v instanceof DefaultValue) set(optionsState, v);
    else set(optionsState, { ...get(optionsState), ...v });
  },
});
