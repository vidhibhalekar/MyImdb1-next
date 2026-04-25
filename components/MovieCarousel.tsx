"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import MovieCard from "./MovieCard";

type Movie = {
  id: number;
  title: string;
  rating: number;
  image: string;
  year: number;
  genre?: string[];
};

type Props = {
  movies: Movie[];
};

export default function MovieCarousel({ movies }: Props) {
  const [index, setIndex] = useState(0);

  const visible = 4;
  const maxIndex = Math.max(0, movies.length - visible);

  const next = () => {
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <div className="relative overflow-hidden">
      
      {/* TRACK */}
      <motion.div
        className="flex"
        animate={{
          x: `-${index * 25}%`, // ✅ FIXED: stable 4-card grid system
        }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 20,
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -80) next();
          else if (info.offset.x > 80) prev();
        }}
      >
        {movies.map((movie) => (
          <motion.div
            key={movie.id}
            className="min-w-1/4 w-1/4 p-2 shrink-0"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <MovieCard {...movie} />
          </motion.div>
        ))}
      </motion.div>

      {/* LEFT BUTTON */}
      {movies.length > visible && (
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 
                     bg-black/70 hover:bg-black/90 p-2 rounded-full"
          aria-label="Previous movies"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* RIGHT BUTTON */}
      {movies.length > visible && (
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 
                     bg-black/70 hover:bg-black/90 p-2 rounded-full"
          aria-label="Next movies"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}