import { useRecoilValue } from 'recoil';

import { loadingMessageSelector } from '../../../shared';
import classes from './LoadMessage.module.scss';

export function LoadMessage() {
  const loadMessage = useRecoilValue(loadingMessageSelector);

  if (!loadMessage) return null;

  return (
    <div className={classes.container}>
      <p className={classes.message}>{loadMessage}</p>
    </div>
  );
}
