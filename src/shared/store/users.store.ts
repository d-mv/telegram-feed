import { Optional } from '@mv-d/toolbelt';
import { atom, DefaultValue, selector } from 'recoil';

import { StateUser } from './data.types';

export const usersState = atom<StateUser[]>({
  key: 'users',
  default: [],
});

export const usersSelector = selector({
  key: 'users/selector',
  get: ({ get }) => get(usersState),
  set: ({ set, get }, v) => {
    if (v instanceof DefaultValue) {
      set(usersState, v);
      return;
    }

    const newIds = v.map(u => u.id);

    set(usersState, [...get(usersState).filter(user => !newIds.includes(user.id)), ...v]);
  },
});

export const myselfState = atom<Optional<StateUser>>({
  key: 'users/myself',
  default: undefined,
});

export const myselfSelector = selector({
  key: 'users/myself/selector',
  get: ({ get }) => get(myselfState),
  set: ({ set }, v) => set(myselfState, v),
});
