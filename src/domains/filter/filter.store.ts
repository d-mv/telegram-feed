import { atom, DefaultValue, selector } from 'recoil';

export const filterState = atom<number[]>({ key: 'filter', default: [] });

export const filterSelector = selector<number[]>({
  key: 'filter/selector',
  get: ({ get }) => get(filterState),
  set: ({ set, get }, v) => {
    if (v instanceof DefaultValue) {
      set(filterState, v);
      return;
    }

    if (get(filterState).find(i => i === v[0]))
      set(
        filterState,
        get(filterState).filter(i => i !== v[0]),
      );
    else set(filterState, [...get(filterState), ...v]);
  },
});
