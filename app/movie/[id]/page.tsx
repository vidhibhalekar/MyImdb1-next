import {
  Award,
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  Globe,
  Play,
  Share2,
  Star,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import WatchlistButton from "@/components/watchlistButton";
import ReviewForm from "@/components/ReviewForm";

export default function MovieDetails({ params }: any) {
  const { id } = params;

  const Movies = [
    {
      id: 1,
      title: "Dune: Part Two",
      rating: 8.8,
      year: 2024,
      duration: "166 min",
      genre: ["Action", "Adventure", "Drama", "Sci-Fi"],
      director: "Denis Villeneuve",
      description:
        "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1HYYqIoovqLVr7DQU9tevo_bMrzQqJ7LQiVnjyK1x5BUHqrjFB_JDtftcR1Sxo1cPE0fPmg&s=10",
      backdrop:
        "https://www.torontofilmschool.ca/wp-content/uploads/2024/05/dune-part-two.jpeg",
      cast: [
        {
          id: 1,
          name: "Timothée Chalamet",
          role: "Paul Atreides",
          image:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
          bio: "Rising star known for compelling performances",
        },
      ],
      trailer: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      awards: ["Academy Award Nominee", "Golden Globe Nominee"],
      boxOffice: "$494.7M",
      language: "English",
      productionCompany: "Legendary Entertainment",
      releaseDate: "2024-03-01",
      metacriticScore: 81,
      rottenTomatoesScore: 94,
    },
  ];

  const movie = Movies.find((m) => m.id === Number(id)) || Movies[0];

  return (
    <div>
      <div className="relative h-[90vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.backdrop || movie.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
          <div className="grid md:grid-cols-3 gap-8 items-end">
            <div className="hidden md:block">
              <img
                src={movie.image}
                alt={movie.title}
                className="rounded-lg shadow-xl aspect-2/3 object-cover"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-500 font-semibold">
                    {movie.rating} Rating
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span>{movie.duration}</span>
                </div>

                <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span>{movie.releaseDate}</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {movie.title}
              </h1>

              <div className="flex flex-wrap gap-4">
                <a
                  href={movie.trailer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-yellow-500 text-black px-8 py-3 rounded-lg flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Watch Trailer
                </a>

                <WatchlistButton
                  movie={{
                    id: String(movie.id),
                    title: movie.title,
                  }}
                />

                <button className="bg-gray-800 px-4 py-3 rounded-lg">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-gray-300">{movie.description}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">User Reviews</h2>
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
            <ReviewForm movieId={id} />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Top Cast</h2>
          <div className="grid grid-cols-2 gap-6">
            {movie.cast.map((actor) => (
              <Link
                key={actor.id}
                href={`/en/actor/${actor.id}`}
                className="bg-gray-800 p-4 rounded-lg flex gap-4"
              >
                <img
                  src={actor.image}
                  className="w-24 h-24 rounded-xl object-cover"
                  alt={actor.name}
                />
                <div>
                  <h3 className="font-semibold">{actor.name}</h3>
                  <p className="text-gray-400">{actor.role}</p>
                  <p className="text-sm text-gray-400">{actor.bio}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}