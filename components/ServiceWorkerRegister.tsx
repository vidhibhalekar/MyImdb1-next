"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        console.log("✅ SW registered");

        // initial sync
        reg.sync?.register("sync-watchlist");
      });
    }

    // ✅ STEP 4: AUTO SYNC WHEN ONLINE
    const handleOnline = () => {
      console.log("🌐 Back online → syncing");

      navigator.serviceWorker.ready.then((reg) => {
        reg.sync?.register("sync-watchlist");
      });
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return null;
}