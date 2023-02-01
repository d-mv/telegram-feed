import { AnyValue, as } from '@mv-d/toolbelt';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { ErrorMessage, Input, SubmitButton } from '../../../shared';
import { useAuthentication } from '../useAuthentication';
import classes from './PhoneInput.module.scss';

export default function PhoneInput() {
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
      <Input type='tel' name='phone' placeholder='+1 555 555 5555' value={phone} onChange={handleChange}>
        Phone #
      </Input>
      <ErrorMessage>{error}</ErrorMessage>
      <SubmitButton isDisabled={disableSubmit} />
    </form>
  );
}
