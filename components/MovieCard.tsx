"use client";

import Link from "next/link";
import { useWatchlist } from "@/lib/useWatchlist";
import { toggleWatchlist } from "@/lib/watchlistService";
import { scheduleUndo } from "@/lib/watchlistUndo";

type Props = {
  id: number;
  title: string;
  rating: number;
  image: string;
  year: number;
  genre?: string[];
};

export default function MovieCard({
  id,
  title,
  rating,
  image,
  year,
  genre,
}: Props) {
  const { isInWatchlist } = useWatchlist();

  const movieId = String(id);
  const added = isInWatchlist(movieId);

  const handleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();

    const action = {
      id: movieId,
      title,
    };

    const willRemove = added;

    // 1. immediate update + queue
    toggleWatchlist(action);

    // 2. schedule undo
    scheduleUndo(action, () => {
      toggleWatchlist(action);
    });
  };

  return (
    <Link
      href={`/movie/${id}`}
      aria-label={`View details for ${title}`}
      className="block focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-xl"
    >
      <article className="bg-zinc-900/50 rounded-xl overflow-hidden movie-card-hover backdrop-blur-sm transition hover:scale-[1.02]">
        
        {/* IMAGE */}
        <div className="relative aspect-[2/3]">
          <img
            src={image}
            alt={`${title} movie poster`}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* WATCHLIST BUTTON */}
          <button
            onClick={handleWatchlist}
            className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded"
          >
            {added ? "✓ Saved" : "+ Watchlist"}
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-3">
          <h3 className="font-semibold text-white">{title}</h3>

          <p className="text-sm text-gray-400">{year}</p>

          <p className="text-yellow-500">⭐ {rating}</p>

          {genre && (
            <p className="text-xs text-gray-500">
              {genre.join(", ")}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}