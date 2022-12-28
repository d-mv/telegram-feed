import { getAppIsLoading, useSelector } from '../shared';

export function App() {
  const isAppLoading = useSelector(getAppIsLoading);

  return <div>{String(isAppLoading)}</div>;
}
