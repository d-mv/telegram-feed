import { ifTrue } from '@mv-d/toolbelt';
import { useRecoilValue } from 'recoil';

import { LoadMessage, Notifications } from '../domains';
import { Authenticate, Main } from '../pages';
import { LazyLoad, myselfSelector, useSelectedChat } from '../shared';
import { useConnect } from './useConnect.hook';

const renderAuthenticate = () => <Authenticate />;

const renderMain = () => <Main />;

export function App() {
  const myself = useRecoilValue(myselfSelector);

  useConnect();

  useSelectedChat();

  return (
    <>
      <LazyLoad>
        {ifTrue(!myself, renderAuthenticate)}
        {ifTrue(myself, renderMain)}
      </LazyLoad>
      <Notifications />
      <LoadMessage />
    </>
  );
}
