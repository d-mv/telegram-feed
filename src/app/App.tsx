import { ifTrue } from '@mv-d/toolbelt';
import { useRecoilValue } from 'recoil';

import { LoadMessage, Modals, Notifications } from '../domains';
import { Authenticate, Main } from '../pages';
import { LazyLoad, myselfSelector, useFilter, useConnect } from '../shared';

const renderAuthenticate = () => <Authenticate />;

const renderMain = () => <Main />;

export function App() {
  const myself = useRecoilValue(myselfSelector);

  useConnect();
  useFilter();

  return (
    <>
      <LazyLoad>
        {ifTrue(!myself, renderAuthenticate)}
        {ifTrue(myself, renderMain)}
      </LazyLoad>
      <Notifications />
      <LoadMessage />
      <Modals />
    </>
  );
}
