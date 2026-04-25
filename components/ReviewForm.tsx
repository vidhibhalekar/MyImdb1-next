"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { saveDraft, getDraft } from "@/lib/reviewDraft";
import { wilson } from "@/lib/wilson";
import { OfflineStore } from "@/lib/offlineStore";
import { motion, AnimatePresence } from "framer-motion";

export default function ReviewForm({ movieId }: any) {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(8);
  const [reviews, setReviews] = useState<any[]>([]);
  const [sort, setSort] = useState("recent");
  const [cursor, setCursor] = useState<number | null>(null);

  const draftTimer = useRef<NodeJS.Timeout | null>(null);

  // =========================
  // AUTH HEADERS
  // =========================
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: "Bearer user-1",
  });

  // =========================
  // NORMALIZER (FIXED SAFETY)
  // =========================
  const normalize = (r: any) => ({
    id: r?.id,
    text: r?.text ?? "",
    rating: r?.rating ?? 0,
    up: r?.up ?? (r?.rating >= 5 ? 1 : 0),
    down: r?.down ?? (r?.rating < 5 ? 1 : 0),
    createdAt: r?.createdAt ?? Date.now(),
    deleted: r?.deleted ?? false,
  });

  // =========================
  // LOAD DRAFT
  // =========================
  useEffect(() => {
    getDraft(movieId).then((d) => setText(d || ""));
  }, [movieId]);

  // =========================
  // LOAD REVIEWS
  // =========================
  async function loadMore() {
    try {
      const url = cursor
        ? `/api/review?cursor=${cursor}`
        : `/api/review`;

      const res = await fetch(url);
      if (!res.ok) return;

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return;

      setReviews((prev) => {
        const map = new Map();
        [...data, ...prev].forEach((r) => {
          if (r?.id) map.set(r.id, normalize(r));
        });
        return Array.from(map.values());
      });

      setCursor(data[data.length - 1]?.createdAt ?? null);
    } catch {
      console.log("pagination failed");
    }
  }

  useEffect(() => {
    loadMore();
  }, []);

  // =========================
  // SYNC ON VISIBILITY
  // =========================
  useEffect(() => {
    const sync = async () => {
      try {
        const res = await fetch("/api/review");
        if (!res.ok) return;

        const data = await res.json();
        if (!Array.isArray(data)) return;

        setReviews((prev) => {
          const map = new Map();
          [...data, ...prev].forEach((item) => {
            if (item?.id) map.set(item.id, normalize(item));
          });
          return Array.from(map.values());
        });
      } catch {
        console.log("sync failed");
      }
    };

    const handler = () => {
      if (document.visibilityState === "visible") {
        sync();
      }
    };

    document.addEventListener("visibilitychange", handler);
    return () =>
      document.removeEventListener("visibilitychange", handler);
  }, []);

  // =========================
  // OFFLINE SYNC
  // =========================
  useEffect(() => {
    window.addEventListener("online", OfflineStore.flushQueue);
    return () =>
      window.removeEventListener("online", OfflineStore.flushQueue);
  }, []);

  // =========================
  // SUBMIT (FIXED CRASH ROOT CAUSE)
  // =========================
  async function submit() {
    const cleanText = text?.trim();

    if (!cleanText || cleanText.length < 5) {
      alert("Review must be at least 5 characters");
      return;
    }

    const optimistic = normalize({
      id: crypto.randomUUID(),
      text: cleanText,
      rating,
      userId: "user-1",
      movieId,
      createdAt: Date.now(),
    });

    setReviews((r) => [optimistic, ...r]);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Idempotency-Key": optimistic.id,
        },
