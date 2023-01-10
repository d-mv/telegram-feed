import { ifTrue } from '@mv-d/toolbelt';
import { useEffect } from 'react';

import { Chat, Feed } from '../../domains';
import { getSelectedChat, LazyLoad, restoreState, useDispatch, useSelector, useTelegram } from '../../shared';
import { Container } from './Container';
import { Header } from './Header';

export default function Main() {
  const { getChats } = useTelegram();

  const selectedChat = useSelector(getSelectedChat);

  const dispatch = useDispatch();

  useEffect(() => {
    getChats();
    dispatch(restoreState());
    // getChats is not memoized, so we need to disable exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
