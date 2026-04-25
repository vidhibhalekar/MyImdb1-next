import { NextResponse } from "next/server";
import { actors } from "@/lib/data";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ correct

  const actor = actors.find((a) => a.id.toString() === id);

  if (!actor) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(actor, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}