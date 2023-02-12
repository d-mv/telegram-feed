import { logger } from '@mv-d/toolbelt';

import { CONFIG } from '../config';

export function contextLogger(context: string) {
  function info(message: string) {
    if (CONFIG.logging >= 3) logger.info(`[${context}] ${message}`);
  }

  function warn(message: string) {
    if (CONFIG.logging >= 2) logger.warn(`[${context}] ${message}`);
  }

  function error(error: unknown, message: string) {
    if (CONFIG.logging >= 1) logger.error(error, `[${context}] ${message}`);
  }

  function verbose(message: string) {
    if (CONFIG.logging === 4) logger.info(`[${context}] ${message}`);
  }

  return { info, warn, error, verbose };
}
