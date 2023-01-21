import { logger, makeMatch, R } from '@mv-d/toolbelt';
import { Dispatch, SetStateAction } from 'react';

import { CONFIG } from '../../config';
import { useDispatch, updateAuthPasswordHint, setOption, addNewMessage } from '../../store';
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
      // updateDeleteMessages: handleMessages,
      updateOption: R.compose(dispatch, setOption),
      updateSelectedBackground: handleBackground,
      // updateUser: (event: TUpdateUser) => R.compose(dispatch, updateUsers)(event.user),
      // updateUserFullInfo: (event: TUpdateUserFullInfo) =>
      // R.compose(
      //   dispatch,
      //   updateUsersFullInfo,
      // )(R.omit(['@type'], { ...event.user_full_info, user_id: event.user_id })),
      // updateChatLastMessage: (event: TUpdateChatLastMessage) => {
      //   // eslint-disable-next-line no-console
      //   if (event.chat_id === -1001091699222) console.log('updateChatLastMessage', event.last_message.content);

      //   const sender = getSenderFromMessage({ message: event.last_message, getChat, getUser, myself });

      //   if (sender) {
      //     R.compose(
      //       dispatch,
      //       addNotification,
      //     )({
      //       id: generateId(),
      //       text: `New message${sender ? ` from ${sender}` : ''}`,
      //       type: MessageTypes.INFO,
      //     });
      //   }

      //   R.compose(dispatch, addMessage)(event.last_message);
      // },
      // updateNewChat: (event: TUpdateNewChat) => R.compose(dispatch, addChat)(event.chat),
    },
    (event: TUpdates) => isDebugLogging(CONFIG) && logger.error(`Unmatched event: ${event['@type']}`),
  );

  return { matchUpdate };
}
