import { getDB } from "./idb";

export async function saveDraft(movieId: string, text: string) {
  const db = await getDB();
  const tx = db.transaction("drafts", "readwrite");

  tx.objectStore("drafts").put({
    movieId,
    text,
  });
}

export async function getDraft(movieId: string) {
  const db = await getDB();
  const tx = db.transaction("drafts", "readonly");

  return new Promise<string>((resolve) => {
    const req = tx.objectStore("drafts").get(movieId);

    req.onsuccess = () => resolve(req.result?.text || "");
    req.onerror = () => resolve("");
  });
}