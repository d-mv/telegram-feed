import { clsx } from 'clsx';
import { FormEvent, MouseEvent, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { Icon, Input, passwordHintState, SubmitButton, useTelegram } from '../../../shared';
import classes from './PasswordInput.module.scss';

export default function PasswordInput() {
  const { submitPassword } = useTelegram();

  const authPasswordHint = useRecoilValue(passwordHintState);

  const [password, setPassword] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submitPassword(password);
  }

  const [show, setShow] = useState(false);

  function handleShowHide(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setShow(state => !state);
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Input
        type={show ? 'text' : 'password'}
        name='password'
        placeholder={authPasswordHint ?? 'Enter your password'}
        value={password}
        onChange={e => setPassword(e.target.value)}
        suffixElement={
          <button className={clsx(classes['show-button'], { [classes['hide-color']]: show })} onClick={handleShowHide}>
            <Icon icon={show ? 'hide' : 'show'} />
          </button>
        }
      >
        Password
      </Input>
      <SubmitButton isDisabled={!password.length} />
    </form>
  );
}
