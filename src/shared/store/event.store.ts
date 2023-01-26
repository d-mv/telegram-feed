import { Optional } from '@mv-d/toolbelt';
import { atom, selector } from 'recoil';

import { TAuthUpdates } from '../entities';

export const authEventState = atom<Optional<TAuthUpdates>>({
  key: 'authEvent',
  default: undefined,
});

export const authEventSelector = selector({
  key: 'authEvent/selector',
  get: ({ get }) => get(authEventState),
  set: ({ set }, v) => set(authEventState, v),
});

export const passwordHintState = atom<string>({
  key: 'passwordHint',
  default: undefined,
});

export const passwordHintSelector = selector({
  key: 'passwordHint/selector',
  get: ({ get }) => get(passwordHintState),
  set: ({ set }, v) => set(passwordHintState, v),
});
