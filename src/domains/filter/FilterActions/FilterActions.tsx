import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';

import { Button, modalState, useChats } from '../../../shared';
import { filterSelector } from '../../../shared/store/filter.store';
import { useGetChats } from '../../feed/useGetChats.hook';
import { selectedState } from '../filter.store';
import classes from './FilterActions.module.scss';

export default function FilterActions() {
  const closeModal = useResetRecoilState(modalState);

  const selected = useRecoilValue(selectedState);

  const setFilter = useSetRecoilState(filterSelector);

  const { messagesForChatIds } = useGetChats();

  const { cleanUpOrphanMessages } = useChats();

  function handleUpdate() {
    setFilter(selected);
    cleanUpOrphanMessages(selected);
    messagesForChatIds(selected);
    closeModal();
  }

  return (
    <div className={classes.container}>
      <button className={classes.button} onClick={closeModal}>
        Cancel
      </button>
      <Button isDisabled={false} onClick={handleUpdate}>
        Update
      </Button>
    </div>
  );
}
