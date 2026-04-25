"use client";

import { useMemo, useState, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import Image from "next/image";

export default function FilmographyExplorer({ movies }: any) {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [role, setRole] = useState("");
  const [genre, setGenre] = useState("");

  // FILTER (same UI logic)
  const filteredMovies = useMemo(() => {
    return (movies || []).filter((m: any) =>
      m.title?.toLowerCase().includes(search.toLowerCase()) &&
      (year ? m.year?.toString().includes(year) : true) &&
      (role ? m.role?.toLowerCase().includes(role.toLowerCase()) : true) &&
      (genre ? m.genre?.toLowerCase().includes(genre.toLowerCase()) : true)
    );
  }, [movies, search, year, role, genre]);

  // VIRTUALIZATION
  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredMovies.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 110,
  });

  return (
    <div>
      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search movies..."
        className="w-full mb-4 bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-white"
      />

      {/* YEAR */}
      <input
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Year"
        className="w-full mb-4 bg-zinc-900 border border-zinc-700 p-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
      />

      {/* ROLE */}
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role"
        className="w-full mb-4 bg-zinc-900 border border-zinc-700 p-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
      />

      {/* GENRE */}
      <input
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        placeholder="Genre"
        className="w-full mb-4 bg-zinc-900 border border-zinc-700 p-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
      />

      {/* VIRTUAL LIST (UI SAME) */}
      <div ref={parentRef} className="h-[500px] overflow-auto space-y-3">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const movie = filteredMovies[virtualRow.index];
            if (!movie) return null;

            return (
              <div
                key={virtualRow.index}
                style={{
                  position: "absolute",
                  top: 0,
                  transform: `translateY(${virtualRow.start}px)`,
                  width: "100%",
                }}
                className="flex gap-4 p-3 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-600 transition"
              >
                {/* IMAGE */}
                <div className="relative w-[70px] h-[100px] shrink-0">
                  <Image
                    src={movie.image || "/fallback.jpg"}
                    alt={movie.title}
                    fill
                    loading="lazy"
                    sizes="70px"
                    className="object-cover rounded-md"
                  />
                </div>

                {/* INFO */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-white font-semibold">
                    {movie.title}
                  </h3>

                  <p className="text-gray-200 text-sm">
                    {movie.year} • ⭐ {movie.rating}
                  </p>

                  <p className="text-gray-200 text-sm">
                    Role: {movie.role} • {movie.genre}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* EMPTY */}
      {filteredMovies.length === 0 && (
        <p className="text-gray-400 text-center mt-4">
          No movies found
        </p>
      )}
    </div>
  );
}