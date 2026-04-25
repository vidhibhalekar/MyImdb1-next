import type { WatchItemDTO } from "../lib/zodSchemas";

let db: Record<string, WatchItemDTO> = {};

export const mockApi = {
  async upsert(item: WatchItemDTO) {
    const existing = db[item.id];

    // ✅ prevent older version overwrite
    if (existing && existing.version > item.version) {
      return existing;
    }

    db[item.id] = item;

    await new Promise((r) => setTimeout(r, 150));

    return db[item.id];
  },

  // ✅ ADD THIS (FIX)
  async delete(id: string) {
    const existing = db[id];

    // if nothing exists, return a dummy item
    if (!existing) {
      return {
        id,
        title: "",
        addedAt: Date.now(),
        updatedAt: Date.now(),
        version: 1,
        vectorClock: { local: 1 },
      };
    }

    delete db[id];

    await new Promise((r) => setTimeout(r, 150));

    // return deleted item (important for merge)
    return {
      ...existing,
      updatedAt: Date.now(),
      version: existing.version + 1,
    };
  },

  async getAll() {
    await new Promise((r) => setTimeout(r, 150));
    return Object.values(db);
  },
};