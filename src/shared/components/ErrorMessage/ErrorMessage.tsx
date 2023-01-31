import { PropsWithChildren } from 'react';

import classes from './ErrorMessage.module.css';

export function ErrorMessage({ children }: PropsWithChildren) {
  return (
    <div className={classes.container}>
      <p>{children}</p>
    </div>
  );
}
