type QueueAction =
  | { type: "ADD"; id: string; title: string }
  | { type: "REMOVE"; id: string };

const DB_NAME = "watchlist-queue";
const STORE = "queue";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { autoIncrement: true });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function addToQueue(action: QueueAction) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).add(action);
}

export async function getQueue(): Promise<QueueAction[]> {
  const db = await openDB();
  const tx = db.transaction(STORE, "readonly");
  const req = tx.objectStore(STORE).getAll();

  return new Promise((resolve) => {
    req.onsuccess = () => resolve(req.result || []);
  });
}

export async function clearQueue() {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).clear();
}