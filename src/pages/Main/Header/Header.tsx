import { clsx } from 'clsx';
import { useRecoilValue, useResetRecoilState } from 'recoil';

import { Menu } from '../../../domains';
import { selectedChatSelector } from '../../../shared';
import classes from './Header.module.scss';

export function Header() {
  const selectedChat = useRecoilValue(selectedChatSelector);

  const resetSelectedChat = useResetRecoilState(selectedChatSelector);

  function makeH2(s: string) {
    return <h2 className={classes.name}>{s}</h2>;
  }

  function makeHeaderTitle() {
    if (selectedChat?.id)
      return (
        <button className={classes['chat-title']} onClick={resetSelectedChat}>
          {makeH2(selectedChat.title || '')}
        </button>
      );

    return makeH2('Feed');
  }

  return (
    <header className={clsx(classes.container, { [classes.chat]: selectedChat?.id })}>
      <Menu />
      {makeHeaderTitle()}
    </header>
  );
}
