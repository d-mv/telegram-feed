import { useSetRecoilState } from 'recoil';
import { compose, omit } from 'ramda';
import { logger, toArray } from '@mv-d/toolbelt';
import { useCallback } from 'react';

import { myselfSelector, notificationsSelector, StateUser, usersSelector } from '../../store';
import { makeTErrorNotification } from './telegram.tools';
import { TUser, TUserFullInfo } from './types';
import { isDebugLogging } from '../../tools';
import { CONFIG } from '../../config';
import { TelegramService } from './telegram.service';

export function useTelegram() {
  const setMyself = useSetRecoilState(myselfSelector);

  const setUser = useSetRecoilState(usersSelector);

  const setNotification = useSetRecoilState(notificationsSelector);

  function submitPassword(password: string) {
    TelegramService.send({
      type: 'checkAuthenticationPassword',
      password,
    }).catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error(err);

      if (isDebugLogging(CONFIG)) compose(setNotification, toArray, makeTErrorNotification)(err);
    });
  }

  const fetchUserById = useCallback(
    async (myId: string | number, isMyself = false) => {
      const user_id = typeof myId === 'string' ? parseInt(myId) : myId;

      const maybeUser = await TelegramService.send<TUser>({ type: 'getUser', user_id });

      if (maybeUser.isNone) {
        logger.error(maybeUser.error, `User not found with id: ${user_id}`);
        return;
      }

      const maybeUserFullInfo = await TelegramService.send<TUserFullInfo>({ type: 'getUserFullInfo', user_id });

      if (maybeUserFullInfo.isNone) {
        logger.error(maybeUserFullInfo.error, `User (Full Info) not found with id: ${user_id}`);
        return;
      }

      const update: StateUser = { ...maybeUser.value, ...omit(['@type'], maybeUserFullInfo) };

      if (isMyself) setMyself(update);
      else setUser([update]);
    },
    [setMyself, setUser],
  );

  return { submitPassword, fetchUserById };
}
