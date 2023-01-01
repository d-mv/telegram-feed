import { AnyValue, logger, makeMatch, R } from '@mv-d/toolbelt';
import { Dispatch, SetStateAction } from 'react';

import { CONFIG } from '../../config';
import {
  useDispatch,
  updateAuthPasswordHint,
  updateUsers,
  updateUsersFullInfo,
  addMessage,
  addChat,
} from '../../store';
import {
  TOptions,
  TUpdates,
  TUpdateOption,
  TUpdateSelectedBackground,
  TUpdateUser,
  TUpdateUserFullInfo,
  TUpdateChatLastMessage,
  TUpdateNewChat,
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

  function handleMessages(update: AnyValue) {
    // eslint-disable-next-line no-console
    console.log(update);
  }

  function handleOptions(event: TUpdateOption) {
    const name = event.name;

    if (name in options) {
      const currentValue = JSON.stringify(R.path([name], options));

      const newValue = JSON.stringify(event.value);

      if (currentValue === newValue) return;
    }

    setOptions(state => ({ ...state, [name]: event.value }));

    if (!CONFIG.isDev) return;

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
      updateChatLastMessage: (event: TUpdateChatLastMessage) => R.compose(dispatch, addMessage)(event.last_message),
      updateNewChat: (event: TUpdateNewChat) => R.compose(dispatch, addChat)(event.chat),
    },
    (event: TUpdates) => logger.error(`Unmatched event: ${event['@type']}`),
  );

  return { matchUpdate };
}
