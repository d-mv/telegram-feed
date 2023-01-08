import { AnyValue, generateId, logger, makeMatch, R } from '@mv-d/toolbelt';
import { Dispatch, SetStateAction } from 'react';

import { MessageTypes } from '../../../domains';
import { CONFIG } from '../../config';
import { useUser } from '../../hooks';
import {
  useDispatch,
  updateAuthPasswordHint,
  updateUsers,
  updateUsersFullInfo,
  addMessage,
  addChat,
  addNotification,
  getChatById,
  getUserById,
  useSelector,
  setCurrentUserId,
} from '../../store';
import { getSenderFromMessage, isDebugLogging } from '../../tools';
import {
  TOptions,
  TUpdates,
  TUpdateOption,
  TUpdateSelectedBackground,
  TUpdateUser,
  TUpdateUserFullInfo,
  TUpdateChatLastMessage,
  TUpdateNewChat,
  TMessage,
  TUpdateNewMessage,
} from './types';

export function useUpdate({
  options,
  setOptions,
  setEvent,
}: {
  options: TOptions;
  setOptions: Dispatch<SetStateAction<TOptions>>;
  setEvent: Dispatch<SetStateAction<TUpdates | undefined>>;
}) {
  const dispatch = useDispatch();

  const { myself } = useUser();

  const getChat = useSelector(getChatById);

  const getUser = useSelector(getUserById);

  function handleMessages(update: TUpdateNewMessage) {
    if (update['@type'] === 'updateNewMessage') {
      R.compose(dispatch, addMessage)(update.message);
    }
    // eslint-disable-next-line no-console
    else console.log('handleMessages', update);
  }

  function handleOptions(event: TUpdateOption) {
    const name = event.name;

    if (name in options) {
      const currentValue = JSON.stringify(R.path([name], options));

      const newValue = JSON.stringify(event.value);

      if (currentValue === newValue) return;
    }

    setOptions(state => ({ ...state, [name]: event.value }));

    if (name === 'my_id') {
      R.compose(dispatch, setCurrentUserId)(parseInt(event.value.value as string));
    }

    if (!CONFIG.isDev || !isDebugLogging(CONFIG)) return;

    logger.info('TelegramContext', `options changed: ${name}`, JSON.stringify(event.value));
  }

  function handleBackground(update: TUpdateSelectedBackground) {
    setOptions(state => ({
      ...state,
      for_dark_theme: { '@type': 'optionValueBoolean', value: update['for_dark_theme'] },
    }));
  }

  function handleAuthState(event: TUpdates) {
    setEvent(event);

    if ('authorization_state' in event && event.authorization_state['@type'] === 'authorizationStateWaitPassword') {
      R.compose(dispatch, updateAuthPasswordHint)(event['authorization_state'].password_hint);
    }
  }

  const matchUpdate = makeMatch(
    {
      updateAuthorizationState: handleAuthState,
      updateNewMessage: handleMessages,
      updateDeleteMessages: handleMessages,
      updateOption: handleOptions,
      updateSelectedBackground: handleBackground,
      updateUser: (event: TUpdateUser) => R.compose(dispatch, updateUsers)(event.user),
      updateUserFullInfo: (event: TUpdateUserFullInfo) =>
        R.compose(dispatch, updateUsersFullInfo)({ ...event.user_full_info, user_id: event.user_id }),
      updateChatLastMessage: (event: TUpdateChatLastMessage) => {
        // eslint-disable-next-line no-console
        if (event.chat_id === -1001091699222) console.log('updateChatLastMessage', event.last_message.content);

        const sender = getSenderFromMessage({ message: event.last_message, getChat, getUser, myself });

        if (sender) {
          R.compose(
            dispatch,
            addNotification,
          )({
            id: generateId(),
            text: `New message${sender ? ` from ${sender}` : ''}`,
            type: MessageTypes.INFO,
          });
        }

        R.compose(dispatch, addMessage)(event.last_message);
      },
      updateNewChat: (event: TUpdateNewChat) => R.compose(dispatch, addChat)(event.chat),
    },
    (event: TUpdates) => isDebugLogging(CONFIG) && logger.error(`Unmatched event: ${event['@type']}`),
  );

  return { matchUpdate };
}
