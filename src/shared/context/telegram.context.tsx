import { AnyValue, Optional, RecordObject, R, as } from '@mv-d/toolbelt';
import { useCallback, useEffect, useState } from 'react';
import TdClient from 'tdweb';
import { createContext } from 'use-context-selector';
import { CONFIG } from '../config';
import { TelegramService } from '../services';

const { id, hash } = CONFIG.api;

export type TelegramEvent = RecordObject<AnyValue>;

export interface TelegramContextType {
  event: Optional<TelegramEvent>;
  client: TdClient;
}

export const TelegramContext = R.compose(createContext<TelegramContextType>, as<TelegramContextType>)({});

TelegramContext.displayName = 'TelegramContext';

export function TelegramProvider(props: AnyValue) {
  const [event, setEvent] = useState<TelegramEvent>();

  function handleMessages(update: AnyValue) {
    // eslint-disable-next-line no-console
    console.log(update);
  }

  const onUpdate = useCallback((update: AnyValue) => {
    setEvent(update);

    if (update['@type'] === 'updateAuthorizationState') {
      setEvent(update);
    }

    if (update['@type'] === 'updateNewMessage' || update['@type'] === 'updateDeleteMessages') {
      handleMessages(update);
    }
  }, []);

  const [client, setClient] = useState<AnyValue>();

  useEffect(() => {
    setClient(new TelegramService(id, hash, onUpdate));
  }, [onUpdate]);

  return <TelegramContext.Provider value={{ event, client }}>{props.children}</TelegramContext.Provider>;
}
