import { CSSProperties, PropsWithChildren } from 'react';

import classes from './Dialog.module.scss';

interface DialogProps {
  style?: CSSProperties;
}

export default function Dialog({ children, style }: PropsWithChildren<DialogProps>) {
  return (
    <article id='dialog' className={classes.container} style={style}>
      {children}
    </article>
  );
}
