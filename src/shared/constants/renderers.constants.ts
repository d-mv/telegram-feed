import { makeMatch } from '@mv-d/toolbelt';

import { MessageText } from '../components';

// "messageAnimatedEmoji", "messageUnsupported", "messageVideo"
export const MATCH_MESSAGE_RENDERERS = makeMatch(
  {
    messageText: MessageText,
    messagePhoto: MessageText,
  },
  null,
);
