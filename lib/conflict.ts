import type { WatchItemDTO } from "./zodSchemas";

export function mergeItems(
  local: WatchItemDTO,
  remote: WatchItemDTO
): WatchItemDTO {
  // ✅ MERGE VECTOR CLOCKS
  const mergedClock: Record<string, number> = {
    ...local.vectorClock,
  };

  for (const key in remote.vectorClock) {
    mergedClock[key] = Math.max(
      mergedClock[key] ?? 0,
      remote.vectorClock[key] ?? 0
    );
  }

  // ✅ LAST WRITE WINS (PRIMARY DECISION)
  let winner: WatchItemDTO;

  if (local.updatedAt > remote.updatedAt) {
    winner = local;
  } else if (remote.updatedAt > local.updatedAt) {
    winner = remote;
  } else {
    // ⚠️ fallback if timestamps equal
    winner = local.version >= remote.version ? local : remote;
  }

  return {
    ...winner,
    version: Math.max(local.version, remote.version) + 1,
    vectorClock: mergedClock,
    updatedAt: Date.now(), // ✅ ensure new merge time
  };
}