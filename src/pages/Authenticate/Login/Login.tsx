import { AnyValue, as } from '@mv-d/toolbelt';
import { FormEvent, useCallback, useEffect, useState } from 'react';

import classes from './Login.module.scss';

const tester = new RegExp(/^\+[\d\s]{12}/);

// TODO: add submit phone
export function Login() {
  const [phone, setPhone] = useState('');

  const [disableSubmit, setDisableSubmit] = useState(false);

  const testPhoneValue = useCallback(() => tester.test(phone.replace(' ', '')), [phone]);

  useEffect(() => {
    if (phone.length === 0 && !disableSubmit) setDisableSubmit(true);
    else if (phone.length > 12 && testPhoneValue() && disableSubmit) setDisableSubmit(false);
  }, [disableSubmit, phone, testPhoneValue]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const value = Object.entries<HTMLInputElement>(as<AnyValue>(e.target).elements)
      .filter(([el]) => Number.isNaN(parseInt(el)))
      .reduce((acc, [key, element]) => ({ ...acc, [key]: element.value }), {} as Record<string, string>);

    setPhone(value.phone);
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
          onChange={e => setPhone(e.target.value)}
        />
      </div>
      <button disabled={disableSubmit} className={classes['submit-button']} type='submit'>
        Submit
      </button>
    </form>
  );
}
