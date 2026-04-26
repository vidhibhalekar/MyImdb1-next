const API_KEY = process.env.TMDB_API_KEY;

export async function getActor(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch actor");
  }

  return res.json();
}