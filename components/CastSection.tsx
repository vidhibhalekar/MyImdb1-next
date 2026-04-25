import Link from "next/link";

export default function CastSection({ cast }: any) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {cast?.map((actor: any) => (
        <Link
          key={actor.id}
          href={`/en/actor/${actor.id}`}
          className="min-w-[120px]"
        >
          <img
            src={actor.image}
            className="w-28 h-36 object-cover rounded"
          />
          <p className="text-sm mt-1">{actor.name}</p>
          <p className="text-xs text-gray-400">
            {actor.role}
          </p>
        </Link>
      ))}
    </div>
  );
}