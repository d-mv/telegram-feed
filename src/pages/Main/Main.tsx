import { ifTrue, R } from '@mv-d/toolbelt';
import { useEffect } from 'react';

import { Chat, Feed } from '../../domains';
import { getSelectedChat, LazyLoad, restoreState, useDispatch, useSelector, useTelegram } from '../../shared';
import { Container } from './Container';
import { Header } from './Header';

export default function Main() {
  const selectedChat = useSelector(getSelectedChat);

  const dispatch = useDispatch();

  useTelegram();

  useEffect(() => {
    R.compose(dispatch, restoreState)();
  }, [dispatch]);

  const renderChat = () => <Chat />;

  const renderFeed = () => <Feed />;

  return (
    <Container>
      <Header />
      <LazyLoad>
        {ifTrue(selectedChat?.id, renderChat)}
        {ifTrue(!selectedChat?.id, renderFeed)}
      </LazyLoad>
    </Container>
  );
}
