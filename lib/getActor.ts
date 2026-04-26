import { actors } from "@/lib/data";

export type Actor = (typeof actors)[number];

export async function getActor(id: string): Promise<Actor | null> {
  const actor = actors.find(
    (a) => String(a.id) === String(id)
  );

  return actor || null;
}