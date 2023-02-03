import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { TChatRender, useChats, filterState } from '../../../shared';
import { FilterContext } from '../filter.context';
import { selectedSelector, selectedState } from '../filter.store';
import { Item } from '../Item';
import classes from './Filter.module.scss';

export default function Filter() {
  const { makeChatList } = useChats();

  const [selected, setSelected] = useRecoilState(selectedState);

  const filter = useRecoilValue(filterState);

  const setFilters = useSetRecoilState(selectedSelector);

  useEffect(() => {
    setSelected(filter);
  }, [filter, setSelected]);

  useEffect(() => {
    return () => {
      setSelected([]);
    };
  }, [setSelected]);

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
