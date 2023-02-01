import { CSSProperties, HTMLInputTypeAttribute, PropsWithChildren } from 'react';

import classes from './Input.module.scss';

interface InputProps {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  maxLength?: number;
  type: HTMLInputTypeAttribute;
  name: string;
  style?: CSSProperties;
  suffixElement?: JSX.Element;
}

export function Input({
  children,
  placeholder,
  onChange,
  value,
  maxLength,
  type,
  name,
  style,
  suffixElement,
}: PropsWithChildren<InputProps>) {
  return (
    <div className={classes.container}>
      <label className={classes.label} htmlFor={name}>
        {children}
      </label>
      <input
        autoComplete='off'
        autoFocus
        className={classes.input}
        maxLength={maxLength}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required
        style={style}
        type={type}
        value={value}
      />
      {suffixElement}
    </div>
  );
}
