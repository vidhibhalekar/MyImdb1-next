import { processQueue } from "@/lib/syncEngine";

export function initWatchlistOnlineSync() {
  if (typeof window === "undefined") return;

  window.addEventListener("online", async () => {
    try {
      console.log("🌐 Back online → syncing watchlist queue...");
      await processQueue();
    } catch (err) {
      console.error("Sync failed:", err);
    }
  });
}