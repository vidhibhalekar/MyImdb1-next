import { openDB } from "idb";
type WatchItemDTO = {
    id: string;
    title?: string;
    poster?: string;
  };
const DB_NAME = "watchlist-db";
const STORE = "items";
const QUEUE_STORE = "queue";

let dbPromise: any;

function getDB() {
  if (typeof window === "undefined") return null;

  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 2, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains(QUEUE_STORE)) {
          db.createObjectStore(QUEUE_STORE, { keyPath: "id" });
        }
      },
    });
  }

  return dbPromise;
}

export const OfflineStore = {
  async getAll(): Promise<WatchItemDTO[]> {
    const db = await getDB();
    if (!db) return [];
    return db.getAll(STORE);
  },

  async get(id: string) {
    const db = await getDB();
    if (!db) return undefined;
    return db.get(STORE, id);
  },

  async put(item: WatchItemDTO) {
    const db = await getDB();
    if (!db) return;
    return db.put(STORE, item);
  },

  async delete(id: string) {
    const db = await getDB();
    if (!db) return;
    return db.delete(STORE, id);
  },

  async enqueue(req: any) {
    const db = await getDB();
    if (!db) return;

    return db.put(QUEUE_STORE, {
      id: crypto.randomUUID(),
      req,
      createdAt: Date.now(),
    });
  },

  async getQueue() {
    const db = await getDB();
    if (!db) return [];
    return db.getAll(QUEUE_STORE);
  },

  async clearQueueItem(id: string) {
    const db = await getDB();
    if (!db) return;
    return db.delete(QUEUE_STORE, id);
  },

  async flushQueue() {
    const db = await getDB();
    if (!db) return;

    const all = await db.getAll(QUEUE_STORE);

    for (const item of all) {
      try {
        const res = await fetch("/api/review", item.req);

        if (res.ok) {
          await db.delete(QUEUE_STORE, item.id);
        }
      } catch {
        // keep retry
      }
    }
  },
};