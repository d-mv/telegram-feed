import { CONFIG, LogLevel } from '../config';

export function isDebugLogging(config: typeof CONFIG) {
  return config.userSettings.logging === LogLevel.DEBUG;
}
