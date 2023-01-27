import { Icon } from '../Icon';
import classes from './GoToTop.module.scss';

interface GoToTopProps {
  onClick: () => void;
}

export function GoToTop({ onClick }: GoToTopProps) {
  return (
    <button className={classes.container} onClick={onClick}>
      <Icon icon='up' className={classes.icon} />
    </button>
  );
}
