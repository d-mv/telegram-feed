import { PropsWithChildren, Suspense } from 'react';

export interface LazyLoadOptions {
  isDefault: boolean;
  isLoading: JSX.Element;
  message?: string;
}

export function LazyLoad({ isDefault, isLoading, children, message }: PropsWithChildren<Partial<LazyLoadOptions>>) {
  let fallback = null;

  if (isDefault) fallback = 'Loading...';

  if (isLoading) fallback = isLoading;

  if (message) fallback = message;

  return <Suspense fallback={fallback}>{children}</Suspense>;
}
