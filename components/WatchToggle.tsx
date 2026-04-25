/*
import {
  getAllItems,
  putItem,
  deleteItem,
} from "@/lib/watchlistDB";

import { WatchlistItemSchema, type WatchItemDTO } from "@/lib/zodSchemas";

export async function toggleWatchlist(item: WatchItemDTO) {
  // 🧠 Normalize input safely (prevents crashes)
  const normalized: WatchItemDTO = {
    id: item.id || crypto.randomUUID(),
    title: item.title || "Unknown",
    addedAt: item.addedAt || Date.now(),
    updatedAt: Date.now(),
    version: (item.version ?? 0) + 1,
    vectorClock: item.vectorClock || { local: 1 },
  };

  // optional validation (safe mode, never crashes UI)
  const parsed = WatchlistItemSchema.safeParse(normalized);

  const finalItem = parsed.success ? parsed.data : normalized;

  const allItems = await getAllItems();

  const existing = allItems.find((i) => i.id === finalItem.id);

  /* ---------------------------
     REMOVE FLOW
  ---------------------------- */
  /*
  if (existing) {
    await deleteItem(finalItem.id);
    return { removed: true };
  }

  /* ---------------------------
     ADD FLOW
  ---------------------------- */
  {/*
  await putItem(finalItem);

  return { added: true };
}
*/}