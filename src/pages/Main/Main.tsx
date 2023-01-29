import { Feed } from '../../domains';
import { LazyLoad } from '../../shared';
import { Container } from './Container';
import { Header } from './Header';

export default function Main() {
  return (
    <Container>
      <Header />
      <LazyLoad>
        <Feed />
      </LazyLoad>
    </Container>
  );
}
