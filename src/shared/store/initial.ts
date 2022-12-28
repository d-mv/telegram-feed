import { LoadingItems, State } from './types';

export const INITIAL_STATE: State = {
  isLoading: { [LoadingItems.APP]: true },
};
