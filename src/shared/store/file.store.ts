import { dissoc } from 'ramda';
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

    const val = Object.values(v)[0];

    // remove item from the list
    if (val.expectedSize === -1 && val.downloadedSize === -1) {
      set(fileDownloadProgressState, dissoc(Number(Object.keys(v)[0]), get(fileDownloadProgressState)));
    } else set(fileDownloadProgressState, { ...get(fileDownloadProgressState), ...v });
  },
});
