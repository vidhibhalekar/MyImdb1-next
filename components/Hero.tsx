"use client";

import React, { useEffect, useState } from "react";
import { Play, Star, Calendar } from "lucide-react";
import Link from "next/link";


const featuredMovies = [
  {
    id: 1,
    title: "Dune: Part Two",
    rating: 8.8,
    releaseDate: "March 1, 2024",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.",
    image:
      "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=2000&q=80",
  },
  {
    id: 2,
    title: "Oppenheimer",
    rating: 8.9,
    releaseDate: "July 21, 2023",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb. A gripping tale of genius, conscience, and the price of scientific progress.",
    image:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=2000&q=80",
  },
];

const Hero = () => {
  const [currentMovie, setCurrentMovie] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMovie((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  const movie = featuredMovies[currentMovie];

  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{
          backgroundImage: `url('${movie.image}')`,
        }}
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-black/20" />

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-black to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <div className="max-w-2xl">
          {/* Rating + Date */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="text-yellow-400 font-semibold">
                {movie.rating} Rating
              </span>
            </div>

            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full">
              <Calendar className="w-5 h-5 text-zinc-300" />
              <span className="text-zinc-300">{movie.releaseDate}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {movie.title}
          </h1>

          {/* Description */}
          <p className="text-zinc-300 text-lg mb-8 max-w-xl line-clamp-3">
            {movie.description}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={`/movie/${movie.id}`}
              className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-yellow-400 transition-all duration-300 hover:scale-105"
            >
              <Play className="w-5 h-5" />
              Watch Trailer
            </Link>

            <Link
              href={`/movie/${movie.id}`}
              className="bg-zinc-900/80 backdrop-blur-md text-white px-8 py-3 rounded-xl font-semibold hover:bg-zinc-800 transition-all duration-300 hover:scale-105"
            >
              More Info
            </Link>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 right-8 flex gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentMovie(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentMovie === index
                  ? "bg-yellow-500 w-10"
                  : "bg-zinc-600 w-4 hover:bg-zinc-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
