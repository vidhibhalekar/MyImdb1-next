const cache = new Map<string, any>();

export async function getMovie(id: string) {
  if (!id) return null;

  if (cache.has(id)) return cache.get(id);

  const API_KEY = process.env.TMDB_API_KEY;

  if (!API_KEY) {
    console.log("❌ Missing TMDB_API_KEY in .env.local");
    return null;
  }

  const baseUrl = "https://api.themoviedb.org/3/movie";

  const movieUrl = `${baseUrl}/${id}?api_key=${API_KEY}`;
  const creditsUrl = `${baseUrl}/${id}/credits?api_key=${API_KEY}`;

  try {
    console.log("API KEY:", process.env.TMDB_API_KEY);
    const [movieRes, creditsRes] = await Promise.all([
      fetch(movieUrl),
      fetch(creditsUrl),
    ]);

    if (!movieRes.ok) {
      console.log("TMDB ERROR:", movieRes.status, await movieRes.text());
      return null;
    }

    const movie = await movieRes.json();
    const credits = creditsRes.ok ? await creditsRes.json() : null;

    const cast =
      credits?.cast?.slice(0, 6).map((c: any) => ({
        id: String(c.id),
        name: c.name,
        role: c.character,
        image: c.profile_path
          ? `https://image.tmdb.org/t/p/w300${c.profile_path}`
          : "/fallback.jpg",
      })) || [];

    const data = {
      id: String(movie.id),
      title: movie.title,
      rating: movie.vote_average || 0,
      duration: movie.runtime ? `${movie.runtime} min` : "N/A",
      genre: movie.genres?.map((g: any) => g.name) || [],
      description: movie.overview || "No description available",

      image: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/fallback.jpg",

      backdrop: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : "/fallback.jpg",

      releaseDate: movie.release_date?.split("-")[0] || "N/A",
      cast,

      awards: ["Academy Award Nominee"],
      boxOffice: movie.revenue
        ? `$${(movie.revenue / 1_000_000).toFixed(0)}M`
        : "N/A",

      language: movie.original_language || "N/A",
      productionCompany:
        movie.production_companies?.[0]?.name || "N/A",

      director: "N/A",
      metacriticScore: 75,
      rottenTomatoesScore: 85,
      trailer: "#",
    };

    cache.set(id, data);
    return data;
  } catch (err) {
    console.log("FETCH ERROR:", err);
    return null;
  }
}