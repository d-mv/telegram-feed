import { ifTrue } from '@mv-d/toolbelt';
import { useRecoilValue } from 'recoil';
import { useGetChats } from '../../app/useGetChats.hook';

import { Chat, Feed } from '../../domains';
import { LazyLoad, selectedChatSelector } from '../../shared';
import { Container } from './Container';
import { Header } from './Header';

const renderChat = () => <Chat />;

const renderFeed = () => <Feed />;

export default function Main() {
  const selectedChat = useRecoilValue(selectedChatSelector);

  useGetChats();
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
