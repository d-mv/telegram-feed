import { Button, ButtonProps } from './Button';

export function SubmitButton({ isDisabled }: ButtonProps) {
  return (
    <Button isDisabled={isDisabled} type='submit'>
      Submit
    </Button>
  );
}
