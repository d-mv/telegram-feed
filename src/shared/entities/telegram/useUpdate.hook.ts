import { logger, makeMatch, R } from '@mv-d/toolbelt';
import { Dispatch, SetStateAction, useState } from 'react';
import { useContextSelector } from 'use-context-selector';
import { CONFIG } from '../../config';

import {
  useDispatch,
  updateAuthPasswordHint,
  setOption,
  addNewMessage,
  updateUser,
  updateUserFullInfo,
  useSelector,
  getLoadMessage,
  setLoadMessage,
  addMessages,
  addUserFullInfo,
  addUser,
  addLastMessage,
} from '../../store';
import { isDebugLogging } from '../../tools';
import { TelegramContext } from './telegram.context';
import { TelegramService } from './telegram.service';
import { TMessage, TMessages, TUpdates, TUser, TUserFullInfo } from './types';

export function useUpdate({ setEvent }: { setEvent: Dispatch<SetStateAction<TUpdates | undefined>> }) {
  // const [send] = useContextSelector(TelegramContext, c => [c.send]);

  const loadMessage = useSelector(getLoadMessage);

  const dispatch = useDispatch();

  function handleBackground(update: TUpdates) {
    const value: TUpdates = {
      ...update,
      // FIXME
      // @ts-ignore -- temp
      name: 'for_dark_theme',
      value: {
        '@type': 'optionValueBoolean',
        // @ts-ignore -- temp
        value: update['for_dark_theme'],
      },
    };

    R.compose(dispatch, setOption)(value);
  }

  function handleAuthState(event: TUpdates) {
    setEvent(event);

    if ('authorization_state' in event && event.authorization_state['@type'] === 'authorizationStateWaitPassword') {
      R.compose(dispatch, updateAuthPasswordHint)(event['authorization_state'].password_hint);
    }
  }

  // function log(event: TUpdates) {
  //   // eslint-disable-next-line no-console
  //   console.log(event['@type'], event);
  // }

  async function fetchUserById(user_id: number) {
    const maybeUser = await TelegramService.send<TUser>({ type: 'getUser', user_id });

    if (maybeUser.isNone) {
      logger.error(maybeUser.error, `User not found with id: ${user_id}`);
      return;
    }

    R.compose(dispatch, addUser)(maybeUser.payload);

    const maybeUserFullInfo = await TelegramService.send<TUserFullInfo>({ type: 'getUserFullInfo', user_id });

    if (maybeUserFullInfo.isNone) {
      logger.error(maybeUserFullInfo.error, `User (Full Info) not found with id: ${user_id}`);
      return;
    }

    R.compose(dispatch, addUserFullInfo)({ id: user_id, data: maybeUserFullInfo.payload });
  }

  // async function fetchMessagesForChat(e: TUpdates) {
  //   if (e['@type'] !== 'updateNewChat') return;

  //   R.compose(dispatch, addChat)(e);

  //   // const { id } = e.chat;

  //   // const messages: TMessage[] = [];

  //   // const limit = 20;

  //   // if (id > 0) fetchUserById(id);

  //   // while (messages.length < 20) {
  //   //   // First call
  //   //   const maybeMessages = await TelegramService.send<TMessages>({
  //   //     type: 'getChatHistory',
  //   //     chat_id: id,
  //   //     from_message_id: messages.length ? messages[messages.length - 1].id : 0,
  //   //     // offset: -limit + 1,
  //   //     limit,
  //   //     only_local: false,
  //   //   });

  //   //   if (maybeMessages.isNone) break;

  //   //   if (maybeMessages.payload.total_count === 0) break;

  //   //   messages.push(...maybeMessages.payload.messages);

  //   //   if (loadMessage) R.compose(dispatch, setLoadMessage)('');

  //   //   R.compose(dispatch, addMessages)(maybeMessages.payload.messages);
  //   // }
  // }
  const [lastChats, setLastChats] = useState<number[]>([]);

  async function fetchMessagesForChat(e: TUpdates) {
    if (e['@type'] !== 'updateChatLastMessage') return;

    const { chat_id } = e;

    if (lastChats.includes(chat_id)) return;

    R.compose(dispatch, addLastMessage)(e);
    setLastChats(prev => [...prev, chat_id]);

    const messages: TMessage[] = [];

    const limit = 20;

    if (chat_id > 0) fetchUserById(chat_id);

    while (messages.length < 20) {
      // First call
      const maybeMessages = await TelegramService.send<TMessages>({
        type: 'getChatHistory',
        chat_id,
        from_message_id: messages.length ? messages[messages.length - 1].id : e.last_message.id,
        // offset: -limit + 1,
        limit,
        only_local: false,
      });

      if (maybeMessages.isNone) break;

      if (maybeMessages.payload.total_count === 0) break;

      messages.push(...maybeMessages.payload.messages);

      R.compose(dispatch, addMessages)(maybeMessages.payload.messages);

      if (loadMessage) R.compose(dispatch, setLoadMessage)('');
    }
  }

  const matchUpdate = makeMatch<(e: TUpdates) => void>(
    {
      updateAuthorizationState: handleAuthState,
      // updateNewMessage: R.compose(dispatch, addNewMessage),
      // updateDeleteMessages: log,
      updateOption: R.compose(dispatch, setOption),
      updateSelectedBackground: handleBackground,
      // updateUser: R.compose(dispatch, updateUser),
      // updateUserFullInfo: R.compose(dispatch, updateUserFullInfo),
      // updateConnectionState: log,
      // updateChatFilters: log,
      // updateBasicGroup: log,
      // updateHavePendingNotifications: log,
      updateChatLastMessage: fetchMessagesForChat,
      // updateChatLastMessage: R.compose(dispatch, addLastMessage),
      // updateNewChat: R.compose(dispatch, addChat),
    },
    (event: TUpdates) => isDebugLogging(CONFIG) && logger.warn(`Unmatched event: ${event['@type']}`),
  );

  return { matchUpdate };
}
