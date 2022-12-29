import { LoadingItems, State } from './types';

export const INITIAL_STATE: State = {
  isLoading: { [LoadingItems.APP]: true },
  app: {
    // prevAuthorizationState: AuthorizationStore.current,
    authorizationState: false,
    tdlibDatabaseExists: false,
    // inactive: false,
    // fatalError: false,
  },
  authorization: {
    step: 1,
  },
  notifications: [],
};
