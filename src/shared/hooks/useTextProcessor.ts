import { logger, makeMatch } from '@mv-d/toolbelt';
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

const PROCESS_TEXT = makeMatch(
  {
    textEntityTypeBold: (text: string) => `<strong>${text}</strong>`,
    textEntityTypeUrl: (text: string) =>
      `<a id="outside-link" href="${text}" target='_blank' rel='noopener noreferrer'>${text}</a>`,
    textEntityTypeBotCommand: (text: string) =>
      `<a id="outside-link" href="${text}" target='_blank' rel='noopener noreferrer'>${text}</a>`,
    textEntityTypeCode: (text: string) => `<code>${text}</code>`,
    textEntityTypeTextUrl: (text: string, url: string) =>
      `<a id="outside-link" href="${url}" target='_blank' rel='noopener noreferrer'>${text}</a>`,
    textEntityTypeMention: (text: string) =>
      `<a id="outside-link" href="${text.slice(1, text.length)}" target='_blank' rel='noopener noreferrer'>${text}</a>`,
    textEntityTypeHashtag: (text: string) =>
      `<a id="outside-link" href="https://t.me/${text}" target='_blank' rel='noopener noreferrer'><em>${text}</em></a>`,
    textEntityTypeItalic: (text: string) => `<em>${text}</em>`,
    textEntityTypeEmailAddress: (text: string) =>
      `<a id="outside-link" href="mailto:${text}" target='_blank' rel='noopener noreferrer'>${text}</a>`,
  },
  () => '',
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

      const result = PROCESS_TEXT[type['@type']](text, 'url' in type ? type.url : '');

      if (!result) logger.warn(`useTextProcessor] missing process ${type}`);

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
