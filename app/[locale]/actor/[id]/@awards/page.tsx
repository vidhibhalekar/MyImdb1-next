import { Award } from "lucide-react";
import { getActor } from "@/lib/getActor";

interface AwardsPageProps {
  params: { id: string };
}

export default async function AwardsPage({ params }: AwardsPageProps) {
  const actor = await getActor(params.id);

  if (!actor) {
    return <div className="text-gray-400">Actor not found</div>;
  }

  if (!actor.awards?.length) {
    return <div className="text-gray-400">No awards available</div>;
  }

  return (
    <div className="grid gap-4">
      {actor.awards.map((award: any, i: number) => (
        <div
          key={i}
          className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-xl p-4 flex gap-4 hover:shadow-lg hover:shadow-black/30 transition"
        >
          <div className="bg-yellow-500/20 p-3 rounded-lg">
            <Award className="text-yellow-500" />
          </div>

          <div>
            <p className="font-semibold text-lg">
              {award?.name || "Unknown Award"}
            </p>

            <p className="text-gray-400 text-sm">
              {award?.year || "—"} • {award?.category || "—"}
            </p>

            <p className="text-gray-300 text-sm mt-1">
              Film: {award?.film || "N/A"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 