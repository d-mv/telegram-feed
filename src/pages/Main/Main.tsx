import { LazyExoticComponent } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Chat, Feed } from '../../domains';
import { LazyLoad } from '../../shared';
import { Container } from './Container';
import { Header } from './Header';

function renderLazy(Component: LazyExoticComponent<() => JSX.Element>) {
  return (
    <LazyLoad>
      <Component />
    </LazyLoad>
  );
}

export default function Main() {
  function reRoute() {
    window.history.pushState({}, '', `/feed`);
    return <div />;
  }

  return (
    <Container>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path='/chat/:chatId' element={renderLazy(Chat)} />
          <Route path='/feed' element={renderLazy(Feed)} />
          <Route path='*' element={reRoute()} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}
