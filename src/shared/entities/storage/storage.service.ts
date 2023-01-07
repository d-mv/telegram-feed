import { RecordObject, R, AnyValue, logger } from '@mv-d/toolbelt';
import { CONFIG } from '../../config';
import { isDebugLogging } from '../../tools';
import { MaybeNull } from '../../types';

function toMap(obj: RecordObject<string>) {
  const newMap = new Map<string, string>();

  Object.entries(obj).forEach(([key, value]: [string, string]) => newMap.set(key, value));

  return newMap;
}

function fromMap(map: Map<string, string>): RecordObject<string> {
  let newObj: RecordObject<string> = {};

  map.forEach((value, key) => {
    newObj = { ...newObj, [key]: value };
  });

  return newObj;
}

class Storage {
  #state: Map<string, string> = new Map();

  constructor() {
    this.#init();
  }

  #init() {
    const data = window.localStorage.getItem('telefeed');

    this.#state = R.compose(toMap, this.#decrypt)(data);

    if (isDebugLogging(CONFIG))
      R.compose(logger.info, (s: string) => `Restored state ${s}`, JSON.stringify, fromMap)(this.#state);
  }

  #decrypt(data: MaybeNull<string>): RecordObject<string> {
    if (!data) return {};

    return JSON.parse(data);
  }

  #updateLocalStorage() {
    window.localStorage.setItem('telefeed', R.compose(JSON.stringify, fromMap)(this.#state));
  }

  set(key: string, value: AnyValue) {
    this.#state.set(key, value);
    this.#updateLocalStorage();
  }

  get(key: string) {
    return this.#state.get(key) || '';
  }

  remove(key: string) {
    this.#state.delete(key);
    this.#updateLocalStorage();
  }

  get state() {
    return fromMap(this.#state);
  }
}

export const StorageService = new Storage();
