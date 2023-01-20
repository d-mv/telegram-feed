import InfiniteLoader from 'react-window-infinite-loader';
import { VariableSizeList } from 'react-window';
import { AnyValue } from '@mv-d/toolbelt';
import { renderListItem } from './ListItem';
import { useState } from 'react';
import { TMessage } from '../entities';

interface Props<T> {
  hasNextPage: boolean; // Are there more items to load?
  isNextPageLoading: boolean; // Are we currently loading a page of items?
  items: T[]; // Array of items loaded so far.
  loadNextPage: (startIndex: number, stopIndex: number) => Promise<AnyValue>; // Callback function responsible for loading the next page of items.
  limit?: number;
  height: number;
  renderItem: (data: T) => JSX.Element;
  itemHeight: number;
}

export function RenderList({
  hasNextPage,
  isNextPageLoading,
  height,
  items,
  loadNextPage,
  renderItem,
  itemHeight,
}: Props<TMessage>) {
  const itemCount = hasNextPage ? items.length + 1 : items.length;

  const loadMoreItems = (startIndex: number, stopIndex: number) => {
    isNextPageLoading && loadNextPage(startIndex, stopIndex);
  };

  const isItemLoaded = (index: number) => !hasNextPage || index < items.length;

  function getItem(index: number) {
    return items[index];
  }

  const [heights, setHeights] = useState<Record<number, number>>({});

  //  function  isItemLoaded (index: number) => boolean;
  // renderItem: (data: T) => JSX.Element;
  function sendHeight(i: number, id: string, height: number) {
    // eslint-disable-next-line no-console
    // console.log(i, id, height);
    // const r = document.getElementById(id);
    // id (!(i in heights)) {
    //   setHeights(h => ({ ...h, [i]: r?.offsetHeight || 0 }));
    // }
  }

  return (
    <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems} threshold={3}>
      {({ onItemsRendered, ref }) => (
        <VariableSizeList
          itemCount={itemCount}
          onItemsRendered={onItemsRendered}
          ref={ref}
          itemSize={(index: number) => {
            // eslint-disable-next-line no-console
            // console.log(items, index);

            if (!items.length) return 0;

            const i = items[index];

            if (!i) return 0;

            const id = String(i.id);

            const r = document.getElementById(id);

            // eslint-disable-next-line no-console
            console.log(id, r?.offsetHeight);

            return r?.offsetHeight || 0;
          }}
          height={height}
          width='100%'
        >
          {renderListItem({ getItem, isItemLoaded, renderItem, sendHeight })}
        </VariableSizeList>
      )}
    </InfiniteLoader>
  );
}
