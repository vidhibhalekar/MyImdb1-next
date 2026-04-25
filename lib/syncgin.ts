import type { QueueItem } from "@/types/sync";

export async function syncItem(item: QueueItem) {
  try {
    if (item.type === "ADD") {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item.payload),
      });

      return await res.json();
    }

    if (item.type === "REMOVE") {
      const res = await fetch(`/api/review/${item.payload.id}`, {
        method: "DELETE",
      });

      return await res.json();
    }
  } catch (err) {
    console.log("Sync error:", err);
  }
}