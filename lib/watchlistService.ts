import {
  addToWatchlist,
  removeFromWatchlist,
  getState,
} from "@/lib/watchlistStore";

import { addToQueue } from "@/lib/watchlistQueue";

export function isInWatchlist(id: string) {
  return getState().some((m) => m.id === id);
}

export async function toggleWatchlist(item: { id: string; title: string }) {
  const exists = isInWatchlist(item.id);

  if (exists) {
    removeFromWatchlist(item.id);

    await addToQueue({
      type: "REMOVE",
      id: item.id,
    });
  } else {
    addToWatchlist(item);

    await addToQueue({
      type: "ADD",
      id: item.id,
      title: item.title,
    });
  }
}