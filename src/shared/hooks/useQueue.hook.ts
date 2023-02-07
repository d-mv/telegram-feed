import { Result, toArray, success, failure } from '@mv-d/toolbelt';
import { compose, assoc, isNil } from 'ramda';
import { useState, useCallback, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { CONFIG } from '../config';
import { TFilePart, TelegramService, makeTErrorNotification } from '../entities';
import { notificationsSelector } from '../store';
import { isDebugLogging } from '../tools';

type QueueItemStatus = 'new' | 'inprogress' | 'finished';

type QueueItem = {
  fileSize: number;
  status: QueueItemStatus;
  callback: (arg0: Result<TFilePart, Error>) => void;
};

let queue: Record<number, QueueItem> = {};

export function useQueue() {
  const [updated, setUpdated] = useState(false);

  const setNotification = useSetRecoilState(notificationsSelector);

  async function downloadFile(fileId: number, callback: (arg0: Result<TFilePart, Error>) => void): Promise<void> {
    queue[fileId].status = 'inprogress';

    // downloading the file
    await TelegramService.send({
      type: 'downloadFile',
      file_id: fileId,
      priority: 1,
      synchronous: true,
    }).catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error(err);

      if (isDebugLogging(CONFIG)) compose(setNotification, toArray, makeTErrorNotification)(err);
    });

    // Read the data from local tdlib to blob
    const maybeFile = await TelegramService.send<TFilePart>({
      type: 'readFile',
      file_id: fileId,
    });

    // update the queue and trigger the process update
    queue[fileId].status = 'finished';
    setUpdated(!updated);

    if (maybeFile.isSome) callback(success(maybeFile.value));
    else {
      // eslint-disable-next-line no-console
      console.error(maybeFile.error);

      if (isDebugLogging(CONFIG)) compose(setNotification, toArray, makeTErrorNotification)(maybeFile.error);

      callback(failure(maybeFile.error));
    }
  }

  const updateDownloadProcess = useCallback(() => {
    if (isNil(queue)) return;

    const newItemsInQueue = Object.entries(queue).filter(([_, { status }]) => status === 'new');

    if (!newItemsInQueue.length) return;

    const runningItemsInQueue = Object.entries(queue).filter(([_, { status }]) => status === 'inprogress');

    // limit qty of simultaneous downloads
    if (runningItemsInQueue.length >= 10) return;

    // take the qty we can download
    newItemsInQueue
      //   .sort((a, b) => a[1].fileSize - b[1].fileSize)
      .slice(0, runningItemsInQueue.length - 10)
      .forEach(([fileId, { callback }]) => {
        downloadFile(parseInt(fileId), callback);
      });

    // we need memoization to be updated on this set of dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadFile, updated]);

  useEffect(() => {
    updateDownloadProcess();
  }, [updateDownloadProcess, updated]);

  function queueFileDownload(fileId: number, fileSize: number, callback: (arg0: Result<TFilePart, Error>) => void) {
    if (!(fileId in queue)) {
      queue = assoc(fileId, { fileSize, status: 'new', callback }, queue);
      // trigger mechanism to launch download process update
      setUpdated(!updated);
    }
  }

  const cancelFileDownload = useCallback((fileId: number) => {
    // if (!(fileId in downloadQueue)) return;
    // if (downloadQueue[fileId].status === 'inprogress') {
    //   TelegramService.send({
    //     type: 'cancelDownloadFile',
    //     file_id: fileId,
    //   });
    // }
    // setDownloadQueue(({ [fileId]: _, ...o }) => o);
  }, []);

  return { cancelFileDownload, queueFileDownload };
}
