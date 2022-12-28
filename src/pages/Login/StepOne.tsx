export function StepOne() {
  return (
    <>
      <label htmlFor='phone_number'>Phone number</label>
      <input
        type='text'
        name='phone_number'
        required
        autoComplete='on'
        autoFocus
        minLength={13}
        placeholder='Enter your mobile #'
      />
    </>
  );
}
