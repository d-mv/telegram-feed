import { ifTrue } from '@mv-d/toolbelt';
import { useContextSelector } from 'use-context-selector';

import { LoadMessage, Notifications } from '../domains';
import { Authenticate, Main } from '../pages';
import { getIsInitialized, getMyself, LazyLoad, TelegramContext, useAuthentication, useSelector } from '../shared';

const VALID_TYPES = [
  'authorizationStateWaitEncryptionKey',
  'authorizationStateWaitOtherDeviceConfirmation',
  'authorizationStateWaitPhoneNumber',
  'authorizationStateWaitPassword',
  'updateAuthorizationState',
  'authorizationStateClosed',
  'authorizationStateReady',
];

const renderAuthenticate = () => <Authenticate />;

const renderMain = () => <Main />;

export function App() {
  const event = useContextSelector(TelegramContext, c => c.authEvent);

  // const isInitialized = useSelector(getIsInitialized)
  const currentUser = useSelector(getMyself);

  const { handleAuthentication } = useAuthentication();

  if (!event || !('authorization_state' in event)) return <LoadMessage />;

  if (!currentUser) handleAuthentication();

  const type = event['authorization_state']['@type'];

  if (!VALID_TYPES.includes(type)) return <LoadMessage />;

  return (
    <>
      <LazyLoad>
        {ifTrue(!currentUser, renderAuthenticate)}
        {ifTrue(currentUser, renderMain)}
      </LazyLoad>
      <Notifications />
      <LoadMessage />
    </>
  );
}
