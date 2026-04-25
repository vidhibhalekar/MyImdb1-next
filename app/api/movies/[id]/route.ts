export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  console.log("GET MOVIE ID:", id);

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );

    console.log("TMDB STATUS:", res.status);

    if (!res.ok) {
      return new Response(
        JSON.stringify({
          error: "Movie not found",
          status: res.status,
        }),
        { status: res.status }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error("FETCH FAILED:", err);

    return new Response(
      JSON.stringify({ error: "Network error" }),
      { status: 500 }
    );
  }
}