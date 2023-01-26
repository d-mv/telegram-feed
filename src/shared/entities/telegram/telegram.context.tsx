import { AnyValue, Optional, R, as, logger } from '@mv-d/toolbelt';
import { useCallback, useEffect, useState } from 'react';
import { createContext } from 'use-context-selector';
import { compose } from 'ramda';

import { CONFIG } from '../../config';
import { getMyId, getMyself, setMyself, useDispatch, useSelector } from '../../store';
import { isDebugLogging } from '../../tools';
import { JsLogVerbosityLevel, TelegramService } from './telegram.service';
import { TUpdates, TUser } from './types';

export interface TelegramContextType {
  // event: Optional<TUpdates>;
  authEvent: Optional<TUpdates>;
}

export const TelegramContext = R.compose(createContext<TelegramContextType>, as<TelegramContextType>)({});

TelegramContext.displayName = 'TelegramContext';

export function TelegramProvider(props: AnyValue) {
  // const [event, setEvent] = useState<TUpdates>();

  const [authEvent, setAuthEvent] = useState<TUpdates>();

  // const { matchUpdate } = useUpdate();

  const dispatch = useDispatch();

  const mySelf = useSelector(getMyself);

  const myId = useSelector(getMyId);

  const onUpdate = useCallback((event: TUpdates) => {
    const type = event['@type'];

    // eslint-disable-next-line security/detect-object-injection
    // matchUpdate[type](event);

    if ('authorization_state' in event) setAuthEvent(event);

    // matchUpdate is not memoized, so we need to disable the exhaustive-deps rule
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // setup client
  useEffect(() => {
    let logVerbosityLevel = 0;

    let jsLogVerbosityLevel: JsLogVerbosityLevel = 'error';

    if (isDebugLogging(CONFIG)) {
      logger.info('Initializing Telegram client...');
      logVerbosityLevel = 1;
      jsLogVerbosityLevel = 'debug';
    }

    // eslint-disable-next-line no-console
    console.log('here');
    // TelegramService.init({
    //   onUpdate,
    //   logVerbosityLevel,
    //   jsLogVerbosityLevel,
    // });
  }, [onUpdate]);

  useEffect(() => {
    async function fetchMyself() {
      const maybeMyself = await TelegramService.send<TUser>({ type: 'getUser', user_id: myId });

      if (maybeMyself.isSome) R.compose(dispatch, setMyself)(maybeMyself.payload);
    }

    if (myId && !mySelf) fetchMyself();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mySelf, myId, dispatch]);

  return <TelegramContext.Provider value={{ authEvent }}>{props.children}</TelegramContext.Provider>;
}
