import { AnyValue, Optional } from '@mv-d/toolbelt';
import { useCallback, useEffect, useRef } from 'react';
import { MaybeNull } from '../types';

export function useDebounce<T>(fn: (...arg: T[]) => void, delay = 1000) {
  const timeoutRef = useRef<Optional<NodeJS.Timeout>>();

  function clear() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }

  useEffect(() => clear, []);

  return useCallback(
    (...arg: T[]) => {
      clear();
      timeoutRef.current = setTimeout(() => fn(...arg), delay);
    },
    [fn, delay],
  );
}
