"use client";

import { Star, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ComingSoon() {
  const comingMovies = [
    {
      id: 6,
      title: "Deadpool 3",
      rating: 9.1,
      image:
        "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=800&q=80",
      year: 2024,
      genre: ["Action", "Comedy", "Adventure"],
    },
    {
      id: 8,
      title: "Kingdom of the Planet of the Apes",
      rating: 8.3,
      image:
        "https://images.unsplash.com/photo-1533973860717-d49dfd14cf64?auto=format&fit=crop&w=800&q=80",
      year: 2024,
      genre: ["Action", "Adventure", "Drama"],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Coming Soon</h1>
        <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl hover:bg-gray-900 transition-colors">
          <SlidersHorizontal className="w-5 h-5 text-yellow-500" /> Filters
        </button>
      </div>

      {/* Movie Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {comingMovies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
            >
              <div className="relative aspect-video">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-yellow-500 font-medium">
                    {movie.rating}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">{movie.year}</span>
                  <div className="flex gap-2">
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
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}