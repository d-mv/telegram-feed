import { logger, match, stringify } from '@mv-d/toolbelt';
import { atom, selector } from 'recoil';

import { StorageService } from '../entities';

export const filterState = atom<number[]>({ key: 'filter', default: [] });

export const filterSelector = selector<number[]>({
  key: 'filter/selector',
  get: ({ get }) => get(filterState),
  set: ({ set }, v) => {
    set(filterState, v);

    match(stringify(v), {
      Some: r => StorageService.set('filter', r),
      None: _ => logger.warn('Could not stringify filter'),
    });
  },
});
