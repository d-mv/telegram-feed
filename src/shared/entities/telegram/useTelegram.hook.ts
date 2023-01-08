import { useContextSelector } from 'use-context-selector';
import QRCodeStyling from 'qr-code-styling';
import { failure, logger, PromisedResult, R, success } from '@mv-d/toolbelt';
import { useCallback } from 'react';

import tg_logo from '../../assets/tg_logo.png';
import { MaybeNull } from '../../types';
import { addChat, addMessage, addNotification, useDispatch } from '../../store';
import { TelegramContext } from './telegram.context';
import { makeTErrorNotification } from './telegram.tools';
import { TChat, TChats, TFilePart, TMessage, TMessages } from './types';
import { isDebugLogging } from '../../tools';
import { CONFIG } from '../../config';
import { useDebounce } from '../../hooks';

export function useTelegram() {
  const [client, event, send] = useContextSelector(TelegramContext, c => [c.client, c.event, c.send]);

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

  const fetchChatIds = useCallback(async () => {
    let chatIds: number[] = [];

    let limit = 20;
    let i = 0;

    while (i !== -1) {
      const maybeChats = await send<TChats>({
        type: 'getChats',
        chat_list: { '@type': 'chatListMain' },
        // offset_order,
        offset_chat_id: chatIds.length ? R.last(chatIds) : 0,
        limit,
      });

      if (maybeChats.isNone) break;

      chatIds = [...chatIds, ...maybeChats.payload.chat_ids];

      if (maybeChats.payload.total_count <= chatIds.length) i = -1;

      if (maybeChats.payload.total_count - chatIds.length < 20) limit = maybeChats.payload.total_count - chatIds.length;
    }
    return chatIds;
  }, [send]);

  const fetchChats = useCallback(
    async (chatIds: number[]) => {
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

      while (messages.length < 50) {
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
        maybeMessages.payload.messages.forEach(R.compose(dispatch, addMessage));
        // if (maybeMessages.payload.total_count <= messages.length) i = -1;

        // if (maybeMessages.payload.total_count - messages.length < 20)
        //   limit = maybeMessages.payload.total_count - messages.length;
        // }
      }
    },
    [dispatch, send],
  );

  const fetchMessagesForChats = useCallback(
    async (chatIds: number[]) => {
      for (const chat_id of chatIds) {
        fetchMessagesForChatId(chat_id);
      }
    },
    [fetchMessagesForChatId],
  );

  const getChatsOriginal = useCallback(async () => {
    const chatIds = await fetchChatIds();

    if (chatIds.length === 0) return;

    fetchChats(chatIds);

    fetchMessagesForChats([chatIds[0]]);
  }, [fetchChatIds, fetchChats, fetchMessagesForChats]);

  const getChats = useDebounce(getChatsOriginal);

  return { handleAuthentication, getChats, submitPassword, downloadFile };
}
