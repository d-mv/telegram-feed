import { generateId } from '@mv-d/toolbelt';
import { CSSProperties, useEffect, useLayoutEffect, useRef } from 'react';
import { TMessage } from '../entities';

import { MaybeNull } from '../types';

interface ListItemBasicProps<T> {
  getItem: (index: number) => T;
  isItemLoaded: (index: number) => boolean;
  renderItem: (data: T) => JSX.Element;
  sendHeight: (index: number, id: string, height: number) => void;
}

interface ListItemProps {
  index: number;
  style: CSSProperties;
}

export function renderListItem({ getItem, isItemLoaded, sendHeight, renderItem }: ListItemBasicProps<TMessage>) {
  return function ListItem({ index, style }: ListItemProps) {
    let content;

    const ref = useRef<MaybeNull<HTMLDivElement>>(null);

    if (!isItemLoaded(index)) {
      content = 'Loading...';
    } else {
      content = renderItem(getItem(index));
    }

    const current = ref.current;

    const id = generateId();

    useLayoutEffect(() => {
      sendHeight(index, id, 0);
    }, []);

    useEffect(() => {
      // eslint-disable-next-line no-console
      //   console.log('current', current);
      //   if (current) sendHeight(index, current.offsetHeight);
    }, [current]);

    return (
      <div id={isItemLoaded(index) ? String(getItem(index)?.id) : generateId()} style={style}>
        {content}
      </div>
    );
  };
}
