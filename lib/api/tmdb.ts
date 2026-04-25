import { getCached } from "@/lib/cache/serverCache";

const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY!;

async function fetchFromAPI(url: string) {
    const res = await fetch(url);
  
    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ TMDB ERROR:", res.status, errorText);
      throw new Error(`API failed: ${res.status}`);
    }
  
    return res.json();
  }

export function fetchMovie(id: string) {
  return getCached(`movie:${id}`, () =>
    fetchFromAPI(`${TMDB_BASE}/movie/${id}?api_key=${API_KEY}`)
  );
}

export function fetchCredits(id: string) {
  return getCached(`credits:${id}`, () =>
    fetchFromAPI(`${TMDB_BASE}/movie/${id}/credits?api_key=${API_KEY}`)
  );
}

export function fetchReviews(id: string) {
  return getCached(`reviews:${id}`, () =>
    fetchFromAPI(`${TMDB_BASE}/movie/${id}/reviews?api_key=${API_KEY}`)
  );
}