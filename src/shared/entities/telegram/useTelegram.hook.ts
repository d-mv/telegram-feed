import { useContextSelector } from 'use-context-selector';
import QRCodeStyling from 'qr-code-styling';
import { failure, logger, PromisedResult, R, success } from '@mv-d/toolbelt';
import { useCallback, useEffect, useState } from 'react';

import tg_logo from '../../assets/tg_logo.png';
import { MaybeNull } from '../../types';
import {
  addChat,
  addMessages,
  addNotification,
  addUser,
  addUserFullInfo,
  getChats,
  getIsInitialized,
  getLoadMessage,
  getStateRestored,
  setChatIds,
  setIsInitialized,
  setLoadMessage,
  StateActions,
  useDispatch,
  useSelector,
} from '../../store';
import { TelegramContext } from './telegram.context';
import { makeTErrorNotification } from './telegram.tools';
import { TChat, TChats, TFilePart, TMessage, TMessages, TUser, TUserFullInfo } from './types';
import { isDebugLogging } from '../../tools';
import { CONFIG } from '../../config';
import { useDebounce } from '../../hooks';
import { TelegramService } from './telegram.service';

export function useTelegram() {
  const [event] = useContextSelector(TelegramContext, c => [c.event]);

  const loadMessage = useSelector(getLoadMessage);

  const isRestored = useSelector(getStateRestored);

  const isInitialized = useSelector(getIsInitialized);

  const dispatch = useDispatch();

  function submitPassword(password: string) {
    TelegramService.send({
      type: 'checkAuthenticationPassword',
      password,
    }).catch((err: unknown) => {
      if (isDebugLogging(CONFIG)) R.compose(dispatch, addNotification, makeTErrorNotification)(err);
    });
  }

  function handleAuthentication(container: MaybeNull<HTMLDivElement>) {
    return async function call() {
      if (!event) return;

      if (!('authorization_state' in event)) return;

      const type = event.authorization_state['@type'];

      switch (type) {
        // case 'authorizationStateClosed':

        //   break;
        case 'authorizationStateWaitEncryptionKey':
          TelegramService.send({
            type: 'checkDatabaseEncryptionKey',
          }).catch((err: unknown) => {
            if (isDebugLogging(CONFIG)) R.compose(dispatch, addNotification, makeTErrorNotification)(err);
          });

          break;
        case 'authorizationStateWaitPhoneNumber':
          await TelegramService.send({
            type: 'requestQrCodeAuthentication',
            other_user_ids: [],
          });
          break;
        case 'authorizationStateWaitOtherDeviceConfirmation':
          if (!container) {
            if (isDebugLogging(CONFIG)) logger.error('Container is not defined');

            return;
          }

          // eslint-disable-next-line no-case-declarations
          const qrCode = new QRCodeStyling({
            width: 200,
            height: 200,
            data: event.authorization_state.link,
            dotsOptions: {
              color: '#1132b6',
              type: 'square',
            },
            backgroundOptions: {
              color: 'transparent',
            },
            image: tg_logo,
            imageOptions: {
              crossOrigin: 'anonymous',
              margin: 6,
            },
          });

          container.innerHTML = '';
          qrCode.append(container);

          break;
        default:
          break;
      }
    };
  }

  async function downloadFile(fileId: number): PromisedResult<TFilePart> {
    // downloading the file
    await TelegramService.send({
      type: 'downloadFile',
      file_id: fileId,
      priority: 1,
      synchronous: true,
    }).catch((err: unknown) => {
      if (isDebugLogging(CONFIG)) R.compose(dispatch, addNotification, makeTErrorNotification)(err);
    });

    // Read the data from local tdlib to blob
    const maybeFile = await TelegramService.send<TFilePart>({
      type: 'readFile',
      file_id: fileId,
    });

    if (maybeFile.isSome) return success(maybeFile.payload);
    else {
      if (isDebugLogging(CONFIG)) R.compose(dispatch, addNotification, makeTErrorNotification)(maybeFile.error);

      return failure(maybeFile.error);
    }
  }

  const getChat = useCallback(
    async (chat_id: number, isLast?: boolean) => {
      const chat = await TelegramService.send<TChat>({ type: 'getChat', chat_id });

      if (chat.isSome) R.compose(dispatch, addChat)(chat.payload);

      if (isLast) dispatch({ type: StateActions.CLEAR_LAST_MESSAGES });
    },
    [dispatch],
  );

  const processChatIds = useCallback(
    async (chatIds: number[]) => {
      logger.info('Processing chat ids...');

      for await (const id of chatIds) {
        await getChat(id, id === R.last(chatIds));
      }
    },
    [getChat],
  );

  const getChats = useCallback(async () => {
    logger.info('Getting chats...');

    const maybeChats = await TelegramService.send<TChats>({
      type: 'getChats',
      // TODO: solve
      limit: 1000,
    });

    if (maybeChats.isNone) {
      logger.error(maybeChats.error, 'maybeChats');

      return;
    }

    R.compose(dispatch, setChatIds)(maybeChats.payload.chat_ids);

    if (maybeChats.payload.chat_ids.length) processChatIds(maybeChats.payload.chat_ids);
  }, [dispatch, processChatIds]);

  useEffect(() => {
    if (isRestored && !isInitialized) {
      R.compose(dispatch, setIsInitialized)();
      getChats();
    }
  }, [isRestored, isInitialized, dispatch, getChats]);

  return { handleAuthentication, submitPassword, downloadFile, getChat };
}
