import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { TChatRender, useChats } from '../../../shared';
import { FilterContext } from '../filter.context';
import { filterSelector, filterState } from '../filter.store';
import { Item } from '../Item';
import classes from './Filter.module.scss';

export default function Filter() {
  const { makeChatList } = useChats();

  const selected = useRecoilValue(filterState);

  const setFilters = useSetRecoilState(filterSelector);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('selected', selected);
  }, [selected]);

  function toggleAddRemove(id: number) {
    return function call() {
      setFilters([id]);
    };
  }

  function renderChat(chat: TChatRender) {
    return (
      <FilterContext.Provider key={chat.id} value={{ item: chat, selected, onClick: toggleAddRemove(chat.id) }}>
        <Item />
      </FilterContext.Provider>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.list}>{makeChatList().map(renderChat)}</div>
    </div>
  );
}
