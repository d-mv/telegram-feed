import { ifTrue, logger } from '@mv-d/toolbelt';
import { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';

import {
  authEventSelector,
  authLinkState,
  authorizationState,
  MaybeNull,
  myselfSelector,
  useGlobal,
} from '../../shared';
import { AuthenticateWithApp } from './AuthenticateWithApp';
import { Container } from './Container';
import { Passcode } from './Passcode';
import { useAuthentication } from './useAuthentication';

export default function Authenticate() {
  const event = useRecoilValue(authEventSelector);

  const state = authorizationState(event);

  const myself = useRecoilValue(myselfSelector);

  const authLink = useRecoilValue(authLinkState);

  const qr = useRef<MaybeNull<HTMLDivElement>>(null);

  const { handleAuthentication } = useAuthentication();

  const { isMobile } = useGlobal();

  useEffect(() => {
    if (event && 'authorization_state' in event) {
      handleAuthentication(qr.current);
    }
  }, [event, handleAuthentication]);

  function renderQr() {
    return (
      <>
        <h2>Login with your device</h2>
        <div ref={qr}>Generating QR code...</div>
      </>
    );
  }

  if (myself) {
    logger.info('Is authenticated, redirecting to main page...');
    return null;
  }

  const isWaiting = state === 'authorizationStateWaitOtherDeviceConfirmation';

  return (
    <Container>
      {ifTrue(isWaiting && authLink && isMobile(), () => (
        <AuthenticateWithApp />
      ))}
      {ifTrue(isWaiting && !isMobile(), renderQr)}
      {ifTrue(state === 'authorizationStateWaitPassword', () => (
        <Passcode />
      ))}
    </Container>
  );
}
