import MovieList from "./movielist";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-gray-400">Loading...</p>}>
      <MovieList />
    </Suspense>
  );
} 