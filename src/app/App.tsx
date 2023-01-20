import { ifTrue } from '@mv-d/toolbelt';
import { useContextSelector } from 'use-context-selector';

import { Notifications } from '../domains';
import { Authenticate, Main } from '../pages';
import { getMyself, LazyLoad, Loader, TelegramContext, useSelector } from '../shared';

const VALID_TYPES = [
  'authorizationStateWaitEncryptionKey',
  'authorizationStateWaitOtherDeviceConfirmation',
  'authorizationStateWaitPhoneNumber',
  'authorizationStateWaitPassword',
  'updateAuthorizationState',
  'authorizationStateClosed',
  'authorizationStateReady',
];

export function App() {
  const event = useContextSelector(TelegramContext, c => c.authEvent);

  const currentUser = useSelector(getMyself);

  if (!event || !('authorization_state' in event)) return <Loader />;

  const type = event['authorization_state']['@type'];

  if (!VALID_TYPES.includes(type)) return <Loader />;

  const renderAuthenticate = () => <Authenticate />;

  const renderMain = () => <Main />;

  return (
    <>
      <LazyLoad>
        {ifTrue(!currentUser, renderAuthenticate)}
        {ifTrue(currentUser, renderMain)}
      </LazyLoad>
      <Notifications />
    </>
  );
}
