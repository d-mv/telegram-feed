import { UIEvent, useCallback, useEffect, useRef, useState } from 'react';
import { buildIntArray } from '@mv-d/toolbelt';

import { MaybeNull } from '../../types';

import classes from './List.module.scss';

export interface ListProps<T> {
  renderItem: (arg0: number) => JSX.Element | null;
}

export function List<T extends { id: string | number }>({ renderItem }: ListProps<T>) {
  const [showItems, setShowItems] = useState(buildIntArray(9, 0));

  const itemIndexInView = useRef(-1);

  const containerRef = useRef<MaybeNull<HTMLDivElement>>(null);

  const bottomRef = useRef<MaybeNull<HTMLButtonElement>>(null);

  const topRef = useRef<MaybeNull<HTMLSpanElement>>(null);

  const [screenRatio, setScreenRatio] = useState(window.outerWidth / window.outerHeight);

  const updateScreenRatio = useCallback(() => {
    const ratio = window.outerWidth / window.outerHeight;

    if (screenRatio !== ratio) {
      setScreenRatio(ratio);
    }
  }, [screenRatio]);

  useEffect(() => {
    window.addEventListener('resize', updateScreenRatio);
    return () => {
      window.removeEventListener('resize', updateScreenRatio);
    };
  }, [updateScreenRatio]);

  function updateItemsDown() {
    const maintain = 10;

    const last = showItems[showItems.length - 1];

    const next = last + 1;

    // existing + add from next to last
    let newState = [...showItems, ...buildIntArray(next + maintain, next)];

    const indexOfCurrent = showItems.indexOf(itemIndexInView.current);

    // if there are more than needed items above the one in view
    if (indexOfCurrent > maintain) {
      newState = newState.slice(maintain);
    }

    setShowItems(newState);
  }

  function updateItemsUp() {
    const maintain = 10;

    const first = showItems[0];

    const startPoint = first - maintain < 0 ? 0 : first - maintain;

    // existing + add from next to last
    let newState = buildIntArray(first - 1, startPoint);

    const indexOfCurrent = showItems.indexOf(itemIndexInView.current);

    const maxNeeded = indexOfCurrent + maintain;

    // if there are more than needed items above the one in view
    if (maxNeeded < showItems[showItems.length - 1]) {
      newState = [...newState, ...showItems.slice(0, maxNeeded)];
    } else {
      newState = [...newState, ...showItems];
    }

    setShowItems(newState);
  }

  const [lastPosition, setLastPosition] = useState(0);

  function processGoingDown() {
    const container = containerRef.current;

    if (!container) return;

    const containerHeight = container.offsetHeight;

    const diff = lastPosition - containerHeight;

    const shouldUpdate =
      (screenRatio < 0.5 && diff / containerHeight < 2.6) || (screenRatio > 0.5 && diff / containerHeight < 3.6);

    if (shouldUpdate) updateItemsDown();
  }

  function processGoingUp() {
    const container = containerRef.current;

    const top = topRef.current;

    if (!container || !top) return;

    const containerHeight = container.offsetHeight;

    const diff = -top.getBoundingClientRect().top - containerHeight;

    const shouldUpdate =
      (screenRatio < 0.5 && diff / containerHeight < 2.6) || (screenRatio > 0.5 && diff / containerHeight < 3.6);

    if (shouldUpdate) updateItemsUp();
  }

  function processScrollEvents() {
    const bottom = bottomRef.current;

    if (!bottom) return;

    // const { offsetTop, clientTop, scrollTop } = idElement;
    const bottomPosition = bottom.getBoundingClientRect().top;

    if (!lastPosition) setLastPosition(bottomPosition);
    else if (lastPosition === bottomPosition) return;
    else {
      const isGoingUp = bottomPosition > lastPosition;

      setLastPosition(bottomPosition);

      if (isGoingUp) processGoingUp();
      else processGoingDown();
    }
  }

  // const its = showItems.map(i => items[i]).filter(Boolean);
  function handleCurrentItem(e: UIEvent<HTMLDivElement>) {
    const itemId = parseInt(e.currentTarget.id);

    if (itemIndexInView.current !== itemId) itemIndexInView.current = itemId;
  }

  function mapRenderItem(item: number) {
    return (
      <div key={item} id={String(item)} className={classes.item} onWheelCapture={handleCurrentItem}>
        {renderItem(item)}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={classes.container}>
      <div className={classes.items} onScroll={processScrollEvents}>
        <span ref={topRef} />
        {showItems.map(mapRenderItem)}
        <button ref={bottomRef} className={classes['load-more-button']} onClick={updateItemsDown}>
          <p className='p4'>load more?</p>
        </button>
      </div>
    </div>
  );
}
