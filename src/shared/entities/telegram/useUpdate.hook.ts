import { logger, makeMatch, R } from '@mv-d/toolbelt';
import { Dispatch, SetStateAction } from 'react';

import {
  useDispatch,
  updateAuthPasswordHint,
  setOption,
  addNewMessage,
  updateUser,
  updateUserFullInfo,
} from '../../store';
import { TUpdates } from './types';

export function useUpdate({ setEvent }: { setEvent: Dispatch<SetStateAction<TUpdates | undefined>> }) {
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

  function log(event: TUpdates) {
    // eslint-disable-next-line no-console
    console.log(event['@type'], event);
  }

  const matchUpdate = makeMatch<(e: TUpdates) => void>(
    {
      updateAuthorizationState: handleAuthState,
      updateNewMessage: R.compose(dispatch, addNewMessage),
      updateDeleteMessages: log,
      updateOption: R.compose(dispatch, setOption),
      updateSelectedBackground: handleBackground,
      updateUser: R.compose(dispatch, updateUser),
      updateUserFullInfo: R.compose(dispatch, updateUserFullInfo),
      updateConnectionState: log,
      updateChatFilters: log,
      updateBasicGroup: log,
      updateHavePendingNotifications: log,
    },
    (event: TUpdates) =>
      // isDebugLogging(CONFIG) &&
      logger.warn(`Unmatched event: ${event['@type']}`),
  );

  return { matchUpdate };
}
