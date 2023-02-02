import { clsx } from 'clsx';
import { useRecoilState, useRecoilValue } from 'recoil';

import { chatsState, Icon } from '../../../shared';
import { selectedState } from '../filter.store';
import classes from './FilterCounter.module.scss';

export default function FilterCounter() {
  const [selected, setSelected] = useRecoilState(selectedState);

  const chats = useRecoilValue(chatsState);

  const allSelected = selected.length === chats.length;

  function makeMessage() {
    if (!selected.length) return 'No chats selected';

    if (allSelected) return 'All chats selected';

    return `${selected.length} of ${chats.length} selected`;
  }

  function toggleSelectAll() {
    if (!allSelected) {
      setSelected(chats.map(c => c.id));
    } else {
      setSelected([]);
    }
  }

  return (
    <div className={classes.container}>
      <button className={clsx(classes.button, { [classes.all]: allSelected })} onClick={toggleSelectAll}>
        <Icon icon='selectAll' className={classes.icon} />
        select all
      </button>
      <p className={classes.value}>{makeMessage()}</p>
    </div>
  );
}
