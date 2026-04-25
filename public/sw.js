"use client";

import { useEffect, useRef } from "react";
import { processQueue } from "@/lib/syncEngine";
import { getWatchlist } from "@/lib/watchlistRepository";
import { setState } from "@/lib/watchlistStore";
import { getChannel } from "@/lib/broadcast";

export default function SyncProvider() {
  const isSyncing = useRef(false);
  const hasRunInitial = useRef(false);

  const run = async () => {
    if (isSyncing.current) return;

    try {
      isSyncing.current = true;

      console.log("🔄 Sync running...");

      // 1. sync DB
      await processQueue();

      // 2. refresh UI state from DB (IMPORTANT FIX)
      const updated = await getWatchlist();
      setState(updated);

      // 3. notify all tabs
      const channel = getChannel();
      channel?.postMessage({
        type: "MERGE",
        payload: { refresh: true },
      });
    } catch (err) {
      console.error("❌ Sync failed:", err);
    } finally {
      isSyncing.current = false;
    }
  };

  useEffect(() => {
    if (!hasRunInitial.current) {
      hasRunInitial.current = true;
      run();
    }

    window.addEventListener("online", run);

    return () => window.removeEventListener("online", run);
  }, []);

  return null;
}