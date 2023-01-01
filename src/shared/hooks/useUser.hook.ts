import { useContextSelector } from 'use-context-selector';
import { TelegramContext } from '../entities';
import { getUserById, useSelector } from '../store';

export function useUser() {
  const { my_id } = useContextSelector(TelegramContext, c => c.options);

  const myself = useSelector(getUserById)(parseInt(my_id.value) ?? 0);

  return { myself };
}
