import { ifTrue } from '@mv-d/toolbelt';
import { useRecoilValue } from 'recoil';
import { Notifications, LoadMessage } from '../domains';
import { Authenticate, Main } from '../pages';
import { myselfSelector, LazyLoad } from '../shared';

const renderAuthenticate = () => <Authenticate />;

const renderMain = () => <Main />;

export function Container() {
  const myself = useRecoilValue(myselfSelector);

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
