import { useRecoilValue } from 'recoil';

import { authLinkState } from '../../../shared';
import classes from './AuthenticateWithApp.module.scss';

export function AuthenticateWithApp() {
  const authLink = useRecoilValue(authLinkState);

  if (!authLink) return null;

  return (
    <a className={classes.container} href={authLink}>
      Login with app
    </a>
  );
}
