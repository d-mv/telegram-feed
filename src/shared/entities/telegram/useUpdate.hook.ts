import { some, logger, makeMatch, R, none } from '@mv-d/toolbelt';
import { SetStateAction } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { CONFIG } from '../../config';

import {
  useDispatch,
  updateAuthPasswordHint,
  addNewMessage,
  messagesSelector,
  usersSelector,
  StateUser,
  optionsSelector,
  Dispatch,
  myselfSelector,
  authEventSelector,
} from '../../store';
import { isDebugLogging } from '../../tools';
import { TELEGRAM_AUTH_TYPES } from './telegram.data';
import { TelegramService } from './telegram.service';
import { TMessage, TUpdates, TUser, TUserFullInfo } from './types';

export function useUpdate() {
  const dispatch = useDispatch();

  const setOption = useSetRecoilState(optionsSelector);

  const setMyself = useSetRecoilState(myselfSelector);

  async function fetchMyself(myId: string) {
    logger.info('Fetching myself...');

    const user_id = parseInt(myId);

    const maybeUser = await TelegramService.send<TUser>({ type: 'getUser', user_id });

    if (maybeUser.isNone) {
      logger.error(maybeUser.error, `User not found with id: ${user_id}`);
      return;
    }

    const maybeUserFullInfo = await TelegramService.send<TUserFullInfo>({ type: 'getUserFullInfo', user_id });

    if (maybeUserFullInfo.isNone) {
      // eslint-disable-next-line no-console
      console.log('maybeUserFullInfo', maybeUserFullInfo.error);
      // logger.error(maybeUserFullInfo.error, `User (Full Info) not found with id: ${user_id}`);
      return;
    }

    const uf = R.omit(['@type'], maybeUserFullInfo);

    const update: StateUser = { ...maybeUser.payload, ...uf };

    logger.dir(['maybeUser', update]);

    setMyself(update);
  }

  function handleOption(e: TUpdates) {
    if (e['@type'] !== 'updateOption') return;

    setOption({ [e.name]: e.value });
  }

  function handleBackground(e: TUpdates) {
    if (!e || e['@type'] !== 'for_dark_theme') return;

    setOption({ for_dark_theme: e.value });
  }

  const setAuthEvent = useSetRecoilState(authEventSelector);

  function handleAuthState(event: TUpdates) {
    // FIXME: fix type
    // @ts-ignore -- temp
    if (event && TELEGRAM_AUTH_TYPES.includes(event['@type'])) setAuthEvent(event);

    if ('authorization_state' in event && event.authorization_state['@type'] === 'authorizationStateWaitPassword') {
      R.compose(dispatch, updateAuthPasswordHint)(event['authorization_state'].password_hint);
    }
  }

  // function log(event: TUpdates) {
  //   // eslint-disable-next-line no-console
  //   console.log(event['@type'], event);
  // }

  // async function fetchUserById(user_id: number) {
  //   const maybeUser = await TelegramService.send<TUser>({ type: 'getUser', user_id });
  //
  //   if (maybeUser.isNone) {
  //     logger.error(maybeUser.error, `User not found with id: ${user_id}`);
  //     return;
  //   }
  //
  //   R.compose(dispatch, addUser)(maybeUser.payload);
  //
  //   const maybeUserFullInfo = await TelegramService.send<TUserFullInfo>({ type: 'getUserFullInfo', user_id });
  //
  //   if (maybeUserFullInfo.isNone) {
  //     logger.error(maybeUserFullInfo.error, `User (Full Info) not found with id: ${user_id}`);
  //     return;
  //   }
  //
  //   R.compose(dispatch, addUserFullInfo)({ id: user_id, data: maybeUserFullInfo.payload });
  // }

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
  // const [lastChats, setLastChats] = useState<number[]>([]);

  // async function fetchMessagesForChat(e: TUpdates) {
  //   if (e['@type'] !== 'updateChatLastMessage') return;
  //
  //   const { chat_id } = e;
  //
  //   // if (lastChats.includes(chat_id)) return;
  //
  //   R.compose(dispatch, addLastMessage)(e);
  //   // setLastChats(prev => [...prev, chat_id]);
  //
  //   const messages: TMessage[] = [];
  //
  //   const limit = 20;
  //
  //   if (chat_id > 0) fetchUserById(chat_id);
  //
  //   while (messages.length < 20) {
  //     // First call
  //     const maybeMessages = await TelegramService.send<TMessages>({
  //       type: 'getChatHistory',
  //       chat_id,
  //       from_message_id: messages.length ? messages[messages.length - 1].id : e.last_message.id,
  //       // offset: -limit + 1,
  //       limit,
  //       only_local: false,
  //     });
  //
  //     if (maybeMessages.isNone) break;
  //
  //     if (maybeMessages.payload.total_count === 0) break;
  //
  //     messages.push(...maybeMessages.payload.messages);
  //
  //     // R.compose(dispatch, addLastMessage)(maybeMessages.payload.messages);
  //
  //     if (loadMessage) R.compose(dispatch, setLoadMessage)('');
  //   }
  // }

  const [messages, setMessages] = useRecoilState(messagesSelector);

  function addMessageToMessages(message: TMessage) {
    setMessages([...messages.filter(m => m.id !== message.id), message]);
  }

  function addLastMessageToMessages(e: TUpdates) {
    if (!e || e['@type'] !== 'updateChatLastMessage') return;

    if (e.last_message.message_thread_id) return;

    addMessageToMessages(e.last_message);
  }

  const [users, setUsers] = useRecoilState(usersSelector);

  function addUser(e: TUpdates) {
    if (e['@type'] !== 'updateUser') return;

    setUsers([e.user]);
  }

  function addUserFullInfo(e: TUpdates) {
    if (e['@type'] !== 'updateUserFullInfo') return;

    const mapperFn = (user: TUser): StateUser =>
      user.id === e.user_id ? { ...user, ...R.omit(['@type'], e.user_full_info) } : user;

    setUsers(users.map(mapperFn));
  }

  const matchUpdate = makeMatch<(e: TUpdates) => void>(
    {
      updateAuthorizationState: handleAuthState,
      updateNewMessage: R.compose(dispatch, addNewMessage),
      // updateDeleteMessages: log,
      updateOption: handleOption,
      updateSelectedBackground: handleBackground,
      updateUser: addUser,
      updateUserFullInfo: addUserFullInfo,
      // updateConnectionState: log,
      // updateChatFilters: log,
      // updateBasicGroup: log,
      // updateHavePendingNotifications: log,
      updateChatLastMessage: addLastMessageToMessages,
      // updateChatLastMessage: R.compose(dispatch, addLastMessage),
      // updateNewChat: R.compose(dispatch, addChat),
    },
    (event: TUpdates) => isDebugLogging(CONFIG) && logger.warn(`Unmatched event: ${event['@type']}`),
  );

  return { matchUpdate };
}
