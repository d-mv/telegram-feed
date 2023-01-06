import { R } from '@mv-d/toolbelt';
import { getSelectedChatTitle, Icon, setSelectedChatId, useDispatch, useSelector, useUser } from '../../../shared';
import { Avatar } from '../Avatar';
// import { FilterPanel } from '../FilterPanel';
import classes from './Header.module.scss';

export function Header() {
  const { myself } = useUser();

  const dispatch = useDispatch();

  const chatTitle = useSelector(getSelectedChatTitle);

  function handleReturn() {
    R.compose(dispatch, setSelectedChatId)(-1);
  }

  function makeH2(s: string) {
    return <h2 className={classes.name}>{s}</h2>;
  }

  function makeHeaderTitle() {
    if (!myself && !chatTitle) return 'Feed';

    if (!chatTitle) return makeH2(`Feed for ${myself!.first_name} ${myself!.last_name}`);

    return (
      <div className={classes['chat-title']}>
        <button onClick={handleReturn} className={classes['chat-title-button']}>
          <Icon icon='return' className={classes['chat-title-icon']} />
        </button>
        {makeH2(chatTitle)}
      </div>
    );
  }

  function renderContent() {
    if (!myself) return null;

    return (
      <>
        {makeHeaderTitle()}
        {/* <FilterPanel /> */}
        <Avatar user={myself} />
      </>
    );
  }

  return <header className={classes.container}>{renderContent()}</header>;
}
