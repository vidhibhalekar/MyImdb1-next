"use client";

import { useState } from "react";
import { Award, Instagram, Twitter, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Tabs({ actor, actors }: any) {
  const [active, setActive] = useState("awards");

  const similarActors = actors.filter((a: any) => {
    if (a.id === actor.id) return false;
    return a.genres?.some((g: string) =>
      actor.genres?.includes(g)
    );
  });

  return (
    <div>

      {/* TAB LIST (FIXED ACCESSIBILITY) */}
      <div
        role="tablist"
        aria-label="Actor information tabs"
        className="flex gap-6 mb-6 border-b border-zinc-800 pb-2"
      >
        {[
          { key: "awards", label: "Awards", icon: Award },
          { key: "social", label: "Social", icon: Instagram },
          { key: "similar", label: "Similar", icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.key;

          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.key}-panel`}
              onClick={() => setActive(tab.key)}
              className={`flex items-center gap-2 pb-2 px-3 rounded-t-lg transition-all ${isActive
                  ? "bg-gray-800 border-b-2 border-yellow-500 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* AWARDS */}
      {active === "awards" && (
        <div id="awards-panel" role="tabpanel" className="grid gap-4">
          {actor.awards.map((a: any, i: number) => (
            <div
              key={i}
              className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex gap-4"
            >
              <Award className="text-yellow-500" aria-hidden="true" />

              <div>
                <p className="font-semibold text-lg">{a.name}</p>
                <p className="text-gray-400 text-sm">
                  {a.year} • {a.category}
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  Film: {a.film}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SOCIAL */}
      {active === "social" && (
        <div id="social-panel" role="tabpanel" className="grid sm:grid-cols-2 gap-4">

          <a
            href={actor.socialMedia.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl flex items-center gap-4"
          >
            <Instagram aria-hidden="true" />
            <div>
              <p className="font-semibold">Instagram</p>
              <p className="text-gray-400 text-sm">@{actor.name}</p>
            </div>
          </a>

          <a
            href={actor.socialMedia.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl flex items-center gap-4"
          >
            <Twitter aria-hidden="true" />
            <div>
              <p className="font-semibold">Twitter</p>
              <p className="text-gray-400 text-sm">@{actor.name}</p>
            </div>
          </a>

        </div>
      )}

      {/* SIMILAR */}
      {active === "similar" && (
        <div id="similar-panel" role="tabpanel">

          <h3 className="text-lg font-semibold mb-4">
            Similar to {actor.name}
          </h3>

          {similarActors.length === 0 && (
            <p className="text-gray-400">No similar actors found</p>
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

            {similarActors.map((item: any) => (
              <Link key={item.id} href={`/actor/${item.id}`}>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">

                  <div className="relative h-[220px]">
                    <Image
                      src={item.image || "/fallback.jpg"}
                      alt={item.name}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-3">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {item.genres?.join(" • ")}
                    </p>
                  </div>

                </div>
              </Link>
            ))}

          </div>
        </div>
      )}

    </div>
  );
}