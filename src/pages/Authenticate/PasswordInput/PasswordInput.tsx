import { clsx } from 'clsx';
import { MouseEvent, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { Icon, passwordHintState, useTelegram } from '../../../shared';
import classes from './PasswordInput.module.scss';

export default function PasswordInput() {
  const { submitPassword } = useTelegram();

  const authPasswordHint = useRecoilValue(passwordHintState);

  const [password, setPassword] = useState('');

  function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    submitPassword(password);
  }

  const [show, setShow] = useState(false);

  function handleShowHide(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setShow(state => !state);
  }

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
          <Icon icon={show ? 'hide' : 'show'} />
        </button>
      </div>
      <button disabled={!password.length} className={classes['submit-button']} type='submit' onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
