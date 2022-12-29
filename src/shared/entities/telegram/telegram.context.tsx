import { AnyValue, Optional, RecordObject, R, as, logger } from '@mv-d/toolbelt';
import { useCallback, useEffect, useState } from 'react';
import TdClient from 'tdweb';
import { createContext } from 'use-context-selector';
import { CONFIG } from '../../config';
import { TelegramService } from './telegram.service';
import { TOptions, TUpdateOption, TUpdates, TUpdateSelectedBackground } from './types';

const { id, hash } = CONFIG.api;

export type TelegramEvent = RecordObject<AnyValue>;

export interface TelegramContextType {
  event: Optional<TUpdates>;
  client: TdClient;
  options: TOptions;
  authPasswordHint: string;
}

export const TelegramContext = R.compose(createContext<TelegramContextType>, as<TelegramContextType>)({});

TelegramContext.displayName = 'TelegramContext';

export function TelegramProvider(props: AnyValue) {
  const [event, setEvent] = useState<TUpdates>();

  const [options, setOptions] = useState<TOptions>({} as TOptions);

  const [prevOptions, setPrevOptions] = useState(JSON.stringify(options));

  const [authPasswordHint, setAuthPasswordHint] = useState<string>('');

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

  function handleMessages(update: AnyValue) {
    // eslint-disable-next-line no-console
    console.log(update);
  }

  function handleBackground(update: TUpdateSelectedBackground) {
    setOptions(state => ({
      ...state,
      for_dark_theme: { '@type': 'optionValueBoolean', value: update['for_dark_theme'] },
    }));
  }

  const onUpdate = useCallback((event: TUpdates) => {
    // eslint-disable-next-line no-console
    if (event['@type'] !== 'updateOption') console.log('>>>', event);
    // eslint-disable-next-line no-console
    // console.log('>>>>', event);
    // console.log(`Connection state: ${connectionState(event)}`);

    if (event['@type'] === 'updateAuthorizationState') {
      setEvent(event);

      if (event.authorization_state['@type'] === 'authorizationStateWaitPassword') {
        setAuthPasswordHint(event['authorization_state'].password_hint);
      }
    }
    // else if (event['@type'] === 'updateNewMessage' || event['@type'] === 'updateDeleteMessages') {
    //   handleMessages(event);
    // }
    else if (event['@type'] === 'updateOption') {
      handleOptions(event);
    } else if (event['@type'] === 'updateSelectedBackground') {
      handleBackground(event);
    }
  }, []);

  const [client, setClient] = useState<AnyValue>();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('creating client');
    setClient(new TelegramService(id, hash, onUpdate).client);
  }, [onUpdate]);

  return (
    <TelegramContext.Provider value={{ event, client, options, authPasswordHint }}>
      {props.children}
    </TelegramContext.Provider>
  );
}
