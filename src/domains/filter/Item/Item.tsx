import clsx from 'clsx';
import { useMemo } from 'react';
import { useContextSelector } from 'use-context-selector';
import { Icon } from '../../../shared';

import { FilterContext } from '../filter.context';
import classes from './Item.module.scss';

export function Item() {
  const [item, selected, onClick] = useContextSelector(FilterContext, c => [c.item, c.selected, c.onClick]);

  const isSelected = useMemo(() => selected.includes(item.id), [selected, item.id]);

  return (
    <button className={clsx(classes.container, { [classes.selected]: isSelected })} onClick={onClick}>
      <p className={classes.label}>{item.title}</p>
      <Icon icon={isSelected ? 'checkboxChecked' : 'checkbox'} className={classes.checkbox} />
    </button>
  );
}
