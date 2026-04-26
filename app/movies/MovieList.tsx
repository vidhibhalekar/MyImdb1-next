"use client";

import { SlidersHorizontal, Star } from "lucide-react";
import Link from "next/link";
import SearchClient from "./searchClient";
export const dynamic = "force-dynamic";


export default function MovieList() {
  const movies = [
    {
      id: 1,
      title: "Dune: Part Two",
      rating: 8.8,
      image:
        "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=800&q=80",
      year: 2024,
      genre: ["Action", "Adventure", "Sci-Fi"],
    },
    {
      id: 2,
      title: "Poor Things",
      rating: 8.4,
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
      year: 2023,
      genre: ["Comedy", "Drama", "Romance"],
    },
    {
      id: 3,
      title: "Oppenheimer",
      rating: 8.9,
      image:
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
      year: 2023,
      genre: ["Biography", "Drama", "History"],
    },
    {
      id: 4,
      title: "The Batman",
      rating: 8.5,
      image:
        "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=800&q=80",
      year: 2024,
      genre: ["Action", "Crime", "Drama"],
    },
    {
      id: 5,
      title: "Killers of the Flower Moon",
      rating: 8.7,
      image:
        "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=800&q=80",
      year: 2023,
      genre: ["Crime", "Drama", "History"],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search */}
      <SearchClient />

      {/* Header */}
      <div className="flex justify-between items-center mb-8 mt-4">
        <h1 className="text-3xl font-bold">Popular Movies</h1>

        <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl hover:bg-gray-900 transition">
          <SlidersHorizontal />
          Filters
        </button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`}>
            <div className="bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                  {movie.title}
                </h2>

                <div className="flex items-center justify-between text-gray-400">
                  <span>{movie.year}</span>

                  <span className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4" />
                    {movie.rating}
                  </span>
                </div>

                <div className="flex gap-2 mt-2">
                  {movie.genre.slice(0, 2).map((g) => (
                    <span
                      key={g}
                      className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-300"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}