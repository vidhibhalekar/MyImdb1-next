const cache = new Map<string, any>();

export async function getMovie(id: string) {
  if (!id) return null;

  // cache
  if (cache.has(id)) return cache.get(id);

  const TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;
  const API_KEY = process.env.TMDB_API_KEY;

  const headers: HeadersInit = {
    accept: "application/json",
  };

  // ✅ FIX: correct auth handling
  if (TOKEN) {
    headers["Authorization"] = `Bearer ${TOKEN}`;
  }

  const baseUrl = "https://api.themoviedb.org/3/movie";

  // fallback if token not working
  const movieUrl = TOKEN
    ? `${baseUrl}/${id}`
    : `${baseUrl}/${id}?api_key=${API_KEY}`;

  const creditsUrl = TOKEN
    ? `${baseUrl}/${id}/credits`
    : `${baseUrl}/${id}/credits?api_key=${API_KEY}`;

  try {
    const [movieRes, creditsRes] = await Promise.all([
      fetch(movieUrl, { headers }),
      fetch(creditsUrl, { headers }),
    ]);

    // ❌ debug exact error
    if (!movieRes.ok) {
      const text = await movieRes.text();
      console.log("TMDB MOVIE ERROR:", movieRes.status, text);
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