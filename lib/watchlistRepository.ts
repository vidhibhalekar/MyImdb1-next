import { getAllItems, putItem, deleteItem } from "@/lib/watchlistDB";
import { getChannel } from "@/lib/broadcast";
import { addToQueue } from "@/lib/watchlistQueue";

type WatchInput = {
  id: string;
  title: string;
};

export async function getWatchlist() {
  return getAllItems();
}

export async function toggleWatchlist(item: WatchInput) {
  const channel = getChannel();
  const isOnline = navigator.onLine;

  const all = await getAllItems();
  const exists = all.some((i) => i.id === item.id);

  try {
    // ======================
    // OFFLINE MODE
    // ======================
    if (!isOnline) {
      await addToQueue({
        type: exists ? "REMOVE" : "ADD",
        id: item.id,
        title: item.title,
      });

      channel?.postMessage({
        type: exists ? "REMOVE" : "ADD",
        payload: { id: item.id },
      });

      return exists ? { removed: true } : { added: true };
    }

    // ======================
    // REMOVE ITEM
    // ======================
    if (exists) {
      await deleteItem(item.id);

      channel?.postMessage({
        type: "REMOVE",
        payload: { id: item.id },
      });

      console.log("🗑️ REMOVED:", item.id);

      return { removed: true };
    }

    // ======================
    // ADD ITEM
    // ======================
    const newItem = {
      id: item.id,
      title: item.title,
      addedAt: Date.now(),
    };

    await putItem(newItem);

    channel?.postMessage({
      type: "ADD",
      payload: { id: item.id },
    });

    console.log("➕ ADDED:", item.id);

    return { added: true };
  } catch (err) {
    console.error("toggleWatchlist error:", err);
    throw err;
  }
}