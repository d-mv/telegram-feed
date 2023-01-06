import { useContextSelector } from 'use-context-selector';

import { Notifications } from '../domains';
import { Authenticate, Main } from '../pages';
import { LazyLoad, Loader, TelegramContext } from '../shared';

export function App() {
  const event = useContextSelector(TelegramContext, c => c.authEvent);

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
    <>
      <LazyLoad>{getPage()}</LazyLoad>
      <Notifications />
    </>
  );
}
