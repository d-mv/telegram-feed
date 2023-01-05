import { ifTrue } from '@mv-d/toolbelt';
import { Chat, Feed } from '../../domains';
import { getSelectedChatTitle, LazyLoad, useSelector } from '../../shared';
import { Container } from './Container';
import { Header } from './Header';

export default function Main() {
  const chatTitle = useSelector(getSelectedChatTitle);

  return (
    <Container>
      <Header />
      {ifTrue(chatTitle, () => (
        <LazyLoad>
          <Chat />
        </LazyLoad>
      ))}
      {ifTrue(!chatTitle, () => (
        <Feed />
      ))}
    </Container>
  );
}
