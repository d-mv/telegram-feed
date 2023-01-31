import { AnyValue, as } from '@mv-d/toolbelt';
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import { useAuthentication } from '../useAuthentication';

import classes from './Login.module.scss';

export default function Login() {
  const [phone, setPhone] = useState('');

  const [error, setError] = useState('');

  const [disableSubmit, setDisableSubmit] = useState(false);

  const { isPhoneNo, sendAuthenticationPhoneNumber } = useAuthentication();

  useEffect(() => {
    if (phone.length === 0 && !disableSubmit) setDisableSubmit(true);
    else if (phone.length > 12 && disableSubmit) setDisableSubmit(false);
  }, [disableSubmit, phone]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const value = Object.entries<HTMLInputElement>(as<AnyValue>(e.target).elements)
      .filter(([el]) => Number.isNaN(parseInt(el)))
      .reduce((acc, [key, element]) => ({ ...acc, [key]: element.value }), {} as Record<string, string>);

    if (isPhoneNo(value.phone)) sendAuthenticationPhoneNumber(value.phone);
    else setError('Incorrect number');
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (error) setError('');

    setPhone(e.target.value);
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <label className={classes.label} htmlFor='password'>
        Phone #
      </label>
      <div className={classes['input-container']}>
        <input
          className={classes.input}
          type='tel'
          name='phone'
          required
          autoComplete='off'
          autoFocus
          placeholder='+1 555 555 5555'
          value={phone}
          onChange={handleChange}
        />
      </div>
      <div className={classes['error-message']}>
        <p>{error}</p>
      </div>
      <button disabled={disableSubmit} className={classes['submit-button']} type='submit'>
        Submit
      </button>
    </form>
  );
}
