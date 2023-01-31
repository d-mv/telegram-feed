import { HTMLInputTypeAttribute, PropsWithChildren } from 'react';

import classes from './Input.module.scss';

interface InputProps {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  maxLength?: number;
  type: HTMLInputTypeAttribute;
  name: string;
}

export function Input({
  children,
  placeholder,
  onChange,
  value,
  maxLength,
  type,
  name,
}: PropsWithChildren<InputProps>) {
  return (
    <>
      <label className={classes.label} htmlFor={name}>
        {children}
      </label>
      <input
        className={classes.input}
        type={type}
        name={name}
        required
        autoComplete='off'
        autoFocus
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
      />
    </>
  );
}
