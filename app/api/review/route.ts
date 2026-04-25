import { ReviewSchema } from "@/lib/Schema";
import { getUserId } from "@/lib/auth";
import {
  addReview,
  getReviews,
  updateReview,
  deleteReview,
} from "@/lib/reviewStore";
import { moderate } from "@/lib/moderation";

// ==========================
// ✅ IN-MEMORY RATE LIMIT
// ==========================
const RATE_LIMIT = 10;
const WINDOW = 60 * 1000;

const store = new Map<string, number[]>();

function rateLimit(userId: string) {
  const now = Date.now();
  const timestamps = store.get(userId) || [];

  const filtered = timestamps.filter((t) => now - t < WINDOW);
  filtered.push(now);

  store.set(userId, filtered);

  if (filtered.length > RATE_LIMIT) {
    throw new Error("RATE_LIMIT");
  }
}

// ==========================
// ✅ REVISION HISTORY STORE
// ==========================
const revisions = new Map<string, any[]>();

function saveRevision(id: string, oldData: any, newData: any) {
  const diff = {
    before: oldData.text,
    after: newData.text,
    at: Date.now(),
  };

  const list = revisions.get(id) || [];
  list.push(diff);
  revisions.set(id, list);
}

// ==========================
// ✅ GET (pagination)
// ==========================
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const limit = Number(searchParams.get("limit") || 20);
  const cursor = Number(searchParams.get("cursor") || Date.now());

  const all = await getReviews();

  const filtered = all
    .filter((r) => r.createdAt < cursor)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);

  return Response.json(filtered);
}

// ==========================
// ✅ POST (CREATE)
// ==========================
export async function POST(req: Request) {
  try {
    const userId = await getUserId(req);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ❌ TEMP: disable rate limit (it is likely throwing)
    // rateLimit(userId);

    const body = await req.json();
    console.log("BODY:", body);

    // ❌ TEMP: skip Zod (just to confirm flow works)
    const { id, text, rating, movieId } = body;

    if (!text || text.length < 5) {
      return Response.json({ error: "Text too short" }, { status: 400 });
    }

    // ❌ TEMP: disable moderation (can silently block)
    // if (moderate(text)) {
    //   return Response.json({ error: "Inappropriate content" }, { status: 400 });
    // }

    const review = {
      id: id || crypto.randomUUID(),
      userId,
      text,
      rating,
      movieId,
      up: rating >= 5 ? 1 : 0,
      down: rating < 5 ? 1 : 0,
      createdAt: Date.now(),
      deleted: false,
    };

    await addReview(review);

    return Response.json({ review });
  } catch (e: any) {
    console.error("POST ERROR:", e); // 🔥 CRITICAL

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
// ==========================
// ✅ PUT (UPDATE)
// ==========================
export async function PUT(req: Request) {
  try {
    const userId = await getUserId(req);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    rateLimit(userId);

    const body = await req.json();
    const { id, text, rating } = body;

    if (!id) {
      return Response.json({ error: "Missing id" }, { status: 400 });
    }

    const all = await getReviews();
    const old = all.find((r) => r.id === id);

    if (!old) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    if (old.userId !== userId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    if (text && moderate(text)) {
      return Response.json(
        { error: "Inappropriate content" },
        { status: 400 }
      );
    }

    const updated = await updateReview(id, {
      text,
      rating,
      up: rating >= 5 ? 1 : 0,
      down: rating < 5 ? 1 : 0,
      updatedAt: Date.now(),
    });

    // ✅ revision history
    saveRevision(id, old, updated);

    return Response.json({ review: updated });
  } catch (e: any) {
    if (e.message === "RATE_LIMIT") {
      return Response.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// ==========================
// ✅ DELETE (SOFT)
// ==========================
export async function DELETE(req: Request) {
  try {
    const userId = await getUserId(req);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    rateLimit(userId);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Missing id" }, { status: 400 });
    }

    const all = await getReviews();
    const review = all.find((r) => r.id === id);

    if (!review) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    if (review.userId !== userId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const deleted = await deleteReview(id);

    return Response.json({ success: true, review: deleted });
  } catch (e: any) {
    if (e.message === "RATE_LIMIT") {
      return Response.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
} 