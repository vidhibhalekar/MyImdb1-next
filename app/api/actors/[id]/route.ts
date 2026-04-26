import { NextResponse } from "next/server";
import { actors } from "@/lib/data";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const actor = actors.find(
    (a) => String(a.id) === String(id)
  );

  // 🔍 Debug (temporary)
  console.log("PARAM ID:", id);
  console.log("FOUND ACTOR:", actor);

  if (!actor) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(actor, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}