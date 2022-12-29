import { ifTrue, Optional } from '@mv-d/toolbelt';
import { FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { useContextSelector } from 'use-context-selector';
import { BiShow, BiHide } from 'react-icons/bi';
import clsx from 'clsx';
import { authorizationState, MaybeNull, TelegramContext, TelegramEvent, useTelegram } from '../../shared';
import classes from './Authenticate.module.scss';

export default function Authenticate() {
  const [event, client, authPasswordHint] = useContextSelector(TelegramContext, c => [
    c.event,
    c.client,
    c.authPasswordHint,
  ]);

  const qr = useRef<MaybeNull<HTMLDivElement>>(null);

  const [password, setPassword] = useState('');

  const { handleAuthentication, submitPassword } = useTelegram();

  const authenticate = handleAuthentication(qr.current);

  useEffect(() => {
    if (client && event && 'authorization_state' in event) authenticate();
  }, [authenticate, client, event]);

  function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    submitPassword(password);
  }

  const [show, setShow] = useState(false);

  function handleShowHide(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setShow(state => !state);
  }

  function renderIcon() {
    if (show) return <BiHide />;

    return <BiShow />;
  }

  function renderPasscode() {
    return (
      <div className={classes.form}>
        <label htmlFor='password'>Password</label>
        <div className={classes['input-container']}>
          <input
            type={show ? 'text' : 'password'}
            name='password'
            required
            autoComplete='off'
            autoFocus
            placeholder={authPasswordHint ?? 'Enter your password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className={clsx(classes['show-button'], { [classes['hide-color']]: show })} onClick={handleShowHide}>
            {renderIcon()}
          </button>
        </div>
        <button disabled={!password.length} className={classes['submit-button']} type='submit' onClick={handleSubmit}>
          Submit
        </button>
      </div>
    );
  }

  function q() {
    return (
      <>
        <h2>Login with your device</h2>
        <div ref={qr}>Generating QR code...</div>
      </>
    );
  }

  const state = authorizationState(event);

  // eslint-disable-next-line no-console
  console.log(state);
  return (
    <div className={classes.container}>
      {ifTrue(state === 'authorizationStateWaitOtherDeviceConfirmation', q)}
      {ifTrue(state === 'authorizationStateWaitPassword', renderPasscode)}
    </div>
  );
}
