import {
  clearSelectedChatId,
  getMyself,
  getSelectedChat,
  getSelectedChatTitle,
  Icon,
  useDispatch,
  useSelector,
} from '../../../shared';
import classes from './Header.module.scss';

export function Header() {
  const myself = useSelector(getMyself);

  const dispatch = useDispatch();

  const selectedChat = useSelector(getSelectedChat);

  function handleReturn() {
    dispatch(clearSelectedChatId());
  }

  function makeH2(s: string) {
    return <h2 className={classes.name}>{s}</h2>;
  }

  function makeHeaderTitle() {
    if (selectedChat)
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

  function renderContent() {
    if (!myself) return null;

    return (
      <>
        {makeHeaderTitle()}
        {/* <FilterPanel /> */}
        {/* <Avatar user={myself} /> */}
      </>
    );
  }

  return <header className={classes.container}>{renderContent()}</header>;
}
