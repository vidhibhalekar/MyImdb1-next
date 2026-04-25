"use client";

import { useEffect, useRef } from "react";
import { processQueue } from "@/lib/syncEngine";
import { setState } from "@/lib/watchlistStore";

export default function SyncProvider() {
  const syncing = useRef(false);

  const run = async () => {
    if (syncing.current) return;

    try {
      syncing.current = true;

      // 1. Sync offline queue → DB
      await processQueue();

      // ❌ REMOVE THIS (causes conflicts)
      // const items = await getWatchlist();
      // setState(items);

      // 2. Let store remain source of truth
      // store is already updated inside toggleWatchlist
    } finally {
      syncing.current = false;
    }
  };

  useEffect(() => {
    run();

    window.addEventListener("online", run);

    return () => window.removeEventListener("online", run);
  }, []);

  return null;
}