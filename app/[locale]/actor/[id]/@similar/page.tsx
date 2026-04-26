import { getActor } from "@/lib/getActor";
import Link from "next/link";

interface SimilarPageProps {
  params: {
    id: string;
  };
}

export default async function SimilarPage({ params }: SimilarPageProps) {
  const actor = await getActor(params.id);

  if (!actor) {
    return <div className="text-gray-400">Not found</div>;
  }

  const knownFor = actor.knownFor ?? [];

  if (knownFor.length === 0) {
    return <div className="text-gray-400">No movies found</div>;
  }

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {knownFor.map((movie: any, i: number) => (
        <Link
          key={movie.id ?? i}
          href={`/movies/${movie.id}`}
          className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 hover:scale-[1.02] transition"
        >
          <p className="font-semibold">{movie.title}</p>
          <p className="text-sm text-gray-400">{movie.year || "—"}</p>
        </Link>
      ))}
    </div>
  );
} 