import { useContextSelector } from 'use-context-selector';

import { Login, Main } from '../pages';
import { LazyLoad, TelegramContext } from '../shared';

export function App() {
  const event = useContextSelector(TelegramContext, c => c.event);

  if (!event || !event['authorization_state']) return <div>loading</div>;

  const type = event['authorization_state']['@type'];

  function getPage() {
    switch (type) {
      case 'authorizationStateWaitEncryptionKey':
      case 'authorizationStateWaitOtherDeviceConfirmation':
      case 'authorizationStateWaitPhoneNumber':
      case 'updateAuthorizationState':
      case 'authorizationStateClosed':
        return <Login />;
      case 'authorizationStateReady':
        return <Main />;
      default:
        return null;
    }
  }

  return <LazyLoad>{getPage()}</LazyLoad>;
}
