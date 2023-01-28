import { clsx } from 'clsx';
import { useRecoilState } from 'recoil';

import { Icon } from '../../../shared';
import { menuIsOpenSelector } from '../menu.store';
import classes from './MenuButton.module.scss';

export function MenuButton() {
  const [isOpen, setIsOpen] = useRecoilState(menuIsOpenSelector);

  const handleClick = () => {
    if (!isOpen) setIsOpen(true);
    else setIsOpen(false);
  };

  return (
    <button className={clsx(classes.container, { [classes.open]: isOpen })} onClick={handleClick}>
      <Icon icon='menu' className={classes.icon} />
    </button>
  );
}
