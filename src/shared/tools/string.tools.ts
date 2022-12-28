import { makeMatch, Optional, R } from '@mv-d/toolbelt';

export function wasmFileNameToHash(fileName: string): string {
  return fileName.replace(/\.wasm$/, '');
}

const MATCH_STR_BOOL = makeMatch<(str?: string) => boolean>(
  {
    true: () => true,
    yes: () => true,
    '1': () => true,
    false: () => false,
    no: () => false,
    '0': () => false,
  },
  (str?: string) => Boolean(str),
);

export function strToBool(string?: Optional<string>) {
  if (R.isNil(string)) return false;

  return MATCH_STR_BOOL[string.toLowerCase().trim()](string);
}
