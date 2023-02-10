import { Menu } from '../../../domains';
import classes from './Header.module.scss';

export function Header() {
  return (
    <header className={classes.container}>
      <Menu />
      <h2 className={classes.name}>Feed</h2>;
    </header>
  );
}
