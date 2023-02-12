import { useCallback, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { TelegramService, TFilePart } from '../entities';
import { fileDownloadProgressSelector } from '../store';
import { checkIfFileIsDownloaded, choosePriority, contextLogger } from '../tools';

const { info, error } = contextLogger('useDownload');

export function useDownload(file_id: number, expected_size: number) {
  const [file, setFile] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const setFileDownloadProgress = useSetRecoilState(fileDownloadProgressSelector);

  const downloadFile = useCallback(async () => {
    const isDownloaded = await checkIfFileIsDownloaded(file_id);

    if (!isDownloaded) {
      const priority = choosePriority(expected_size);

      info(`Downloading file ${file_id} with expected size ${expected_size} and priority ${priority}`);

      // downloading the file
      await TelegramService.send({
        type: 'downloadFile',
        file_id,
        priority,
        synchronous: true,
      }).catch(err => {
        error(err, `Error while downloading file ${file_id}`);
      });
    } else {
      info(`File ${file_id} is already downloaded, reading...`);
    }

    // Read the data from local tdlib to blob
    const maybeFile = await TelegramService.send<TFilePart>({
      type: 'readFile',
      file_id,
    });

    if (maybeFile.isSome) {
      setFile(URL.createObjectURL(maybeFile.value.data));
      setIsLoading(false);
    } else {
      error(maybeFile.error, `Error while reading file ${file_id}`);
    }
  }, [expected_size, file_id]);

  function cancelFileDownload(fileId: number) {
    info(`Cancelling download of file ${fileId}...`);
    TelegramService.send({
      type: 'cancelDownloadFile',
      file_id: fileId,
    });
    setFileDownloadProgress({ [fileId]: { expectedSize: -1, downloadedSize: -1 } });
  }

  useEffect(() => {
    if (file_id && !file && !isLoading) {
      setIsLoading(true);
      downloadFile();
    }

    return () => {
      if (file_id && file) cancelFileDownload(file_id);
    };
  }, [downloadFile, file, file_id, isLoading]);

  return { file, isLoading };
}
