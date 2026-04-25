export async function getMovie(id: string) {
  console.log("GET MOVIE ID:", id);

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits`
  );

  console.log("TMDB STATUS:", res.status);

  if (!res.ok) {
    console.log("TMDB FAILED");
    return null;
  }

  const data = await res.json();

  console.log("TMDB DATA:", data?.title);

  return {
    id: data.id,
    title: data.title,
    rating: data.vote_average,
    duration: `${data.runtime} min`,
    genre: data.genres?.map((g: any) => g.name) || [],
    description: data.overview,
    image: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
    backdrop: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
    cast: [],
    awards: [],
    trailer: "#",
    boxOffice: data.revenue ? `$${data.revenue}` : "N/A",
    language: data.original_language,
    productionCompany: data.production_companies?.[0]?.name || "N/A",
    releaseDate: data.release_date,
    metacriticScore: Math.round(data.vote_average * 10),
    rottenTomatoesScore: Math.round(data.vote_average * 10),
  };
}