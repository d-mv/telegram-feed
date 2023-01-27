import { logger, makeMatch } from '@mv-d/toolbelt';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import {
  authEventSelector,
  optionsSelector,
  TelegramService,
  TUpdates,
  isDebugLogging,
  CONFIG,
  JsLogVerbosityLevel,
  TELEGRAM_AUTH_TYPES,
  passwordHintSelector,
  useTelegram,
  authState,
  loadingMessageSelector,
  messagesSelector,
  fileDownloadProgressSelector,
} from '../shared';

export function useConnect() {
  const isInit = useRef(false);

  const setAuthEvent = useSetRecoilState(authEventSelector);

  const setOption = useSetRecoilState(optionsSelector);

  const setPasswordHint = useSetRecoilState(passwordHintSelector);

  const setLoadingMessage = useSetRecoilState(loadingMessageSelector);

  const setMessages = useSetRecoilState(messagesSelector);

  const setFileDownloadProgress = useSetRecoilState(fileDownloadProgressSelector);

  const { fetchUserById } = useTelegram();

  const handleOption = useCallback(
    (e: TUpdates) => {
      if (e['@type'] !== 'updateOption') return;

      setOption({ [e.name]: e.value });

      if (e.name === 'my_id' && e.value['@type'] === 'optionValueInteger') {
        fetchUserById(e.value.value, true);
      }
    },
    [fetchUserById, setOption],
  );

  const handleBackground = useCallback(
    (e: TUpdates) => {
      if (!e || e['@type'] !== 'for_dark_theme') return;

      setOption({ for_dark_theme: e.value });
    },
    [setOption],
  );

  const handleAuthState = useCallback(
    (event: TUpdates) => {
      // FIXME: fix type
      // @ts-ignore -- temp
      if (event && TELEGRAM_AUTH_TYPES.includes(event['@type'])) setAuthEvent(event);

      if ('authorization_state' in event && event.authorization_state['@type'] === 'authorizationStateWaitPassword')
        setPasswordHint(event['authorization_state'].password_hint);
    },
    [setAuthEvent, setPasswordHint],
  );

  // const fetchMessagesForChatId = useCallback(
  //   async (chat_id: number, lastMessageId: number) => {
  //     const messages: TMessage[] = [];

  //     const limit = 20;

  //     while (messages.length < 20) {
  //       const maybeMessages = await TelegramService.send<TMessages>({
  //         type: 'getChatHistory',
  //         chat_id,
  //         from_message_id: messages.length ? messages[messages.length - 1].id : lastMessageId,
  //         // offset: -limit + 1,
  //         limit,
  //         only_local: false,
  //       });

  //       if (maybeMessages.isNone) break;

  //       if (maybeMessages.payload.total_count === 0) break;

  //       messages.push(...maybeMessages.payload.messages);

  //       setMessages(maybeMessages.payload.messages);
  //     }
  //   },
  //   [setMessages],
  // );
  // const addLastMessageToMessages = useCallback(
  //   (e: TUpdates) => {
  //     if (!e || e['@type'] !== 'updateChatLastMessage') return;

  //     if (e.last_message.message_thread_id) return;

  //     addMessageToMessages(e.last_message);
  //     // fetchMessagesForChatId(e.chat_id, e.last_message.id);

  //     if (e.last_message.sender_id['@type'] === 'messageSenderUser') fetchUserById(e.last_message.sender_id.user_id);
  //   },
  //   [addMessageToMessages, fetchMessagesForChatId, fetchUserById],
  // );

  // const setChats = useSetRecoilState(chatsSelector);

  // const handleNewChat = useCallback(
  //   (e: TUpdates) => {
  //     if (!e || e['@type'] !== 'updateNewChat') return;

  //     setChats([e.chat]);
  //   },
  //   [setChats],
  // );

  const updateNewMessage = useCallback(
    (e: TUpdates) => {
      if (!e || e['@type'] !== 'updateNewMessage') return;

      if (e.message.message_thread_id) return;

      setMessages([e.message]);
      // fetchMessagesForChatId(e.chat_id, e.last_message.id);

      if (e.message.sender_id['@type'] === 'messageSenderUser') fetchUserById(e.message.sender_id.user_id);
    },
    [fetchUserById, setMessages],
  );

  const updateFile = useCallback(
    (e: TUpdates) => {
      if (!e || e['@type'] !== 'updateFile') return;

      const id = e.file.id;

      const expectedSize = e.file.expected_size;

      const downloadedSize = e.file.local.downloaded_size;

      setFileDownloadProgress({ [id]: { expectedSize, downloadedSize } });
    },
    [setFileDownloadProgress],
  );

  const matchUpdate = useMemo(
    () =>
      makeMatch<(e: TUpdates) => void>(
        {
          updateAuthorizationState: handleAuthState,
          updateNewMessage,
          // updateDeleteMessages: log,
          updateOption: handleOption,
          updateSelectedBackground: handleBackground,
          // updateUser: addUser,
          // updateUserFullInfo: addUserFullInfo,
          // updateConnectionState: (
          //   v, // eslint-disable-next-line no-console
          // ) => console.log('>>>', v),
          // updateChatFilters: log,
          // updateBasicGroup: log,
          // updateHavePendingNotifications: log,
          // updateChatLastMessage: addLastMessageToMessages,
          // updateNewChat: handleNewChat,
          updateFile,
        },
        (event: TUpdates) => isDebugLogging(CONFIG) && logger.warn(`Unmatched event: ${event['@type']}`),
      ),
    [handleAuthState, handleBackground, handleOption, updateFile, updateNewMessage],
  );

  const [isAuthed, setIsAuthed] = useRecoilState(authState);

  const onUpdate = useCallback(
    (event: TUpdates) => {
      const type = event['@type'];

      if (type === 'updateConnectionState' && event.state['@type'] === 'connectionStateReady' && !isAuthed) {
        logger.info('Connection ready');
        setIsAuthed(true);
        return;
      }

      // eslint-disable-next-line security/detect-object-injection
      matchUpdate[type](event);

      if ('authorization_state' in event) setAuthEvent(event);
    },
    [isAuthed, matchUpdate, setAuthEvent, setIsAuthed],
  );

  // setup client
  useEffect(() => {
    if (isInit.current) return;

    isInit.current = true;
    let logVerbosityLevel = 0;

    let jsLogVerbosityLevel: JsLogVerbosityLevel = 'error';

    setLoadingMessage('Connecting to Telegram...');

    if (isDebugLogging(CONFIG)) {
      logVerbosityLevel = 1;
      jsLogVerbosityLevel = 'debug';
    }

    TelegramService.init({
      onUpdate,
      logVerbosityLevel,
      jsLogVerbosityLevel,
    });
  }, [onUpdate, setLoadingMessage]);
}
