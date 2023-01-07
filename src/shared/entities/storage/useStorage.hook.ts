import { RecordObject } from '@mv-d/toolbelt';
import { useEffect, useState } from 'react';

export function useStorage() {
  const [state, setState] = useState<RecordObject<string>>({});

  useEffect(() => {
    const data = window.localStorage.getItem('telefeed');

    if (data !== null) setState(JSON.parse(data));
  }, []);

  return {
    setItem(key: string, value: string) {
      setState(prevState => ({ ...prevState, [key]: value }));
    },
    getItem(key: string) {
      // No user input is used to access object properties
      // eslint-disable-next-line security/detect-object-injection
      return state[key] || '';
    },
  };
}
