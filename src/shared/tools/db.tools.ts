/* eslint-disable promise/avoid-new */
export async function databaseExists(dbname: string) {
  return new Promise<boolean>((resolve, reject) => {
    const req = indexedDB.open(dbname);

    let existed = true;
    req.onsuccess = function () {
      req.result.close();

      if (!existed) indexedDB.deleteDatabase(dbname);

      resolve(existed);
    };
    req.onerror = function (err) {
      reject(err);
    };
    req.onupgradeneeded = function () {
      existed = false;
    };
  });
}
