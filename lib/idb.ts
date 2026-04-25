let dbPromise: Promise<IDBDatabase> | null = null;

const DB_NAME = "review-db";
const DB_VERSION = 1;

function initDB() {
  if (typeof window === "undefined") {
    // 🚫 prevent SSR crash
    return Promise.reject("IndexedDB not available on server");
  }

  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;

      if (!db.objectStoreNames.contains("queue")) {
        db.createObjectStore("queue", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("drafts")) {
        db.createObjectStore("drafts", { keyPath: "movieId" });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ✅ THIS IS WHAT YOU WERE MISSING
export function getDB() {
  if (!dbPromise) {
    dbPromise = initDB();
  }
  return dbPromise;
}