body: JSON.stringify({
  id: optimistic.id,
  text: String(cleanText || "").trim(),
  rating: Number(rating),
  movieId: String(movieId),
}),
      });

      if (!res.ok) throw new Error("API failed");

      const saved = await res.json();

      setReviews((r) =>
        r.map((x) =>
          x.id === optimistic.id
            ? normalize(saved.review || saved)
            : x
        )
      );
    } catch {
      if (!navigator.onLine) {
        OfflineStore.enqueue({
          url: "/api/review",
          method: "POST",
          headers: {
            ...getAuthHeaders(),
            "Idempotency-Key": optimistic.id,
          },
          body: JSON.stringify({
            id: optimistic.id,
            text: cleanText,
            rating,
            movieId,
          }),
        });
      }

      setReviews((r) =>
        r.map((x) =>
          x.id === optimistic.id
            ? { ...x, failed: true }
            : x
        )
      );
    }
  }

  // =========================
  // SOFT DELETE (FIXED METHOD)
  // =========================
  async function softDelete(id: string) {
    setReviews((r) =>
      r.map((x) =>
        x.id === id ? { ...x, deleted: true } : x
      )
    );

    try {
      await fetch("/api/review", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          id,
          type: "delete",
          movieId,
        }),
      });
    } catch {
      console.log("delete failed");
    }
  }

  function undoDelete(id: string) {
    setReviews((r) =>
      r.map((x) =>
        x.id === id ? { ...x, deleted: false } : x
      )
    );
  }

  // =========================
  // SORT
  // =========================
  const sortedReviews = useMemo(() => {
    const getScore = (r: any) =>
      wilson(r.up || 0, r.down || 0);

    return [...reviews]
      .sort((a, b) => {
        if (sort === "recent")
          return (b.createdAt || 0) - (a.createdAt || 0);

        if (sort === "helpful")
          return getScore(b) - getScore(a);

        if (sort === "controversial")
          return (
            Math.abs((b.up || 0) - (b.down || 0)) -
            Math.abs((a.up || 0) - (a.down || 0))
          );

        return 0;
      })
      .slice(0, 100);
  }, [reviews, sort]);

  // =========================
  // UI (UNCHANGED)
  // =========================
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Write a Review</h3>

      <textarea
        className="w-full p-4 bg-gray-950 border border-gray-700 rounded-lg"
        value={text}
        placeholder="Write your review..."
        onChange={(e) => {
          const value = e.target.value;
          setText(value);

          if (draftTimer.current)
            clearTimeout(draftTimer.current);

          draftTimer.current = setTimeout(() => {
            saveDraft(movieId, value);
          }, 400);
        }}
      />

      <div className="flex gap-3">
        <button
          onClick={() => setRating(1)}
          className={`px-3 py-1 rounded ${
            rating === 1 ? "bg-red-500" : "bg-gray-700"
          }`}
        >
          👎 Bad
        </button>

        <button
          onClick={() => setRating(10)}
          className={`px-3 py-1 rounded ${
            rating === 10 ? "bg-green-500" : "bg-gray-700"
          }`}
        >
          👍 Good
        </button>
      </div>

      <button
        onClick={submit}
        className="bg-yellow-500 px-6 py-2 rounded-lg"
      >
        Submit Review
      </button>

      <div className="space-y-4">
        <AnimatePresence>
          {sortedReviews.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-gray-800/70 p-4 rounded-lg"
            >
              {!r.deleted ? (
                <>
                  <div className="flex justify-between">
                    <p>{r.text}</p>
                    <span>
                      👍 {r.up || 0} | 👎 {r.down || 0}
                    </span>
                  </div>

                  <button
                    onClick={() => softDelete(r.id)}
                    className="text-red-400"
                  >
                    Delete
                  </button>

                  {r.failed && (
                    <p className="text-red-400 text-sm">
                      Failed to sync
                    </p>
                  )}
                </>
              ) : (
                <button
                  onClick={() => undoDelete(r.id)}
                  className="text-yellow-400"
                >
                  Undo Delete
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={loadMore}
        className="text-sm text-gray-400 hover:text-white"
      >
        Load More
      </button>
    </div>
  );
}