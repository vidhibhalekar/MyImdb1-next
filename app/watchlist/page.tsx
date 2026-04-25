"use client";

import { getState, removeFromWatchlist } from "@/lib/watchlistStore";
import { useState } from "react";

export default function WatchlistPage() {
  const [list, setList] = useState(getState());

  const remove = (id: string) => {
    removeFromWatchlist(id);
    setList(getState());
  };

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Watchlist</h1>

      {list.length === 0 && (
        <p className="text-gray-400">No movies added yet</p>
      )}

      <div className="grid gap-4">
        {list.map((movie: any) => (
          <div
            key={movie.id}
            className="bg-gray-800 p-4 rounded flex justify-between items-center"
          >
            <span>{movie.title}</span>

            <button
              onClick={() => remove(movie.id)}
              className="text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}