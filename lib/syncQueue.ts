import type { QueueItem } from "@/types/sync";
import { getDB } from "./idb";


// ==========================
// ADD TO QUEUE
// ==========================
export async function addToQueue(
  item: Omit<QueueItem, "id">
) {
  const db = await getDB();
  const tx = db.transaction("queue", "readwrite");

  tx.objectStore("queue").put({
    ...item,
    id: crypto.randomUUID(),
  });

  await waitForTx(tx);
}

// ==========================
// GET QUEUE
// ==========================
export async function getQueue(): Promise<QueueItem[]> {
  const db = await getDB();
  const tx = db.transaction("queue", "readonly");

  return new Promise((resolve) => {
    const req = tx.objectStore("queue").getAll();

    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => resolve([]);
  });
}

// ==========================
// CLEAR QUEUE
// ==========================
export async function clearQueue() {
  const db = await getDB();
  const tx = db.transaction("queue", "readwrite");

  tx.objectStore("queue").clear();

  await waitForTx(tx);
}

// ==========================
// DELETE SINGLE ITEM
// ==========================
export async function deleteItem(id: string) {
  const db = await getDB();
  const tx = db.transaction("queue", "readwrite");

  tx.objectStore("queue").delete(id);

  await waitForTx(tx);
}

// ==========================
// FLUSH QUEUE (CORE SYNC ENGINE)
// ==========================
export async function flushQueue() {
  if (typeof window === "undefined") return;

  const db = await getDB();
  const items = await getQueue();

  if (!items.length) return;

  try {
    const res = await fetch("/api/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer user-1",
      },
      body: JSON.stringify(items),
    });

    if (!res.ok) {
      console.log("❌ Sync failed — keeping queue");
      return;
    }

    // clear only on success
    await clearQueue();

    // refresh UI
    const reviewsRes = await fetch("/api/review");
    const data = await reviewsRes.json();

    window.dispatchEvent(
      new CustomEvent("reviews:sync", {
        detail: data,
      })
    );

    console.log("✅ Sync successful");
  } catch (err) {
    console.log("❌ Sync error:", err);
  }
}

// ==========================
// WAIT FOR INDEXEDDB TX
// ==========================
function waitForTx(tx: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
} 