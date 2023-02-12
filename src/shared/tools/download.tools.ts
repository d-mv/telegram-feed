import { TelegramService, TFile } from '../entities';

export async function checkIfFileIsDownloaded(file_id: number) {
  const checkResult = await TelegramService.send<TFile>({ type: 'getFile', file_id });

  if (checkResult.isNone) return false;

  const {
    local: { is_downloading_completed, downloaded_size },
    expected_size,
  } = checkResult.value;

  return is_downloading_completed && expected_size === downloaded_size;
}

export function choosePriority(expected_size: number) {
  if (expected_size <= 30_000) return 32;

  if (expected_size >= 5_000_000) return 1;

  const priority = expected_size / 165_667;

  if (priority < 1) return 2;

  return Math.round(priority);
}
