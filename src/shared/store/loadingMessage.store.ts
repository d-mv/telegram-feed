import { Optional } from '@mv-d/toolbelt';
import { atom, selector } from 'recoil';

export const loadingMessageState = atom<Optional<string>>({
  key: 'loadingMessage',
  default: undefined,
});

export const loadingMessageSelector = selector({
  key: 'loadingMessage/selector',
  get: ({ get }) => get(loadingMessageState),
  set: ({ set }, v) => set(loadingMessageState, v),
});
