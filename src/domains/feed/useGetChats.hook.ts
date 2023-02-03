import { logger } from '@mv-d/toolbelt';
import { useCallback, useEffect, useRef } from 'react';
import { last } from 'ramda';
import { useSetRecoilState, useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';

import {
  chatIdsSelector,
  chatsSelector,
  TelegramService,
  TChat,
  TChats,
  myselfSelector,
  chatsLoadedSelector,
  authState,
  messagesSelector,
  TMessage,
  TMessages,
  useTelegram,
  loadingMessageSelector,
} from '../../shared';
import { filterState } from '../../shared/store/filter.store';

export function useGetChats() {
  const myself = useRecoilValue(myselfSelector);

  const setChatIds = useSetRecoilState(chatIdsSelector);

  const [chats, setChats] = useRecoilState(chatsSelector);

  const setChatsLoaded = useSetRecoilState(chatsLoadedSelector);

  const { fetchUserById } = useTelegram();

  const setMessages = useSetRecoilState(messagesSelector);

  const messages = useRecoilValue(messagesSelector);

  const init = useRef(false);

  const authStatus = useRecoilValue(authState);

  const filter = useRecoilValue(filterState);

  const setLoadingMessage = useSetRecoilState(loadingMessageSelector);

  const resetLoadingMessage = useResetRecoilState(loadingMessageSelector);

  const getChat = useCallback(
    async (chat_id: number, isLast?: boolean) => {
      const chat = await TelegramService.send<TChat>({ type: 'getChat', chat_id });

      if (chat.isSome) {
        setChats([...chats, chat.value]);
        chat.value.type['@type'] === 'chatTypePrivate' && fetchUserById(chat.value.type.user_id);
      }
      // eslint-disable-next-line no-console
      else console.log('getChat error', chat_id, chat.error);

      if (isLast) setChatsLoaded(true);
    },
    [chats, fetchUserById, setChats, setChatsLoaded],
  );

  const fetchMessagesForChatId = useCallback(
    async (chat_id: number, lastMessageId: number, isFirst = false) => {
      if (isFirst) setLoadingMessage('Getting messages...');

      const messages: TMessage[] = [];

      const limit = 20;

      while (messages.length < 20) {
        const maybeMessages = await TelegramService.send<TMessages>({
          type: 'getChatHistory',
          chat_id,
          from_message_id: messages.length ? messages[messages.length - 1].id : lastMessageId,
          // offset: -limit + 1,
          limit,
          only_local: false,
        });

        if (maybeMessages.isNone) break;

        if (maybeMessages.value.total_count === 0) break;

        messages.push(...maybeMessages.value.messages);

        if (isFirst) resetLoadingMessage();

        setMessages(maybeMessages.value.messages);
      }
    },
    [resetLoadingMessage, setLoadingMessage, setMessages],
  );

  const messagesForChatIds = useCallback(
    async (chatIds: number[]) => {
      for await (const id of chatIds) {
        await fetchMessagesForChatId(id, 0);
      }
    },
    [fetchMessagesForChatId],
  );

  const processChatIds = useCallback(
    async (chatIds: number[]) => {
      logger.info('Processing chat ids...');
      let isFirst = true;

      for await (const id of chatIds) {
        await getChat(id, id === last(chatIds));

        if (filter.length) {
          if (filter.includes(id)) {
            await fetchMessagesForChatId(id, 0, isFirst);
            isFirst = false;
          }
        } else {
          await fetchMessagesForChatId(id, 0, isFirst);
          isFirst = false;
        }
      }
    },
    [fetchMessagesForChatId, filter, getChat],
  );

  const getChats = useCallback(async () => {
    logger.info('Getting chats...');

    const maybeChats = await TelegramService.send<TChats>({
      type: 'getChats',
      // TODO: solve
      limit: 1000,
    });

    if (maybeChats.isNone) {
      console.error(maybeChats.error, 'maybeChats');

      return;
    }

    const ids = maybeChats.value.chat_ids;

    setChatIds(ids);

    if (ids) processChatIds(ids);
  }, [processChatIds, setChatIds]);

  useEffect(() => {
    if (authStatus && myself && !init.current && !messages.length) {
      init.current = true;
      setLoadingMessage('Connected, getting chats...');
      getChats();
    }
  }, [myself, getChats, authStatus, setLoadingMessage, messages.length]);

  return { messagesForChatIds };
}
