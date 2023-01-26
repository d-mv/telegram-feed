import { useCallback, useEffect } from 'react';
import { propEq } from 'ramda';

import { authSelector, optionsSelector, usersSelector } from '../store';
import { useRecoilValue } from 'recoil';
import { useTelegram } from '../entities';

export function useUsers() {
  const users = useRecoilValue(usersSelector);

  const authStatus = useRecoilValue(authSelector);

  const options = useRecoilValue(optionsSelector);

  const { fetchUserById } = useTelegram();

  useEffect(() => {
    if (authStatus && options.my_id) fetchUserById(options.my_id.value, true);
  }, [authStatus, fetchUserById, options.my_id]);

  const getUserById = useCallback((id: number) => users.find(propEq('id', id)), [users]);

  return { getUserById };
}
