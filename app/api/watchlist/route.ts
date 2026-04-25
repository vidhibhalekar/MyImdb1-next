import { NextResponse } from "next/server";
import { mockApi } from "@/server/mockApi";

// GET all
export async function GET() {
  const data = await mockApi.getAll();
  return NextResponse.json(data);
}

// ADD / UPSERT
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await mockApi.upsert(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: "POST failed" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const result = await mockApi.delete(id);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: "DELETE failed" },
      { status: 500 }
    );
  }
}