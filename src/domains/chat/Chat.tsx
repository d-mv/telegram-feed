import { getMessagesForSelectedChat, useSelector } from '../../shared';

export default function Chat() {
  const messages = useSelector(getMessagesForSelectedChat);

  // eslint-disable-next-line no-console
  console.log('messages', messages);
  // trigger loading of messages
  // render messages
  // trigger loading comments for message_thread_id

  // TODO: switch to container
  return <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>I am chat</div>;
}
