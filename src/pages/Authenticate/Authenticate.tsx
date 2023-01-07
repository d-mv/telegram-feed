import { ifTrue } from '@mv-d/toolbelt';
import { useEffect, useRef } from 'react';
import { useContextSelector } from 'use-context-selector';

import { authorizationState, getCurrentUser, MaybeNull, TelegramContext, useSelector, useTelegram } from '../../shared';
import { Container } from './Container';
import { Passcode } from './Passcode';

export default function Authenticate() {
  const [event, client] = useContextSelector(TelegramContext, c => [c.event, c.client]);

  const state = authorizationState(event);

  const currentUser = useSelector(getCurrentUser);

  const qr = useRef<MaybeNull<HTMLDivElement>>(null);

  const { handleAuthentication } = useTelegram();

  const authenticate = handleAuthentication(qr.current);

  useEffect(() => {
    if (client && event && 'authorization_state' in event) {
      authenticate();
    }
  }, [authenticate, client, event]);

  function renderQr() {
    return (
      <>
        <h2>Login with your device</h2>
        <div ref={qr}>Generating QR code...</div>
      </>
    );
  }

  if (currentUser) return null;

  return (
    <Container>
      {ifTrue(state === 'authorizationStateWaitOtherDeviceConfirmation', renderQr)}
      {ifTrue(state === 'authorizationStateWaitPassword', () => (
        <Passcode />
      ))}
    </Container>
  );
}
