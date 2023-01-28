import { useSetRecoilState } from 'recoil';
import { compose, omit } from 'ramda';
import { failure, logger, RecordObject, Result, success, toArray } from '@mv-d/toolbelt';
import { useCallback, useEffect, useState } from 'react';

import { myselfSelector, notificationsSelector, StateUser, usersSelector } from '../../store';
import { makeTErrorNotification } from './telegram.tools';
import { TFilePart, TUser, TUserFullInfo } from './types';
import { isDebugLogging } from '../../tools';
import { CONFIG } from '../../config';
import { TelegramService } from './telegram.service';

type QueueItemStatus = 'new' | 'inprogress' | 'finished';

type QueueItem = {
  fileSize: number;
  status: QueueItemStatus;
  callback: (arg0: Result<TFilePart, Error>) => void;
};

export function useTelegram() {
  const setMyself = useSetRecoilState(myselfSelector);

  const setUser = useSetRecoilState(usersSelector);

  const setNotification = useSetRecoilState(notificationsSelector);

  function submitPassword(password: string) {
    TelegramService.send({
      type: 'checkAuthenticationPassword',
      password,
    }).catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error(err);

      if (isDebugLogging(CONFIG)) compose(setNotification, toArray, makeTErrorNotification)(err);
    });
  }

  const [downloadQueue, setDownloadQueue] = useState<RecordObject<QueueItem>>({});

  const updateItemInQueue = useCallback(
    (fileId: number, status: QueueItemStatus) => {
      setDownloadQueue({ ...downloadQueue, [fileId]: { ...downloadQueue[fileId], status } });
    },
    [downloadQueue],
  );

  const downloadFile = useCallback(
    async (fileId: number, callback: (arg0: Result<TFilePart, Error>) => void): Promise<void> => {
      updateItemInQueue(fileId, 'inprogress');

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

      updateItemInQueue(fileId, 'finished');

      if (maybeFile.isSome) callback(success(maybeFile.payload));
      else {
        // eslint-disable-next-line no-console
        console.error(maybeFile.error);

        if (isDebugLogging(CONFIG)) compose(setNotification, toArray, makeTErrorNotification)(maybeFile.error);

        callback(failure(maybeFile.error));
      }
    },
    [setNotification, updateItemInQueue],
  );

  // TODO: implement logic for prioritizing downloads
  useEffect(() => {
    const newFiles = Object.entries(downloadQueue).filter(([, { status }]) => status === 'new');

    if (newFiles.length === 0) return;

    newFiles.slice(0, 3).forEach(file => {
      const fileId = parseInt(file[0]);

      downloadFile(fileId, file[1].callback);
    });
  }, [downloadFile, downloadQueue]);

  function queueFileDownload(fileId: number, fileSize: number, callback: (arg0: Result<TFilePart, Error>) => void) {
    if (!(fileId in downloadQueue))
      setDownloadQueue(state => ({ [fileId]: { fileSize, status: 'new', callback }, ...state }));
  }

  const fetchUserById = useCallback(
    async (myId: string | number, isMyself = false) => {
      const user_id = typeof myId === 'string' ? parseInt(myId) : myId;

      const maybeUser = await TelegramService.send<TUser>({ type: 'getUser', user_id });

      if (maybeUser.isNone) {
        logger.error(maybeUser.error, `User not found with id: ${user_id}`);
        return;
      }

      const maybeUserFullInfo = await TelegramService.send<TUserFullInfo>({ type: 'getUserFullInfo', user_id });

      if (maybeUserFullInfo.isNone) {
        logger.error(maybeUserFullInfo.error, `User (Full Info) not found with id: ${user_id}`);
        return;
      }

      const update: StateUser = { ...maybeUser.payload, ...omit(['@type'], maybeUserFullInfo) };

      if (isMyself) setMyself(update);
      else setUser([update]);
    },
    [setMyself, setUser],
  );

  return { submitPassword, downloadFile, fetchUserById, queueFileDownload };
}
