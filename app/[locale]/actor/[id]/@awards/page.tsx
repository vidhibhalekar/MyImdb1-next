import { Award } from "lucide-react";


export default async function AwardsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // ✅ fetch actor
  const res = await fetch(
    `http://localhost:3000/api/actors/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div className="text-gray-400">No awards found</div>;
  }

  const actor = await res.json();

  if (!actor?.awards || actor.awards.length === 0) {
    return <div className="text-gray-400">No awards available</div>;
  }

  return (
    <div className="grid gap-4">

      {actor.awards.map((a: any, i: number) => (
        <div
          key={i}
          className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-xl p-4 flex gap-4 hover:shadow-lg hover:shadow-black/30 transition"
        >
          <div className="bg-yellow-500/20 p-3 rounded-lg">
            <Award className="text-yellow-500" />
          </div>

          <div>
            <p className="font-semibold text-lg">
              {a?.name || "Unknown Award"}
            </p>

            <p className="text-gray-400 text-sm">
              {a?.year || "—"} • {a?.category || "—"}
            </p>

            <p className="text-gray-300 text-sm mt-1">
              Film: {a?.film || "N/A"}
            </p>
          </div>
        </div>
      ))}

    </div>
  );
}