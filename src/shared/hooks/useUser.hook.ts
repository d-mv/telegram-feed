import { Optional } from '@mv-d/toolbelt';
import { useContextSelector } from 'use-context-selector';

import { TelegramContext, TUser } from '../entities';
import { getUserById, useSelector } from '../store';

export function useUser() {
  const options = useContextSelector(TelegramContext, c => c.options);

  const getUser = useSelector(getUserById);

  if (!options || !('my_id' in options)) return { myself: undefined, byMyself: () => false };

  const { my_id } = options;

  const myself = getUser(parseInt(my_id.value) ?? 0);

  const byMyself = (userId: Optional<number>) => !!userId && getUser(userId)?.id === myself?.id;

  return {
    myself,
    byMyself,
  };
}
