import Link from "next/link";
import Image from "next/image";

export default async function SimilarPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;

  const res = await fetch(
    "http://localhost:3000/api/actors",
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div className="text-gray-400">No data found</div>;
  }

  const actors = await res.json();

  // ✅ current actor
  const current = actors.find(
    (a: any) => a.id.toString() === id
  );

  if (!current) {
    return <div className="text-gray-400">Actor not found</div>;
  }

  // ✅ SIMILAR LOGIC (by genre)
  const similarActors = actors.filter(
    (a: any) =>
      a.id.toString() !== id &&
      a.genres?.some((g: string) =>
        current.genres?.includes(g)
      )
  );

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Similar to {current.name}
      </h3>

      {/* EMPTY STATE */}
      {similarActors.length === 0 && (
        <p className="text-gray-400">
          No similar actors found
        </p>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {similarActors.map((item: any) => (
          <Link
            key={item.id}
            href={`/${locale}/actor/${item.id}`}
          >
            <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-xl overflow-hidden hover:scale-105 transition cursor-pointer">

              {/* IMAGE */}
              <div className="relative h-[220px]">
                <Image
                  src={item.image || "/fallback.jpg"}
                  alt={item.name}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </div>

              {/* INFO */}
              <div className="p-3">
                <h3 className="font-semibold text-white">
                  {item.name}
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                  {item.genres?.join(" • ") || "N/A"}
                </p>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}