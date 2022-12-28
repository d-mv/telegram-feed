import { LoadingItems, State } from './types';

export const INITIAL_STATE: State = {
  isLoading: { [LoadingItems.APP]: true },
  // app: {
  //   prevAuthorizationState: AuthorizationStore.current,
  //   authorizationState: null,
  //   tdlibDatabaseExists: false,
  //   inactive: false,
  //   fatalError: false,
  //   nativeMobile: isMobile(),
  //   isSmall: window.innerWidth < 800,
  // },
};
