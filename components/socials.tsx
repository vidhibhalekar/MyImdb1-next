"use client";

import { useState } from "react";
import { Award, Instagram, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import Awards from "./awards";
import Socials from "./socials";

export default function Tabs({ actor, actors }: any) {
  const [active, setActive] = useState("awards");

  const similarActors =
    actors?.filter((a: any) => {
      if (a.id === actor.id) return false;
      return a.genres?.some((g: string) =>
        actor.genres?.includes(g)
      );
    }) || [];

  const tabs = [
    { key: "awards", label: "Awards", icon: Award },
    { key: "social", label: "Social", icon: Instagram },
    { key: "similar", label: "Similar", icon: Users },
  ];

  return (
    <div>
      {/* TAB LIST */}
      <div
        role="tablist"
        className="flex gap-6 mb-6 border-b border-zinc-800 pb-2"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`flex items-center gap-2 pb-2 px-3 rounded-t-lg transition-all ${
                isActive
                  ? "bg-gray-800 border-b-2 border-yellow-500 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* AWARDS */}
      {active === "awards" && (
        <div role="tabpanel">
          <Awards awards={actor?.awards} />
        </div>
      )}

      {/* SOCIAL */}
      {active === "social" && (
        <div role="tabpanel">
          <Socials social={actor?.external_ids || actor?.socialMedia} />
        </div>
      )}

      {/* SIMILAR */}
      {active === "similar" && (
        <div role="tabpanel">
          <h3 className="text-lg font-semibold mb-4">
            Similar to {actor?.name}
          </h3>

          {similarActors.length === 0 ? (
            <p className="text-gray-400">No similar actors found</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {similarActors.map((item: any) => (
                <Link key={item.id} href={`/actor/${item.id}`}>
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="relative h-[220px]">
                      <Image
                        src={item.image || "/fallback.jpg"}
                        alt={item.name}
                        fill
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
          )}
        </div>
      )}
    </div>
  );
}