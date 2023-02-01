import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { ErrorMessage, Input, SubmitButton } from '../../../shared';
import { useAuthentication } from '../useAuthentication';
import classes from './LoginCodeInput.module.scss';

export default function CodeInput() {
  const [code, setCode] = useState('');

  const [error, setError] = useState('');

  const [disableSubmit, setDisableSubmit] = useState(true);

  const { checkAuthenticationCode, loginCodePlaceholder, loginCodeLength, getFieldValueFromFromInput } =
    useAuthentication();

  useEffect(() => {
    if (code.length !== loginCodeLength && !disableSubmit) setDisableSubmit(true);
    else if (code.length === loginCodeLength && disableSubmit) setDisableSubmit(false);
  }, [disableSubmit, loginCodeLength, code]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const value = getFieldValueFromFromInput(e, 'code');

    if (!Number.isNaN(parseInt(value))) {
      const maybeResult = await checkAuthenticationCode(value);

      if (maybeResult.isNone) setError(maybeResult.error.message);
    } else setError('Not a number');
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (error) setError('');

    setCode(e.target.value);
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Input
        type='number'
        name='code'
        placeholder={loginCodePlaceholder}
        value={code}
        onChange={handleChange}
        maxLength={loginCodeLength}
      >
        Login code from Telegram
      </Input>
      <ErrorMessage>{error}</ErrorMessage>
      <SubmitButton isDisabled={disableSubmit} />
    </form>
  );
}
