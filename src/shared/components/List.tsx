import { VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { TMessage } from '../entities';
import { Ref, useEffect, useRef } from 'react';
import { MaybeNull } from '../types';

const styles = {
  messagesContainer: {
    height: '100%',
    width: '100%',
  },
  newMessage: {
    backgroundColor: '#3578E5',
    borderRadius: '8px',
    color: '#FFFFFF',
    display: 'flex',
    fontFamily: 'Roboto, sans-serif',
    padding: '12px',
    width: '65%',
  },
  newMessageContainer: {
    display: 'flex',
    flex: '0 0 auto',
    justifyContent: 'flex-end',
    width: '100%',
  },
  receivedMessage: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    display: 'flex',
    fontFamily: 'Roboto, sans-serif',
    padding: '12px',
    width: '65%',
  },
  receivedMessageContainer: {
    display: 'flex',
    flex: '0 0 auto',
    justifyContent: 'flex-start',
    width: '100%',
  },
};

export const List = ({ messages, render }: { messages: TMessage[]; render: (arg0: TMessage) => JSX.Element }) => {
  // References
  const listRef = useRef<Ref<VariableSizeList<TMessage>>>(null);

  const rowHeights = useRef<Record<number, number>>({});

  // @ts-ignore -- temp
  function setRowHeight(index, size) {
    // @ts-ignore -- temp
    listRef.current?.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: size };
  }

  // @ts-ignore -- temp
  function getRowHeight(index) {
    // @ts-ignore -- temp
    return rowHeights.current[index] + 8 || 82;
  }

  // @ts-ignore -- temp
  // eslint-disable-next-line react/prop-types
  function Row({ index, style }) {
    const rowRef = useRef<MaybeNull<HTMLDivElement>>(null);

    useEffect(() => {
      if (rowRef.current) {
        setRowHeight(index, rowRef.current.clientHeight);
      }
    }, [index, rowRef]);

    return (
      <div ref={rowRef} style={styles.newMessageContainer}>
        {render(messages[index])}
      </div>
    );
  }

  return (
    <AutoSizer style={styles.messagesContainer}>
      {({ height, width }) => (
        <VariableSizeList
          className='List'
          height={height}
          itemCount={messages.length}
          itemKey={index => messages[index].id}
          overscanCount={10}
          itemSize={getRowHeight}
          // @ts-ignore -- temp
          ref={listRef}
          width={width}
        >
          {Row}
        </VariableSizeList>
      )}
    </AutoSizer>
  );
};
