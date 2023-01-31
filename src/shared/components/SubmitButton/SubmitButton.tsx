import classes from './SubmitButton.module.scss';

interface SubmitButtonProps {
  isDisabled: boolean;
}

export function SubmitButton({ isDisabled }: SubmitButtonProps) {
  return (
    <button disabled={isDisabled} className={classes.container} type='submit'>
      Submit
    </button>
  );
}
