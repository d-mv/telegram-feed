import { UIEvent, useCallback, useEffect, useRef, useState } from 'react';
import { buildIntArray, ifTrue } from '@mv-d/toolbelt';
import { last } from 'ramda';

import { MaybeNull } from '../../types';
import classes from './List.module.scss';
import { CONFIG } from '../../config';

const maintain = CONFIG.ui.elementsPerPage;

export interface ListProps {
  renderItem: (arg0: number) => JSX.Element | null;
  setBottomRef?: (arg0: HTMLButtonElement) => void;
  setTopRef?: (arg0: HTMLSpanElement) => void;
  qtyItems?: number;
}

export function List({ renderItem, setBottomRef, setTopRef, qtyItems = 0 }: ListProps) {
  const [showItems, setShowItems] = useState(buildIntArray(maintain - 1, 0));

  const itemIndexInView = useRef(-1);

  const containerRef = useRef<MaybeNull<HTMLDivElement>>(null);

  const bottomRef = useRef<MaybeNull<HTMLButtonElement>>(null);

  const topRef = useRef<MaybeNull<HTMLSpanElement>>(null);

  const [screenRatio, setScreenRatio] = useState(window.outerWidth / window.outerHeight);

  const currentBottomRef = bottomRef.current;

  const currentTopRef = topRef.current;

  useEffect(() => {
    if (currentBottomRef && setBottomRef) setBottomRef(currentBottomRef);
  }, [currentBottomRef, setBottomRef]);

  useEffect(() => {
    if (currentTopRef && setTopRef) setTopRef(currentTopRef);
  }, [currentTopRef, setTopRef]);

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

    const shouldUpdate = diff / containerHeight < 3.6;

    if (shouldUpdate) updateItemsDown();
  }

  function processGoingUp() {
    const container = containerRef.current;

    const top = topRef.current;

    if (!container || !top) return;

    const containerHeight = container.offsetHeight;

    const diff = -top.getBoundingClientRect().top - containerHeight;

    const shouldUpdate = diff / containerHeight < 3.6;

    if (shouldUpdate) updateItemsUp();
  }

  function processScrollEvents(e: UIEvent<HTMLDivElement>) {
    e.persist();

    const bottom = bottomRef.current;

    if (!bottom) return;

    const bottomPosition = bottom.getBoundingClientRect().top;

    if (!lastPosition) setLastPosition(bottomPosition);
    else if (lastPosition !== bottomPosition) {
      const isGoingUp = bottomPosition > lastPosition;

      setLastPosition(bottomPosition);

      if (isGoingUp) processGoingUp();
      else processGoingDown();
    }
  }

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

  const thereIsMore = qtyItems > (last(showItems) || 0);

  return (
    <div ref={containerRef} className={classes.container}>
      <div className={classes.items} onScroll={processScrollEvents}>
        <span ref={topRef} />
        {showItems.map(mapRenderItem)}
        <button ref={bottomRef} className={ifTrue(thereIsMore, classes['load-more-button'])} onClick={updateItemsDown}>
          {ifTrue(thereIsMore, <p className='p4'>load more?</p>)}
        </button>
      </div>
    </div>
  );
}
