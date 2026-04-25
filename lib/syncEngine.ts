import { getQueue, clearQueue } from "./syncQueue";
import { mockApi } from "@/server/mockApi";
import { putItem, deleteItem } from "./watchlistDB";

export async function processQueue() {
  console.log("🔄 Sync running...");

  const queue = await getQueue();

  console.log("📦 Queue received:", queue);

  if (!queue || queue.length === 0) {
    console.log("✅ No queued actions");
    return;
  }

  for (const item of queue) {
    console.log("⚙️ Processing:", item);

    try {
      if (item.type === "ADD") {
        const serverItem = await mockApi.upsert(item.payload);
        await putItem(serverItem);

        console.log("✅ ADD synced:", serverItem);
      }

      if (item.type === "REMOVE") {
        const serverItem = await mockApi.delete(item.payload.id);
        await deleteItem(item.payload.id);

        console.log("✅ REMOVE synced:", serverItem);
      }
    } catch (err) {
      console.log("❌ Sync failed (stopping queue):", err);
      return;
    }
  }

  await clearQueue();
  console.log("🎉 Queue fully cleared");
}