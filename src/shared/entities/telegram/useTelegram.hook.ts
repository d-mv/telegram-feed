import { useContextSelector } from 'use-context-selector';
import QRCodeStyling from 'qr-code-styling';
import { failure, logger, PromisedResult, R, success } from '@mv-d/toolbelt';
import { useCallback, useEffect } from 'react';

import tg_logo from '../../assets/tg_logo.png';
import { MaybeNull } from '../../types';
import {
  addChat,
  addMessages,
  addNotification,
  addUser,
  addUserFullInfo,
  getIsInitialized,
  getLoadMessage,
  getStateRestored,
  setChatIds,
  setIsInitialized,
  setLoadMessage,
  useDispatch,
  useSelector,
} from '../../store';
import { TelegramContext } from './telegram.context';
import { makeTErrorNotification } from './telegram.tools';
import { TChat, TChats, TFilePart, TMessage, TMessages, TUser, TUserFullInfo } from './types';
import { isDebugLogging } from '../../tools';
import { CONFIG } from '../../config';
import { useDebounce } from '../../hooks';

export function useTelegram() {
  const [client, event, send] = useContextSelector(TelegramContext, c => [c.client, c.event, c.send]);

  const loadMessage = useSelector(getLoadMessage);

  const isRestored = useSelector(getStateRestored);

  const isInitialized = useSelector(getIsInitialized);

  const dispatch = useDispatch();

  function submitPassword(password: string) {
    client
      .send({
        '@type': 'checkAuthenticationPassword',
        password,
      })
      .catch((err: unknown) => {
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
          client
            .send({
              '@type': 'checkDatabaseEncryptionKey',
            })
            .catch((err: unknown) => {
              if (isDebugLogging(CONFIG)) R.compose(dispatch, addNotification, makeTErrorNotification)(err);
            });

          break;
        case 'authorizationStateWaitPhoneNumber':
          await client.send({
            '@type': 'requestQrCodeAuthentication',
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
    await client
      .send({
        '@type': 'downloadFile',
        file_id: fileId,
        priority: 1,
        synchronous: true,
      })
      .catch((err: unknown) => {
        if (isDebugLogging(CONFIG)) R.compose(dispatch, addNotification, makeTErrorNotification)(err);
      });

    // Read the data from local tdlib to blob
    const maybeFile = await send<TFilePart>({
      type: 'readFile',
      file_id: fileId,
    });

    if (maybeFile.isSome) return success(maybeFile.payload);
    else {
      if (isDebugLogging(CONFIG)) R.compose(dispatch, addNotification, makeTErrorNotification)(maybeFile.error);

      return failure(maybeFile.error);
    }
  }

  const fetchUserById = useCallback(
    async (user_id: number) => {
      const maybeUser = await send<TUser>({ type: 'getUser', user_id });

      if (maybeUser.isNone) {
        logger.error(maybeUser.error, `User not found with id: ${user_id}`);
        return;
      }

      R.compose(dispatch, addUser)(maybeUser.payload);

      const maybeUserFullInfo = await send<TUserFullInfo>({ type: 'getUserFullInfo', user_id });

      if (maybeUserFullInfo.isNone) {
        logger.error(maybeUserFullInfo.error, `User (Full Info) not found with id: ${user_id}`);
        return;
      }

      R.compose(dispatch, addUserFullInfo)({ id: user_id, data: maybeUserFullInfo.payload });
    },
    [dispatch, send],
  );

  const fetchChatIds = useCallback(async () => {
    let ids: number[] = [];

    let limit = 20;
    let i = 0;

    while (i !== -1) {
      const maybeChats = await send<TChats>({
        type: 'getChats',
        chat_list: { '@type': 'chatListMain' },
        // offset_order,
        offset_chat_id: ids.length ? R.last(ids) : 0,
        limit,
      });

      if (maybeChats.isNone) break;

      ids = [...ids, ...maybeChats.payload.chat_ids];

      if (maybeChats.payload.total_count <= ids.length) i = -1;

      if (maybeChats.payload.total_count - ids.length < 20) limit = maybeChats.payload.total_count - ids.length;
    }

    R.compose(dispatch, setChatIds)(ids);
    return ids;
  }, [dispatch, send]);

  const fetchChats = useCallback(
    async (chatIds: number[]) => {
      R.compose(dispatch, setLoadMessage)('Loading chats...');

      const chats: TChat[] = [];

      for await (const chat_id of chatIds) {
        const maybeChat = await send<TChat>({
          type: 'getChat',
          chat_id,
        });

        if (maybeChat.isNone) return chats;

        chats.push(maybeChat.payload);
        R.compose(dispatch, addChat)(maybeChat.payload);
      }

      return chats;
    },
    [dispatch, send],
  );

  const fetchMessagesForChatId = useCallback(
    async (chat_id: number) => {
      const messages: TMessage[] = [];

      const limit = 20;

      // fetchChatById(chat_id);

      if (chat_id > 0) fetchUserById(chat_id);

      while (messages.length < 20) {
        // First call
        const maybeMessages = await send<TMessages>({
          type: 'getChatHistory',
          chat_id,
          from_message_id: messages.length ? messages[messages.length - 1].id : 0,
          // offset: -limit + 1,
          limit,
          only_local: false,
        });

        if (maybeMessages.isNone) break;

        if (maybeMessages.payload.total_count === 0) break;

        messages.push(...maybeMessages.payload.messages);

        if (loadMessage) R.compose(dispatch, setLoadMessage)('');

        R.compose(dispatch, addMessages)(maybeMessages.payload.messages);
      }
    },
    [dispatch, fetchUserById, loadMessage, send],
  );

  const fetchMessagesForChats = useCallback(
    (ids: number[]) => {
      for (const chat_id of ids) {
        fetchMessagesForChatId(chat_id);
      }
    },
    [fetchMessagesForChatId],
  );

  // TODO: update with fetching from cache
  const acquireChatIds = useCallback(async () => {
    R.compose(dispatch, setLoadMessage)('Loading chat list...');

    return await fetchChatIds();
  }, [dispatch, fetchChatIds]);

  const getChats = useCallback(async () => {
    const ids = await acquireChatIds();

    logger.info(`Acquired chat ids, qty: ${ids.length}`);

    if (ids.length === 0) return;

    fetchChats(ids);
    logger.info('Fetching messages...');
    R.compose(dispatch, setLoadMessage)('Loading messages...');
    fetchMessagesForChats(ids);
  }, [acquireChatIds, dispatch, fetchChats, fetchMessagesForChats]);

  const handleInitialization = useCallback(() => {
    logger.info('State is restored, initializing...');
    R.compose(dispatch, setIsInitialized)();
    getChats();
  }, [dispatch, getChats]);

  const handleInitializationDebounced = useDebounce(handleInitialization, 300);

  useEffect(() => {
    if (isRestored && !isInitialized) handleInitializationDebounced();
  }, [handleInitializationDebounced, isInitialized, isRestored]);

  return { handleAuthentication, submitPassword, downloadFile };
}
