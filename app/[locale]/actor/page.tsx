import { actors } from "@/lib/data";
import WatchButton from "@/components/WatchButton";

export default function ActorPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;

  return (
    <div className="text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Actors</h1>

      <div className="grid gap-6">
        {actors.map((actor) => (
          <div
            key={actor.id}
            className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg"
          >
            <img
              src={actor.image}
              alt={actor.name}
              className="w-20 h-28 object-cover rounded-md"
            />

            <div className="flex-1">
              <h2 className="text-xl font-semibold">{actor.name}</h2>
            </div>

            <WatchButton
              movie={{
                id: String(actor.id),
                title: actor.name,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}