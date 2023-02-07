import { atom, DefaultValue, selector } from 'recoil';

import { FileDownloadProgress } from './data.types';

export const fileDownloadProgressState = atom<FileDownloadProgress>({ key: 'file/download/progress', default: {} });

export const fileDownloadProgressSelector = selector({
  key: 'file/download/progress/selector',
  get: ({ get }) => get(fileDownloadProgressState),
  set: ({ set, get }, v) => {
    if (v instanceof DefaultValue) {
      set(fileDownloadProgressState, v);
      return;
    }

    set(fileDownloadProgressState, { ...get(fileDownloadProgressState), ...v });
  },
});
