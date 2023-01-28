import { useSetRecoilState } from 'recoil';
import { compose, dissoc, omit } from 'ramda';
import { failure, logger, PromisedResult, Result, success, toArray } from '@mv-d/toolbelt';
import { useCallback, useEffect, useState } from 'react';

import { myselfSelector, notificationsSelector, StateUser, usersSelector } from '../../store';
import { makeTErrorNotification } from './telegram.tools';
import { TFilePart, TUser, TUserFullInfo } from './types';
import { isDebugLogging } from '../../tools';
import { CONFIG } from '../../config';
import { TelegramService } from './telegram.service';

export function useTelegram() {
  const setMyself = useSetRecoilState(myselfSelector);

  const setUser = useSetRecoilState(usersSelector);

  const setNotification = useSetRecoilState(notificationsSelector);

  // const getChatHistory = useCallback(
  //   async (chat_id: number) => {
  //     const messages: TMessage[] = [];

  //     const limit = 20;

  //     // if (chat_id > 0) fetchUserById(chat_id);

  //     while (messages.length < 20) {
  //       // First call
  //       const maybeMessages = await TelegramService.send<TMessages>({
  //         type: 'getChatHistory',
  //         chat_id,
  //         from_message_id: messages.length ? messages[messages.length - 1].id : lastMessageForChat(chat_id)?.id || 0,
  //         // offset: -limit + 1,
  //         limit,
  //         only_local: false,
  //       });

  //       if (maybeMessages.isNone) break;

  //       if (maybeMessages.payload.total_count === 0) break;

  //       messages.push(...maybeMessages.payload.messages);

  //       // R.compose(dispatch, addMessages)(maybeMessages.payload.messages);

  //       // if (loadMessage) R.compose(dispatch, setLoadMessage)('');
  //     }
  //   },
  //   [loadMessage],
  // );

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

  // async function downloadFile(fileId: number): PromisedResult<TFilePart> {
  //   // downloading the file
  //   await TelegramService.send({
  //     type: 'downloadFile',
  //     file_id: fileId,
  //     priority: 1,
  //     synchronous: true,
  //   }).catch((err: unknown) => {
  //     // eslint-disable-next-line no-console
  //     console.error(err);

  //     if (isDebugLogging(CONFIG)) compose(setNotification, toArray, makeTErrorNotification)(err);
  //   });

  //   // Read the data from local tdlib to blob
  //   const maybeFile = await TelegramService.send<TFilePart>({
  //     type: 'readFile',
  //     file_id: fileId,
  //   });

  //   if (maybeFile.isSome) return success(maybeFile.payload);
  //   else {
  //     // eslint-disable-next-line no-console
  //     console.error(maybeFile.error);

  //     if (isDebugLogging(CONFIG)) compose(setNotification, toArray, makeTErrorNotification)(maybeFile.error);

  //     return failure(maybeFile.error);
  //   }
  // }

  const [downloadQueue, setDownloadQueue] = useState<
    Record<
      number,
      {
        fileSize: number;
        status: 'new' | 'inprogress' | 'finished';
        callback: (arg0: Result<TFilePart, Error>) => void;
      }
    >
  >({});

  const downloadFile = useCallback(
    async (fileId: number, callback: (arg0: Result<TFilePart, Error>) => void): Promise<void> => {
      setDownloadQueue({ ...downloadQueue, [fileId]: { ...downloadQueue[fileId], status: 'inprogress' } });
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

      setDownloadQueue({ ...downloadQueue, [fileId]: { ...downloadQueue[fileId], status: 'finished' } });

      if (maybeFile.isSome) callback(success(maybeFile.payload));
      else {
        // eslint-disable-next-line no-console
        console.error(maybeFile.error);

        if (isDebugLogging(CONFIG)) compose(setNotification, toArray, makeTErrorNotification)(maybeFile.error);

        callback(failure(maybeFile.error));
      }
    },
    [downloadQueue, setNotification],
  );

  useEffect(() => {
    // // eslint-disable-next-line no-console
    // console.log(Object.entries(downloadQueue).map(file => `${file[0]} - ${file[1].status}`));

    const newFiles = Object.entries(downloadQueue).filter(([, { status }]) => status === 'new');

    if (newFiles.length === 0) return;

    // eslint-disable-next-line no-console
    // console.log(newFiles);
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
