"use client";

import React, { useState } from "react";
import { Film, Search, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/movies?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navItems = [
    { label: "Movies", path: "/movies" },
    { label: "Top Rated", path: "/movies/top-rated" },
    { label: "Coming Soon", path: "/movies/coming-soon" },
  ];

  return (
    <nav
      aria-label="Main navigation"
      className="bg-black/70 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Film className="w-8 h-8 text-yellow-500" aria-hidden="true" />
            <span className="text-xl font-bold">MovieDB</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">

            {/* Search */}
            <form onSubmit={handleSearch} role="search" className="relative">
              <label htmlFor="movie-search" className="sr-only">
                Search movies
              </label>

              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5"
                aria-hidden="true"
              />

              <input
                id="movie-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies"
                className="bg-zinc-900 text-white pl-10 pr-4 py-2 rounded-xl w-64"
              />
            </form>

            {/* Nav links */}
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="text-zinc-300 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile toggle */}
          <button
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden text-zinc-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">

            <form onSubmit={handleSearch} role="search" className="relative mb-4">
              <label htmlFor="movie-search-mobile" className="sr-only">
                Search movies
              </label>

              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5"
                aria-hidden="true"
              />

              <input
                id="movie-search-mobile"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies"
                className="bg-zinc-900 text-white pl-10 pr-4 py-2 rounded-xl w-full"
              />
            </form>

            <ul className="flex flex-col gap-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-zinc-300 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

          </div>
        )}
      </div>
    </nav>
  );
}