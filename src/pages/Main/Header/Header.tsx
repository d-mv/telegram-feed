import { useRecoilValue, useResetRecoilState } from 'recoil';

import { Icon, myselfSelector, selectedChatSelector } from '../../../shared';
import classes from './Header.module.scss';

export function Header() {
  const myself = useRecoilValue(myselfSelector);

  const selectedChat = useRecoilValue(selectedChatSelector);

  const resetSelectedChat = useResetRecoilState(selectedChatSelector);

  function handleReturn() {
    resetSelectedChat();
  }

  function makeH2(s: string) {
    return <h2 className={classes.name}>{s}</h2>;
  }

  function makeHeaderTitle() {
    if (selectedChat?.id)
      return (
        <div className={classes['chat-title']}>
          <button onClick={handleReturn} className={classes['chat-title-button']}>
            <Icon icon='return' className={classes['chat-title-icon']} />
          </button>

          {makeH2(selectedChat.title || '')}
        </div>
      );

    if (!myself) return 'Feed';

    return makeH2(`Feed for ${myself.first_name} ${myself.last_name}`);
  }

  return (
    <header className={classes.container}>
      {makeHeaderTitle()}
      {/* <FilterPanel /> */}
      {/* <Avatar user={myself} /> */}
    </header>
  );
}
