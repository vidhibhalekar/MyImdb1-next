const DB_NAME = "watchlist-db";
const STORE = "watchlist";
const DB_VERSION = 2; // IMPORTANT: keep this updated when schema changes

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => reject(request.error);

    request.onblocked = () => {
      console.warn("IndexedDB blocked. Close other tabs using this app.");
    };
  });
}

// =====================
// GET ALL ITEMS
// =====================
export async function getAllItems() {
  const db = await openDB();

  return new Promise<any[]>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);

    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

// =====================
// GET SINGLE ITEM
// =====================
export async function getItem(id: string) {
  const db = await openDB();

  return new Promise<any>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);

    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// =====================
// ADD / UPDATE ITEM
// =====================
export async function putItem(item: any) {
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);

    const request = store.put(item);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// =====================
// DELETE ITEM
// =====================
export async function deleteItem(id: string) {
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);

    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}