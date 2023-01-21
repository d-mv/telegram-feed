import { logger, makeMatch, R } from '@mv-d/toolbelt';
import { Dispatch, SetStateAction } from 'react';

import { CONFIG } from '../../config';
import {
  useDispatch,
  updateAuthPasswordHint,
  setOption,
  addNewMessage,
  updateUser,
  updateUserFullInfo,
} from '../../store';
import { isDebugLogging } from '../../tools';
import { TUpdates, TUpdateSelectedBackground } from './types';

export function useUpdate({ setEvent }: { setEvent: Dispatch<SetStateAction<TUpdates | undefined>> }) {
  const dispatch = useDispatch();

  // const getChat = useSelector(getChatById);

  // const getUser = useSelector(getUserById);

  // function handleMessages(update: TUpdateNewMessage) {
  //   if (update['@type'] === 'updateNewMessage') {
  //     R.compose(dispatch, addMessage)(update.message);
  //   }
  //   // eslint-disable-next-line no-console
  //   else console.log('handleMessages', update);
  // }

  function handleBackground(update: TUpdateSelectedBackground) {
    R.compose(
      dispatch,
      setOption,
    )({
      ...update,
      name: 'for_dark_theme',
      value: {
        '@type': 'optionValueBoolean',
        value: update['for_dark_theme'],
      },
    });
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
      updateNewMessage: R.compose(dispatch, addNewMessage),
      updateDeleteMessages: logger.dir,
      updateOption: R.compose(dispatch, setOption),
      updateSelectedBackground: handleBackground,
      updateUser: R.compose(dispatch, updateUser),
      updateUserFullInfo: R.compose(dispatch, updateUserFullInfo),
      // updateNewChat: (event: TUpdateNewChat) => R.compose(dispatch, addChat)(event.chat),
    },
    (event: TUpdates) =>
      // isDebugLogging(CONFIG) &&
      logger.warn(`Unmatched event: ${event['@type']}`),
  );

  return { matchUpdate };
}
