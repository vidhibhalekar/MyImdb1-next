import React from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import FilmographyExplorer from "@/components/FilmographyExplorer";
import { getMessages } from "@/lib/getMessages";
import { getActor, Actor } from "@/lib/getActor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = {
  id: string;
  locale?: string;
};

// ✅ Metadata
export async function generateMetadata({ params }: { params: Params }) {
  const { id } = params;

  try {
    const actor = await getActor(id);

    if (!actor) return { title: "Actor Not Found" };

    return {
      title: actor.name,
      description: actor.biography,
    };
  } catch {
    return { title: "Actor Not Found" };
  }
}

// ✅ Page
export default async function Page({ params }: { params: Params }) {
  const { id, locale = "en" } = params;

  let actor: Actor | null = null;
  let messages: any = null;

  try {
    [actor, messages] = await Promise.all([
      getActor(id),
      getMessages(locale),
    ]);
  } catch (error) {
    console.error("Error loading actor:", error);
  }

  if (!actor) {
    return (
      <div className="text-white text-center mt-10">
        Actor not found
      </div>
    );
  }

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: actor.name,
            description: actor.biography,
          }),
        }}
      />

      <PageWrapper>
        {/* HERO */}
        <div className="relative w-full h-[320px] md:h-[400px] mb-8 rounded-xl overflow-hidden">
          <Image
            src="/cover.jpg"
            alt="Actor cover"
            width={1200}
            height={400}
            priority
            className="w-full h-[320px] md:h-[400px] object-cover rounded-xl"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute bottom-6 left-6 flex items-end gap-6">
            <div className="relative w-28 h-28 md:w-40 md:h-40">
              <Image
                src={actor.image}
                alt={actor.name}
                width={160}
                height={160}
                className="w-28 md:w-40 h-auto rounded-xl object-cover border-4 border-black shadow-lg"
              />
            </div>

            <div>
              <h1 className="text-2xl md:text-4xl font-bold mb-3 text-white">
                {actor.name}
              </h1>

              <div className="flex gap-6 text-white">
                <span>⭐ {actor.stats?.avgRating ?? "N/A"}</span>
                <span>🏆 {actor.stats?.totalAwards ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* LEFT */}
          <div>
            <div className="sticky top-24 space-y-6">
              <div className="bg-zinc-900 p-6 rounded-xl">
                <h2 className="mb-4 text-white font-semibold">
                  {messages?.personalInfo}
                </h2>

                <p className="text-gray-200">🎂 Born</p>
                <p className="text-white">{actor.birthDate ?? "N/A"}</p>

                <p className="text-gray-200 mt-3">📍 Place</p>
                <p className="text-white">{actor.birthPlace ?? "N/A"}</p>

                <p className="text-gray-200 mt-3">🎬 Movies</p>
                <p className="text-white">
                  {actor.stats?.moviesCount ?? 0}
                </p>
              </div>

              {/* SOCIAL */}
              <div className="bg-zinc-900 p-6 rounded-xl">
                <h2 className="mb-4 text-white font-semibold">
                  {messages?.social}
                </h2>

                <div className="flex gap-4">
                  {actor.socialMedia?.instagram && (
                    <a
                      href={actor.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📸
                    </a>
                  )}

                  {actor.socialMedia?.twitter && (
                    <a
                      href={actor.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🐦
                    </a>
                  )}
                  {actor.socialMedia?.imdb && (
                    <a
                      href={actor.socialMedia.imdb}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="IMDb"
                      className="text-yellow-400 font-bold text-lg bg-black px-2 py-1 rounded"
                    >
                      IMDb
                    </a>

                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="md:col-span-2">
            {/* BIO */}
            <section className="mb-10">
              <h2 className="text-2xl text-white font-bold mb-4">
                {messages?.biography}
              </h2>
              <p className="text-gray-200">{actor.biography}</p>
            </section>

           
            {/* FILMOGRAPHY */}
            <section>
              <h2 className="text-2xl text-white font-bold mb-6">
                {messages?.filmography}
              </h2>

              <FilmographyExplorer movies={actor.knownFor || []} />
            </section>
          </div>
        </div>
      </PageWrapper>
    </>
  );
} 