import { makeMatch } from '@mv-d/toolbelt';
import { useMemo } from 'react';

import { TFormattedText, TMessageContentPhoto, TMessageText, TMessageTextEntity, TMessageVideo } from '../entities';

const GET_CONTENT_AND_ENTITIES = makeMatch(
  {
    messageText: (content: TMessageText) => ({ originalText: content.text.text, entities: content.text.entities }),
    messagePhoto: (content: TMessageContentPhoto) => ({
      originalText: content.caption.text,
      entities: content.caption.entities,
    }),
  },
  () => ({ originalText: '', entities: [] as TMessageTextEntity[] }),
);

export function useTextProcessor(content: TMessageContentPhoto | TMessageText | TFormattedText | TMessageVideo) {
  return useMemo(() => {
    const f = GET_CONTENT_AND_ENTITIES[content['@type']];

    // @ts-ignore -- resolve mismatched types
    const { originalText, entities } = f(content);

    if (!entities.length) return originalText;

    let processedText = '';

    let lastOffset = 0;

    entities.forEach(entity => {
      const { offset, length, type } = entity;

      const text = originalText.slice(offset, offset + length);

      let result = '';

      switch (type['@type']) {
        case 'textEntityTypeBold':
          result += `<strong>${text}</strong>`;
          break;
        case 'textEntityTypeUrl':
          result += `<a href="${text}" target='_blank' rel='noopener noreferrer'>${text}</a>`;
          break;
        case 'textEntityTypeBotCommand':
          result += `<a href="https://t.me/${text}" target='_blank' rel='noopener noreferrer'>${text}</a>`;
          break;
        case 'textEntityTypeCode':
          result += `<code>${text}</code>`;
          break;
        case 'textEntityTypeTextUrl':
          result += `<a href="https://t.me/${type.url}" target='_blank' rel='noopener noreferrer'>${text}</a>`;
          break;
        case 'textEntityTypeMention':
          result += `<a href="https://t.me/${text.slice(
            1,
            text.length,
          )}" target='_blank' rel='noopener noreferrer'>${text}</a>`;
          break;
        case 'textEntityTypeHashtag':
          result += `<a href="https://t.me/#${text}" target='_blank' rel='noopener noreferrer'><em>${text}</em></a>`;
          break;
        case 'textEntityTypeItalic':
          result += `<em>${text}</em>`;
          break;
        case 'textEntityTypeEmailAddress':
          result += `<a href="mailto:${text}" target='_blank' rel='noopener noreferrer'>${text}</a>`;
          break;
        default:
          // eslint-disable-next-line no-console
          console.log('missing type: ', type['@type'], content);
          break;
      }

      if (!processedText) {
        processedText = originalText.slice(0, offset) + result;
        lastOffset = offset + length;
      } else {
        const skippedText = originalText.slice(lastOffset, offset);

        processedText += skippedText + result;
        // updated last offset, to calculate skipped text on next iteration
        lastOffset = offset + length;
      }
    });

    // add leftover text
    return (processedText + originalText.slice(lastOffset)).replace(/\n/g, '</br>');
  }, [content]);
}
