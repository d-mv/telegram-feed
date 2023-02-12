import { RecordObject, Result } from '@mv-d/toolbelt';
import { atom, DefaultValue, selector } from 'recoil';

import { TFilePart, TMessage } from '../entities';

export type QueueItemStatus = 'new' | 'inprogress' | 'finished';

export type QueueItem = {
  fileId: number;
  fileSize: number;
  status: QueueItemStatus;
  callback: (arg0: Result<TFilePart, Error>) => void;
};

export const queue = atom<QueueItem[]>({ key: 'files/download/queue', default: [] });

export const queueSelector = selector({
  key: 'files/download/queue/selector',
  get: ({ get }) => get(queue),
  set: ({ set, get }, v) => {
    if (v instanceof DefaultValue) {
      set(queue, v);
      return;
    }

    const current = get(queue);

    const existing = current.find(q => q.fileId === v[0].fileId);

    if (!existing) {
      set(queue, v);
      return;
    }

    // don't add new files to the queue if they are already there
    if ((v[0].status === 'new' && existing) || v[0].status === existing.status) return;

    set(queue, [...current, ...v]);
  },
});

export const messagesState = atom<TMessage[]>({
  key: 'messages',
  default: [],
});

export const messagesSelector = selector({
  key: 'messages/selector',
  get: ({ get }) => get(messagesState),
  set: ({ set, get }, v) => {
    if (v instanceof DefaultValue) {
      set(messagesState, v);
      return;
    }

    const newIds = v.map(m => m.id);

    set(messagesState, [...get(messagesState).filter(m => !newIds.includes(m.id)), ...v]);
  },
});
