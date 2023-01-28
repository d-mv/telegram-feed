import classes from './DropdownItem.module.scss';

interface DropdownItemProps {
  title: string;
  onClick: () => void;
}

export function DropdownItem({ title, onClick }: DropdownItemProps) {
  return (
    <button className={classes.container} onClick={onClick}>
      <p className={classes.text}>{title}</p>
    </button>
  );
}
