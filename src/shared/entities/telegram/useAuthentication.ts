import { makeMatch, Option, none } from '@mv-d/toolbelt';
import { useContextSelector } from 'use-context-selector';

import { TelegramContext } from './telegram.context';
import { TelegramService } from './telegram.service';

const MATCH_AUTH_STATE = makeMatch<() => Promise<Option<unknown>>>(
  {
    authorizationStateWaitEncryptionKey: () => TelegramService.send({ type: 'checkDatabaseEncryptionKey' }),
    authorizationStateWaitPhoneNumber: () =>
      TelegramService.send({ type: 'requestQrCodeAuthentication', other_user_ids: [] }),
  },
  () => Promise.resolve(none()),
);

export function useAuthentication() {
  const [event] = useContextSelector(TelegramContext, c => [c.event]);

  async function handleAuthentication() {
    if (!event) return;

    if (!('authorization_state' in event)) return;

    MATCH_AUTH_STATE[event.authorization_state['@type']]();
  }

  return { handleAuthentication };
}
