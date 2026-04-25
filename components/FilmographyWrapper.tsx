"use client";

import dynamic from "next/dynamic";

const FilmographyExplorer = dynamic(
  () => import("./FilmographyExplorer"),
  {
    ssr: false,
    loading: () => (
      <p className="text-gray-400 mt-4">Loading filmography...</p>
    ),
  }
);

export default function FilmographyWrapper({ movies }: any) {
  return <FilmographyExplorer movies={movies} />;
}