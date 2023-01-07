import { AnyValue, Optional, R, as, logger, Option, some, none } from '@mv-d/toolbelt';
import { useCallback, useEffect, useState } from 'react';
import TdClient from 'tdweb';
import { createContext } from 'use-context-selector';

import { CONFIG } from '../../config';
import { isDebugLogging } from '../../tools';
import { JsLogVerbosityLevel, TelegramService } from './telegram.service';
import { TOptions, TUpdates } from './types';
import { useUpdate } from './useUpdate.hook';

const { id, hash } = CONFIG.api;

export interface TelegramSendParams {
  type: string;
  [key: string]: unknown;
}

export interface TelegramContextType {
  event: Optional<TUpdates>;
  client: TdClient;
  options: TOptions;
  authEvent: Optional<TUpdates>;
  send: <R>(args: TelegramSendParams) => Promise<Option<R>>;
}

export const TelegramContext = R.compose(createContext<TelegramContextType>, as<TelegramContextType>)({});

TelegramContext.displayName = 'TelegramContext';

export function TelegramProvider(props: AnyValue) {
  const [event, setEvent] = useState<TUpdates>();

  const [authEvent, setAuthEvent] = useState<TUpdates>();

  const [options, setOptions] = useState<TOptions>({} as TOptions);

  const { matchUpdate } = useUpdate({ setEvent, options, setOptions });

  const onUpdate = useCallback((event: TUpdates) => {
    matchUpdate[event['@type']](event);

    if ('authorization_state' in event) setAuthEvent(event);
    // matchUpdate is not memoized, so we need to disable the exhaustive-deps rule
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [client, setClient] = useState<AnyValue>();

  useEffect(() => {
    let logVerbosityLevel = 0;

    let jsLogVerbosityLevel: JsLogVerbosityLevel = 'error';

    if (isDebugLogging(CONFIG)) {
      logger.info('Initializing Telegram client...');
      logVerbosityLevel = 1;
      jsLogVerbosityLevel = 'debug';
    }

    setClient(
      new TelegramService({
        apiId: id,
        apiHash: hash,
        onUpdate,
        logVerbosityLevel,
        jsLogVerbosityLevel,
      }).client,
    );
  }, [onUpdate]);

  async function send<R>({ type, ...args }: TelegramSendParams): Promise<Option<R>> {
    try {
      const r = (await client.send({ '@type': type, ...args })) as R;

      return some(r);
    } catch (err) {
      if (isDebugLogging(CONFIG)) logger.error(err, 'Send error');

      return none(err as Error);
    }
  }

  return (
    <TelegramContext.Provider value={{ event, client, options, send, authEvent }}>
      {props.children}
    </TelegramContext.Provider>
  );
}
