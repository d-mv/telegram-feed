import { logger, Optional } from '@mv-d/toolbelt';
import { useEffect } from 'react';
import { useContextSelector } from 'use-context-selector';
import { Notifications } from '../domains';

import { Authenticate, Main } from '../pages';
import { connectionState, LazyLoad, Loader, TelegramContext, TelegramEvent, useTelegram } from '../shared';

export function App() {
  const [event] = useContextSelector(TelegramContext, c => [c.event, c.options]);

  if (!event || !('authorization_state' in event)) return <Loader />;

  const type = event['authorization_state']['@type'];

  function getPage() {
    switch (type) {
      case 'authorizationStateWaitEncryptionKey':
      case 'authorizationStateWaitOtherDeviceConfirmation':
      case 'authorizationStateWaitPhoneNumber':
      case 'authorizationStateWaitPassword':
      case 'updateAuthorizationState':
      case 'authorizationStateClosed':
        return <Authenticate />;
      case 'authorizationStateReady':
        return <Main />;
      default:
        return <Loader />;
    }
  }

  return (
    <LazyLoad>
      {getPage()}
      <Notifications />
    </LazyLoad>
  );
}
