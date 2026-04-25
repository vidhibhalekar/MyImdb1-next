"use client";

import { useEffect, useState } from "react";
import { toggleWatchlist, getWatchlist } from "@/lib/watchlistRepository";

export default function WatchButton({ movie }: any) {
  const [added, setAdded] = useState(false);

  // load initial state
  useEffect(() => {
    const load = async () => {
      const items = await getWatchlist();
      setAdded(items.some((i: any) => i.id === movie.id));
    };

    load();
  }, [movie.id]);

  // click
  const handleClick = async () => {
    console.log("🔥 CLICKED:", movie.id);

    const res = await toggleWatchlist({
      id: movie.id,
      title: movie.title,
    });

    console.log("🔥 RESULT:", res);

    if (res.added) setAdded(true);
    if (res.removed) setAdded(false);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded font-semibold ${
        added ? "bg-green-500 text-white" : "bg-yellow-400 text-black"
      }`}
    >
      {added ? "✔ Saved" : "+ Watchlist"}
    </button>
  );
}