import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const { tag } = await req.json();

    if (!tag) {
      return NextResponse.json(
        { error: "Missing tag" },
        { status: 400 }
      );
    }

    revalidateTag(tag as string);

    return NextResponse.json({
      success: true,
      revalidated: tag,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}