import { logger, match, parseStr } from '@mv-d/toolbelt';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { StorageService } from '../entities';
import { filterState } from '../store/filter.store';

export function useFilter() {
  const setFilters = useSetRecoilState(filterState);

  useEffect(() => {
    const value = StorageService.get('filter');

    match(parseStr<number[]>(value), {
      Some: v => {
        // eslint-disable-next-line no-console
        console.log('Filters found in storage: ', v);
        setFilters(v);
      },
      None: _ => logger.info('No filters found in storage'),
    });
  }, [setFilters]);
}
