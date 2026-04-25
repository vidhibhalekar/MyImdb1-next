import { actors } from "@/lib/data";
import WatchButton from "@/components/WatchButton";

export default function ActorPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const { id } = params;

  const actor = actors.find((a) => String(a.id) === id);

  if (!actor) {
    return (
      <div className="text-white p-10">
        Actor not found
      </div>
    );
  }

  return (
    <div className="text-white p-10">
      <h1 className="text-3xl font-bold">{actor.name}</h1>

      <img
        src={actor.image}
        alt={actor.name}
        className="w-40 h-52 object-cover rounded-lg mt-4"
      />

      <div className="mt-6">
        <WatchButton
          movie={{
            id: String(actor.id),
            title: actor.name,
          }}
        />
      </div>
    </div>
  );
}