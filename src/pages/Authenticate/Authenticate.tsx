import { ifTrue, logger } from '@mv-d/toolbelt';
import { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';

import { authEventSelector, authorizationState, MaybeNull, myselfSelector } from '../../shared';
import { LoginCodeInput } from './LoginCodeInput';
import { Container } from './Container';
import { PhoneInput } from './PhoneInput';
import { PasswordInput } from './PasswordInput';
import { useAuthentication } from './useAuthentication';

export default function Authenticate() {
  const event = useRecoilValue(authEventSelector);

  const state = authorizationState(event);

  const myself = useRecoilValue(myselfSelector);

  // const authLink = useRecoilValue(authLinkState);

  const qr = useRef<MaybeNull<HTMLDivElement>>(null);

  const { handleAuthentication } = useAuthentication();

  // const { isMobile } = useGlobal();

  useEffect(() => {
    if (event && 'authorization_state' in event) {
      handleAuthentication(qr.current);
    }
  }, [event, handleAuthentication]);

  // function renderQr() {
  //   return (
  //     <>
  //       <h2>Login with your device</h2>
  //       <div ref={qr}>Generating QR code...</div>
  //     </>
  //   );
  // }

  if (myself) {
    logger.info('Is authenticated, redirecting to main page...');
    return null;
  }

  // const isWaiting = state === 'authorizationStateWaitOtherDeviceConfirmation';

  const isWaitingForPhoneNumber = state === 'authorizationStateWaitPhoneNumber';

  const isWaitingForCode = state === 'authorizationStateWaitCode';

  const isWaitingForPassword = state === 'authorizationStateWaitPassword';

  const renderPhoneInput = () => <PhoneInput />;

  const renderCodeInput = () => <LoginCodeInput />;

  const renderPasswordInput = () => <PasswordInput />;

  return (
    <Container>
      {ifTrue(isWaitingForPhoneNumber, renderPhoneInput)}
      {ifTrue(isWaitingForCode, renderCodeInput)}
      {ifTrue(isWaitingForPassword, renderPasswordInput)}
    </Container>
  );
}
