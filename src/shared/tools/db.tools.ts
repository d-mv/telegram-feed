export function databaseExists(dbname: string, callback: (existed: boolean) => void) {
  const req = indexedDB.open(dbname);

  let existed = true;
  req.onsuccess = function () {
    req.result.close();

    if (!existed) indexedDB.deleteDatabase(dbname);

    callback(existed);
  };
  req.onupgradeneeded = function () {
    existed = false;
  };
}
