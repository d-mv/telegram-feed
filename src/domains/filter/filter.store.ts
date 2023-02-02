import { atom, DefaultValue, selector } from 'recoil';

export const selectedState = atom<number[]>({ key: 'selected', default: [] });

export const selectedSelector = selector<number[]>({
  key: 'selected/selector',
  get: ({ get }) => get(selectedState),
  set: ({ set, get }, v) => {
    if (v instanceof DefaultValue) {
      set(selectedState, v);
      return;
    }

    if (get(selectedState).find(i => i === v[0]))
      set(
        selectedState,
        get(selectedState).filter(i => i !== v[0]),
      );
    else set(selectedState, [...get(selectedState), ...v]);
  },
});
