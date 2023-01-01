import { useUser } from '../../../shared';
import { Avatar } from '../Avatar';
import classes from './Header.module.scss';

export function Header() {
  const { myself } = useUser();

  function renderContent() {
    if (!myself) return null;

    return (
      <>
        <h2 className={classes.name}>{`Feed for ${myself.first_name} ${myself.last_name}`}</h2>
        <Avatar user={myself} />
      </>
    );
  }

  return <header className={classes.container}>{renderContent()}</header>;
}
