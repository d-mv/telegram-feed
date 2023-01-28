import { logger, makeMatch, Optional } from '@mv-d/toolbelt';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

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
  chatIdsState,
} from '../shared';

let timer: Optional<NodeJS.Timeout> = undefined;

export function useConnect() {
  const isInit = useRef(false);

  const setAuthEvent = useSetRecoilState(authEventSelector);

  const setOption = useSetRecoilState(optionsSelector);

  const setPasswordHint = useSetRecoilState(passwordHintSelector);

  const setLoadingMessage = useSetRecoilState(loadingMessageSelector);

  const setMessages = useSetRecoilState(messagesSelector);

  const setFileDownloadProgress = useSetRecoilState(fileDownloadProgressSelector);

  const chatIds = useRecoilValue(chatIdsState);

  const [isAuthed, setIsAuthed] = useRecoilState(authState);

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

  const updateNewMessage = useCallback(
    (e: TUpdates) => {
      if (!e || e['@type'] !== 'updateNewMessage') return;

      if (e.message.message_thread_id) return;

      setMessages([e.message]);

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

  const reloadIfStuck = useCallback(() => {
    logger.info('Timer was not off, loading stuck, reloading');

    if (timer) clearTimeout(timer);

    window.history.go(0);
  }, []);

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

  // disable reloading, if chatIds fetched
  useEffect(() => {
    if (chatIds.length > 0 && timer) clearTimeout(timer);
  }, [chatIds]);

  // setup client
  useEffect(() => {
    // avoid double initialization
    if (isInit.current) return;

    isInit.current = true;
    let logVerbosityLevel = 0;

    let jsLogVerbosityLevel: JsLogVerbosityLevel = 'error';

    setLoadingMessage('Connecting to Telegram...');

    if (isDebugLogging(CONFIG)) {
      logVerbosityLevel = 1;
      jsLogVerbosityLevel = 'debug';
    }

    timer = setTimeout(reloadIfStuck, 3000);
    TelegramService.init({
      onUpdate,
      logVerbosityLevel,
      jsLogVerbosityLevel,
    });
  }, [onUpdate, reloadIfStuck, setLoadingMessage]);
}
