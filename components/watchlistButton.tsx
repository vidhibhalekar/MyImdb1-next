"use client";

import { useEffect, useState } from "react";
import { toggleWatchlist, getWatchlist } from "@/lib/watchlistRepository";
import { getChannel } from "@/lib/broadcast";

type Props = {
  movie: {
    id: string;
    title: string;
  };
};

export default function WatchlistButton({ movie }: Props) {
  const [added, setAdded] = useState(false);

  // =====================
  // INITIAL LOAD (IndexedDB)
  // =====================
  useEffect(() => {
    const load = async () => {
      const items = await getWatchlist();
      setAdded(items.some((i: any) => i.id === movie.id));
    };

    load();
  }, [movie.id]);

  // =====================
  // CROSS-TAB SYNC (FIXED)
  // =====================
  useEffect(() => {
    const channel = getChannel();
    if (!channel) return;

    const handler = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;

      console.log("📡 SYNC RECEIVED:", data);

      if (data.type === "ADD" && data.payload?.id === movie.id) {
        setAdded(true);
      }

      if (data.type === "REMOVE" && data.payload === movie.id) {
        setAdded(false);
      }
    };

    channel.addEventListener("message", handler);

    return () => {
      channel.removeEventListener("message", handler);
    };
  }, [movie.id]);

  // =====================
  // CLICK HANDLER
  // =====================
  const handleClick = async () => {
    console.log("🔥 CLICKED:", movie.id);

    try {
      const res = await toggleWatchlist({
        id: movie.id,
        title: movie.title,
      });

      console.log("🔥 RESULT:", res);

      if (res.added) setAdded(true);
      if (res.removed) setAdded(false);
    } catch (err) {
      console.error("❌ ERROR:", err);
    }
  };

  // =====================
  // UI
  // =====================
  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded font-semibold transition ${
        added
          ? "bg-green-500 text-white"
          : "bg-yellow-400 text-black hover:bg-yellow-300"
      }`}
    >
      {added ? "✔ Saved" : "+ Watchlist"}
    </button>
  );
}