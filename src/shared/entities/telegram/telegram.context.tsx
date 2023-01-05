import { AnyValue, Optional, R, as, logger } from '@mv-d/toolbelt';
import { useCallback, useEffect, useState } from 'react';
import TdClient from 'tdweb';
import { createContext } from 'use-context-selector';

import { CONFIG } from '../../config';
import { TelegramService } from './telegram.service';
import { TOptions, TUpdates } from './types';
import { useUpdate } from './useUpdate.hook';

const { id, hash } = CONFIG.api;

export interface TelegramContextType {
  event: Optional<TUpdates>;
  client: TdClient;
  options: TOptions;
  authEvent: Optional<TUpdates>;
  send: <R>(args: { type: string; [key: string]: unknown }) => Promise<R>;
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
  }, []);

  const [client, setClient] = useState<AnyValue>();

  useEffect(() => {
    logger.info('Initializing Telegram client...');
    setClient(new TelegramService(id, hash, onUpdate).client);
  }, [onUpdate]);

  function send<R>({ type, ...args }: { type: string; [key: string]: unknown }): Promise<R> {
    return client.send({ '@type': type, ...args }) as Promise<R>;
  }

  return (
    <TelegramContext.Provider value={{ event, client, options, send, authEvent }}>
      {props.children}
    </TelegramContext.Provider>
  );
}
