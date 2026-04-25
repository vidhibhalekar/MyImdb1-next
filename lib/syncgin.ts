import { getQueue, clearQueue } from "./syncQueue";
import { putItem, deleteItem } from "./watchlistDB";
import { mockApi } from "@/server/mockApi";

// ==========================
// MAIN SYNC ENGINE
// ==========================
export async function processQueue() {
  console.log("🔄 Sync running...");

  let queue;

  try {
    queue = await getQueue();
  } catch (err) {
    console.log("❌ Failed to read queue:", err);
    return;
  }

  console.log("📦 Queue received:", queue);

  if (!queue || queue.length === 0) {
    console.log("✅ No queued actions");
    return;
  }

  const failedItems: any[] = [];

  for (const item of queue) {
    console.log("⚙️ Processing:", item);

    try {
      // ==========================
      // POST / ADD
      // ==========================
      if (item.method === "POST") {
        const res = await fetch(item.url, {
          method: "POST",
          headers: item.headers,
          body: item.body,
        });

        if (!res.ok) throw new Error("POST failed");

        const serverItem = await res.json();

        console.log("✅ POST synced:", serverItem);
      }

      // ==========================
      // PUT / UPDATE
      // ==========================
      if (item.method === "PUT") {
        const res = await fetch(item.url, {
          method: "PUT",
          headers: item.headers,
          body: item.body,
        });

        if (!res.ok) throw new Error("PUT failed");

        const serverItem = await res.json();

        console.log("✅ PUT synced:", serverItem);
      }

      // ==========================
      // DELETE
      // ==========================
      if (item.method === "DELETE") {
        const res = await fetch(item.url, {
          method: "DELETE",
          headers: item.headers,
          body: item.body,
        });

        if (!res.ok) throw new Error("DELETE failed");

        const serverItem = await res.json();

        console.log("✅ DELETE synced:", serverItem);
      }
    } catch (err) {
      console.log("❌ Item failed, will retry later:", err);

      failedItems.push(item);
    }
  }

  // ==========================
  // CLEAR ONLY IF ALL SUCCESS
  // ==========================
  if (failedItems.length === 0) {
    await clearQueue();
    console.log("🎉 Queue fully cleared");
  } else {
    console.log(
      `⚠️ Sync partial failure: ${failedItems.length} items kept in queue`
    );
  }

  // ==========================
  // REFRESH UI AFTER SYNC
  // ==========================
  try {
    const res = await fetch("/api/review");
    const data = await res.json();

    window.dispatchEvent(
      new CustomEvent("reviews:sync", {
        detail: data,
      })
    );
  } catch (err) {
    console.log("❌ Failed to refresh reviews:", err);
  }
}