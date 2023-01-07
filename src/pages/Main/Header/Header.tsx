import { clearSelectedChatId, getSelectedChatId, Icon, useDispatch, useSelector, useUser } from '../../../shared';
import classes from './Header.module.scss';

export function Header() {
  const { myself } = useUser();

  const dispatch = useDispatch();

  const chatId = useSelector(getSelectedChatId);

  function handleReturn() {
    dispatch(clearSelectedChatId());
  }

  function makeH2(s: string) {
    return <h2 className={classes.name}>{s}</h2>;
  }

  function makeHeaderTitle() {
    if (!myself && !chatId) return 'Feed';

    if (!chatId && myself) return makeH2(`Feed for ${myself.first_name} ${myself.last_name}`);

    if (!chatId) return null;

    // chat might not be loaded, but we know it's being selected
    return (
      <div className={classes['chat-title']}>
        <button onClick={handleReturn} className={classes['chat-title-button']}>
          <Icon icon='return' className={classes['chat-title-icon']} />
        </button>

        {makeH2(chatId.title || '')}
      </div>
    );
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
