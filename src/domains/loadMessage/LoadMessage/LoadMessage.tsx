import { getLoadMessage, useSelector } from '../../../shared';
import classes from './LoadMessage.module.scss';

export function LoadMessage() {
  const loadMessage = useSelector(getLoadMessage);

  if (!loadMessage) return null;

  return (
    <div className={classes.container}>
      <p className={classes.message}>{loadMessage}</p>
    </div>
  );
}
