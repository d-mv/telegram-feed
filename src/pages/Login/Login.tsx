import { ifTrue } from '@mv-d/toolbelt';
import { getAuthStep, useSelector, useTelegram } from '../../shared';
import { StepOne } from './StepOne';
import { StepTwo } from './StepTwo';

export default function Login() {
  const step = useSelector(getAuthStep);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (step === 1) {
      // @ts-ignore -- temp
      const value = e.target[0]?.value;

      // submitPhone(value);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {ifTrue(step === 1, () => (
        <StepOne />
      ))}
      {ifTrue(step === 2, () => (
        <StepTwo />
      ))}
    </form>
  );
}
